window.MadarHintHistoryPage=function(container){'use strict';
 const M=window.MadarHintHistory,$=id=>container.querySelector('#'+id), create=(tag,content,className)=>{const el=document.createElement(tag);if(content!==undefined)el.textContent=content;if(className)el.className=className;return el;};
 let data={records:[],labs:[]},limit=30,busy=false,sourceNote='';
 const date=value=>M.time(value)===null?'التوقيت لم يُسجّل':new Date(value).toLocaleString('ar-SA',{timeZone:'Asia/Riyadh',dateStyle:'medium',timeStyle:'short'})+' · مكة';
 function options(id,values){const select=$(id),previous=select.value;while(select.options.length>1)select.remove(1);for(const [value,label] of values)select.add(new Option(label,value));if([...select.options].some(x=>x.value===previous))select.value=previous;}
 function init(){
  options('lab',data.labs.filter(l=>data.records.some(r=>r.locations.some(x=>x.id===l.id))).map(l=>[l.id,l.name+(l.hidden?' · مخفي':'')+(l.deleted?' · محذوف قابل للاسترجاع':'')]));
  options('scope',[...new Set(data.records.map(r=>r.scope).filter(Boolean))].map(s=>[s,M.scopes[s]||s]));
  options('attempt',[...new Map(data.records.map(r=>[r.attemptGroup,[r.attemptGroup,(r.locations.find(x=>!x.copy)||r.locations[0]).name+' · '+r.attempt]])).values()]);
  const metrics=[[data.records.length,'مساعدة مسجلة'],[data.records.filter(r=>r.level==='full').length,'كشف للخطوة كاملة'],[new Set(data.records.map(r=>r.attemptGroup)).size,'محاولة لها سجل مساعدة']];
  $('stats').replaceChildren(...metrics.map(([n,label])=>{const el=create('div',undefined,'stat');el.append(create('strong',n.toLocaleString('ar-SA')),create('span',label));return el;}));
  $('export').disabled=!data.records.length;$('content').hidden=false;render();
 }
 function icon(degree){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',degree==='full'?'M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3z M12 6v15 M6 9h3 M15 9h3 M6 13h3 M15 13h3':degree===3?'M12 2 2 21h20z M12 8v6 M12 17v1':degree===2?'M13 2 4 14h7l-1 8 10-13h-7z':'M9 19h6 M9 22h6 M8 15a7 7 0 1 1 8 0l-1 2H9z');svg.append(path);return svg;}
 function fact(dl,title,value){const group=create('div');group.append(create('dt',title),create('dd',value||'لم يُسجّل'));dl.append(group);}
 function card(r){
  const el=create('details',undefined,'record');el.dataset.degree=r.level||'unknown';const summary=create('summary'),head=create('span',undefined,'summary-head'),badge=create('span',undefined,'badge');badge.append(icon(r.level),create('span',r.label));head.append(badge,create('h2',r.goal));const meta=create('span',undefined,'meta');meta.append(create('span',r.scopeLabel),create('span',date(r.at)),create('span',(r.locations.find(x=>!x.copy)||r.locations[0]).name));head.append(meta);summary.append(head);el.append(summary);
  const body=create('div',undefined,'details'),facts=create('dl',undefined,'facts');
  fact(facts,'نوع المساعدة',r.label);fact(facts,'عدد المساعدات المختلفة لهذه الخطوة في المحاولة',String(r.count));fact(facts,'أعلى درجة مسجلة لهذه الخطوة في المحاولة',M.labels[r.strongest]);fact(facts,'وقت ظهور المساعدة',date(r.at));
  fact(facts,'المختبر وقت طلب المساعدة',r.context?.labName);fact(facts,'الخطوة وقت الطلب',r.context?.stepTitle||r.context?.step);fact(facts,'نوع المختبر وقت الطلب',r.context?.kind);fact(facts,'معرّف المحاولة',r.attempt);
  body.append(facts,create('h3','نص المساعدة كما ظهر لك'));
  if(r.body){const pre=create('pre',r.body,'help-body');pre.dir='auto';body.append(pre);}else body.append(create('p','هذا سجل قديم لم يحفظ نص المساعدة وقت عرضها. لن نضع نصًا جديدًا مكان النص الأصلي.','note'));
  if(r.remaining){body.append(create('h3','ما بقي عليك تنفيذه وقت المساعدة'),create('p',r.remaining,'remaining'));}
  body.append(create('h3','المختبرات التي تحتفظ بهذا السجل'));const locations=create('ul',undefined,'locations');for(const l of r.locations)locations.append(create('li',l.name+' — '+l.kind+(l.copy?' · نسخة تحمل السجل السابق':'')+(l.hidden?' · مخفي':'')+(l.deleted?' · آخر مختبر محذوف قابل للاسترجاع':'')));body.append(locations);
  if(r.locations.some(x=>x.copy))body.append(create('p','النسخ الموروثة للسجل لا تُحتسب طلبات مساعدة جديدة.','note'));
  if(r.feedback.length){body.append(create('h3','تقييمك للمساعدة'));for(const f of r.feedback)body.append(create('p',({useful:'مفيدة',redundant:'مكررة',unclear:'غير واضحة'}[f[3]]||f[3])+' — '+date(f[4])));}
  const technical=create('details',undefined,'technical');technical.append(create('summary','بيانات السجل الأصلية ومتطلبات التمرين المحفوظة'),create('pre',JSON.stringify({attempt:r.attempt,stepKey:r.key,hintId:r.hint,exposure:r.rawEvent,contextAtExposure:r.context,feedback:r.feedback},null,2)));body.append(technical);el.append(body);return el;
 }
 function render(){const filters=Object.fromEntries(['query','lab','degree','scope','attempt','sort'].map(id=>[id,$(id).value])),rows=M.filter(data.records,filters);$('records').replaceChildren(...rows.slice(0,limit).map(card));$('count').textContent='عرض '+Math.min(limit,rows.length)+' من '+rows.length+' مساعدة'+(rows.length!==data.records.length?' · إجمالي السجل '+data.records.length:'');$('empty').hidden=!!rows.length;$('empty').textContent=data.records.length?'ما فيه نتائج تطابق التصفية. جرّب تغييرها.':'ما فيه مساعدات محفوظة إلى الآن. المساعدات اللي تستخدمها في المحاكي تظهر هنا بعد حفظ المختبر.';$('more').hidden=rows.length<=limit;$('expand').disabled=$('collapse').disabled=!rows.length;}
 async function load(){if(busy)return;busy=true;$('refresh').disabled=true;$('status').textContent='جارٍ قراءة سجلك المحفوظ…';$('error').hidden=true;
  try{const store=await MadarStore.open('network');data=M.project(await M.decode(store.value));sourceNote=store.conflict?'تعرض مسودة هذا المتصفح؛ توجد نسخة أحدث في الحساب. عالج تعارض الحفظ من المحاكي.':store.dirty?'تعرض مسودة هذا المتصفح التي لم يكتمل حفظها في الحساب.':store.account.user?'تمت قراءة السجل المحفوظ في حسابك.':'تمت قراءة السجل المحفوظ على هذا المتصفح — دون حساب.';$('status').textContent=sourceNote+' · آخر قراءة '+date(new Date().toISOString());init();}
  catch(e){$('status').textContent='لم نغيّر أي بيانات محفوظة.';$('content').hidden=true;$('export').disabled=true;$('error').hidden=false;$('error').textContent='تعذر قراءة سجل التلميحات. '+(e.message||'أعد المحاولة.');}
  finally{busy=false;$('refresh').disabled=false;}
 }
 for(const id of ['query','lab','degree','scope','attempt','sort'])$(id).addEventListener(id==='query'?'input':'change',()=>{limit=30;render();});
 $('clear').onclick=()=>{for(const id of ['query','lab','degree','scope','attempt'])$(id).value='';$('sort').value='new';limit=30;render();};$('more').onclick=()=>{limit+=30;render();};$('refresh').onclick=load;
 $('expand').onclick=()=>container.querySelectorAll('#records>.record').forEach(x=>x.open=true);$('collapse').onclick=()=>container.querySelectorAll('#records>.record').forEach(x=>x.open=false);
 $('export').onclick=()=>{let host=window;try{if(parent!==window&&parent.location.origin===location.origin)host=parent;}catch{}const blob=new Blob([JSON.stringify({format:'madar-hint-history-v1',exportedAt:new Date().toISOString(),source:sourceNote,records:data.records},null,2)],{type:'application/json'}),url=host.URL.createObjectURL(blob),link=host.document.createElement('a');link.href=url;link.download='madar-hint-history.json';host.document.body.append(link);link.click();link.remove();host.setTimeout(()=>host.URL.revokeObjectURL(url),60000);};
 void load();
};
if(document.getElementById('history'))window.MadarHintHistoryPage(document);
