import postcss from 'postcss';

// Offsets refer to the original string, including inline style/script containers.
export function styleOperations(css, offset, operations, diagnostics, file) {
  try {
    const tree=postcss.parse(css,{from:file});
    tree.walk(node=>{
      if(node.type!=='decl' && node.type!=='rule' && node.type!=='atrule')return;
      const context=[];
      for(let p=node.parent;p && p.type!=='root';p=p.parent)context.unshift(p.selector || ('@'+p.name+' '+p.params));
      const label=node.type==='decl'?node.prop+' = '+node.value+(node.important?' !important':''):node.selector || ('@'+node.name+' '+node.params);
      operations.push([offset+node.source.start.offset,offset+Math.min(css.length,node.source.end.offset),'style',context.concat(label).join(' → ')]);
    });
  }catch(error){diagnostics.push([offset,'CSS: '+(error.reason || error.message)]);}
}

export function markupOperations(text,operations,diagnostics,file) {
  const tag= /<!--[\s\S]*?-->|<(\/?)([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'"<>])*)>/gi;
  for(let m;(m=tag.exec(text));){
    if(!m[2])continue;
    const element=m[2].toLowerCase(), end=tag.lastIndex;
    operations.push([m.index,end,m[1]?'closeTag':'openTag',element]);
    if(m[1])continue;
    const attrs=m[3],base=end-1-attrs.length;
    for(const a of attrs.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)){
      operations.push([base+a.index,base+a.index+a[0].length,'attribute',element+' · '+a[1]+' = '+(a[2]??a[3]??a[4]??'(present)')]);
    }
    if(element==='style'||element==='script'||element==='textarea'||element==='title'){
      const close=new RegExp('</'+element+'\\s*>','ig');close.lastIndex=end;
      const closing=close.exec(text);
      const stop=closing?.index ?? text.length;
      if(element==='style')styleOperations(text.slice(end,stop),end,operations,diagnostics,file);
      tag.lastIndex=stop;
    }
  }
}
