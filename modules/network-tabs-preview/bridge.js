// Runs inside the existing, copied 3D engine; never modifies the source preview.
let tabsChanging=false,tabsDrafts={},tabsOnChange=null,tabsDevice='',tabsOpenState=false,tabsScrollState=0;
let tabsRestoring=null,tabsAliases={};
const tabsClone=x=>JSON.parse(JSON.stringify(x));
const tabsCreate=createDevice,tabsRemove=removeDevice,tabsSnapshot=snapshot,tabsRestore=restore;
createDevice=function(id,...args){tabsCreate(id,...args);devices[id].instanceId=tabsRestoring?.devices?.[id]?.instanceId||crypto.randomUUID();};
removeDevice=function(id){tabsRemove(id);if(!tabsRestoring&&!tabsChanging){delete tabsDrafts[id];if(tabsDevice===id)tabsDevice='';root.dispatchEvent(new CustomEvent('labs:device-removed',{detail:{id}}));}};
snapshot=function(){const s=tabsSnapshot();for(const[id,d]of Object.entries(s.devices))d.instanceId=devices[id].instanceId||(devices[id].instanceId=crypto.randomUUID());return s;};
restore=function(s){const prior=tabsRestoring;tabsRestoring=s;try{assist.import(s.assistance||new window.MadarAssistance.Assistance().export());tabsRestore(s);}finally{tabsRestoring=prior;}};
// Keep each lab's bounded console history; the base preview importer starts a fresh history.
const tabsImportCli=ios.import.bind(ios);
ios.import=function(data){
 tabsImportCli(data);
 for(const[id,s]of Object.entries(this.sessions)){
  const old=data?.[id];if(!old)continue;
  const history=Array.isArray(old.history)?old.history.filter(x=>typeof x==='string'):[];
  s.history=history.slice(-30);
  s.historyIndex=Number.isInteger(old.historyIndex)?Math.max(0,Math.min(s.history.length,old.historyIndex-Math.max(0,history.length-30))):s.history.length;
  s.lines=Array.isArray(old.lines)?old.lines.filter(x=>typeof x==='string').slice(-110):[];
 }
};
const engineRefresh=refreshCli;
refreshCli=function(){
 const old=tabsDevice,priorLog=cliLog.textContent,priorScroll=cliLog.scrollTop;if(old&&!tabsChanging)tabsDrafts[old]=ios.session(old).auth?'':cliInput.value;
 engineRefresh();tabsDevice=ports[selected]?.id||'';
 // Link-state refreshes do not constitute new console output. Keep the reader's place.
 if(tabsDevice===old&&cliLog.textContent===priorLog)cliLog.scrollTop=priorScroll;
 if(tabsDevice!==old||tabsChanging)cliInput.value=tabsDrafts[tabsDevice]||'';
 root.dispatchEvent(new CustomEvent('labs:context'));
};
const engineRun=runCli;
runCli=function(){engineRun();tabsDrafts[tabsDevice]=ios.session(tabsDevice).auth?'':cliInput.value;};
q('#nf-command-send').onclick=()=>runCli();
cliInput.addEventListener('input',()=>{tabsDrafts[tabsDevice]=ios.session(tabsDevice).auth?'':cliInput.value;tabsOnChange?.('draft');});
cliInput.addEventListener('keydown',e=>{if(['Tab','ArrowUp','ArrowDown'].includes(e.key)||(e.ctrlKey&&e.key.toLowerCase()==='c')){tabsDrafts[tabsDevice]=ios.session(tabsDevice).auth?'':cliInput.value;tabsOnChange?.('draft');}});
const tabsDisplayPing=displayPing,tabsInvalidatePing=invalidatePing;
displayPing=function(result){trafficUntil=0;trafficCables=new Set();q('#nf-ping-result').removeAttribute('data-pending');tabsDisplayPing(result);root.dispatchEvent(new CustomEvent('labs:ping-display'));};
invalidatePing=function(){q('#nf-ping-result').removeAttribute('data-pending');tabsInvalidatePing();};
function tabsPingUi(ui={}){const el=q('#nf-ping-result');el.textContent=ui.pingResult||'جاهز للفحص';if(ui.pingOk==='true'||ui.pingOk==='false')el.dataset.ok=ui.pingOk;else el.removeAttribute('data-ok');el.removeAttribute('data-pending');q('#nf-ping-trace').textContent=ui.pingTrace||'';}
q('#nf-cli').addEventListener('toggle',()=>{if(q('#nf-cli').open!==tabsOpenState){tabsOpenState=q('#nf-cli').open;tabsOnChange?.('view');}});
q('#nf-cli-log').addEventListener('scroll',()=>{const top=cliLog.scrollTop;if(top===tabsScrollState)return;tabsScrollState=top;if(!tabsChanging)tabsOnChange?.('view');});
// These choices are already part of the saved UI; edits must schedule a save too.
q('#nf-ping-target').addEventListener('input',()=>{if(!tabsChanging)tabsOnChange?.('view');});
q('#nf-ping-source').addEventListener('change',()=>{if(!tabsChanging)tabsOnChange?.('view');});
save=function(){if(!tabsChanging)tabsOnChange?.('engine');};
root.labsBridge={
 onChange(fn){tabsOnChange=fn;},
 capture(){if(tabsDevice)tabsDrafts[tabsDevice]=ios.session(tabsDevice).auth?'':cliInput.value;const s=snapshot();delete s.writer;delete s.write;s.cameraControls=2;s.cli=JSON.parse(JSON.stringify(cliSessions));s.editUndo=undoSnapshot?tabsClone(undoSnapshot):null;s.ui={drafts:{...tabsDrafts},cliOpen:cliDetails.open,cliScroll:cliLog.scrollTop,pingResult:q('#nf-ping-result').textContent,pingOk:q('#nf-ping-result').getAttribute('data-ok'),pingPending:q('#nf-ping-result').dataset.pending==='true',pingTrace:q('#nf-ping-trace').textContent,pingTarget:q('#nf-ping-target').value,pingSource:q('#nf-ping-source').value,pcLog:q('#nf-pc-log').textContent};return JSON.parse(JSON.stringify(s));},
 restore(s){tabsChanging=true;trafficUntil=0;trafficCables=new Set();undoSnapshot=s.editUndo?tabsClone(s.editUndo):null;q('#nf-undo').disabled=!undoSnapshot;tabsDrafts={...s.ui?.drafts};if(s.deviceAliases)root.dispatchEvent(new CustomEvent('labs:aliases-restored',{detail:tabsClone(s.deviceAliases)}));restore({...JSON.parse(JSON.stringify(s)),writer:'tabs',write:0});
 tabsOpenState=!!s.ui?.cliOpen;cliDetails.open=tabsOpenState;cliInput.value=tabsDrafts[tabsDevice]||'';cliLog.scrollTop=s.ui?.cliScroll||0;tabsScrollState=cliLog.scrollTop;const interrupted=s.ui?.pingPending||s.ui?.pingResult?.startsWith('جارٍ عرض نتيجة');tabsPingUi(interrupted?{pingResult:'لم يكتمل عرض نتيجة الفحص السابق؛ أعد اختبار الاتصال.'}:s.ui);q('#nf-ping-target').value=s.ui?.pingTarget||'192.168.30.3';if(s.ui?.pingSource)q('#nf-ping-source').value=s.ui.pingSource;q('#nf-pc-log').textContent=s.ui?.pcLog||'';tabsChanging=false;wake();},
 point(e){return groundPoint(e)?.toArray();},
 workspaceCoverage(){const probe=new T.Raycaster(),ground=new T.Plane(V(0,1,0),.015);return [-1,1].flatMap(x=>[-1,1].map(y=>{probe.setFromCamera(new T.Vector2(x,y),camera);const p=probe.ray.intersectPlane(ground,V());if(!p)return false;const depth=p.clone().project(camera).z;return Math.abs(p.x-floor.position.x)<100*floor.scale.x&&Math.abs(p.z-floor.position.z)<100*floor.scale.y&&depth>=-1&&depth<=1;}));},
 endpoint(key){const v=at(key);return{p:v.p.toArray(),n:v.n.toArray()};},
 selected(){return ports[selected]?.id||'';},
 deviceIds(){return Object.keys(devices);},
 select(id){selectDevice(id);},
 busy(){return busy||!!wireDrag;},
 insert(type){insertDevice(type);},
 prepare(){setupVlan(false);undoSnapshot=null;q('#nf-undo').disabled=true;},
 runPing(id,target){return network.ping(id,target);},
 pendingPing(){trafficUntil=0;trafficCables=new Set();tabsPingUi({pingResult:'جارٍ عرض نتيجة اختبار الاتصال…'});q('#nf-ping-result').dataset.pending='true';wake();},
 showPing(result,text,stale=false){if(stale){trafficUntil=0;trafficCables=new Set();tabsPingUi({pingResult:text});}else{displayPing(result);q('#nf-ping-result').textContent=text;}wake();},
 verify(course){return course==='vlan'?(!!devices.S1&&!!network.ensure('S1').vlans[20]):!!admin['R1:G0/1'];},
 aliases(names){tabsAliases={...names};for(const [id,b]of Object.entries(labels))b.textContent=names[id]||id;},
 fingerprint(){const s=snapshot();return JSON.stringify({devices:Object.fromEntries(Object.entries(s.devices).map(([id,d])=>[id,d.type])),cables:s.cables.map(c=>[c.a,c.b]),network:s.network,admin:s.admin,power:s.power});}
};
rememberEdit=function(){undoSnapshot=root.labsBridge.capture();delete undoSnapshot.editUndo;undoSnapshot.deviceAliases={...tabsAliases};q('#nf-undo').disabled=false;};
q('#nf-undo').onclick=()=>{if(!undoSnapshot||busy||wireDrag)return;const s=undoSnapshot;root.labsBridge.restore({...s,editUndo:null,assistance:assist.export()});save();announce('استُعيدت الشبكة قبل آخر إضافة أو حذف في هذا المختبر.');};
root.dispatchEvent(new CustomEvent('labs:ready',{bubbles:true}));
