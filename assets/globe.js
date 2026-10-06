
(() => {
  const canvas = document.getElementById('globe');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, cx = 0, cy = 0, R = 0;
  let rotation = -0.55;
  let targetRotation = rotation;
  let auto = true;
  let pointer = {x:-9999,y:-9999,inside:false};
  let dragging = false;
  let lastX = 0;

  const points = [];
  for (let lat = -82; lat <= 82; lat += 7) {
    for (let lon = -180; lon < 180; lon += 6) {
      points.push({lat, lon, phase: (lat*13 + lon*7) % 31});
    }
  }

  const signals = [
    {lat: 28.6, lon: 77.2},
    {lat: 51.5, lon: -0.1},
    {lat: 40.7, lon: -74.0},
    {lat: 35.7, lon: 139.7},
    {lat: 1.3, lon: 103.8}
  ];

  function resize(){
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, r.width*dpr);
    canvas.height = Math.max(1, r.height*dpr);
    w = r.width; h = r.height;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    cx = w/2; cy = h/2; R = Math.min(w,h)*.40;
  }

  function project(latDeg, lonDeg) {
    const lat = latDeg*Math.PI/180;
    const lon = lonDeg*Math.PI/180 + rotation;
    const x3 = Math.cos(lat)*Math.sin(lon);
    const z3 = Math.cos(lat)*Math.cos(lon);
    const y3 = Math.sin(lat);
    return {
      x: cx + x3*R,
      y: cy - y3*R*.96,
      z: z3
    };
  }

  function drawArc(latDeg) {
    ctx.beginPath();
    let started = false;
    for(let lon=-180; lon<=180; lon+=3){
      const p = project(latDeg,lon);
      if(p.z > -0.04){
        if(!started){ctx.moveTo(p.x,p.y);started=true;}
        else ctx.lineTo(p.x,p.y);
      } else {
        started=false;
      }
    }
    ctx.stroke();
  }

  function drawG(){
    // A restrained, typographic G at the centre of the globe.
    const size = Math.max(30, R*.24);
    ctx.save();
    ctx.translate(cx,cy);
    ctx.font = `400 ${size}px "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(184,134,33,.92)";
    ctx.fillText("G", 0, 1);
    ctx.restore();
  }

  function draw(){
    ctx.clearRect(0,0,w,h);

    // Very light orbital rings.
    ctx.strokeStyle='rgba(7,27,77,.08)';
    ctx.lineWidth=1;
    ctx.beginPath(); ctx.ellipse(cx,cy,R,R*.96,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx,cy,R*.96,R*.38,0,0,Math.PI*2); ctx.stroke();

    // Latitude structure.
    ctx.strokeStyle='rgba(7,27,77,.075)';
    [-55,-28,0,28,55].forEach(drawArc);

    // Point field.
    for(const pt of points){
      const p = project(pt.lat,pt.lon);
      if(p.z <= 0.02) continue;
      const dx = p.x-pointer.x, dy=p.y-pointer.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      const hover = pointer.inside ? Math.max(0,1-dist/(R*.30)) : 0;
      const alpha = .14 + .48*p.z + hover*.30;
      const radius = .65 + p.z*.45 + hover*1.15;
      ctx.fillStyle = `rgba(7,27,77,${alpha})`;
      ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill();
    }

    // Sparse gold signal points.
    for(const s of signals){
      const p=project(s.lat,s.lon);
      if(p.z<=.08) continue;
      const pulse=1.8+Math.sin(performance.now()/700+s.lon)*.65;
      ctx.fillStyle='rgba(184,134,33,.88)';
      ctx.beginPath();ctx.arc(p.x,p.y,pulse,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(184,134,33,.20)';
      ctx.beginPath();ctx.arc(p.x,p.y,pulse*3.2,0,Math.PI*2);ctx.stroke();
    }

    drawG();

    if(auto && !dragging) targetRotation += .0009;
    rotation += (targetRotation-rotation)*.075;
    requestAnimationFrame(draw);
  }

  canvas.addEventListener('pointerdown', e=>{
    dragging=true; auto=false; lastX=e.clientX; canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e=>{
    const r=canvas.getBoundingClientRect();
    pointer={x:e.clientX-r.left,y:e.clientY-r.top,inside:true};
    if(dragging){
      const dx=e.clientX-lastX;
      targetRotation += dx*.008;
      lastX=e.clientX;
    }
  });
  canvas.addEventListener('pointerup', ()=>{
    dragging=false;
    setTimeout(()=>{auto=true},1200);
  });
  canvas.addEventListener('pointercancel', ()=>{
    dragging=false; setTimeout(()=>{auto=true},1200);
  });
  canvas.addEventListener('pointerleave', ()=>{
    pointer.inside=false;
  });
  canvas.addEventListener('wheel', e=>{
    e.preventDefault();
    targetRotation += e.deltaY*.0015 + e.deltaX*.0015;
    auto=false;
    clearTimeout(canvas._wheelTimer);
    canvas._wheelTimer=setTimeout(()=>auto=true,1200);
  },{passive:false});

  window.addEventListener('resize',resize,{passive:true});
  resize();
  draw();
})();
