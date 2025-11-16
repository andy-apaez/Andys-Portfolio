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

  // color interpolation within yellow, purple, blue hues
  const colorA = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  const colorB = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  const mixAmount = Math.random() * 0.5 + 0.25;
  const mixedColor = colorA.clone().lerp(colorB, mixAmount);

  colors[i3 + 0] = mixedColor.r;
  colors[i3 + 1] = mixedColor.g;
  colors[i3 + 2] = mixedColor.b;

  sizes[i] = Math.random() * 1.5 + 0.2;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

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

  varying vec3 vColor;

  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uPerspective;

  void main() {
    vColor = color;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = -mvPosition.z;
    float perspective = uPerspective / max(dist, 1.0);
    float pointSize = size * uSize * uPixelRatio * perspective;
    gl_PointSize = max(pointSize, 1.5);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = /* glsl */ `
  precision mediump float;

  varying vec3 vColor;
  uniform float uTrailStrength;

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

    float alpha = core + glow;

    if (alpha <= 0.01) discard;

    vec3 color = vColor * (1.2 + glow * 1.5);

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
  { id: 0, name: "Los Tacos Menu", desc: "Interactive menu with slider categories & cart. Stripe + Firebase.", tags: ["React", "Firebase", "Stripe"], demo: "https://example.com/demo1", code: "https://github.com/you/los-tacos" },
  { id: 1, name: "stuff", desc: "lots of stuff in here.", tags: ["Python", "Wireshark"], demo: "https://example.com/demo2", code: "https://github.com/you/cyber-lab" },
  { id: 2, name: "blah blah blah", desc: "woopdoodoosoosos.", tags: ["HTML","CSS","JS"], demo: "https://example.com/demo3", code: "https://github.com/you/portfolio" },
  { id: 3, name: "something something something", desc: "PWA ordering flow with offline support and caching.", tags: ["PWA","ServiceWorker"], demo: "https://example.com/demo4", code: "https://github.com/you/shop-pwa" },
  { id: 4, name: "another cool porject", desc: "cool details and stuff.", tags: ["Three.js","Websockets"], demo: "https://example.com/demo5", code: "https://github.com/you/3d-viz" }
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

// (Comets removed)

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

  // animate camera to focus on the clicked star  *** CHANGED
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

  // update time uniform for trails (can be used for future effects)
  particleUniforms.uTime.value = elapsed;

  // gentle rotation of galaxy points
  points.rotation.y = elapsed * 0.02;
  clickableGroup.rotation.y = elapsed * 0.015;
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

  // (Comet animation removed)

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
