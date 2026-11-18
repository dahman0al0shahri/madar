import ts from 'typescript';
import path from 'node:path';

export function language(file) {
  const name = file.replace(/\.inc$/, '');
  if (/\.[cm]?[jt]sx?$/.test(name)) return 'JavaScript / TypeScript';
  const ext = path.posix.extname(name).slice(1).toLowerCase();
  return ({ html: 'HTML', svg: 'SVG', css: 'CSS', json: 'JSON', sql: 'SQL', md: 'Markdown',
    yml: 'YAML', yaml: 'YAML', py: 'Python', sh: 'Shell' })[ext] || 'Text';
}

const short = text => text.replace(/\s+/g, ' ').trim().slice(0, 120);

// Record source positions in UTF-16 offsets (the same indexing used by the reader).
// A compact line may contain many operations. Each keeps its own column and range.
export function analyze(file, source) {
  const symbols = [], operations = [], imports = [], diagnostics = [], repeatedKeys = [];
  const lang = language(file);
  const bindings = [];
  const branches = [];
  const fields = [];

  function parseScript(code, offset, kind) {
    const ast = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, kind);
    for (const d of ast.parseDiagnostics) diagnostics.push([offset + (d.start || 0), ts.flattenDiagnosticMessageText(d.messageText, ' ')]);
    const snippet = n => n ? short(n.getText(ast)) : '';
    function visit(n) {
      const start = offset + n.getStart(ast), end = offset + n.end;
      const op = (type, subject) => operations.push([start, end, type, subject]);
      if (ts.isFunctionLike(n) && n.body || ts.isClassDeclaration(n) || ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) {
        const name = n.name || (n.parent && ts.isVariableDeclaration(n.parent) && n.parent.name);
        if (name) symbols.push([start, end, snippet(name)]);
      }
      if (ts.isIfStatement(n) || ts.isConditionalExpression(n)) {
        const condition = snippet(n.expression || n.condition);
        for (const [block,expected] of [[n.thenStatement || n.whenTrue,true],[n.elseStatement || n.whenFalse,false]]) {
          if (block) branches.push([offset+block.getStart(ast),offset+block.end,expected,condition]);
        }
      }
      if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) {
        if (n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) {
          imports.push(n.moduleSpecifier.text);
          op(ts.isImportDeclaration(n) ? 'import' : 'export', n.moduleSpecifier.text);
        }
      } else if (ts.isIfStatement(n)) op('if', snippet(n.expression));
      else if (ts.isConditionalExpression(n)) op('choose', snippet(n.condition));
      else if (ts.isReturnStatement(n)) op('return', snippet(n.expression));
      else if (ts.isThrowStatement(n)) op('throw', snippet(n.expression));
      else if (ts.isAwaitExpression(n)) op('await', snippet(n.expression));
      else if (ts.isCallExpression(n) || ts.isNewExpression(n)) {
        op(ts.isNewExpression(n) ? 'new' : 'call', snippet(n.expression));
        if (['require','import'].includes(snippet(n.expression)) && n.arguments?.length === 1 && ts.isStringLiteral(n.arguments[0])) imports.push(n.arguments[0].text);
      } else if (ts.isVariableDeclaration(n)) op('bind', snippet(n.name));
      else if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.EqualsToken) op('assign', snippet(n.left));
      else if (ts.isForOfStatement(n) || ts.isForInStatement(n) || ts.isWhileStatement(n) || ts.isDoStatement(n)) op('loop', snippet(n.expression));
      else if (ts.isForStatement(n)) op('loop', snippet(n.condition));
      else if (ts.isCatchClause(n)) op('catch', snippet(n.variableDeclaration));
      if (ts.isObjectLiteralExpression(n)) {
        const keys = new Set();
        for (const p of n.properties) {
          if (!ts.isPropertyAssignment(p) || !p.name || ts.isComputedPropertyName(p.name)) continue;
          const key = p.name.text;
          if (keys.has(key)) repeatedKeys.push([offset + p.getStart(ast), key]);
          keys.add(key);
        }
      }
      ts.forEachChild(n, visit);
    }
    visit(ast);
    // Bind identifiers to declarations in the same syntax tree. This preserves shadowing
    // and permits references to earlier or later declarations without loading dependencies.
    const options = { noLib: true, noResolve: true, allowJs: true, jsx: ts.JsxEmit.Preserve, allowNonTsExtensions: true };
    const host = ts.createCompilerHost(options);
    host.getSourceFile = name => name === file ? ast : undefined;
    const program = ts.createProgram([file], options, host);
    const checker = program.getTypeChecker();
    const uses = new Map();
    function collect(node) {
      if (ts.isIdentifier(node)) {
        const symbol = checker.getSymbolAtLocation(node);
        const declaration = symbol?.valueDeclaration || symbol?.declarations?.[0];
        const name = declaration?.name;
        if (name && name.getSourceFile() === ast && ts.isIdentifier(name)) {
          const at = offset + name.getStart(ast);
          if (!uses.has(at)) uses.set(at, [at, name.text, []]);
          const mention = offset + node.getStart(ast);
          if (mention !== at) uses.get(at)[2].push(mention);
        }
      }
      ts.forEachChild(node, collect);
    }
    collect(ast);
    bindings.push(...uses.values());
  }

  if (lang === 'JSON') {
    const ast = ts.parseJsonText(file, source);
    for (const d of ast.parseDiagnostics) diagnostics.push([d.start || 0, ts.flattenDiagnosticMessageText(d.messageText, ' ')]);
    function walk(value,parent,key,start) {
      if (!value) return;
      const index = fields.length;
      fields.push([start, value.end, parent, key]);
      if (ts.isObjectLiteralExpression(value)) {
        const keys = new Set();
        for (const prop of value.properties) {
          if (!ts.isPropertyAssignment(prop)) continue;
          const key = prop.name.text;
          if (keys.has(key)) repeatedKeys.push([prop.getStart(ast),key]);
          keys.add(key);
          walk(prop.initializer,index,key,prop.getStart(ast));
        }
      } else if (ts.isArrayLiteralExpression(value)) {
        value.elements.forEach((item,i)=>walk(item,index,i,item.getStart(ast)));
      }
    }
    const root = ast.statements[0]?.expression;
    if (root) walk(root,-1,'',root.getStart(ast));
  }
  if (lang === 'JavaScript / TypeScript') {
    const kind = /\.tsx(?:\.inc)?$/.test(file) ? ts.ScriptKind.TSX : /\.[cm]?ts$/.test(file) ? ts.ScriptKind.TS : ts.ScriptKind.JS;
    parseScript(source, 0, kind);
  } else if (lang === 'HTML') {
    for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
      const type = /\btype\s*=\s*["']([^"']+)/i.exec(match[1])?.[1];
      if (!type || /^(?:module|(?:text|application)\/(?:java|ecma)script)$/i.test(type)) {
        parseScript(match[2], match.index + match[0].indexOf('>') + 1, ts.ScriptKind.JS);
      }
    }
  }
  return { symbols, operations, bindings, branches, fields, imports: [...new Set(imports)], diagnostics, repeatedKeys };
}

export function resolveImport(from, specifier, paths) {
  const clean = specifier.replace(/\?(?:raw|url|inline)$/, '');
  if (!clean.startsWith('.') && !clean.startsWith('@/')) return;
  const base = clean.startsWith('@/') ? clean.slice(2) : path.posix.join(path.posix.dirname(from), clean);
  const candidates = [base, ...['.ts','.tsx','.js','.mjs','.cjs','.json','/index.ts','/index.tsx','/index.js'].map(ext => base + ext)];
  return candidates.find(candidate => paths.has(candidate));
}
