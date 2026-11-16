function labPortKind(key){return key?.endsWith(':Console')?'console':key?.endsWith(':RS232')?'rs232':key?.includes(':S0/')?'serial':'ethernet';}
function addLabPorts(id,type){
 const g=devices[id].g;
 const socket=(name,xyz,normal,w,h,serial=false)=>{addPort(id,name,xyz,normal,w,h);const face=ports[id+':'+name].indicator;F.box(face,0,0,-.008,w+.05,h+.05,.025,F.steel);F.box(face,0,0,.01,w,h,.026,F.black);if(serial){for(const x of [-1,1])F.box(face,x*(w*.62),0,.025,.04,.04,.04,F.steel);for(let row=0;row<2;row++)for(let pin=0;pin<(name==='RS232'?5:13);pin++)F.box(face,(-.4+pin/(name==='RS232'?5:13)*.8)*w,(row-.5)*h*.35,.027,.008,.008,.018,F.gold);}else F.box(face,0,-h*.55,.026,w,.018,.025,F.material(0x82c8de));};
 if(type==='PC')socket('RS232',[1.47,.27,-1.15],[0,0,-1],.34,.15,true);
 else if(type==='S')socket('Console',[-1.55,-.03,1.26],[0,0,1],.22,.17);
 else{socket('Console',[.82,-.18,-1.314],[0,0,-1],.22,.17);socket('S0/0/0',[-.72,.20,-1.314],[0,0,-1],.38,.18,true);socket('S0/0/1',[.72,.20,-1.314],[0,0,-1],.38,.18,true);}
}
function labConnector(color,wiring,type,key,dce=false){
 if(type!=='serial'&&!(type==='console'&&labPortKind(key)==='rs232'))return connector(color,wiring?.length?wiring:undefined);
 const g=new T.Group();g.userData.labConnector=true;g.userData.cableExit=.27;
 const w=type==='serial'?.40:.37;F.box(g,0,0,.13,w,.19,.25,F.material(color));F.box(g,0,0,.025,w*.85,.13,.07,F.steel);F.box(g,0,0,-.017,w*.72,.085,.025,F.black);
 for(const x of [-1,1])F.box(g,x*w*.58,0,.06,.055,.055,.15,F.steel);
 for(let row=0;row<2;row++)for(let pin=0;pin<(type==='serial'?13:5);pin++)F.box(g,(-.32+pin/(type==='serial'?13:5)*.64)*w,(row-.5)*.035,-.032,.009,.009,.018,dce?F.black:F.gold);
 scene.add(g);return g;
}
function releaseLabConnector(g){if(!g.userData.labConnector){RJ.release(g);return;}g.removeFromParent();g.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();if(o.material&&!Object.values(F).includes(o.material))o.material.dispose?.();});}

