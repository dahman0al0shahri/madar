// Routes served as authenticated documents never belong in the public browser
// navigation catalogue. This only filters browser metadata, not server routing.
const hidden = /exam-review|night-review|private-assets/;
export function privateRouteManifest(){return {
 name:'madar-private-route-manifest',enforce:'post',
 transform(code,id){
  if(!id.includes('vinext-app-browser-entry')||!code.includes('window.__VINEXT_LINK_PREFETCH_ROUTES__'))return;
  let result=code.replace(/(window\.__VINEXT_LINK_PREFETCH_ROUTES__ = )(\[[^;]*\]);/,(_,prefix,json)=>prefix+JSON.stringify(JSON.parse(json).filter(entry=>!hidden.test(JSON.stringify(entry))))+';');
  result=result.replace(/new Map\((\[[^\n]*\])\)/g,(_,json)=>'new Map('+JSON.stringify(JSON.parse(json).filter(entry=>!hidden.test(JSON.stringify(entry))))+')');
  if(hidden.test(result))throw Error('Private route metadata remained in browser entry');
  return {code:result,map:null};
 }
};}
