function syncCamera(){
 const aspect=main.clientWidth/main.clientHeight;
 if(!Number.isFinite(aspect)||aspect<=0)return;
 const extent=view*Math.max(1,1.14/aspect),reach=extent*Math.max(1,aspect);
 camera.left=-extent*aspect;camera.right=extent*aspect;camera.top=extent;camera.bottom=-extent;
 // Orthographic scale remains unchanged; moving the eye back keeps all ground rays in front of it.
 const direction=V(5.5,12,18),distance=Math.max(direction.length(),reach*4);
 camera.position.copy(pan).add(direction.normalize().multiplyScalar(distance));
 camera.near=.1;camera.far=Math.max(200,distance+reach*8);
 camera.lookAt(pan);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
 // Extend the floor and world-aligned unit grid beyond every visible corner, at any supported zoom.
 const size=Math.max(200,Math.ceil(reach*8/100)*100);
 floor.scale.set(size/200,size/200,1);floor.position.x=pan.x;floor.position.z=pan.z;
 if(grid.userData.workspaceSize!==size){
  const expanded=new T.GridHelper(size,size,0x526063,0x334147);
  grid.geometry.dispose();grid.geometry=expanded.geometry;expanded.material.dispose();
  grid.userData.workspaceSize=size;
 }
 grid.position.x=Math.round(pan.x);grid.position.z=Math.round(pan.z);
 // The far workspace must not disappear into the old, fixed-distance studio fog.
 scene.fog.near=Math.max(38,distance+reach*3);scene.fog.far=Math.max(110,distance+reach*7);
}
function fitDevicesToView(){
 const bounds=new T.Box3();Object.values(devices).forEach(d=>bounds.expandByObject(d.g));
 if(bounds.isEmpty()){pan.set(0,0,0);view=6.7;syncCamera();return;}
 pan.copy(bounds.getCenter(V()));pan.y=0;syncCamera();
 const aspect=main.clientWidth/main.clientHeight;if(!Number.isFinite(aspect)||aspect<=0)return;
 let halfWidth=0,halfHeight=0;
 for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const p=V(x,y,z).applyMatrix4(camera.matrixWorldInverse);halfWidth=Math.max(halfWidth,Math.abs(p.x));halfHeight=Math.max(halfHeight,Math.abs(p.y));}
 const extent=Math.max(halfWidth/aspect,halfHeight)*1.25;
 view=Math.max(.55,Math.min(80,extent/Math.max(1,1.14/aspect)));syncCamera();
}
