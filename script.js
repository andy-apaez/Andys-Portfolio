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

// ========== Soft reflected-fog layer ==========
const fogGeometry = new THREE.PlaneGeometry(720, 720, 1, 1);

const fogVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fogFragmentShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uSecondaryColor;
  uniform float uIntensity;
  uniform float uNoiseScale;
  uniform float uSpiralStrength;
  uniform float uSpiralTightness;

  // Simplex noise (2D) from ashima webgl noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 centeredUv = (vUv - 0.5) * uNoiseScale;
    float t = uTime * 0.12;

    float radial = length(centeredUv);
    float theta = atan(centeredUv.y, centeredUv.x);
    float swirl = theta + radial * uSpiralStrength + sin(theta * uSpiralTightness + t * 2.0) * 0.18;
    vec2 swirlUv = vec2(cos(swirl), sin(swirl)) * radial;

    float n1 = snoise(swirlUv * 1.6 + vec2(t * 0.8, -t * 0.45));
    float n2 = snoise(swirlUv * 3.0 + vec2(-t * 0.35, t * 0.55));
    float cloud = smoothstep(-0.2, 0.6, n1 * 0.6 + n2 * 0.4);

    float vignette = smoothstep(0.75, 0.08, length(vUv - 0.5));
    float spiralMask = smoothstep(0.05, 0.8, 1.0 - radial) *
      (0.55 + 0.45 * smoothstep(-0.35, 0.65, sin(theta * (uSpiralTightness * 0.8) + t * 1.6)));

    float alpha = cloud * vignette * spiralMask * uIntensity;
    if (alpha <= 0.01) discard;

    vec3 colorMix = mix(uColor, uSecondaryColor, clamp(n1 * 0.5 + 0.5, 0.0, 1.0));
    gl_FragColor = vec4(colorMix * 1.15, alpha);
  }
`;

const fogUniformsA = {
  uTime: { value: 0 },
  uColor: { value: new THREE.Color('#7bb6ff') },
  uSecondaryColor: { value: new THREE.Color('#c7a5ff') },
  uIntensity: { value: 0.7 },
  uNoiseScale: { value: 1.35 },
  uSpiralStrength: { value: 8.0 },
  uSpiralTightness: { value: 7.5 }
};

const fogUniformsB = {
  uTime: { value: 0 },
  uColor: { value: new THREE.Color('#f8dba0') },
  uSecondaryColor: { value: new THREE.Color('#8ab0ff') },
  uIntensity: { value: 0.42 },
  uNoiseScale: { value: 1.75 },
  uSpiralStrength: { value: 6.5 },
  uSpiralTightness: { value: 5.5 }
};

function createFogLayer(uniforms, rotationOffset = 0) {
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: fogVertexShader,
    fragmentShader: fogFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(fogGeometry, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = rotationOffset;
  mesh.position.y = -4;
  mesh.renderOrder = -2;
  return mesh;
}

const fogLayerA = createFogLayer(fogUniformsA, 0);
const fogLayerB = createFogLayer(fogUniformsB, Math.PI / 5);
scene.add(fogLayerA);
scene.add(fogLayerB); 

// ========== Galaxy particle field ==========
const params = {
  arms: 5,
  particles: 6000,
  radius: 300,
  spiralTightness: 0.045,
  randomness: 0.35,
  randomnessPower: 1.4,
  palette: ['#ffd27f', '#8ab0ff', '#c28bff']
};

// Buffer geometry for tiny background stars
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(params.particles * 3);
const colors = new Float32Array(params.particles * 3);
const sizes = new Float32Array(params.particles);
const brightness = new Float32Array(params.particles);

const colorPalette = params.palette.map(color => new THREE.Color(color));

for (let i = 0; i < params.particles; i++) {
  const i3 = i * 3;

  const radius = Math.pow(Math.random(), 1.25) * params.radius;
  const branch = i % params.arms;
  const branchAngle = (branch / params.arms) * Math.PI * 2;

  const spinAngle = radius * params.spiralTightness * Math.PI * 2;

  const randomnessStrength =
    Math.pow(radius / params.radius, params.randomnessPower) * params.randomness;

  const randomX =
    (Math.random() - 0.5) * randomnessStrength * params.radius * 0.55;
  const randomY =
    (Math.random() - 0.5) * randomnessStrength * params.radius * 0.18;
  const randomZ =
    (Math.random() - 0.5) * randomnessStrength * params.radius * 0.55;

  const angle = branchAngle + spinAngle;

  const x = Math.cos(angle) * radius + randomX;
  const y = randomY * 0.15;
  const z = Math.sin(angle) * radius + randomZ;

  positions[i3 + 0] = x;
  positions[i3 + 1] = y;
  positions[i3 + 2] = z;

  //create a better sprial here maybe with some new partical effect (fog like or smth)

  // color interpolation within yellow, purple, blue hues
  const colorA = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  const colorB = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  const mixAmount = Math.random() * 0.5 + 0.25;
  const mixedColor = colorA.clone().lerp(colorB, mixAmount);

  colors[i3 + 0] = mixedColor.r;
  colors[i3 + 1] = mixedColor.g;
  colors[i3 + 2] = mixedColor.b;

  sizes[i] = Math.random() * 1.5 + 0.2;
  brightness[i] = Math.random() * 0.5 + 0.75;
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

const spriteTexture = new THREE.TextureLoader().load(
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/sprites/spark1.png'
);

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

let hovered = null;
const label = document.getElementById('label');

function updatePointerFromEvent(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onPointerMove(event) {
  updatePointerFromEvent(event);

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableStars, false);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (hovered !== obj) {
      hovered = obj;
      const proj =
        projects.find(p => p.id === obj.userData.projectId) || {};
      label.style.display = 'block';
      label.textContent = proj.name || 'Project';
    }
    label.style.left = event.clientX + 'px';
    label.style.top = event.clientY - 24 + 'px';
  } else {
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
  fogUniformsA.uTime.value = elapsed;
  fogUniformsB.uTime.value = elapsed * 0.9;

  points.rotation.y = elapsed * 0.02;
  clickableGroup.rotation.y = elapsed * 0.015;
  fogLayerA.rotation.z = elapsed * 0.02;
  fogLayerB.rotation.z = -elapsed * 0.017;
  if (activeFollow && activeFollow.enabled) {
    activeFollow.star.getWorldPosition(followTargetWorld);
    followCameraPos.copy(followTargetWorld).add(activeFollow.offset);
    controls.target.lerp(followTargetWorld, 0.08);
    camera.position.lerp(followCameraPos, 0.08);
  }

  // small floating motion on clickable stars (no drift)  *** CHANGED
  clickableStars.forEach((s, idx) => {
    const baseY = s.userData.baseY;
    s.position.y = baseY + Math.sin(elapsed * 0.6 + idx) * 0.7;
  });

  // (Comet animation removed for now)

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
}
window.addEventListener('resize', onResize, { passive: true });

// adjust particle size for small screens
if (window.innerWidth < 700) {
  particleUniforms.uSize.value = 1.0; 
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
