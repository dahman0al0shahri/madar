// Resume metadata is derived from the saved original lab, never from a helper or copy.
function syncLessonProgress(frame){
 if(!state.route.startsWith('lesson:')||!frame)return;
 const progress=frame.contentWindow?.document.getElementById('madar-labs')?.lessonProgress?.();
 if(!progress||progress.lesson!==state.route.slice(7)||!canLesson(lessonBy(progress.lesson)))return;
 const old=profile().visits.network;
 if(JSON.stringify(old)!==JSON.stringify(progress)||profile().latest!=='network'){
  profile().visits.network=progress;profile().latest='network';scheduleSave();
 }
}
