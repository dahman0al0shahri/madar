function ocPaint(){opSave();opPaint();const dialog=$('.oc-dialog');if(dialog)(dialog.querySelector('input,select,textarea')||dialog.querySelector('button'))?.focus({preventScroll:true});}
  root.addEventListener('input',ev=>{const form=ev.target.closest('[data-oc-form="operation"]'),f=ev.target;if(!form||!f.name||f.type==='password')return;const {u}=ocCurrent();if(u){if(f.dataset.ocArray){u.draft[f.name]=[...form.querySelectorAll('input[data-oc-array]:checked')].map(x=>x.value);opSave();return;}u.draft[f.name]=f.type==='checkbox'?f.checked:f.value;opSave();}});
  root.addEventListener('click',ev=>{const btn=ev.target.closest('[data-oc]');if(!btn)return;const {t,e,u,s}=ocCurrent();if(!e)return;const action=btn.dataset.oc;
    if(action==='undo'&&e.curriculumUndo?.length){e.sim=e.curriculumUndo.pop();e.last=null;u.action=null;u.draft={};u.result='';ocDrafts.delete(e.attempt);}
    if(action==='next'){const target=t.actions.find(a=>a.id===btn.dataset.operation);e.sim=op.act(s,'lab-device',{device:target.device});u.console=target.console;u.showMachines=false;u.action=null;u.tools=false;}
    if(action==='machines')u.showMachines=!u.showMachines;
    if(action==='device'){e.sim=op.act(s,'lab-device',{device:btn.dataset.device});u.console='Server Manager';u.showMachines=false;u.action=null;}
    if(action==='motion'){u.motionPaused=!u.motionPaused;const bench=btn.closest('.vm-workbench');bench.dataset.motion=u.motionPaused?'paused':'running';btn.textContent=u.motionPaused?'تشغيل الحركة':'إيقاف الحركة';opSave();return;}
    if(action==='manager')u.console='Server Manager';if(action==='tools')u.tools=!u.tools;
    if(action==='console'){u.console=btn.dataset.console;u.tools=false;}
    if(action==='close'){ocDrafts.delete(e.attempt);u.action=null;u.draft={};u.result='';u.source=false;}
    if(action==='open'||action==='requirement'){if(u.action!==btn.dataset.operation){u.draft={};u.page=0;u.result='';u.source=false;ocDrafts.delete(e.attempt);}u.action=btn.dataset.operation;u.requirement=action==='requirement';}
    if(action==='edit')u.requirement=false;if(action==='previous')u.page=Math.max(0,u.page-1);
    if(action==='reveal-source'){u.source=true;opHelp(e,'reveal:'+aSource(t,u));}
    if(action==='source'){profile().osPositions??={};profile().osPositions['os1-lesson-'+t.lesson]={step:Number(btn.dataset.scene),seconds:0};opSave();void go('lesson:os1-lesson-'+t.lesson);return;}
    ocPaint();
  });
  root.addEventListener('submit',ev=>{const form=ev.target.closest('[data-oc-form]');if(!form)return;ev.preventDefault();const {t,e,u,s}=ocCurrent();if(!e)return;
    if(form.dataset.ocForm==='password'){e.sim=op.act(s,'lab-password',{value:form.elements.value.value});u.result=e.sim.lab.output;ocPaint();return;}
    const a=t.actions.find(x=>x.id===u.action),values=Object.fromEntries(new FormData(form)),secret=ocDrafts.get(e.attempt)||{};
    for(const f of form.querySelectorAll('input[type=checkbox]:not([data-oc-array])'))values[f.name]=f.checked;for(const f of form.querySelectorAll('[data-oc-array]'))values[f.name]=[...form.querySelectorAll('[data-oc-array]:checked')].map(x=>x.value);
    for(const [k,v] of Object.entries(values)){if(['password','confirm','dsrm'].includes(k)&&typeof a.values[k]==='string')secret[k]=v;else u.draft[k]=Array.isArray(a.values[k])?(Array.isArray(v)?v:String(v).split(',').map(x=>x.trim()).filter(Boolean)):typeof a.values[k]==='number'?Number(v):v;}
    ocDrafts.set(e.attempt,secret);
    const pages=Math.max(1,Math.ceil(Object.keys(a.values).length/4));if(u.page<pages-1){u.page++;ocPaint();return;}
    e.curriculumUndo??=[];e.curriculumUndo.push(clone(s));e.curriculumUndo=e.curriculumUndo.slice(-8);e.sim=op.act(s,'lab-action',{id:a.id,values:{...u.draft,...secret}});e.last=null;u.result=e.sim.lab.output;
    if(e.sim.lab.proofs[a.id]?.ok&&!e.sim.lab.passwordStage){u.action=null;u.draft={};ocDrafts.delete(e.attempt);}ocPaint();
  });

  root.addEventListener('keydown',ev=>{const dialog=$('.oc-dialog');if(!dialog)return;if(ev.key==='Escape'){ev.preventDefault();dialog.querySelector('[data-oc="close"]')?.click();}if(ev.key==='Tab'){const fields=[...dialog.querySelectorAll('button,input,select,textarea,summary,a[href]')].filter(x=>!x.disabled&&x.getClientRects().length);if(!fields.length)return;const first=fields[0],last=fields.at(-1);if(ev.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){ev.preventDefault();last.focus();}else if(!ev.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){ev.preventDefault();first.focus();}}});
