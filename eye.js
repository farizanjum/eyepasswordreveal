// Eye artwork is this recreation's rendering of Jhey's original interaction concept.
function createFireEye(canvas) {
  const context = canvas.getContext('2d');
  const scale = 4;
  canvas.width = Math.round(120 * scale);
  canvas.height = Math.round(70 * scale);
  const random = (n) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const irisCanvas = document.createElement('canvas');
  irisCanvas.width = canvas.width;
  irisCanvas.height = canvas.height;
  const iris = irisCanvas.getContext('2d');
  if (!context || !iris) return { start() {}, stop() {} };
  const prepare = (ctx) => { ctx.setTransform(scale / 4, 0, 0, scale / 4, canvas.width / 2, canvas.height / 2); };
  prepare(iris);
  const gradient = iris.createRadialGradient(0, 0, 8, 0, 0, 69);
  for (const [at, color] of [[0,'#fff6bf'],[.28,'#ffe785'],[.6,'#df851c'],[.85,'#8d3009'],[1,'#210b04']]) gradient.addColorStop(at,color);
  iris.fillStyle = gradient;
  iris.beginPath(); iris.ellipse(0,0,69,55,0,0,Math.PI*2); iris.fill();
  for (let i=0;i<420;i++) {
    const a=i*Math.PI*2/420, x=Math.cos(a), y=Math.sin(a), r=random(i+300);
    iris.beginPath(); iris.moveTo(x*(10+r*13),y*(24+r*9));
    iris.quadraticCurveTo(x*42+Math.sin(i)*4,y*40,x*(59+r*10),y*(47+r*8));
    iris.strokeStyle=`hsla(${28+r*24},95%,${15+r*65}%,${.3+r*.65})`;
    iris.lineWidth=.5+r*1.5; iris.stroke();
  }
  iris.shadowColor='#ffec91'; iris.shadowBlur=9;
  iris.strokeStyle='#ffdd75'; iris.lineWidth=2;
  iris.beginPath(); iris.moveTo(0,-51); iris.bezierCurveTo(-17,-18,-14,22,0,53); iris.bezierCurveTo(13,20,16,-20,0,-51); iris.closePath();
  iris.fillStyle='#070302'; iris.fill(); iris.stroke(); iris.shadowBlur=0;
  const shine=iris.createRadialGradient(-20,-22,0,-20,-22,16);
  shine.addColorStop(0,'#fffbd899'); shine.addColorStop(1,'#fffbd800');
  iris.fillStyle=shine; iris.fillRect(-36,-38,32,32);
  const flames=Array.from({length:240},(_,i)=>({
    x:Math.cos(i*Math.PI*2/240), y:Math.sin(i*Math.PI*2/240),
    speed:3+random(i), reach:16+random(i+20)*40,
    color:`hsla(${18+random(i+3)*34},100%,${44+random(i+8)*25}%,${.15+random(i+1)*.6})`,
    width:.7+random(i+9)*2
  }));
  prepare(context);
  const halo=context.createRadialGradient(0,0,12,0,0,160);
  halo.addColorStop(0,'#ffcc6677'); halo.addColorStop(.4,'#ff660033'); halo.addColorStop(1,'#ff220000');
  let frame, lastFrame=0, active=false;
  function draw(time) {
    context.setTransform(1,0,0,1,0,0); context.clearRect(0,0,canvas.width,canvas.height);
    prepare(context); context.globalCompositeOperation='source-over';
    context.fillStyle=halo; context.fillRect(-240,-140,480,280);
    context.globalCompositeOperation='screen';
    flames.forEach((f,i)=>{
      const pulse=Math.sin(time*f.speed+i*.3)*14, reach=f.reach+pulse;
      context.beginPath(); context.moveTo(f.x*63,f.y*43);
      context.bezierCurveTo(f.x*82+Math.sin(i+time*3)*17,f.y*60,f.x*(72+reach)-f.y*pulse,f.y*(42+reach*.6)+f.x*pulse,f.x*(88+reach),f.y*(48+reach*.8));
      context.strokeStyle=f.color; context.lineWidth=f.width; context.stroke();
    });
    context.setTransform(1,0,0,1,0,0); context.globalCompositeOperation='source-over';
    context.drawImage(irisCanvas,0,0);
  }
  function tick(time) {
    if (!active) return;
    if (time-lastFrame >= 1000/60-1) {
      draw(time/1000);
      lastFrame=time;
    }
    frame=requestAnimationFrame(tick);
  }
  function stop() { active=false; cancelAnimationFrame(frame); }
  return {
    start(reducedMotion) { stop(); draw(0); lastFrame=0; if (!reducedMotion) {active=true; frame=requestAnimationFrame(tick);} },
    stop
  };
}
