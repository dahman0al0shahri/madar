import ts from 'typescript';

const results=new Map();
function grammarRegion(node,ast,start,end){
  for(let p=node;p&&!ts.isSourceFile(p);p=p.parent){
    const left=p.getStart(ast);
    if(left>=start||p.end<=end)continue;
    if(ts.isArrayLiteralExpression(p)||ts.isObjectLiteralExpression(p))return [left,p.end,'const sample = (',');','التعبير الحاوي'];
    if(ts.isBlock(p))return [left,p.end,'async function* sample() ','','كتلة التعليمات الحاوية'];
  }
  return [0,ast.text.length,'','','النص البرمجي الكامل'];
}

// Only the parser runs. Never evaluate inspected application code or source examples.
export function scriptTrial(ast,node,start,end) {
  const [left,right,pre,post,region]=grammarRegion(node,ast,start,end);
  const removed=ast.text.slice(start,end).trim();
  const before=ast.text.slice(left,right);
  const after=before.slice(0,start-left)+before.slice(end-left);
  function diagnostic(text){
    const source=ts.createSourceFile(ast.fileName,pre+text+post,ts.ScriptTarget.Latest,false,ast.scriptKind);
    const issue=source.parseDiagnostics[0];
    return issue?ts.flattenDiagnosticMessageText(issue.messageText,' '):'';
  }
  // A context that already fails the isolated grammar is checked in its original module.
  let original='';
  if(pre){
    let idx=results.get(ast);
    if(!idx){idx=new Map();results.set(ast,idx);}
    if(!idx.has(left))idx.set(left,diagnostic(before));
    original=idx.get(left);
  }
  if(original){
    const full=ts.createSourceFile(ast.fileName,ast.text.slice(0,start)+ast.text.slice(end),ts.ScriptTarget.Latest,false,ast.scriptKind);
    const issue=full.parseDiagnostics[0];
    return issue?'رفض محلل الملف حذف السطر: '+ts.flattenDiagnosticMessageText(issue.messageText,' '):'ظل الملف قابلًا للتحليل النحوي بعد حذف السطر. يوضح الشرح والعمليات أدناه الأثر البرمجي الذي يلزم تتبعه.';
  }
  const error=diagnostic(after);
  if(error)return 'عند حذف السطر من '+region+' أبلغ محلل TypeScript: '+error;
  return 'بقي '+region+' قابلًا للتحليل بعد حذف '+(removed.length>110?'السطر الذي يبدأ بـ «'+removed.slice(0,90)+'…»':'«'+removed+'»')+'. يختبر هذا تركيب الشيفرة فقط.';
}
export function finishScriptTrials(ast){results.delete(ast);}
