import path from 'node:path';

// Only link to an exact tracked path, an unambiguous basename, or an actual npm script.
export function documentLinker(paths,source){
  const names=new Map();
  for(const p of paths){
    const key=path.posix.basename(p);
    if(names.has(key))names.set(key,null);else names.set(key,p);
  }
  const pkg=source('package.json').split('\n');
  const scripts=JSON.parse(source('package.json')).scripts;
  const npmLines=new Map(Object.keys(scripts).map(k=>[k,pkg.findIndex(line=>line.trimStart().startsWith(JSON.stringify(k)+':'))+1]));
  return function links(file,content){
    if(!/\.md$|\.ya?ml$|README|LICENSE/i.test(file))return;
    const result={};
    for(const [i,text] of content.split('\n').entries()){
      const links=new Map();
      for(const m of text.matchAll(/(?:npm(?:\.cmd)?\s+(?:run\s+)?)([\w:-]+)/g)){
        if(npmLines.has(m[1]))links.set('npm '+m[1],['package.json',npmLines.get(m[1]),'تعريف أمر npm']);
      }
      for(const m of text.matchAll(/(?:^|[\s(`"'→])([\w@./-]+\.(?:md|txt|mjs|cjs|js|jsx|tsx?|json|ya?ml|sql|css|html|sh|py))\b/gi)){
        const raw=m[1],rel=path.posix.normalize(path.posix.join(path.posix.dirname(file),raw));
        const target=paths.has(raw)?raw:paths.has(rel)?rel:names.get(raw);
        if(target && target!==file)links.set(target,[target,1,'الملف المشار إليه']);
      }
      if(file==='.github/PULL_REQUEST_TEMPLATE.md'&&/^[-*] Changelog:/i.test(text))links.set('CHANGELOG.md',['CHANGELOG.md',1,'سجل التغيير الذي يراجعه صاحب الطلب']);
      if(links.size)result[i+1]=[...links.values()];
    }
    return result;
  };
}
