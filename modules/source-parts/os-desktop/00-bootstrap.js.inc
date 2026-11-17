
  // Reuse the exact MADAR sphere and fluid satellite from the reference artwork.
  let vmOrbits=[];
  const vmOrbitTime={};
  function vmOrbitalMark(kind){return `<div class="mh-main-mark vm-orbital-mark vm-orbit-${kind}" data-vm-orbit="${kind}" aria-hidden="true"><div class="mh-orbit-core"></div><span class="vm-orbit-server">${vmGlyph('server')}</span><div class="mh-liquid-bubble"><canvas></canvas></div></div>`;}
  function vmOrbitSync(){
    for(const item of vmOrbits){vmOrbitTime[item.key]=item.orbit.snapshot();item.orbit.dispose();}
    vmOrbits=$$('[data-vm-orbit]').map(mark=>({key:mark.dataset.vmOrbit,mark,orbit:createLiquidOrbit(mark,{...vmOrbitTime[mark.dataset.vmOrbit],speed:.16,colorSpeed:.35})}));
  }
  function vmOrbitTick(t,stopped){
    if(!vmOrbits.length)return;
    const bench=$('.vm-workbench'),hold=stopped||!bench||bench.dataset.motion==='paused';
    for(const item of vmOrbits)item.orbit.tick(t,hold);
    if(!bench){for(const item of vmOrbits){vmOrbitTime[item.key]=item.orbit.snapshot();item.orbit.dispose();}vmOrbits=[];}
  }
  // Windows lab presentation. Only browser simulation state is changed.
  // Decorative vector icons; labels and lesson actions remain the same.
  