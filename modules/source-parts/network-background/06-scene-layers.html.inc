function floor(x,y,s=1,a=.3){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=color(a);ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(0,0,62,17,0,0,7);ctx.stroke();ctx.strokeStyle=color(a*.35);ctx.beginPath();ctx.ellipse(0,0,79,23,0,0,7);ctx.stroke();ctx.restore()}
    function background(){
      ctx.fillStyle='#090c10';ctx.fillRect(0,0,W,H);glow(W*.56,H*.43,W*.75,.045);glow(W*.0,H*.88,W*.5,.045);
      for(let z=0;z<3;z++){
        ctx.globalAlpha=z===0?.25:z===1?.43:.72;
        edges.filter(e=>e.z===z).forEach((e,i)=>{const a=project(nodes[e.a]),b=project(nodes[e.b]);const wave=.65+.35*Math.sin(clock*.2+i*.7);line(a.x,a.y,b.x,b.y,color((z===2?.40:.22)*wave),z===2?.9:.55)});
        nodes.filter(n=>n.z===z).forEach(n=>{const p=project(n);ctx.strokeStyle=color(z===2?.55:.35);ctx.lineWidth=.65;ctx.beginPath();ctx.arc(p.x,p.y,n.r+1.6,0,7);ctx.stroke();ctx.fillStyle=color(.38);ctx.fillRect(p.x-.75,p.y-.75,1.5,1.5)});
      }
      ctx.globalAlpha=.3;
      landmarks.forEach((l,i)=>{const p=project(l);const s=.16+l.z*.065;if(l.type===0)rack(p.x,p.y,s);else if(l.type===1)router(p.x,p.y,s);else laptop(p.x,p.y,s,.9,'web')});
      traffic.forEach(f=>{const e=edges[f.edge];if(!e)return;const a=project(nodes[e.a]),b=project(nodes[e.b]),t=f.forward?f.position:1-f.position;ctx.globalAlpha=.30+e.z*.12;packet(f.type,mix(a.x,b.x,t),mix(a.y,b.y,t),f.size*(mobile?.65:.8),clock)});
      ctx.globalAlpha=1;
      const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'rgba(9,11,14,.25)');shade.addColorStop(.18,'rgba(9,11,14,0)');shade.addColorStop(.7,'rgba(9,11,14,0)');shade.addColorStop(1,'rgba(9,11,14,.25)');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
    }
    function secondary(){if(mobile||W<750)return;ctx.save();ctx.globalAlpha=.25;const a={x:W*.65,y:H*.17},b={x:W*.9,y:H*.25};circuit(a,b,.3,.8);laptop(a.x,a.y,.27,.9,'mail');phone(b.x,b.y,.32,.8,'mail');envelope(mix(a.x,b.x,(clock*.05)%1),mix(a.y,b.y,(clock*.05)%1),.45);ctx.restore()}

    