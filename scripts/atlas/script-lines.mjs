import ts from 'typescript';

const preview = (node, ast) => node ? ast.text.slice(node.getStart(ast), Math.min(node.end,node.getStart(ast)+320)).replace(/\s+/g,' ').trim().slice(0,145) : '';
const closer = /^[\s}\]);,]+$/;

function observedFunctionEffects(fn, ast) {
  const returns=new Set(), writes=new Set(), calls=new Set();
  function visit(n) {
    if (n !== fn.body && ts.isFunctionLike(n)) return;
    if (ts.isReturnStatement(n) && n.expression) returns.add(preview(n.expression,ast));
    if (ts.isBinaryExpression(n) && n.operatorToken.kind>=ts.SyntaxKind.FirstAssignment &&
        n.operatorToken.kind<=ts.SyntaxKind.LastAssignment && (ts.isPropertyAccessExpression(n.left)||ts.isElementAccessExpression(n.left))) {
      writes.add(preview(n.left,ast));
    }
    if(ts.isCallExpression(n)) calls.add(preview(n.expression,ast));
    ts.forEachChild(n,visit);
  }
  if(ts.isBlock(fn.body))visit(fn.body);else returns.add(preview(fn.body,ast));
  function list(items){return [...items].slice(0,3).join('، ');}
  return [returns.size?'من القيم التي يعيدها '+list(returns):'',writes.size?'من المواضع التي يكتب فيها '+list(writes):'',calls.size?'من الاستدعاءات التي يعتمد عليها '+list(calls):''].filter(Boolean).join('. ');
}

function describe(node, ast) {
  const value = n => preview(n, ast);
  const name = value(node.name) || value(node.parent?.name);
  if (ts.isFunctionLike(node) && node.body) {
    const args = node.parameters.map(p => value(p.name)).join(', ');
    const effects=observedFunctionEffects(node,ast);
    return ['definition', 'يجمع '+(name || 'هذا الاستدعاء المجهول')+' الخطوات التي تنفذ عند استدعائه'+(args?'، وتدخل إليه القيم عبر '+args:' دون معاملات معلنة')+'.'+(effects?' '+effects+'.':'')];
  }
  if (ts.isVariableStatement(node) || ts.isVariableDeclarationList(node)) {
    const list=ts.isVariableStatement(node)?node.declarationList:node;
    return ['value',list.declarations.map(d=>'يربط '+value(d.name)+' بـ '+(value(d.initializer)||'قيمة تُستكمل لاحقًا')).join('، ')+'.'];
  }
  if (ts.isModuleDeclaration(node)) {
    const purpose = ts.isStringLiteral(node.name)
      ? 'يوفر تعريف الأنواع للوحدة '+name+' لكي يتحقق TypeScript من الاستيراد منها أثناء البناء.'
      : 'يجمع تعريفات المجال '+name+' ويتيح دمج واجهاته مع التصريحات الأخرى وقت فحص الأنواع.';
    return ['type',purpose];
  }
  if (ts.isBlock(node)) return;
  if (ts.isVariableDeclaration(node)) return ['value','يربط '+value(node.name)+' بـ '+(value(node.initializer)||'قيمة تُحدّد لاحقًا')+' لكي تستخدم التعليمات التالية هذا الاسم.'];
  if (ts.isReturnStatement(node)) return ['return',node.expression?'ينهي هذا المسار ويرسل '+value(node.expression)+' إلى المستدعي.':'ينهي تنفيذ الدالة هنا من دون قيمة إرجاع صريحة.'];
  if (ts.isThrowStatement(node)) return ['error','ينقل التنفيذ إلى معالجة الاستثناء بقيمة '+value(node.expression)+'، فتُتجاوز بقية الخطوات في هذا المسار.'];
  if (ts.isIfStatement(node)) return ['guard','يتحكم الشرط '+value(node.expression)+' في دخول الفرع '+value(node.thenStatement).slice(0,90)+(node.elseStatement?'، وله فرع بديل عند عدم تحققه.':'.')];
  if (ts.isConditionalExpression(node)) return ['choice','يختار الشرط '+value(node.condition)+' القيمة '+value(node.whenTrue)+' عند تحققه، أو '+value(node.whenFalse)+' في الحالة الأخرى.'];
  if (ts.isPropertyAssignment(node)) return ['field','يضع '+value(node.initializer)+' في الحقل '+value(node.name)+' من الكائن الذي يبنيه هذا التعبير.'];
  if (ts.isShorthandPropertyAssignment(node)) return ['field','ينقل قيمة المتغير '+name+' إلى حقل يحمل الاسم نفسه في الكائن الناتج.'];
  if (ts.isParameter(node)) return ['argument','يستقبل '+name+' من الجهة التي تستدعي الدالة'+(node.initializer?'، ويستخدم '+value(node.initializer)+' عند غياب قيمته':'')+'.'];
  if (ts.isImportDeclaration(node)) return ['import','يجعل '+(value(node.importClause)||'آثار تهيئة الوحدة')+' متاحًا هنا من '+value(node.moduleSpecifier)+'.'];
  if (ts.isExportDeclaration(node)||ts.isExportAssignment(node)) return ['export','يتيح '+(value(node.exportClause)||value(node.expression)||'التعريفات')+' للوحدات المستوردة'+(node.moduleSpecifier?' عبر '+value(node.moduleSpecifier):'')+'.'];
  if (ts.isAwaitExpression(node)) return ['async','ينتظر نتيجة '+value(node.expression)+' حتى تصبح متاحة قبل متابعة هذا المسار.'];
  if (ts.isNewExpression(node)) return ['create','ينشئ مثيلًا من '+value(node.expression)+' باستخدام '+(node.arguments?.map(value).join(', ').slice(0,145)||'المعاملات الافتراضية')+'.'];
  if (ts.isCallExpression(node)) return ['call','يمرر '+(node.arguments.map(value).join(', ').slice(0,145)||'قائمة معاملات فارغة')+' إلى '+value(node.expression)+' عند بلوغ هذا المسار.'];
  if (ts.isBinaryExpression(node)) return ['expression','يطبق العامل '+value(node.operatorToken)+' على '+value(node.left)+' و'+value(node.right)+' ضمن التعبير المحيط.'];
  if (ts.isForOfStatement(node)||ts.isForInStatement(node)) return ['loop','يأخذ '+value(node.initializer)+' من '+value(node.expression)+' في كل دورة لتنفيذ جسم الحلقة.'];
  if (ts.isIterationStatement(node,false)) return ['loop','يحدد '+(value(node.condition)||value(node.expression)||'شرط الحلقة الداخلي')+' تكرار خطوات هذه الحلقة.'];
  if (ts.isCaseClause(node)||ts.isSwitchStatement(node)) return ['case','يحدد '+value(node.expression)+' الفرع المستخدم في المطابقة.'];
  if (ts.isTryStatement(node)||ts.isCatchClause(node)) return ['error','يجمع هذا المسار تعليمات يمكن أن ترفع استثناء'+(ts.isCatchClause(node)?' ويستقبل الخطأ في '+(value(node.variableDeclaration)||'المعالج'):' مع مسار معالجته أو التنظيف')+'.'];
  if (ts.isBreakStatement(node)||ts.isContinueStatement(node)) return ['loop',ts.isBreakStatement(node)?'يخرج من الحلقة أو الاختيار المحيط عند هذا الموضع.':'ينتقل إلى الدورة التالية ويتجاوز بقية تعليمات الدورة الحالية.'];
  if (ts.isJsxAttribute(node)) return ['view','يمرر الخاصية '+name+' بالقيمة '+(value(node.initializer)||'true')+' إلى عنصر الواجهة.'];
  if (ts.isJsxOpeningElement(node)||ts.isJsxClosingElement(node)||ts.isJsxSelfClosingElement(node)) return ['view','يحدد موضع عنصر الواجهة '+value(node.tagName)+' في الشجرة المعروضة.'];
  if (ts.isJsxText(node)||ts.isTemplateExpression(node)||ts.isNoSubstitutionTemplateLiteral(node)) return ['literal','يدخل هذا النص في القيمة التي يكوّنها التعبير المحيط.'];
  if (ts.isClassDeclaration(node)||ts.isInterfaceDeclaration(node)||ts.isTypeAliasDeclaration(node)||ts.isPropertySignature(node)) return ['type','يعرّف '+name+' ويحدد البنية التي تعتمد عليها مواضع استعمال هذا الاسم.'];
  if (ts.isExpressionStatement(node)) return ['statement','ينفذ التعبير '+value(node.expression)+' عند وصول التدفق إلى هذا الموضع.'];
}

export function scriptLineNotes(ast, code, offset, boundaries = []) {
  const rows = [];
  const descriptions=new WeakMap();
  for (const start of new Set([...ast.getLineStarts(), ...boundaries])) {
    const newline = code.indexOf('\n', start);
    const text = code.slice(start, newline < 0 ? undefined : newline);
    const first = text.search(/\S/);
    if (first < 0) continue;
    const pos = start + first;
    let token = ts.getTokenAtPosition(ast,pos);
    if (!token || pos < token.getStart(ast)) continue; // comment trivia
    const chain = [];
    for(let node=token;node && !ts.isSourceFile(node);node=node.parent){
      if(!descriptions.has(node))descriptions.set(node,describe(node,ast));
      const note=descriptions.get(node);
      if(note)chain.push({note,node});
    }
    if (!chain.length) continue;
    const [{note,node}]=chain;
    const scope = chain.find(x=>ts.isFunctionLike(x.node))?.node;
    const scopeName=preview(scope?.name||scope?.parent?.name,ast);
    let message=note[1];
    if(closer.test(text)) message='يغلق هذا الموضع الجزء السابق من البنية. '+message;
    else if(chain.length>1 && chain[1].note[0] !== note[0] && ['value','return','guard','field','argument','choice'].includes(chain[1].note[0])) message+=' '+chain[1].note[1];
    if(scopeName && scope!==node) message+=' داخل '+scopeName+'.';
    rows.push([offset+pos,note[0],message,offset+node.getStart(ast)]);
  }
  return rows;
}
