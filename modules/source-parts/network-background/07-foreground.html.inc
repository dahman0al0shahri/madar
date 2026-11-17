function foreground(){
      // Small activities belong to the fabric of the network; none becomes a hero scene.
      const zones=mobile?
       [[.09,.15,.53,.09,.83,.25],[.16,.47,.69,.36,.87,.56],[.12,.84,.55,.69,.84,.88]]:
       [[.07,.22,.23,.13,.37,.30],[.64,.18,.79,.27,.94,.10],[.06,.66,.22,.54,.37,.79],[.60,.66,.76,.51,.92,.76],[.42,.90,.57,.79,.72,.92]];
      const hot=[];
      zones.forEach((z,i)=>{
        const type=mobile?[0,3,4][i]:i;
        const opacity=.49+.06*Math.sin(clock*.14+i*1.4);
        const A={x:z[0]*W+mx,y:z[1]*H+my},B={x:z[2]*W+mx*.7,y:z[3]*H+my*.7},C={x:z[4]*W+mx,y:z[5]*H+my};
        const size=mobile?.29:.34;
        const selfPeer=i===2;
        if(selfPeer){
          device.style.left=(A.x-65*size)+'px';device.style.top=(A.y-40*size)+'px';device.style.width=(130*size)+'px';device.style.height=(90*size)+'px';
          screen.style.left=(21*size)+'px';screen.style.top=(8*size)+'px';screen.style.width=(88*size)+'px';screen.style.height=(50*size)+'px';
          const key=String(size)+':'+W+':'+H;if(device.dataset.layout!==key){device.dataset.layout=key;layoutMirror()}
          device.dataset.peerScale=String(size);
        }
        ctx.save();ctx.globalAlpha=opacity;
        circuit(A,B,selfPeer?.95:.6,selfPeer?1.15:.8);circuit(B,C,.6,.8);
        // Feed each cluster into the surrounding backbone rather than isolated scenes.
        for(const q of [A,B,C]){
          const nearest=nodes.filter(n=>n.z===2).sort((a,b)=>Math.hypot(a.x-q.x,a.y-q.y)-Math.hypot(b.x-q.x,b.y-q.y))[0];
          if(nearest)line(q.x,q.y,nearest.x+mx,nearest.y+my,color(.25),.6);
        }
        const contentType=type===1?'video':type===2?'game':type===3?'photo':type===4?'mail':'web';
        laptop(A.x,A.y,size,.9,selfPeer?'web':contentType);
        // The portrait phone is removed; the call endpoint is a small audio mark.
        if(type===1)waveform(C.x,C.y,.72,clock);else phone(C.x,C.y,size*1.1,1,contentType);
        const atDevice=[0,1].some(k=>{const progress=(clock/(13+i*1.7)+i*.61+k*2)%4;return [1,3].some(arrival=>Math.abs(progress-arrival)*(13+i*1.7)<.3);});
        if(type===3)cloud(B.x,B.y,size*.7,1);else if(type===1)router(B.x,B.y,size*.9,atDevice);else rack(B.x,B.y,size*.72,atDevice);
        const payload=type===4?0:type===3?1:type===1?2:type===2?4:1;
        // Each payload completes a continuous A-B-C-B-A route independently.
        // Segment boundaries meet at the same device; nothing is reset mid-link.
        for(let k=0;k<2;k++){
          const phase=(clock/(13+i*1.7)+i*.61+k*2)%4;
          const segment=Math.floor(phase),fraction=phase-segment;
          const route=[A,B,C,B,A];
          const pos=at(route[segment],route[segment+1],ease(fraction));
          ctx.save();ctx.globalAlpha*=.9;
          if(!selfPeer)packet(type===1&&k===1?3:payload,pos.x,pos.y,k?.39:.48,clock);
          ctx.restore();
        }
        ctx.restore();
        if(selfPeer){
          // Separate outbound and inbound items share the same physical link.
          // Both reverse at an endpoint, never restart in the middle of a link.
          for(let k=0;k<2;k++){
            const phase=(clock/7+k)%2,outbound=phase<1,t=outbound?phase:2-phase;
            const q=at(A,B,ease(t));ctx.save();ctx.globalAlpha=.85;
            packet(outbound?0:4,q.x,q.y,.36,clock);
            const ahead=at(A,B,clamp(ease(t)+(outbound?.02:-.02)));
            const angle=Math.atan2(ahead.y-q.y,ahead.x-q.x);
            const tail={x:q.x-Math.cos(angle)*10,y:q.y-Math.sin(angle)*10};
            line(tail.x,tail.y,q.x-Math.cos(angle)*6,q.y-Math.sin(angle)*6,color(.7),1);ctx.restore();
          }
        }
        if(i===0)hot.push(A,B,C);
      });
      points=hot;
      hits.forEach((b,i)=>{b.style.left=points[i].x+'px';b.style.top=points[i].y+'px';b.style.width='44px';b.style.height='44px'});
      if(hover>=0&&points[hover])glow(points[hover].x,points[hover].y,35,.16);
    }
    