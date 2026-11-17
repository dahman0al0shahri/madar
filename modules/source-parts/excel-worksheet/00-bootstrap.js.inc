/* A bounded lesson worksheet. No eval, remote formulas, macros, or workbook claims. */
(()=>{'use strict';
const cols='ABCDEFGH',addr=(c,r)=>cols[c]+r;
function position(a){const m=/^\$?([A-H])\$?([1-9]|[12][0-9]|30)$/i.exec(a);if(!m)throw Error('#REF!');return [cols.indexOf(m[1].toUpperCase()),+m[2]];}
function range(a){const [s,e=s]=a.toUpperCase().split(':'),[c,r]=position(s),[d,t]=position(e),out=[];for(let y=Math.min(r,t);y<=Math.max(r,t);y++)for(let x=Math.min(c,d);x<=Math.max(c,d);x++)out.push(addr(x,y));return out;}
function shift(formula,dc,dr){return formula.split(/("(?:[^"]|"")*")/g).map((s,i)=>i%2?s:s.replace(/(\$?)([A-H])(\$?)(\d+)\b/gi,(all,ac,c,ar,r)=>{const x=cols.indexOf(c.toUpperCase())+(ac?0:dc),y=+r+(ar?0:dr);return x<0||x>7||y<1||y>30?'#REF!':ac+cols[x]+ar+y;})).join('');}
