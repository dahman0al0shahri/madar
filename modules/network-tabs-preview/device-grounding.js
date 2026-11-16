// The model origin is not its underside (the PC keyboard/feet are below zero).
// Lift only intersecting bodies. Keep valid saved heights and all X/Z positions.
function seatDeviceAboveFloor(group){
 group.updateMatrixWorld(true);
 const bounds=new T.Box3().setFromObject(group),surfaceY=Math.max(floor.position.y,grid.position.y)+.002;
 if(!bounds.isEmpty()&&Number.isFinite(bounds.min.y)&&bounds.min.y<surfaceY-1e-7){
  group.position.y+=surfaceY-bounds.min.y;
  group.updateMatrixWorld(true);
 }
}
