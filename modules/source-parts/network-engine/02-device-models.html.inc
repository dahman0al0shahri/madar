window.madarDeviceFactory=function(T){const models={},unitBox=new T.BoxGeometry(1,1,1);
const material=(color,metalness=.3,roughness=.5)=>new T.MeshStandardMaterial({color,metalness,roughness});
const paint=material(0x89949c,1,.68),dark=material(0x252c32,0,.76),black=material(0x040506,0,.83),steel=material(0xa7afb3,1,.49),gold=material(0xb5904c,1,.3),plastic=material(0x202225,0,.65),glass=material(0x061820,0,.18);
for(const m of [paint,dark,black,steel,gold,plastic,glass])m.envMapIntensity=.65;
// Finishes use separate height, colour and roughness maps at chassis scale.
let finishSeed=8241;function randomFinish(){finishSeed=(Math.imul(finishSeed,1664525)+1013904223)>>>0;return finishSeed/4294967296;}
function surfaceMaps(brushed){const n=512,canvases=Array.from({length:3},()=>{const c=document.createElement('canvas');c.width=c.height=n;return c;}),ctx=canvases.map(c=>c.getContext('2d')),data=ctx.map(c=>c.createImageData(n,n));
 const streaks=Array.from({length:n},()=>randomFinish()-.5);
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const i=(y*n+x)*4,fine=randomFinish()-.5,grain=brushed?streaks[y]*.65+fine*.35:fine;
 const broad=Math.sin(x*.029+y*.017)*Math.sin(y*.041-x*.011),height=128+grain*(brushed?30:74),colour=226+grain*(brushed?30:26)+broad*2,rough=225+grain*28+broad*7;
 [colour,height,rough].forEach((v,j)=>data[j].data.set([v,v,v,255],i));}
 return canvases.map((c,i)=>{ctx[i].putImageData(data[i],0,0);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(.60,.60);t.anisotropy=8;if(i===0)t.colorSpace=T.SRGBColorSpace;return t;});}
const brushed=surfaceMaps(true),coated=surfaceMaps(false);
paint.map=brushed[0];paint.bumpMap=brushed[1];paint.bumpScale=.016;paint.roughnessMap=brushed[2];paint.envMapIntensity=.82;
dark.map=coated[0];dark.bumpMap=coated[1];dark.bumpScale=.009;dark.roughnessMap=coated[2];
steel.map=brushed[0];steel.bumpMap=brushed[1];steel.bumpScale=.002;steel.roughnessMap=brushed[2];steel.envMapIntensity=.6;
plastic.roughness=.77;plastic.envMapIntensity=.35;
function boxes(group,items,mat){if(!items.length)return;const mesh=new T.InstancedMesh(unitBox,mat,items.length),m=new T.Matrix4(),p=new T.Vector3(),s=new T.Vector3(),q=new T.Quaternion();items.forEach((v,i)=>{p.set(v[0],v[1],v[2]);s.set(v[3],v[4],v[5]);m.compose(p,q,s);mesh.setMatrixAt(i,m);});mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;}
function box(g,x,y,z,w,h,d,m){return boxes(g,[[x,y,z,w,h,d]],m);}
function bevel(g,w,h,d,x,y,z,mat,r=.035){const shape=new T.Shape(),a=-w/2+r,b=-h/2+r;shape.moveTo(a,b);shape.lineTo(-a,b);shape.lineTo(-a,-b);shape.lineTo(a,-b);shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r,bevelThickness:r,curveSegments:1});geo.translate(0,0,-d/2+r);const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
function label(g,text,x,y,z,w,h,color='#b4b9b8',background=null){const c=document.createElement('canvas');c.width=1024;c.height=Math.max(32,Math.round(1024*h/w));const cx=c.getContext('2d');if(background){cx.fillStyle=background;cx.fillRect(0,0,c.width,c.height);}cx.fillStyle=color;let size=c.height*.68;cx.font='500 '+size+'px Arial';while(cx.measureText(text).width>980){size*=.93;cx.font='500 '+size+'px Arial';}cx.textAlign='center';cx.textBaseline='middle';cx.fillText(text,512,c.height*.53);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;const mat=new T.MeshStandardMaterial({map:tex,transparent:true,depthWrite:false,roughness:.8,metalness:0,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1});const p=new T.Mesh(new T.PlaneGeometry(w,h),mat);p.position.set(x,y,z);g.add(p);return p;}
function screw(g,x,y,z,r=.026){const geo=new T.CylinderGeometry(r,r,.018,16),o=new T.Mesh(geo,steel);o.rotation.x=Math.PI/2;o.position.set(x,y,z);g.add(o);box(g,x,y,z+.011,r*1.35,.007,.003,black);}
function feet(g,w,d,y){for(const x of [-w*.38,w*.38])for(const z of [-d*.34,d*.34])box(g,x,y,z,.19,.10,.20,black);}
function vents(g,x,y,z,cols,rows,dx,dy,side=false){const a=[];for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)a.push(side?[x,y+j*dy,z+i*dx,.014,.024,.052]:[x+i*dx,y+j*dy,z,.053,.024,.014]);boxes(g,a,black);}
function ports(g,positions){const rim=[],cavity=[],walls=[],latch=[],leds=[],pins=[],m=new T.Matrix4(),rot=new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),-.46),scale=new T.Vector3(),pos=new T.Vector3();for(const [x,y,z,w=.21,h=.16] of positions){const t=.006,depth=.16;
 rim.push([x-w/2,y,z,t,h+.012,.019],[x+w/2,y,z,t,h+.012,.019],[x,y+h/2,z,w,t,.019],[x,y-h/2,z,w,t,.019]);
 walls.push([x-w/2+.009,y,z-depth/2,.013,h,depth],[x+w/2-.009,y,z-depth/2,.013,h,depth],[x,y+h/2-.009,z-depth/2,w,.013,depth],[x,y-h/2+.009,z-depth/2,w,.013,depth]);
 cavity.push([x,y,z-depth,w-.012,h-.008,.009]);latch.push([x-w*.31,y-h*.34,z-.01,w*.28,h*.28,.037],[x+w*.31,y-h*.34,z-.01,w*.28,h*.28,.037],[x,y-h*.47,z-.035,w*.36,.011,.07]);
 for(let p=0;p<8;p++)pins.push([x+(p-3.5)*w*.078,y+h*.22,z-.070,w*.022,.046,.010]);
 leds.push([x-w*.35,y+h*.64,z-.005,.015,.009,.008]);
 }boxes(g,rim,steel);boxes(g,walls,material(0x303338,.75,.37));boxes(g,cavity,black);boxes(g,latch,plastic);const contacts=new T.InstancedMesh(unitBox,gold,pins.length);pins.forEach((v,i)=>{pos.set(v[0],v[1],v[2]);scale.set(v[3],v[4],v[5]);m.compose(pos,rot,scale);contacts.setMatrixAt(i,m);});contacts.castShadow=true;contacts.receiveShadow=true;g.add(contacts);const lm=new T.MeshStandardMaterial({color:0x537840,emissive:0x5dad25,emissiveIntensity:.18,roughness:.3});boxes(g,leds,lm);g.userData.led=lm;}
function panel(g,w,h,z,holes,mat=paint,thickness=.018){const s=new T.Shape();s.moveTo(-w/2,-h/2);s.lineTo(w/2,-h/2);s.lineTo(w/2,h/2);s.lineTo(-w/2,h/2);s.closePath();for(const [x,y,hw,hh] of holes){const p=new T.Path();p.moveTo(x-hw/2,y-hh/2);p.lineTo(x-hw/2,y+hh/2);p.lineTo(x+hw/2,y+hh/2);p.lineTo(x+hw/2,y-hh/2);p.closePath();s.holes.push(p);}const geo=new T.ExtrudeGeometry(s,{depth:thickness,bevelEnabled:true,bevelThickness:.0015,bevelSize:.0015,bevelSegments:2,steps:1});const o=new T.Mesh(geo,mat);o.position.z=z-thickness;o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
function shell(g,w,h,d,mat,back=true){bevel(g,w,.025,d,0,h/2,0,mat,.006);bevel(g,w,.025,d,0,-h/2,0,mat,.006);box(g,-w/2,0,0,.025,h,d,mat);box(g,w/2,0,0,.025,h,d,mat);if(back)box(g,0,0,-d/2,w,h,.025,mat);box(g,0,-h/2+.07,0,w-.08,.018,d-.10,material(0x123226,0,.72));}
function topDetail(g,w,y,d){
 const seam=new T.Group();seam.rotation.x=-Math.PI/2;seam.position.y=y;g.add(seam);
 for(const x of [-w/2+.16,w/2-.16])for(const z of [-d/2+.18,d/2-.18])screw(seam,x,z,.002,.016);
 box(seam,0,-d/2+.075,.001,w-.1,.007,.002,plastic);
 const badge=label(seam,'CE  •  FCC   |   ASSEMBLED FOR LAB',-.45,-.35,.004,.82,.06,'#242a29','#cbcfc7');
 const lines=[];for(let i=0;i<34;i++)lines.push([.3+i*.009,-.35,.006,i%3===0?.006:.003,.09,.001]);boxes(seam,lines,black);
}
function rackEars(g,w,h,z){for(const side of [-1,1]){box(g,side*(w/2+.07),0,z,.14,h,.05,paint);for(const y of [-h*.3,h*.3]){const hole=new T.Mesh(new T.CylinderGeometry(.036,.036,.006,16),black);hole.rotation.x=Math.PI/2;hole.position.set(side*(w/2+.07),y,z+.03);g.add(hole);}}}
