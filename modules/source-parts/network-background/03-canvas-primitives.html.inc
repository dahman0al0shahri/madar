const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
    const mix=(a,b,t)=>a+(b-a)*t;
    const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
    const color=(a=1)=>`rgba(220,155,93,${a})`;
    let seed=19;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
    function line(x1,y1,x2,y2,c,w=1){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
    function rect(x,y,w,h,r,fill,stroke,lw=1){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
    function pathPoly(arr,fill,stroke){ctx.beginPath();arr.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.8;ctx.stroke()}}
    function glow(x,y,r,a=.1){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(210,125,56,${a})`);g.addColorStop(.3,`rgba(137,79,38,${a*.45})`);g.addColorStop(1,'rgba(110,60,25,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
    function label(text,x,y,sz=10,c='#a99178',align='center'){ctx.font=`${sz}px Tahoma,Arial`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=c;ctx.fillText(text,x,y)}
    