function compare(a,b,op){return op==='>'?a>b:op==='<'?a<b:op==='>='?a>=b:op==='<='?a<=b:op==='<>'?a!==b:a===b;}
function value(cells,a){try{const v=evaluate(cells[a]??'',cells,[a]);return Array.isArray(v)?v.flat()[0]:v;}catch(e){return e.message;}}
function allowed(raw,rule){const n=Number(raw);return raw===''&&rule.ignore!==false||raw!==''&&Number.isFinite(n)&&Number.isInteger(n)&&n>=rule.min&&n<=rule.max;}
function verifyFormula(cells,expected,op){
 if(op==='CROSSREF')return /^=('?ورقة1'?)!\$?H\$?6$/i.test(cells.C2||'')&&value(cells,'C2')===250&&value({...cells,'ورقة1!H6':'311'},'C2')===311;
 if(op==='FIXEDLOOKUP')return ['B2','B3','B4'].every((k,i)=>/\$C\$21:\$D\$25/i.test(cells[k]||'')&&value(cells,k)===value({...cells,[k]:shift(expected,0,i)},k))&&value({...cells,D21:'جديد'},'B2')==='جديد';
 if(op==='CLOCK')return /^=TODAY\(\)$/i.test(cells.C2||'')&&/^=NOW\(\)$/i.test(cells.D2||'');
 if(['DATE','TIME','COUNTIFS'].includes(op)){const formula=cells.C2||'';if(!new RegExp('^='+op+'\\(','i').test(formula))return false;return [cells,{...cells,A2:op==='DATE'?'2027':op==='TIME'?'15':'60',B2:op==='DATE'?'11':'31',D2:'1'},{...cells,A2:op==='DATE'?'2028':op==='TIME'?'25':'70'}].every(p=>{const wanted=value({...p,C2:expected},'C2'),actual=value(p,'C2');return typeof wanted==='number'&&Math.abs(actual-wanted)<1e-10;});}
 const formula=cells.C2||'',fn=expected.match(/^=(\w+)/)?.[1];if(!formula.startsWith('=')||!new RegExp('\\b'+fn+'\\s*\\(','i').test(formula))return false;
 const probes=[cells,{...cells,A2:op==='CONCATENATE'?'سارة':op==='VLOOKUP'?'101':'7',B2:'601'}];
 if(['LOGIC','NESTED'].includes(op))for(const aa of [5,6])for(const bb of [600,601])probes.push({...cells,A2:String(aa),B2:String(bb)});
 if(['SUM','COUNT','AVERAGE','SMALL','LARGE','COUNTIF','MINMAX'].includes(op))for(const key of ['A2','B2','A3','B3','A4','B4'])for(const raw of ['','90','91','-2','نص'])probes.push({...cells,[key]:raw});
 if(op==='ROUND')for(const raw of ['125.64','125.65','-125.65','9.99'])probes.push({...cells,A2:raw});
 if(op==='CONCATENATE')probes.push({...cells,A2:'ليلى',B2:'أحمد'});
 if(op==='VLOOKUP')for(const code of ['101','102','103'])probes.push({...cells,A2:code,E2:'أ',E3:'ب',E4:'ج'});
 if(op==='IF')probes.push(...[399,400,401].map(n=>({...cells,B2:String(n),F2:'3'})));
 return probes.every(p=>{if(value(p,'C2')!==value({...p,C2:expected},'C2'))return false;if(op==='IF')return ['D2','D3','D4'].every(k=>/\$F\$2/i.test(p[k]||''))&&['C3','C4'].every(k=>(p[k]||'').startsWith('=')&&value(p,k)===(+p['B'+k.slice(1)]>400?'عالية':'منخفضة'))&&['D2','D3','D4'].every(k=>(p[k]||'').startsWith('=')&&value(p,k)===Number(p['B'+k.slice(1)])*Number(p.F2));return true;});
}

