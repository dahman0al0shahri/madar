// Shared approved transparent RJ45 assembly for the news scene and simulator.
(function(global){'use strict';
function create(T,data,options={}){
 const scale=.0116,geometries=new Set(),materials=new Set(),plugs=new Set();
 const ownG=g=>(geometries.add(g),g),ownM=m=>(materials.add(m),m);
 const glass=options.glass||ownM(new T.MeshPhysicalMaterial({color:0xdde8eb,metalness:0,roughness:.13,transparent:true,opacity:.3,depthWrite:false,ior:1.58,clearcoat:.8,clearcoatRoughness:.12,envMapIntensity:.75,side:T.DoubleSide}));
 const gold=options.gold||ownM(new T.MeshStandardMaterial({color:0xc4a05c,metalness:.9,roughness:.35}));
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#888';ctx.fillRect(0,0,256,256);let seed=19;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<22000;i++){const n=110+random()*35;ctx.fillStyle=`rgb(${n},${n},${n})`;ctx.fillRect(random()*256,random()*256,1,1);}const grain=new T.CanvasTexture(canvas);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(16,2);
 function cableMaterial(color){return new T.MeshStandardMaterial({color,metalness:0,roughness:.48,bumpMap:grain,bumpScale:.0008});}
 function geometry(indices){const g=new T.BufferGeometry(),positions=[],normals=[];for(let i=0;i<data.position.length;i+=3){positions.push(-data.position[i+2]*scale,data.position[i+1]*scale,data.position[i]*scale);normals.push(-data.normal[i+2],data.normal[i+1],data.normal[i]);}g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));g.setIndex(indices);return g;}
 const bodyBase=ownG(geometry(data.indices.body)),contacts=ownG(geometry(data.indices.contacts)),stemGeo=ownG(new T.CylinderGeometry(.031,.031,.08,32)),wireGeo=ownG(new T.CylinderGeometry(.004,.004,.14,8));
 const colors=[0xe7e3d8,0xb4672b,0xe7e3d8,0x39678c,0xe7e3d8,0x47794b,0xe7e3d8,0x70503a],wireMaterials=colors.map(color=>ownM(new T.MeshStandardMaterial({color,roughness:.5}))),jackets=new Map();
 function plug(color=0x31596b,{size=1,offset=0,wiring=[1,2,3,4,5,6,7,8]}={}){const g=new T.Group(),model=new T.Group();g.name='RJ45-Molex-449150001';g.scale.setScalar(size);g.add(model);model.position.z=offset;
 const add=(geo,mat,name)=>{const m=new T.Mesh(geo,mat);m.name=name;m.castShadow=m.receiveShadow=true;model.add(m);return m;};
 const body=add(bodyBase.clone(),glass,'manufacturer-body');body.castShadow=false;add(contacts,gold,'eight-manufacturer-contacts');if(!jackets.has(color))jackets.set(color,options.cableMaterial||ownM(cableMaterial(color)));const stem=add(stemGeo,jackets.get(color),'cable-jacket');stem.rotation.x=Math.PI/2;stem.position.set(0,0,.10);
 for(let i=0;i<8;i++){const wire=add(wireGeo,wireMaterials[wiring[i]-1],'conductor-'+(i+1));wire.rotation.x=Math.PI/2;wire.position.set((i-3.5)*.0118,.012,-.017);wire.userData.sourcePin=wiring[i];}
 g.userData.body=body;g.userData.originalPositions=body.geometry.attributes.position.array.slice();g.userData.lastPress=-1;g.userData.contacts=8;g.userData.cableExit=(.14+offset)*size;plugs.add(g);return g;}
 function pressLatch(g,press){if(Math.abs(press-g.userData.lastPress)<.001)return;g.userData.lastPress=press;const a=g.userData.body.geometry.attributes.position.array,base=g.userData.originalPositions;for(let i=0;i<a.length;i+=3){a[i+1]=base[i+1];if(base[i+1]<-4.1*scale){const weight=T.MathUtils.smoothstep(base[i+2]/scale,-10,5);a[i+1]+=press*.026*weight;}}g.userData.body.geometry.attributes.position.needsUpdate=true;}
 function release(g){if(!plugs.delete(g))return;g.userData.body.geometry.dispose();g.removeFromParent();}
 function dispose(){for(const g of [...plugs])release(g);for(const g of geometries)g.dispose();for(const m of materials)m.dispose();grain.dispose();}
 return{plug,pressLatch,cableMaterial,release,dispose};
}
global.MadarRJ45={create};
})(window);
