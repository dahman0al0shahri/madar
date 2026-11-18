import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createAnnouncements } from '../public/hub/announcements.mjs';
import { createViewLifecycle } from '../public/hub/view-lifecycle.mjs';
import { createNewsFramePlayer } from '../public/hub/scene-resources.mjs';
import { createCourseViews } from '../public/hub/course-views.mjs';
import { createHostedCourseViews } from '../public/hub/hosted-course-views.mjs';
import slots from '../build/madar/hub-slots.cjs';

function motionFixture() {
  const pending = new Map(), elements = new Map(), resources = [], order = [];
  let id = 0, hidden = false, reduced = false, day = '2026-11-18';
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, { innerHTML: '', textContent: '', style: {},
      setAttribute() {}, classList: { toggle() {} } });
    return elements.get(selector);
  };
  const makeResource = kind => {
    const resource = { kind, ticks: 0, disposed: 0, syncs: 0,
      tick() { this.ticks++; }, dispose() { this.disposed++; }, sync() { this.syncs++; } };
    resources.push(resource); return resource;
  };
  const updates = ['office','network','hub'].map((scene,index) => ({ id: String(index), scene, duration: 8,
    course: '', target: 'courses', title: scene, body: 'synthetic', date: day, status: 'published', places: ['global'], pin: false }));
  const controller = createAnnouncements({ courses: {}, getUpdates: () => updates,
    canCourse: () => true, canLesson: () => true, lessonBy: () => null,
    $: element, $$: () => [], esc: String, icon: String, paintIcons() {},
    createLiquidOrbit: () => makeResource('orbit'), createNetworkNewsPlayer: () => makeResource('news'),
    vmOrbitTick: () => order.push('tick'), motionReduced: () => reduced, isHidden: () => hidden,
    requestFrame: callback => { pending.set(++id, callback); return id; }, cancelFrame: id => pending.delete(id),
    render: () => order.push('render'), day: () => day, refreshSchedule: done => { order.push('refresh'); done(); } });
  function frame(time) { const [key,callback] = pending.entries().next().value; pending.delete(key); callback(time); }
  return { controller, pending, elements, resources, order, updates, frame,
    setHidden: value => { hidden=value; }, setReduced: value => { reduced=value; }, setDay: value => { day=value; } };
}

test('repeated route starts keep one animation callback and dispose scene resources exactly once', () => {
  const f=motionFixture(), c=f.controller;
  c.reset(); c.carouselMarkup(); c.paintSlide(); c.start();
  c.start(); assert.equal(f.pending.size,1);
  f.frame(10); assert.equal(f.pending.size,1);
  c.paintPreview(); c.reset(); c.paintSlide(); c.start();
  c.dispose(); c.dispose(); c.start();
  assert.equal(f.pending.size,0);
  assert(f.resources.every(resource => resource.disposed===1));
});

test('carousel retains duration, hidden-page pause, manual pause and fresh day refresh', () => {
  const f=motionFixture(),c=f.controller;
  c.reset(); c.carouselMarkup(); c.paintSlide(); c.start();
  f.frame(1); f.frame(101);
  const progress=f.elements.get('#mh-progress'); assert.equal(progress.style.width,'1.25%');
  f.setHidden(true); f.frame(201); assert.equal(progress.style.width,'1.25%');
  f.setHidden(false); c.setPaused(true); f.frame(301); assert.equal(progress.style.width,'1.25%');
  c.setPaused(false); c.moveSlide('next'); f.frame(401); f.frame(501);
  assert.equal(progress.style.width, String(100/18000*100)+'%');
  f.setDay('2026-11-19'); f.frame(2001);
  assert.deepEqual(f.order.slice(-2),['refresh','render']); assert.equal(f.pending.size,0);
  c.dispose();
});

test('scene player checks both origin and source, removes only its own listeners and ignores stale callbacks', () => {
  const frame=new EventTarget(), target=new EventTarget(), messages=[];
  frame.contentWindow={postMessage:(...args)=>messages.push(args)};
  let callback,disconnects=0,external=0,paused=false;
  target.addEventListener('message',()=>external++);
  const player=createNewsFramePlayer({frame,eventTarget:target,origin:'https://synthetic.invalid',isPaused:()=>paused,
    observe: fn=>{callback=fn;return {observe: node=>assert.equal(node,frame),disconnect:()=>disconnects++};}});
  const send=(origin,source)=>target.dispatchEvent(Object.assign(new Event('message'),{origin,source,data:{type:'madar-news-ready'}}));
  callback([{isIntersecting:true}]); assert.equal(messages.length,1);
  send('https://other.invalid',frame.contentWindow); send('https://synthetic.invalid',{}); assert.equal(messages.length,1);
  paused=true;send('https://synthetic.invalid',frame.contentWindow);assert.equal(messages.at(-1)[0].paused,true);
  player.dispose();player.dispose();callback([{isIntersecting:true}]);frame.dispatchEvent(new Event('load'));send('https://synthetic.invalid',frame.contentWindow);player.sync();
  assert.equal(messages.length,2);assert.equal(disconnects,1);assert.equal(external,4);
  assert.equal(createNewsFramePlayer({frame:null}),null);
});

test('route lifecycle disposes old content before replacement, mounts in order and preserves redirects', () => {
  const calls=[];let page={html:'one',course:'network'};
  const lifecycle=createViewLifecycle({begin:()=>calls.push('begin'),resolve:()=>page,
    redirect:url=>calls.push(url),beforeReplace:()=>calls.push('dispose-old'),replace:p=>calls.push(p.html),
    mount:p=>calls.push(p.course),finish:()=>calls.push('start'),dispose:()=>calls.push('stop')});
  lifecycle.render();page={html:'two',course:'os1'};lifecycle.render();
  assert.deepEqual(calls,['begin','dispose-old','one','network','start','begin','dispose-old','two','os1','start']);
  calls.length=0;page={redirect:'/applications#word'};lifecycle.render();
  assert.deepEqual(calls,['begin','/applications#word']);
  lifecycle.dispose();lifecycle.dispose();lifecycle.render();assert.equal(calls.at(-1),'stop');assert.equal(calls.length,3);
});

test('hosted course adapters preserve denied labs, theory/practice routing, hints and live permissions', () => {
  let boot={canPractice:false},route='lesson:x';const calls=[];
  const referenceLessons = [
    { id: 'theory', course: 'network', section: 'theory' },
    { id: 'practice', course: 'network', section: 'lessons' },
    { id: 'hidden', course: 'network', section: 'theory' },
    { id: 'other', course: 'os1', section: 'theory' },
  ];
  const v=createHostedCourseViews({courses:{network:{name:'Network',sections:[]}},lessons:referenceLessons,canLesson:lesson=>lesson.id!=='hidden',
    getBoot:()=>boot,getRoute:()=>route,heading:String,esc:String,lessonRows:rows=>'[rows:'+rows.map(row=>row.id).join(',')+']',
    osSection:s=>'os:'+s,osLessonPage:l=>'os:'+l.id,networkPracticalIndex:()=> 'practical-index',
    networkSelfTestPage:s=>'test:'+s,networkTheoryIndex:()=> 'theory-index',networkReference:()=> 'reference',
    theoryLessonPage:l=>{calls.push(l.id);return 'theory';},hintHistory:()=>'<section>hints</section>'});
  assert.equal(v.courseSection('os1','practice'),'os:practice');assert.equal(v.courseSection('network','lessons'),'practical-index');
  assert.equal(v.courseSection('network','hints'),'<section>hints</section>');
  assert.equal(v.courseSection('network','practice-vlan'),'test:practice-vlan');
  assert.doesNotMatch(v.courseSection('network','lab'),/<iframe/);
  assert.match(v.courseSection('network','reference'), /\[rows:theory,practice\]<section class="mh-feedback-fold"/);
  const lesson={id:'x',course:'network',title:'Synthetic',theory:true,practice:true};
  assert.doesNotMatch(v.lessonPage(lesson),/<iframe/);route='lesson:x:reference';assert.match(v.lessonPage(lesson),/theory/);
  route='lesson:x';boot={canPractice:true};assert.match(v.lessonPage(lesson),/data-network-src="\/network-lab\?lesson=x"/);
  assert.match(v.courseSection('network','reference'), /reference\[rows:theory\]<section class="mh-feedback-fold"/);
  assert.match(v.courseSection('network','lab'),/data-network-src="\/network-lab"/);assert.deepEqual(calls,['x']);
});

test('common course templates read restored profiles and delegate without mutating learning data', () => {
  let p={visits:{},notes:{}};const lessons=[{id:'n1',course:'network',title:'Synthetic',steps:['One'],kind:'درس',section:'theory'}];
  const courses={network:{name:'Network',description:'Course',color:'#fff',tags:[],sections:[['theory','Theory']]}};
  const v=createCourseViews({courses,lessons,profile:()=>p,lessonBy:id=>lessons.find(l=>l.id===id),canLesson:l=>Boolean(l),
    esc:String,icon:String,carouselMarkup:()=>'',officeArt:()=>'',networkArt:()=>'',osCourseArt:()=>'',osHome:()=>'',networkReviewCard:()=>'',
    integrations:{courseSection:(...args)=>args.join(':'),lessonPage:l=>l.id}});
  assert.equal(v.resume('network'),'');p={visits:{network:{lesson:'n1',step:0}},notes:{},latest:'network'};
  const before=JSON.stringify(p);assert.match(v.resume('network'),/Synthetic/);assert.match(v.courseCard('network'),/Synthetic/);
  assert.equal(v.courseSection('network','theory'),'network:theory');assert.equal(v.lessonPage(lessons[0]),'n1');
  assert.equal(JSON.stringify(p),before);
});

test('hub slot assembly rejects missing, duplicate and reversed slots and preserves literal replacement characters', () => {
  const slot='/* hub:environment:start */old/* hub:environment:end */';
  assert.equal(slots.fillHubSlots('before'+slot+'after',{environment:'$& $` $\' العربية'}),'before$& $` $\' العربيةafter');
  assert.throws(()=>slots.fillHubSlots(slot,{}),/inventory/);
  assert.throws(()=>slots.fillHubSlots(slot+slot,{environment:''}),/inventory|one hub slot/);
  assert.throws(()=>slots.fillHubSlots('/* hub:environment:end *//* hub:environment:start */',{environment:''}),/Reversed/);
  assert.throws(()=>slots.fillHubSlots('/* hub:environment:start */',{environment:''}),/one hub slot/);
  const build=fs.readFileSync(new URL('../build/madar/hub.cjs',import.meta.url),'utf8');
  assert.doesNotMatch(build,/app\.(?:replace|slice|indexOf)\(/,'Do not reintroduce executable-code surgery');
});
