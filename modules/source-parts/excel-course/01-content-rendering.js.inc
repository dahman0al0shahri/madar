function rich(value){const s=String(value??'');let out='',start=0;const re=/=[A-Z]+\(|=(?:'[^']+'|[\u0621-\u064a][\u0621-\u064a0-9]*)!\$?[A-Z]+\$?\d+/g;let m;while((m=re.exec(s))){let depth=m[0].endsWith('(')?1:0,quoted=false,end=re.lastIndex;for(;end<s.length&&depth;end++){const c=s[end];if(c==='"')quoted=!quoted;else if(!quoted){if(c==='(')depth++;if(c===')')depth--;}}if(depth)continue;out+=prose(s.slice(start,m.index))+'<code class="formula" dir="ltr">'+esc(s.slice(m.index,end)).replace(/&quot;.*?&quot;/g,t=>'<bdi dir="auto">'+t+'</bdi>')+'</code>';start=end;re.lastIndex=end;}return out+prose(s.slice(start));}
function sectionText(s){
 const lines=String(s.text||'').split('\n').filter(x=>x.trim());
 if(s.kind==='steps'&&lines.length&&lines.every(x=>/^\d+\. /.test(x)))return '<ol class="lesson-steps">'+lines.map(x=>'<li>'+rich(x.replace(/^\d+\. /,''))+'</li>').join('')+'</ol>';
 return '<p>'+rich(s.text)+'</p>';
}
function table(t){return t?'<div class="table-wrap" tabindex="0" aria-label="جدول الدرس؛ مرر أفقيًا إذا لزم"><table><thead><tr>'+t.headers.map(x=>'<th scope="col">'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+t.rows.map(r=>'<tr>'+r.map(x=>'<td dir="auto">'+rich(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>':'';}
function message(t){const el=$('#excel-save-status');if(el)el.textContent=t;}
