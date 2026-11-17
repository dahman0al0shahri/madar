function build(){
      const b=stage.getBoundingClientRect();W=b.width;H=b.height;mobile=W<550;const dpr=Math.min(devicePixelRatio||1,2.5);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);seed=34;
      nodes=[];edges=[];landmarks=[];traffic=[];
      for(let z=0;z<3;z++){
        const count=mobile?58:90;
        for(let i=0;i<count;i++){
          const x=rand()*W*1.3-W*.15,y=rand()*(H+100)-50;
          nodes.push({x,y,z,r:.8+z*.4});
        }
      }
      nodes.forEach((n,i)=>{
        const near=nodes.map((q,j)=>({j,d:Math.hypot(n.x-q.x,n.y-q.y)})).filter(q=>q.j>i&&nodes[q.j].z===n.z&&q.d<(mobile?160:230)).sort((a,b)=>a.d-b.d).slice(0,n.z===0?2:3);
        near.forEach(q=>edges.push({a:i,b:q.j,z:n.z}));
        if(i%11===0)landmarks.push({x:n.x,y:n.y,z:n.z,type:i%3});
      });
      for(let i=0;i<(mobile?22:48);i++)traffic.push({edge:Math.floor(rand()*edges.length),position:rand(),forward:true,speed:9+rand()*9,type:i%5,size:.5+rand()*.3});
      points=mobile?[{x:W*.23,y:H*.35},{x:W*.69,y:H*.46},{x:W*.3,y:H*.70}]:[{x:W*.18,y:H*.52},{x:W*.54,y:H*.36},{x:W*.83,y:H*.64}];
      hits.forEach((b,i)=>{b.style.left=points[i].x+'px';b.style.top=points[i].y+'px';b.style.width=(i===1?95:110)+'px';b.style.height=(i===1?110:100)+'px'});layoutMirror();
    }
    function project(n){return{x:n.x+mx*(n.z+1)*.35,y:n.y+my*(n.z+1)*.35}}
    function envelope(x,y,s=1,open=false){ctx.save();ctx.translate(x,y);ctx.scale(s,s);rect(-12,-8,24,17,2,'#2d2320','#efb47f',1.25);line(-11,-7,0,1,'#f6c699',1);line(0,1,11,-7,'#f6c699',1);line(-11,8,-3,0,'#946849',.7);line(11,8,3,0,'#946849',.7);if(open)pathPoly([[-12,-8],[0,-18],[12,-8]],'#bf895c','#f4c597');ctx.restore()}
    function picture(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);rect(-12,-10,24,20,2,'#303132','#ecb781',1);ctx.fillStyle='#e9c08f';ctx.beginPath();ctx.arc(5,-4,2,0,7);ctx.fill();pathPoly([[-10,8],[-3,-2],[3,4],[7,0],[10,8]],'#9d7854');ctx.restore()}
    function file(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);pathPoly([[-8,-12],[3,-12],[9,-6],[9,12],[-8,12]],'#2b2521','#deb588');line(3,-12,3,-6,'#cda780');line(3,-6,9,-6,'#cda780');for(let i=0;i<3;i++)line(-4,-1+i*4,5-i*2,-1+i*4,'#be996d');ctx.restore()}
    function waveform(x,y,s=1,t=0){ctx.save();ctx.translate(x,y);ctx.scale(s,s);for(let i=0;i<7;i++){const h=2+Math.abs(Math.sin(t*4+i*1.9))*7;line((i-3)*3,-h,(i-3)*3,h,'#ffc991',1.5)}ctx.restore()}
    function video(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);rect(-13,-9,23,18,3,'#322820','#efb780');pathPoly([[12,-4],[19,-8],[19,8],[12,4]],'#d5a478');ctx.restore()}
    function packet(type,x,y,s,t){if(type===0)envelope(x,y,s);if(type===1)picture(x,y,s);if(type===2)video(x,y,s*.85);if(type===3)waveform(x,y,s,t);if(type===4)file(x,y,s)}
    // Decorative traffic, driven by the packets in this background, not a real network.
    function activityLed(x,y,w,h,linked,activity){const lit=window.MadarNetworkLED.level(linked,!!activity,clock,reduced);ctx.save();ctx.fillStyle=lit?'#64ff8b':'#17241b';ctx.shadowColor='#64ff8b';ctx.shadowBlur=lit?9:0;ctx.fillRect(x,y,w,h);ctx.restore();}
    