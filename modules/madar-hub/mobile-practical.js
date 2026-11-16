// A full document avoids a tall nested WebGL viewport on phones. Replace only
// the current lesson entry, so Back still leads to the course the learner opened.
function mobilePracticalTarget(html){
 if(!matchMedia('(max-width: 700px), (pointer: coarse)').matches)return null;
 const template=document.createElement('template');template.innerHTML=html;
 const frame=template.content.querySelector('#mh-network-lab');
 if(!frame)return null;
 const url=new URL(frame.getAttribute('data-network-src')||frame.getAttribute('src'),location.origin);
 if(url.origin!==location.origin||url.pathname!=='/network-lab')return null;
 return url.pathname+url.search;
}
