(() => {
 const canvas=document.getElementById("globe"); if(!canvas)return;
 const ctx=canvas.getContext("2d"), reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
 let points=[],t=0; const DPR=Math.min(devicePixelRatio||1,2);
 function makePoints(){const count=620,g=Math.PI*(3-Math.sqrt(5));for(let i=0;i<count;i++){const y=1-(i/(count-1))*2,r=Math.sqrt(Math.max(0,1-y*y)),a=g*i;points.push({x:Math.cos(a)*r,y,z:Math.sin(a)*r})}}
 function resize(){const r=canvas.getBoundingClientRect();canvas.width=r.width*DPR;canvas.height=r.height*DPR;ctx.setTransform(DPR,0,0,DPR,0,0)}
 function draw(){const w=canvas.clientWidth,h=canvas.clientHeight,cx=w/2,cy=h/2,R=Math.min(w,h)*.41;ctx.clearRect(0,0,w,h);const rot=t*.00035;
  for(const p of points){const x=p.x*Math.cos(rot)-p.z*Math.sin(rot),z=p.x*Math.sin(rot)+p.z*Math.cos(rot);if(z<-.05)continue;const d=(z+.05)/1.05;ctx.beginPath();ctx.arc(cx+x*R,cy-p.y*R,.55+1.35*d,0,Math.PI*2);ctx.fillStyle=`rgba(7,27,77,${.16+.7*d})`;ctx.fill()}
  ctx.beginPath();ctx.ellipse(cx,cy,R,R*.32,0,0,Math.PI*2);ctx.strokeStyle="rgba(7,27,77,.08)";ctx.lineWidth=1;ctx.stroke();
  if(!reduce){t+=16;requestAnimationFrame(draw)}
 }
 makePoints();resize();addEventListener("resize",resize);draw();
})();