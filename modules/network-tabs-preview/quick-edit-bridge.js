// Extends the shared engine. Deletions use the existing per-lab undo snapshot.
Object.assign(root.labsBridge,{
 cableChoice(){return cableChoice;},
 cableInfo(id){const c=cables.find(c=>c.id===id);return c?{type:c.type,label:cableTypes[c.type].label,autoPending:c.autoPending,pins:[...cableTypes[c.type].pins]}:null;},
 chooseCable(type){if(busy||wireDrag||linking||!['auto','straight','crossover'].includes(type))return false;cableChoice=type;save();return true;},
 replaceCable(id){const c=cables.find(c=>c.id===id);if(!c||busy||wireDrag||drag||linking)return false;const type=cableChoice==='auto'?recommendedCable(c.a,c.b):cableChoice;rememberEdit();recolorCable(c,type);c.autoPending=cableChoice==='auto'&&!(c.a&&c.b);c.readyAt=performance.now()+650;invalidatePing();updateUI();save();wake();return true;},
 quickPlugPick(e,closeup=false){
  const canvas=closeup?detail.domElement:renderer.domElement,r=canvas.getBoundingClientRect();
  if(!r.width||!r.height)return null;
  const probe=new T.Raycaster();probe.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),closeup?closeCamera:camera);
  const current=cableFor(selected),loose=looseForHome(selected),candidates=closeup?(current?[current.plugs[current.a===selected?0:1]]:loose?[loose.c.plugs[loose.side]]:[]):cables.flatMap(c=>c.plugs);
  const hit=probe.intersectObjects(candidates,true)[0];if(!hit)return null;
  let o=hit.object;while(o.parent&&o.parent!==scene)o=o.parent;
  const c=cables.find(c=>c.plugs.includes(o));return c?{kind:'cable',id:c.id,head:true}:null;
 },
 quickPick(e,{cableOnly=false}={}){
  const head=this.quickPlugPick(e);if(head)return head;
  groundPoint(e);if(!cableOnly){const id=hitDevice();if(id)return {kind:'device',id};
  if(nearestPort(e)||pluggedHit(e)||looseHit(e))return null;} // Normal mode keeps connector dragging intact.
  const rect=renderer.domElement.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;let chosen=null,distance=e.pointerType==='touch'?22:12;
  for(const c of cables){const curve=c.mesh.geometry.parameters?.path;if(!curve)continue;let prev=screenPoint(curve.getPoint(0));
   for(let i=1;i<=80;i++){const next=screenPoint(curve.getPoint(i/80)),dx=next.x-prev.x,dy=next.y-prev.y,u=Math.max(0,Math.min(1,((x-prev.x)*dx+(y-prev.y)*dy)/(dx*dx+dy*dy||1))),d=Math.hypot(x-prev.x-u*dx,y-prev.y-u*dy);if(d<distance){distance=d;chosen=c;}prev=next;}
  }return chosen?{kind:'cable',id:chosen.id}:null;
 },
 highlightCable(id){let changed=false;for(const c of cables){const value=c.id===id?1.8:0;if(c.mesh.material.emissiveIntensity===value)continue;c.mesh.material.emissive.setHex(value?0x68dcd4:0);c.mesh.material.emissiveIntensity=value;changed=true;}if(changed)wake();},
 connectedCable(){return (cableFor(selected)||looseForHome(selected)?.c)?.id||null;},
 deleteItems(ids=[],cableId=null){
  if(busy||wireDrag||drag)return false;const valid=[...new Set(ids)].filter(id=>devices[id]),wire=cables.find(c=>c.id===cableId);if(!valid.length&&!wire)return false;
  rememberEdit();if(valid.length)valid.forEach(removeDevice);else removeCable(wire);invalidatePing();afterEdit();announce(valid.length?'حُذف '+valid.length+' من الأجهزة مع كابلاتها؛ التراجع يعيدها.':'حُذف الكابل؛ التراجع يعيده.');return true;
 }
});
