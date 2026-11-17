<script>
(()=>{
 const root=document.getElementById('madar-review-assistance');
 const q=s=>root.querySelector(s),ar=n=>Number(n).toLocaleString('ar-SA');
 let state={level:'full',count:1};
 const levelColors={1:'#ffe33b',2:'#ffad26',3:'#ff7948',full:'#ff5668'};
 const countColors=['#53d8ff','#32b9ff','#8292ff','#c78aff'];
 const haloColors=['#ffe951','#ffc039','#ff963c','#ff7048','#ff4a68'];
 const haloNames=['هالة صفراء · صواعق خفيفة','هالة كهرمانية · صواعق مزدوجة','هالة برتقالية · صواعق متفرّعة','هالة نارية · صواعق كثيفة','هالة حمراء · صواعق قصوى'];
 const svg=q('.mr-pyramid'), stage=document.createElement('div'),canvas=document.createElement('canvas');
 stage.className='mr-electric-stage';canvas.className='mr-electric-canvas';canvas.setAttribute('aria-hidden','true');
 svg.replaceWith(stage);stage.append(svg,canvas);
 const haloCaption=document.createElement('span');haloCaption.className='mr-halo-caption';
 const haloButton=document.createElement('button');haloButton.type='button';haloButton.className='mr-halo-toggle cursor-interaction';
 const replayButton=document.createElement('button');replayButton.type='button';replayButton.className='mr-halo-toggle cursor-interaction';replayButton.textContent='إعادة الافتتاحية';
 const haloActions=document.createElement('div');haloActions.className='mr-halo-actions';haloActions.append(haloButton,replayButton);
 q('.mr-pyramid-wrap').append(haloCaption,haloActions);
 const ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let haloPlaying=!reduced.matches,haloLevel=4,haloTime=0,lastTick=0,frame=0,visible=true;
 let discharges=[],nextStrike=0,sceneLevel=0,strikeSerial=0,introStart=0,firstDischarge=false;
 const dpr=Math.min(devicePixelRatio||1,3);let sceneWidth=stage.clientWidth,sceneHeight=stage.clientHeight;
 function resizeScene(){sceneWidth=stage.clientWidth;sceneHeight=stage.clientHeight;canvas.width=Math.round(sceneWidth*dpr);canvas.height=Math.round(sceneHeight*dpr);discharges=[];drawHalo();}
 function perimeter(f){
  f=((f%1)+1)%1;
  const narrow=matchMedia('(max-width:520px)').matches,scale=narrow?.7:.8;
  const vertices=[[90,8],[171,158],[9,158],[90,8]].map(([x,y])=>[sceneWidth/2+(x-90)*scale,sceneHeight/2+(y-83)*scale]);
  const lengths=vertices.slice(0,3).map((v,i)=>Math.hypot(vertices[i+1][0]-v[0],vertices[i+1][1]-v[1]));
  let n=f*lengths.reduce((a,b)=>a+b,0),edge=0;
  while(edge<2&&n>lengths[edge])n-=lengths[edge++];
  const a=vertices[edge],b=vertices[edge+1],t=n/lengths[edge];
  const dx=b[0]-a[0],dy=b[1]-a[1],len=lengths[edge];
  return {x:a[0]+dx*t,y:a[1]+dy*t,nx:dy/len,ny:-dx/len};
 }
 