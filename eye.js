// Eye artwork is this recreation's rendering of Jhey's original interaction concept.
function createFireEye(canvas) {
  let reduced = false;
  let running = false;
  let renderer = createShaderEye(canvas);
  function fallback() {
    renderer?.stop();
    const replacement = canvas.cloneNode(false);
    canvas.replaceWith(replacement);
    canvas = replacement;
    renderer = createCanvasEye(canvas);
    if (running) renderer.start(reduced);
  }
  if (!renderer) fallback();
  canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); fallback(); });
  return {
    start(still) { reduced = still; running = true; renderer.start(still); },
    stop() { running = false; renderer.stop(); }
  };
}

function createShaderEye(canvas) {
  const gl = canvas.getContext('webgl', { alpha:true, premultipliedAlpha:false, antialias:false, depth:false, stencil:false, powerPreference:'low-power' });
  if (!gl) return null;
  canvas.width = 480;
  canvas.height = 280;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  }
  const vertex = compile(gl.VERTEX_SHADER, 'attribute vec2 position; void main(){gl_Position=vec4(position,0.0,1.0);}');
  const fragment = compile(gl.FRAGMENT_SHADER, `
    precision highp float;
    uniform float time;
    uniform vec2 resolution;
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){
      vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
    }
    float fbm(vec2 p){
      float n=0.0,a=0.5;
      for(int i=0;i<4;i++){n+=a*noise(p);p=mat2(1.6,1.2,-1.2,1.6)*p+3.7;a*=0.5;}
      return n;
    }
    void main(){
      vec2 p=(gl_FragCoord.xy*2.0-resolution)/resolution.y;
      vec2 q=p*vec2(0.82,1.45);
      float r=length(q),a=atan(q.y,q.x);
      vec2 flow=q*3.8+vec2(0.25*time,-0.9*time);
      float n=fbm(flow+fbm(q*4.0-time*0.35));
      float fine=fbm(q*12.0+vec2(time*0.5,-time*1.7));
      float shape=0.54+(n-0.48)*0.28;
      float ring=exp(-abs(r-shape)*19.0);
      float angular=fbm(vec2(cos(a),sin(a))*4.5+vec2(time*0.5,-time*0.3));
      float flameLength=0.16+0.40*pow(angular*1.7,3.0);
      float tongues=smoothstep(0.40,0.60,r)*(1.0-smoothstep(0.56,0.62+flameLength,r));
      tongues*=smoothstep(0.28,0.65,n+fine*0.4)*1.8;
      float veins=pow(0.5+0.5*sin(a*46.0+r*36.0+n*14.0),5.0);
      float iris=(1.0-smoothstep(0.4,0.61,r))*(0.45+veins*0.55)*smoothstep(0.02,0.22,r);
      float energy=ring*3.4+tongues*1.3+iris*1.1;
      float edge=1.0-smoothstep(0.95,1.45,r);
      float glow=exp(-r*r*2.3)*0.32;
      vec3 orange=vec3(1.0,0.23,0.015);
      vec3 gold=vec3(1.0,0.69,0.15);
      vec3 color=mix(orange,gold,smoothstep(0.25,1.2,energy));
      color=mix(color,vec3(1.0,0.98,0.77),smoothstep(1.2,2.6,energy));
      float alpha=clamp(energy*edge+glow,0.0,1.0);
      float pupilWidth=0.022+0.055*pow(max(0.0,1.0-abs(p.y)/0.40),1.3);
      float pupil=(1.0-smoothstep(pupilWidth,pupilWidth+0.018,abs(p.x)))*(1.0-smoothstep(0.34,0.43,abs(p.y)));
      color=mix(color,vec3(0.015,0.005,0.0),pupil);
      alpha=max(alpha,pupil);
      gl_FragColor=vec4(color,alpha);
    }
  `);
  if (!vertex || !fragment) return null;
  const program=gl.createProgram();
  gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
  gl.deleteShader(vertex);gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) {gl.deleteProgram(program);return null;}
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const time=gl.getUniformLocation(program,'time');
  gl.uniform2f(gl.getUniformLocation(program,'resolution'),canvas.width,canvas.height);
  gl.viewport(0,0,canvas.width,canvas.height);
  let active=false,frame,lastFrame=0;
  function draw(t){gl.uniform1f(time,t/1000);gl.drawArrays(gl.TRIANGLES,0,6);}
  function tick(t){if(!active)return;if(t-lastFrame>=1000/60-1){draw(t);lastFrame=t;}frame=requestAnimationFrame(tick);}
  function stop(){active=false;cancelAnimationFrame(frame);}
  return {start(still){stop();draw(0);lastFrame=0;if(!still){active=true;frame=requestAnimationFrame(tick);}},stop};
}

function createCanvasEye(canvas) {
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
