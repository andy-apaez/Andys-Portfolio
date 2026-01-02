import * as THREE from 'https://unpkg.com/three@0.162.0/build/three.module.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js?module';
import gsap from 'https://cdn.skypack.dev/gsap';

// ========== Basic setup ==========
const container = document.getElementById('container');
const width = container.clientWidth;
const height = container.clientHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x03030a, 0);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
camera.position.set(0, 60, 220);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 40;
controls.maxDistance = 800;

// subtle ambient + rim light
const ambient = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 0.6);
dir.position.set(100, 50, 100);
scene.add(dir);

const spriteTexture = new THREE.TextureLoader().load(
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/sprites/spark1.png'
);

// Subtle inverted skydome with procedural star/nebula texture
function createProceduralSkyTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // base fill
  ctx.fillStyle = '#060814';
  ctx.fillRect(0, 0, size, size);

  // faint nebula gradient
  const grad = ctx.createRadialGradient(size * 0.5, size * 0.5, size * 0.1, size * 0.5, size * 0.5, size * 0.55);
  grad.addColorStop(0, 'rgba(255, 223, 186, 0.08)');
  grad.addColorStop(1, 'rgba(110, 150, 255, 0.03)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // sparse tiny stars
  for (let i = 0; i < 450; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.2 + 0.2;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.08})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

const skyTexture = createProceduralSkyTexture();
const skySphere = new THREE.Mesh(
  new THREE.SphereGeometry(1400, 48, 32),
  new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
    depthTest: false
  })
);
scene.add(skySphere);

// ========== Galaxy particle field ==========
const params = {
  arms: 5,
  particles: 6000,
  radius: 300,
  spiralTightness: 0.045,
  randomness: 0.35,
  randomnessPower: 1.4,
  palette: ['#8cc5ff', '#7fa6ff', '#93d5ff', '#ffd18f']
};


// Starfield layers: far (dim/slow), mid (default), near (bright/faster + parallax)
function createStarLayer({ count, radius, size, opacity, color, yScale = 0.6 }) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const baseColor = new THREE.Color(color);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = Math.pow(Math.random(), 1.1) * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.cos(phi) * yScale;
    positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const dim = 0.6 + Math.random() * 0.4;
    colors[i3 + 0] = baseColor.r * dim;
    colors[i3 + 1] = baseColor.g * dim;
    colors[i3 + 2] = baseColor.b * dim;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  return new THREE.Points(geometry, material);
}

const farStars = createStarLayer({
  count: 1800,
  radius: 1800,
  size: 0.7,
  opacity: 0.35,
  color: '#6c7a91',
  yScale: 0.55
});
farStars.position.y = -20;
scene.add(farStars);

const midStars = createStarLayer({
  count: 1400,
  radius: 1100,
  size: 1.0,
  opacity: 0.5,
  color: '#7c8fb0',
  yScale: 0.65
});
midStars.position.y = -12;
scene.add(midStars);

const nearStars = createStarLayer({
  count: 260,
  radius: 700,
  size: 1.6,
  opacity: 0.7,
  color: '#9fc4ff',
  yScale: 0.8
});
nearStars.position.y = 6;
scene.add(nearStars);
const nearBasePos = nearStars.position.clone();

// Arm stars hugging spiral curves (extra density near arms)
const armStarCount = 1800;
const armStarGeometry = new THREE.BufferGeometry();
const armPositions = new Float32Array(armStarCount * 3);
const armColors = new Float32Array(armStarCount * 3);
const armSizes = new Float32Array(armStarCount);
const armColorPalette = params.palette.map(c => new THREE.Color(c));

for (let i = 0; i < armStarCount; i++) {
  const i3 = i * 3;
  const radius = Math.pow(Math.random(), 1.35) * params.radius * 0.95 + 12;
  const arm = i % params.arms;
  const branchAngle = (arm / params.arms) * Math.PI * 2;
  const spinAngle = radius * params.spiralTightness * Math.PI * 2;
  const angle = branchAngle + spinAngle;

  const jitter = Math.pow(radius / params.radius, params.randomnessPower) * params.randomness;
  const x = Math.cos(angle) * radius + (Math.random() - 0.5) * jitter * params.radius * 0.4;
  const yRange = THREE.MathUtils.lerp(3, 18, Math.min(1, radius / params.radius));
  const y = (Math.random() - 0.5) * yRange;
  const z = Math.sin(angle) * radius + (Math.random() - 0.5) * jitter * params.radius * 0.4;

  armPositions[i3 + 0] = x;
  armPositions[i3 + 1] = y;
  armPositions[i3 + 2] = z;

  const cA = armColorPalette[Math.floor(Math.random() * armColorPalette.length)];
  const cB = armColorPalette[Math.floor(Math.random() * armColorPalette.length)];
  const mix = cA.clone().lerp(cB, Math.random() * 0.5 + 0.2);
  armColors[i3 + 0] = mix.r;
  armColors[i3 + 1] = mix.g;
  armColors[i3 + 2] = mix.b;

  armSizes[i] = Math.random() * 1.1 + 0.6;
}

armStarGeometry.setAttribute('position', new THREE.BufferAttribute(armPositions, 3));
armStarGeometry.setAttribute('color', new THREE.BufferAttribute(armColors, 3));
armStarGeometry.setAttribute('size', new THREE.BufferAttribute(armSizes, 1));

const armStarMaterial = new THREE.PointsMaterial({
  vertexColors: true,
  size: 1.2,
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const armStars = new THREE.Points(armStarGeometry, armStarMaterial);
armStars.position.y = -6;
scene.add(armStars);

// Clustered bright stars placed along arms
const clusterGroup = new THREE.Group();
const clusterCount = Math.floor(Math.random() * 16) + 15; // 15–30 clusters
let clusterTotal = 0;
const clusterCenters = [];

for (let i = 0; i < clusterCount; i++) {
  const arm = Math.floor(Math.random() * params.arms);
  const radius = Math.pow(Math.random(), 1.25) * params.radius * 0.9 + 10;
  const branchAngle = (arm / params.arms) * Math.PI * 2;
  const spinAngle = radius * params.spiralTightness * Math.PI * 2;
  const angle = branchAngle + spinAngle;
  const cx = Math.cos(angle) * radius + (Math.random() - 0.5) * 12;
  const cz = Math.sin(angle) * radius + (Math.random() - 0.5) * 12;
  const cy = (Math.random() - 0.5) * THREE.MathUtils.lerp(6, 18, Math.min(1, radius / params.radius));
  clusterCenters.push({ x: cx, y: cy, z: cz, radius: 6 + Math.random() * 10, count: Math.floor(Math.random() * 31) + 20 });
  clusterTotal += clusterCenters[i].count;
}

const clusterPos = new Float32Array(clusterTotal * 3);
const clusterCol = new Float32Array(clusterTotal * 3);
const clusterSizes = new Float32Array(clusterTotal);

let cIdx = 0;
clusterCenters.forEach(center => {
  for (let i = 0; i < center.count; i++) {
    const j = cIdx + i;
    const j3 = j * 3;
    const r = Math.random() * center.radius;
    const t = Math.random() * Math.PI * 2;
    const h = (Math.random() - 0.5) * center.radius * 0.45;
    const falloff = 1 - Math.min(1, r / center.radius);
    const posX = center.x + Math.cos(t) * r;
    const posY = center.y + h;
    const posZ = center.z + Math.sin(t) * r;

    clusterPos[j3 + 0] = posX;
    clusterPos[j3 + 1] = posY;
    clusterPos[j3 + 2] = posZ;

    const base = new THREE.Color('#cfe3ff').lerp(new THREE.Color('#ffffff'), 0.5 * falloff + 0.2);
    clusterCol[j3 + 0] = base.r * (1.2 - falloff * 0.3);
    clusterCol[j3 + 1] = base.g * (1.2 - falloff * 0.3);
    clusterCol[j3 + 2] = base.b;

    clusterSizes[j] = 0.9 + falloff * 1.4;
  }
  cIdx += center.count;
});

const clusterGeometry = new THREE.BufferGeometry();
clusterGeometry.setAttribute('position', new THREE.BufferAttribute(clusterPos, 3));
clusterGeometry.setAttribute('color', new THREE.BufferAttribute(clusterCol, 3));
clusterGeometry.setAttribute('size', new THREE.BufferAttribute(clusterSizes, 1));

const clusterMaterial = new THREE.PointsMaterial({
  vertexColors: true,
  size: 1.4,
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const clusterStars = new THREE.Points(clusterGeometry, clusterMaterial);
clusterStars.position.y = -4;
clusterGroup.add(clusterStars);
scene.add(clusterGroup);

// Huge soft particles (wide, low opacity, slight parallax)
const softCloudParams = { count: 120, radius: 2000 };
const softCloudGeom = new THREE.BufferGeometry();
const softPositions = new Float32Array(softCloudParams.count * 3);
for (let i = 0; i < softCloudParams.count; i++) {
  const i3 = i * 3;
  const r = Math.pow(Math.random(), 0.7) * softCloudParams.radius + 300;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  softPositions[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
  softPositions[i3 + 1] = r * Math.cos(phi) * 0.25;
  softPositions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
softCloudGeom.setAttribute('position', new THREE.BufferAttribute(softPositions, 3));

const softCloudMat = new THREE.PointsMaterial({
  map: spriteTexture,
  size: 90,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.02,
  color: new THREE.Color('#bcd6ff'),
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const softClouds = new THREE.Points(softCloudGeom, softCloudMat);
softClouds.position.y = -18;
scene.add(softClouds);

// Near-camera micro stars (fast parallax, twinkle, avoid core)
const microCount = 90;
const microGeom = new THREE.BufferGeometry();
const microPos = new Float32Array(microCount * 3);
const microPhase = new Float32Array(microCount);
for (let i = 0; i < microCount; i++) {
  const i3 = i * 3;
  const radius = THREE.MathUtils.lerp(140, 320, Math.random());
  const angle = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * THREE.MathUtils.lerp(30, 90, radius / 320);
  microPos[i3 + 0] = Math.cos(angle) * radius;
  microPos[i3 + 1] = y;
  microPos[i3 + 2] = Math.sin(angle) * radius;
  microPhase[i] = Math.random() * Math.PI * 2;
}
microGeom.setAttribute('position', new THREE.BufferAttribute(microPos, 3));
microGeom.setAttribute('phase', new THREE.BufferAttribute(microPhase, 1));

const microUniforms = {
  uTime: { value: 0 },
  uParallax: { value: new THREE.Vector2(0, 0) },
  uSize: { value: 2.1 },
  uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
};

const microVertex = /* glsl */ `
  precision mediump float;
  attribute float phase;
  varying float vPhase;
  uniform vec2 uParallax;
  uniform float uSize;
  uniform float uPixelRatio;
  void main() {
    vPhase = phase;
    vec3 pos = position;
    pos.x += uParallax.x * 0.6;
    pos.y += uParallax.y * 0.35;
    pos.z += uParallax.x * 0.7;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * uPixelRatio;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const microFragment = /* glsl */ `
  precision mediump float;
  varying float vPhase;
  uniform float uTime;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float soft = smoothstep(0.5, 0.0, r);
    float twinkle = 0.7 + 0.35 * sin(uTime * 6.0 + vPhase);
    float alpha = soft * twinkle;
    if (alpha <= 0.02) discard;
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`;

const microMat = new THREE.ShaderMaterial({
  uniforms: microUniforms,
  vertexShader: microVertex,
  fragmentShader: microFragment,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const microStars = new THREE.Points(microGeom, microMat);
scene.add(microStars);

// Radial gradient overlay (warm core -> cool outer, low alpha)
const radialGradientUniforms = {
  uWarm: { value: new THREE.Color('#f7d7b0') },
  uCool: { value: new THREE.Color('#6fa4ff') },
  uIntensity: { value: 0.18 }
};

const radialGradientVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const radialGradientFragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform vec3 uWarm;
  uniform vec3 uCool;
  uniform float uIntensity;
  void main() {
    vec2 uv = vUv - 0.5;
    float r = length(uv) * 1.4;
    float fade = smoothstep(0.0, 0.95, r);
    vec3 color = mix(uWarm, uCool, clamp(r * 0.9, 0.0, 1.0));
    float alpha = (1.0 - fade) * uIntensity;
    if (alpha <= 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const radialGradientMat = new THREE.ShaderMaterial({
  uniforms: radialGradientUniforms,
  vertexShader: radialGradientVertex,
  fragmentShader: radialGradientFragment,
  transparent: true,
  depthWrite: false,
  depthTest: false,
  side: THREE.DoubleSide
});

const radialGradientMesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), radialGradientMat);
radialGradientMesh.renderOrder = -5;
scene.add(radialGradientMesh);

// Buffer geometry for tiny background stars
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(params.particles * 3);
const colors = new Float32Array(params.particles * 3);
const sizes = new Float32Array(params.particles);
const brightness = new Float32Array(params.particles);
const starAngles = new Float32Array(params.particles);
const starRadius = new Float32Array(params.particles);
const starOffsetX = new Float32Array(params.particles);
const starOffsetZ = new Float32Array(params.particles);
const starSpeed = new Float32Array(params.particles);
const starY = new Float32Array(params.particles);

const colorPalette = params.palette.map(color => new THREE.Color(color));

for (let i = 0; i < params.particles; i++) {
  const i3 = i * 3;

  let radius = Math.pow(Math.random(), 1.75) * params.radius;
  const branch = i % params.arms;
  const branchAngle = (branch / params.arms) * Math.PI * 2;
  const spinAngle = radius * params.spiralTightness * Math.PI * 2;
  const angle = branchAngle + spinAngle;

  const randomnessStrength =
    Math.pow(radius / params.radius, params.randomnessPower) * params.randomness;

  const randomX =
    (Math.random() - 0.5) * randomnessStrength * params.radius * 0.55;
  const randomY =
    (Math.random() - 0.5) * randomnessStrength * params.radius * 0.18;
  const randomZ =
    (Math.random() - 0.5) * randomnessStrength * params.radius * 0.55;

  const x = Math.cos(angle) * radius + randomX;
  const verticalRange = THREE.MathUtils.lerp(4, 26, Math.min(1, radius / params.radius));
  const y = (Math.random() - 0.5) * verticalRange;
  const z = Math.sin(angle) * radius + randomZ;

  positions[i3 + 0] = x;
  positions[i3 + 1] = y;
  positions[i3 + 2] = z;

  starAngles[i] = angle;
  starRadius[i] = radius;
  starOffsetX[i] = randomX;
  starOffsetZ[i] = randomZ;
  starY[i] = y;

  const radialNorm = radius / params.radius;
  starSpeed[i] = 0.06 + radialNorm * 0.16 + (Math.random() - 0.5) * 0.015;

  //create a better sprial here maybe with some new partical effect (fog like or smth)

  // occasional special stars (bright blue or rare red/pink clusters)
  const special = Math.random();
  let baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  let starSize = Math.random() * 1.5 + 0.2;
  let starBrightness = Math.random() * 0.5 + 0.75;

  if (special < 0.02) {
    // rare red/pink cluster closer to core
    radius *= 0.35;
    baseColor = new THREE.Color('#ff7aa8');
    starSize = 2.1;
    starBrightness = 1.25;
  } else if (special < 0.09) {
    // occasional bright blue star
    baseColor = new THREE.Color('#9ad7ff');
    starSize = 2.4;
    starBrightness = 1.4;
  } else {
    const colorB = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    const mixAmount = Math.random() * 0.5 + 0.25;
    baseColor = baseColor.clone().lerp(colorB, mixAmount);
  }

  colors[i3 + 0] = baseColor.r;
  colors[i3 + 1] = baseColor.g;
  colors[i3 + 2] = baseColor.b;

  sizes[i] = starSize;
  brightness[i] = starBrightness;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
geometry.setAttribute('brightness', new THREE.BufferAttribute(brightness, 1));

// ========== Star trail shader material ==========
const particleUniforms = {
  uTime: { value: 0 },
  uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  uSize: { value: 1.6 },
  uTrailStrength: { value: 1.3 },
  uPerspective: { value: params.radius * 1.1 }
};

const particleVertexShader = /* glsl */ `
  precision mediump float;

  attribute float size;
  attribute vec3 color;
  attribute float brightness;

  varying vec3 vColor;
  varying float vFalloff;
  varying float vBrightness;
  varying float vRadial;

  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uPerspective;
  uniform float uTime;

  void main() {
    vColor = color;
    vBrightness = brightness;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = -mvPosition.z;
    float perspective = uPerspective / max(dist, 1.0);
    float pointSize = size * uSize * uPixelRatio * perspective;
    gl_PointSize = max(pointSize, 1.5);

    float radial = length(position.xz) / uPerspective;
    vRadial = clamp(radial, 0.0, 1.0);
    vFalloff = smoothstep(1.1, 0.15, radial);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = /* glsl */ `
  precision mediump float;

  varying vec3 vColor;
  varying float vFalloff;
  varying float vBrightness;
  varying float vRadial;
  uniform float uTrailStrength;
  uniform float uTime;

  void main() {
    // gl_PointCoord is in [0,1] range
    vec2 uv = gl_PointCoord - 0.5;
    // squash in one direction to fake slight elongation (trail)
    uv.y *= uTrailStrength;

    float r = length(uv) * 2.0;

    // soft core falloff
    float core = smoothstep(0.5, 0.0, r);
    // outer glow
    float glow = smoothstep(1.0, 0.3, r) * 0.5;

    float alpha = (core + glow) * vFalloff;

    if (alpha <= 0.01) discard;

    float twinkle = 0.9 + 0.3 * sin(uTime * 3.0 + gl_FragCoord.x * 0.04 + gl_FragCoord.y * 0.04);
    float brightness = vBrightness * twinkle;

    vec3 warmCore = vec3(1.0, 0.92, 0.78);
    vec3 coolOuter = vColor;
    float coreMix = smoothstep(0.15, 0.75, 1.0 - vRadial);
    vec3 color = mix(coolOuter, warmCore, coreMix);
    color *= (1.15 + glow * 1.35) * brightness;

    gl_FragColor = vec4(color, alpha);
  }
`;

const particlesMaterial = new THREE.ShaderMaterial({
  uniforms: particleUniforms,
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const points = new THREE.Points(geometry, particlesMaterial);
scene.add(points);

// ========== Bright clickable stars (project anchors) ==========
const clickableStars = [];
const clickableGroup = new THREE.Group();
scene.add(clickableGroup);

// Example project data 
const projects = [
  { id: 0, name: "Los Tacos Menu", desc: "Interactive menu with slider categories & cart. Stripe + Firebase.", tags: ["React", "Firebase", "Stripe"], demo: "https://wlostacos.vercel.app/", code: "https://github.com/andy-apaez/Los-Tacos" },
  { id: 1, name: "Interactive Curtain", desc: "This project renders a cloth-like curtain that reacts when your mouse brushes across it. Under the hood, a lightweight Verlet‑integration cloth simulation keeps a grid of particles connected by constraints, while mouse movement injects localized force to push sections of fabric aside.", tags: ["JavaScript", "HTML", "CSS"], demo: "https://example.com/demo2", code: "https://github.com/andy-apaez/interactive-curtain" },
  { id: 2, name: "SIEM Dashboard", desc: "interactive dashboard that showcases what a modern Security Information and Event Management (SIEM) console could look like. It highlights alert backlogs, live event streams, telemetry ingestion health, and threat-intelligence watchlists. Everything is powered by mock data so the UI can be demonstrated offline.", tags: ["TypeScript","HTML","CSS","JS"], demo: "/Users/andy/Movies/TapRecord/Video/REC-20251118021927.mp4", code: "https://github.com/andy-apaez/SIEM-Dashboard" },
  { id: 3, name: "Color Detector", desc: "A Python web app that detects the dominant colors in an uploaded image using KMeans clustering. Users can upload an image via their browser, view the image, and see a palette of the most prominent colors along with their RGB values and percentages.", tags: ["Python"], demo: "https://private-user-images.githubusercontent.com/148652039/493122293-85c05669-a101-40b4-bd6c-3582328a985e.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjM4NTQxMTcsIm5iZiI6MTc2Mzg1MzgxNywicGF0aCI6Ii8xNDg2NTIwMzkvNDkzMTIyMjkzLTg1YzA1NjY5LWExMDEtNDBiNC1iZDZjLTM1ODIzMjhhOTg1ZS5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMTIyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTEyMlQyMzIzMzdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lYjhkNDNiNTczYWUwZWZjYmIzNTk5OTQwYWJmZmEyNGFkZGNkNTRhMzZjYTMwNDgyYmI0OWFhYmZhZTM1ZmM4JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.M1l7OqKkUuJBw_zrYcXHpzA3dVG3rWUKgZBi3n0Ei88", code: "https://github.com/andy-apaez/Color_detector" },
  { id: 4, name: "Brute Force Simulator", desc: "A real-time password guessing simulator built with Python (Flask) and JavaScript. This educational tool demonstrates how brute-force and dictionary attacks work, streaming live guesses, progress, and speed directly in the browser. It helps users understand the importance of strong, complex passwords and common vulnerabilities.", tags: ["Python", "HTML", "CSS"], demo: "https://private-user-images.githubusercontent.com/148652039/483927131-89776196-8bc1-479e-b726-e087b542308e.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjM4NTUwOTAsIm5iZiI6MTc2Mzg1NDc5MCwicGF0aCI6Ii8xNDg2NTIwMzkvNDgzOTI3MTMxLTg5Nzc2MTk2LThiYzEtNDc5ZS1iNzI2LWUwODdiNTQyMzA4ZS5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMTIyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTEyMlQyMzM5NTBaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zMjNkMDJiZTZkMDBiMmViN2FjZGU5ZTY3MWVhYjc1ZmIxNzZkZDhmMDYwNDY3MGI0ZGZlZjNiOGE4M2E4NGZjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.kAxCv_p3GFf0bAtYRLyahWkFH1-XrQkTJqH8l0_89Vg", code: "https://github.com/andy-apaez/Brute-Force-Simulator" }
];

// Decide positions for clickable stars along spiral — choose t values
const anchorCount = projects.length;
for (let i = 0; i < anchorCount; i++) {
  const frac = i / anchorCount;
  const arm = i % params.arms;
  const tRadius = (0.12 + frac * 0.9) * params.radius;
  const angle =
    (arm / params.arms) * Math.PI * 2 +
    tRadius * params.spiralTightness * Math.PI * 2 * 0.9;

  const rx = Math.cos(angle) * tRadius + (Math.random() - 0.5) * 12;
  const rz = Math.sin(angle) * tRadius + (Math.random() - 0.5) * 12;
  const ry = (Math.random() - 0.5) * 10;

  const starGeom = new THREE.SphereGeometry(3.2, 12, 8);
  const starMat = new THREE.MeshStandardMaterial({
    emissive: new THREE.Color(0xfff0c0),
    emissiveIntensity: 1,
    color: 0xfff7e8,
    metalness: 0.1,
    roughness: 0.2
  });
  const starMesh = new THREE.Mesh(starGeom, starMat);
  starMesh.position.set(rx, ry, rz);
  starMesh.userData.baseY = ry; 
  starMesh.userData.projectId = projects[i].id;

  // flare sprite (glow)
  const spriteMat = new THREE.SpriteMaterial({
    map: spriteTexture,
    color: 0xfff1c1,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(28, 28, 1);
  sprite.position.set(0, 0, 0);
  starMesh.add(sprite);

  clickableGroup.add(starMesh);
  clickableStars.push(starMesh);

  // subtle pop-in animation with gsap
  starMesh.scale.set(0.001, 0.001, 0.001);
  gsap.to(starMesh.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 0.8,
    delay: i * 0.08,
    ease: 'back.out(1.5)'
  });

  // pulsing emissive
  gsap.to(starMat, {
    emissiveIntensity: 1.8,
    duration: 1.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: i * 0.12
  });
}

clickableGroup.rotation.y = 0;

// add shooting stars and stuff for a more emmersive feel, but disable for now (math isnt mathing right now)

// ========== Raycaster for hover + click ==========
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const followTargetWorld = new THREE.Vector3();
const followCameraPos = new THREE.Vector3();
let activeFollow = null;
const nearParallax = new THREE.Vector2(0, 0);
const nearParallaxTarget = new THREE.Vector2(0, 0);

let hovered = null;
const label = document.getElementById('label');
let prevHover = null;

function updatePointerFromEvent(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

   const nx = (event.clientX / window.innerWidth - 0.5) * 2;
   const ny = (event.clientY / window.innerHeight - 0.5) * 2;
   nearParallaxTarget.set(nx * 14, -ny * 10);
}

function onPointerMove(event) {
  updatePointerFromEvent(event);

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableStars, false);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (hovered !== obj) {
      if (prevHover && prevHover.material) {
        gsap.to(prevHover.material, { emissiveIntensity: 1, duration: 0.2, ease: 'sine.out' });
        if (prevHover.children[0]) gsap.to(prevHover.children[0].scale, { x: 28, y: 28, duration: 0.2, ease: 'sine.out' });
      }
      hovered = obj;
      prevHover = obj;
      gsap.to(obj.material, { emissiveIntensity: 2.4, duration: 0.25, ease: 'sine.out' });
      if (obj.children[0]) gsap.to(obj.children[0].scale, { x: 34, y: 34, duration: 0.25, ease: 'sine.out' });
      const proj =
        projects.find(p => p.id === obj.userData.projectId) || {};
      label.style.display = 'block';
      label.textContent = proj.name || 'Project';
    }
    label.style.left = event.clientX + 'px';
    label.style.top = event.clientY - 24 + 'px';
  } else {
    if (prevHover && prevHover.material) {
      gsap.to(prevHover.material, { emissiveIntensity: 1.4, duration: 0.25, ease: 'sine.out' });
      if (prevHover.children[0]) gsap.to(prevHover.children[0].scale, { x: 28, y: 28, duration: 0.25, ease: 'sine.out' });
    }
    hovered = null;
    label.style.display = 'none';
  }
}

function onClick(event) {
  updatePointerFromEvent(event);

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableStars, false);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    const projId = obj.userData.projectId;
    obj.userData.pauseUntil = clock.getElapsedTime() + 1.2;
    openProjectModal(projId, obj);
  }
}

renderer.domElement.addEventListener('pointermove', onPointerMove);
renderer.domElement.addEventListener('click', onClick);

// ========== Modal logic ==========
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const modalDemo = document.getElementById('modal-demo');
const modalGit = document.getElementById('modal-github');
const closeBtn = document.getElementById('closeBtn');

function openProjectModal(id, starObj) {
  const proj = projects.find(p => p.id === id);
  if (!proj) return;

  modalTitle.textContent = proj.name;
  modalDesc.textContent = proj.desc;
  modalDemo.href = proj.demo || '#';
  modalGit.href = proj.code || '#';

  modalTags.innerHTML = '';
  (proj.tags || []).forEach(t => {
    const el = document.createElement('div');
    el.className = 'tag';
    el.textContent = t;
    modalTags.appendChild(el);
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  // animate camera to focus on the clicked star  
  const targetPos = starObj.getWorldPosition(new THREE.Vector3());

  gsap.to(controls.target, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration: 0.9,
    ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });

  const offset = new THREE.Vector3(35, 20, 35);
  const camTarget = targetPos.clone().add(offset);

  activeFollow = {
    star: starObj,
    offset: offset.clone(),
    enabled: false
  };

  gsap.to(camera.position, {
    x: camTarget.x,
    y: camTarget.y,
    z: camTarget.z,
    duration: 0.9,
    ease: 'power2.inOut',
    onUpdate: () => controls.update(),
    onComplete: () => {
      if (activeFollow && activeFollow.star === starObj) {
        activeFollow.enabled = true;
      }
    }
  });
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  activeFollow = null;

  // gently reset camera  *** CHANGED to sync with controls
  gsap.to(camera.position, {
    x: 0,
    y: 60,
    z: 220,
    duration: 0.9,
    ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });
  gsap.to(controls.target, {
    x: 0,
    y: 0,
    z: 0,
    duration: 0.9,
    ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });
}

closeBtn.addEventListener('click', closeModal);
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ========== Animation loop ==========
const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  particleUniforms.uTime.value = elapsed;

  points.rotation.y = elapsed * 0.018;
  clickableGroup.rotation.y = elapsed * 0.015;
  skySphere.rotation.y = elapsed * 0.0004;
  farStars.rotation.y = elapsed * 0.0008;
  midStars.rotation.y = elapsed * 0.0016;
  nearStars.rotation.y = elapsed * 0.0022;
  armStars.rotation.y = elapsed * 0.002;
  clusterGroup.rotation.y = elapsed * 0.0021;
  softClouds.rotation.y = elapsed * 0.0009;

  nearParallax.lerp(nearParallaxTarget, 0.08);
  nearStars.position.x = THREE.MathUtils.lerp(nearStars.position.x, nearBasePos.x + nearParallax.x, 0.12);
  nearStars.position.y = THREE.MathUtils.lerp(nearStars.position.y, nearBasePos.y + nearParallax.y * 0.35, 0.12);
  nearStars.position.z = THREE.MathUtils.lerp(nearStars.position.z, nearBasePos.z + nearParallax.x * 0.4, 0.12);
  softClouds.position.x = THREE.MathUtils.lerp(softClouds.position.x, nearParallax.x * 12, 0.06);
  softClouds.position.z = THREE.MathUtils.lerp(softClouds.position.z, nearParallax.x * 10, 0.06);
  microUniforms.uParallax.value.lerp(nearParallaxTarget, 0.18);
  microUniforms.uTime.value = elapsed;

  radialGradientMesh.lookAt(camera.position);
  if (activeFollow && activeFollow.enabled) {
    activeFollow.star.getWorldPosition(followTargetWorld);
    followCameraPos.copy(followTargetWorld).add(activeFollow.offset);
    controls.target.lerp(followTargetWorld, 0.08);
    camera.position.lerp(followCameraPos, 0.08);
  }

  // small floating motion on clickable stars (no drift)  *** CHANGED
  clickableStars.forEach((s, idx) => {
    const pauseUntil = s.userData?.pauseUntil;
    const isPaused = pauseUntil && elapsed < pauseUntil;
    const baseY = s.userData.baseY;
    if (!isPaused) {
      s.position.y = baseY + Math.sin(elapsed * 0.6 + idx) * 0.7;
    }
  });

  // (Comet animation removed for now)

  // update galaxy star positions with per-star speed and radial falloff
  const posArray = geometry.attributes.position.array;
  const camDist = camera.position.length();
  const radialScale = 1 + Math.min(Math.max((camDist - 220) / 280, 0), 1) * 0.2; // zoom adds subtle arm separation
  for (let i = 0; i < params.particles; i++) {
    const i3 = i * 3;
    const theta = starAngles[i] + elapsed * starSpeed[i];
    const r = starRadius[i] * radialScale;
    posArray[i3 + 0] = Math.cos(theta) * r + starOffsetX[i];
    posArray[i3 + 1] = starY[i];
    posArray[i3 + 2] = Math.sin(theta) * r + starOffsetZ[i];
  }
  geometry.attributes.position.needsUpdate = true;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// ========== Responsive ==========
function onResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  microUniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
}
window.addEventListener('resize', onResize, { passive: true });

// adjust particle size for small screens
if (window.innerWidth < 700) {
  particleUniforms.uSize.value = 1.0; 
}

// ========== Skills 3D stack (GSAP) ==========
const skillStack = document.querySelector('.skill-stack');
const skillCards = gsap.utils.toArray('.skill-card');

if (skillStack && skillCards.length) {
  let currentIndex = 0;
  let activeTimeline = null;
  const baseDepth = -140;

  // Initialize all cards off-center
  skillCards.forEach((card, i) => {
    gsap.set(card, {
      x: 140,
      z: baseDepth,
      scale: 0.85,
      opacity: 0.25,
      zIndex: i
    });
  });

  // Bring the first card forward
  gsap.set(skillCards[0], {
    x: 0,
    z: 80,
    scale: 1.12,
    opacity: 1,
    zIndex: skillCards.length + 2
  });

  const runCycle = () => {
    const current = skillCards[currentIndex];
    const nextIndex = (currentIndex + 1) % skillCards.length;
    const next = skillCards[nextIndex];

    // Prep incoming card on the right, slightly back
    gsap.set(next, {
      x: 180,
      z: baseDepth,
      scale: 0.82,
      opacity: 0.2,
      zIndex: skillCards.length + 3
    });

    activeTimeline = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        currentIndex = nextIndex;
        runCycle();
      }
    });

    activeTimeline
      // Current slides left/back and softens
      .to(current, {
        x: -180,
        z: baseDepth - 60,
        scale: 0.72,
        opacity: 0.1,
        duration: 0.9
      }, 0)
      // Next sweeps in from the right, forward and bright
      .to(next, {
        x: 0,
        z: 100,
        scale: 1.16,
        opacity: 1,
        duration: 1
      }, 0)
      // Reset the outgoing card to the right/back for future cycles
      .set(current, {
        x: 140,
        z: baseDepth,
        scale: 0.85,
        opacity: 0.22,
        zIndex: 1
      });
  };

  runCycle();

  skillStack.addEventListener('mouseenter', () => activeTimeline?.pause());
  skillStack.addEventListener('mouseleave', () => activeTimeline?.resume());
}

// ========== Scroll locking to galaxy section ==========
const galaxySection = document.getElementById('projects');
const siteNav = document.querySelector('.site-nav');
let galaxyLockTriggered = false;

if (galaxySection) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (
          entry.isIntersecting &&
          !galaxyLockTriggered &&
          entry.boundingClientRect.top < window.innerHeight * 0.4
        ) {
          galaxyLockTriggered = true;
          const navOffset = (siteNav?.offsetHeight || 60) + 10;
          const targetY = Math.max(galaxySection.offsetTop - navOffset, 0);
          window.scrollTo({ top: targetY, behavior: 'smooth' });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );
  observer.observe(galaxySection);
}
