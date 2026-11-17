function groundPoint(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);return ray.ray.intersectPlane(plane,V());}
function hitDevice(){
 // Physical meshes only: a glow sprite (even invisible) is not a device surface.
 // Probe a 98% copy mathematically, without changing rendered geometry or ports.
 const inset=.98,probe=new T.Raycaster();let chosen=null,nearest=Infinity;
 for(const [id,d] of Object.entries(devices)){
  const meshes=[];d.g.traverseVisible(o=>{if(o.isMesh&&o.material&&(Array.isArray(o.material)?o.material.some(m=>m.visible&&m.opacity>0):o.material.visible&&o.material.opacity>0))meshes.push(o);});
  const center=d.g.getWorldPosition(V());probe.ray.copy(ray.ray);
  probe.ray.origin.sub(center).divideScalar(inset).add(center);
  const h=probe.intersectObjects(meshes,false)[0];
  if(h&&h.distance*inset<nearest){nearest=h.distance*inset;chosen=id;}
 }
 return chosen;
}
function moveDevice(id,x,z){const d=devices[id],w=devices[id].type==='S'?2.5:2,depth=devices[id].type==='PC'?2.1:1.4;for(const[other,v]of Object.entries(devices)){if(other===id)continue;const ow=v.type==='S'?2.5:2,od=v.type==='PC'?2.1:1.4;if(Math.abs(x-v.g.position.x)<w+ow+.15&&Math.abs(z-v.g.position.z)<depth+od+.15)return false;}d.g.position.x=x;d.g.position.z=z;dirtyCable=true;updateUI();wake();return true;}
// Direct manipulation: a cable end follows the pointer in the workspace.
let wireDrag=null,hoverKey=null,edgeTime=0;
const hint=document.createElement('span'),marker=document.createElement('span');
hint.className='nf-wire-hint';marker.className='nf-port-target';hint.hidden=marker.hidden=true;main.append(hint,marker);
function screenPoint(p){const v=p.clone().project(camera);return {x:(v.x*.5+.5)*main.clientWidth,y:(-v.y*.5+.5)*main.clientHeight};}
function localPointer(e){const r=renderer.domElement.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function pluggedHit(e){groundPoint(e);const hits=ray.intersectObjects(cables.flatMap(c=>c.plugs.filter((p,i)=>!!(i?c.b:c.a))),true);if(!hits.length)return null;let o=hits[0].object;while(o.parent&&o.parent!==scene)o=o.parent;for(const c of cables){const side=c.plugs.indexOf(o);if(side!==-1)return side?c.b:c.a;}return null;}
function nearestPort(e){const enlarged=zoomPortAt(e);if(enlarged)return enlarged;const pos=localPointer(e);let best=null,dist=e.pointerType==='touch'?23:13;for(const k of Object.keys(ports)){const a=at(k),p=screenPoint(a.p),d=Math.hypot(p.x-pos.x,p.y-pos.y);if(d<dist){dist=d;best=k;}}return best;}
function looseHit(e){groundPoint(e);const hits=ray.intersectObjects(cables.flatMap(c=>c.plugs.filter((p,i)=>!(i?c.b:c.a))),true);if(hits.length){let o=hits[0].object;while(o.parent&&o.parent!==scene)o=o.parent;for(const c of cables){const side=c.plugs.indexOf(o);if(side!==-1)return{c,side};}}const pos=localPointer(e);let best=null,dist= e.pointerType==='touch'?22:10;for(const c of cables)for(let side=0;side<2;side++){if(side?c.b:c.a)continue;const p=screenPoint(endpoint(c,side,performance.now()).p),d=Math.hypot(p.x-pos.x,p.y-pos.y);if(d<dist){dist=d;best={c,side};}}return best;}
function markPort(key,e,valid=true){hoverKey=key;const zb=key&&!zoomBox.hidden?zoomButtons.get(key):null,br=zb?.getBoundingClientRect(),mr=main.getBoundingClientRect();const pos=br?{x:br.left+br.width/2-mr.left,y:br.top+br.height/2-mr.top}:key?screenPoint(at(key).p):localPointer(e);marker.hidden=!key;hint.hidden=false;marker.style.left=pos.x+'px';marker.style.top=pos.y+'px';marker.dataset.valid=String(valid);hint.style.left=Math.max(90,Math.min(main.clientWidth-90,pos.x))+'px';hint.style.top=Math.max(12,pos.y-46)+'px';hint.textContent=key?key.replace(':',' / ')+(wireDrag?(valid?' · أفلت للتوصيل':' · المنفذ غير متاح'):' · اسحب الكابل'):'أفلت لترك الرأس هنا';hint.dataset.valid=String(valid);}
function wireValid(key){if(!key||!wireDrag?.c)return false;const w=wireDrag,other=w.side===0?w.c.b:w.c.a;return !cableFor(key)&&(!other||ports[other].id!==ports[key].id);}
