import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setupRevealAnimations() {
  const revealTargets = document.querySelectorAll(
    [
      ".order-strip",
      ".section-heading",
      ".benefit-grid article",
      ".timeline article",
      ".service-hours",
      ".service-hours-grid div",
      ".trusted-strip span",
      ".partnership",
      ".certificate-grid div",
      ".final-cta",
    ].join(", "),
  );

  revealTargets.forEach((element, index) => {
    element.dataset.reveal = "";
    element.style.setProperty("--reveal-index", index % 5);
  });

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
  );

  revealTargets.forEach((element) => observer.observe(element));
}

function makeLabelTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");

  function roundedRect(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grd.addColorStop(0, "#ffffff");
  grd.addColorStop(0.48, "#e8faff");
  grd.addColorStop(1, "#ffffff");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(21, 153, 223, .08)";
  for (let i = -80; i < canvas.width; i += 58) {
    ctx.fillRect(i, 0, 18, canvas.height);
  }

  roundedRect(42, 42, canvas.width - 84, canvas.height - 84, 34);
  ctx.fillStyle = "rgba(255, 255, 255, .72)";
  ctx.fill();
  ctx.strokeStyle = "rgba(11, 92, 168, .38)";
  ctx.lineWidth = 12;
  ctx.stroke();

  roundedRect(74, 74, canvas.width - 148, canvas.height - 148, 24);
  ctx.strokeStyle = "rgba(24, 170, 131, .22)";
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.save();
  ctx.translate(205, 184);
  const diamond = ctx.createLinearGradient(-50, -50, 70, 88);
  diamond.addColorStop(0, "#9df0ff");
  diamond.addColorStop(0.45, "#1599df");
  diamond.addColorStop(1, "#0b5ca8");
  ctx.fillStyle = diamond;
  ctx.beginPath();
  ctx.moveTo(0, -116);
  ctx.lineTo(128, -18);
  ctx.lineTo(0, 142);
  ctx.lineTo(-128, -18);
  ctx.closePath();
  ctx.shadowColor = "rgba(11, 92, 168, .26)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 14;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(255,255,255,.7)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-128, -18);
  ctx.lineTo(128, -18);
  ctx.moveTo(0, -116);
  ctx.lineTo(-42, -18);
  ctx.lineTo(0, 142);
  ctx.lineTo(42, -18);
  ctx.lineTo(0, -116);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#092a4d";
  ctx.font = "950 106px system-ui, sans-serif";
  ctx.fillText("ДІАМАНТОВА", 380, 210);
  ctx.font = "950 146px system-ui, sans-serif";
  ctx.fillText("ВОДА", 380, 366);

  ctx.fillStyle = "#d7a84f";
  roundedRect(392, 402, 252, 76, 38);
  ctx.fill();
  ctx.fillStyle = "#092a4d";
  ctx.font = "950 42px system-ui, sans-serif";
  ctx.fillText("100 грн", 436, 454);

  ctx.fillStyle = "#0b5ca8";
  ctx.font = "850 42px system-ui, sans-serif";
  ctx.fillText("18,9 л · питна вода для офісу та дому", 382, 540);

  ctx.fillStyle = "#18aa83";
  ctx.font = "900 36px system-ui, sans-serif";
  ctx.fillText("Софіївська Борщагівка +10 км", 382, 596);

  ctx.fillStyle = "#092a4d";
  for (let i = 0; i < 22; i += 1) {
    const x = 1080 + i * 9;
    const h = 58 + ((i * 19) % 64);
    ctx.fillRect(x, 488 - h, i % 4 === 0 ? 5 : 3, h);
  }

  ctx.fillStyle = "rgba(11, 92, 168, .68)";
  ctx.font = "800 24px system-ui, sans-serif";
  ctx.fillText("DIAMOND WATER", 1050, 544);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
}

function createBottle() {
  const group = new THREE.Group();

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xa8ebff,
    transparent: true,
    opacity: 0.5,
    roughness: 0.026,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.018,
    transmission: 0.42,
    thickness: 0.78,
    ior: 1.45,
    reflectivity: 0.72,
    specularIntensity: 1,
    specularColor: 0xffffff,
    attenuationColor: 0x8ee6ff,
    attenuationDistance: 2.8,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f91d8,
    transparent: true,
    opacity: 0.88,
    roughness: 0.1,
    metalness: 0,
    emissive: 0x074f7d,
    emissiveIntensity: 0.12,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
  });

  const capMaterial = new THREE.MeshStandardMaterial({
    color: 0x1fa8ed,
    roughness: 0.2,
    metalness: 0.08,
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd7a84f,
    roughness: 0.16,
    metalness: 0.6,
  });

  const profile = [
    [0.36, -2.48],
    [0.94, -2.47],
    [1.16, -2.38],
    [1.29, -2.2],
    [1.34, -1.95],
    [1.23, -1.76],
    [1.33, -1.55],
    [1.25, -1.3],
    [1.33, -1.06],
    [1.25, -0.78],
    [1.33, -0.5],
    [1.24, -0.22],
    [1.31, 0.08],
    [1.22, 0.38],
    [1.28, 0.7],
    [1.14, 1.02],
    [0.88, 1.24],
    [0.58, 1.44],
    [0.42, 1.68],
    [0.34, 2.02],
    [0.34, 2.34],
    [0.48, 2.43],
  ];

  const bodyGeometry = new THREE.LatheGeometry(
    profile.map(([x, y]) => new THREE.Vector2(x, y)),
    192,
  );
  bodyGeometry.computeVertexNormals();
  const bodySilhouette = new THREE.Mesh(
    bodyGeometry.clone(),
    new THREE.MeshBasicMaterial({
      color: 0x0f91d8,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      depthWrite: false,
    }),
  );
  bodySilhouette.scale.setScalar(1.012);
  bodySilhouette.renderOrder = 28;
  group.add(bodySilhouette);

  const body = new THREE.Mesh(bodyGeometry, glassMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  body.renderOrder = 30;
  group.add(body);

  const waterProfile = [
    [0.35, -2.28],
    [0.92, -2.27],
    [1.08, -2.12],
    [1.16, -1.86],
    [1.08, -1.62],
    [1.17, -1.36],
    [1.1, -1.04],
    [1.18, -0.72],
    [1.1, -0.42],
    [1.16, -0.12],
    [1.04, 0.24],
    [0.78, 0.46],
  ];
  const water = new THREE.Mesh(
    new THREE.LatheGeometry(waterProfile.map(([x, y]) => new THREE.Vector2(x, y)), 192),
    waterMaterial,
  );
  water.geometry.computeVertexNormals();
  water.position.y = -0.02;
  water.frustumCulled = false;
  water.renderOrder = 42;
  group.add(water);

  const waterSurfaceMaterial = new THREE.MeshStandardMaterial({
    color: 0x75ddff,
    transparent: true,
    opacity: 0.7,
    roughness: 0.06,
    metalness: 0,
    emissive: 0x0d6d9d,
    emissiveIntensity: 0.06,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
  });
  const waterSurface = new THREE.Mesh(
    new THREE.CylinderGeometry(0.78, 1.02, 0.028, 160),
    waterSurfaceMaterial,
  );
  waterSurface.position.y = 0.465;
  waterSurface.frustumCulled = false;
  waterSurface.renderOrder = 43;
  group.add(waterSurface);

  const meniscus = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.012, 12, 160),
    new THREE.MeshBasicMaterial({
      color: 0xcaf6ff,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      depthTest: false,
    }),
  );
  meniscus.rotation.x = Math.PI / 2;
  meniscus.position.y = 0.487;
  meniscus.renderOrder = 44;
  group.add(meniscus);

  const labelTexture = makeLabelTexture();
  const labelArc = 1.72;
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(1.335, 1.335, 1.04, 128, 1, true, -labelArc / 2, labelArc),
    new THREE.MeshBasicMaterial({
      map: labelTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  label.position.y = -0.52;
  label.renderOrder = 50;
  group.add(label);

  const backLabel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.326, 1.326, 0.72, 96, 1, true, Math.PI - 0.36, 0.72),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  backLabel.position.y = -0.48;
  backLabel.renderOrder = 20;
  group.add(backLabel);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.36, 80), capMaterial);
  cap.position.y = 2.44;
  cap.castShadow = true;
  group.add(cap);

  [2.31, 2.43, 2.57].forEach((y) => {
    const capRing = new THREE.Mesh(new THREE.TorusGeometry(0.425, 0.018, 10, 80), capMaterial);
    capRing.rotation.x = Math.PI / 2;
    capRing.position.y = y;
    group.add(capRing);
  });

  const pumpStem = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.72, 48), goldMaterial);
  pumpStem.position.y = 2.9;
  group.add(pumpStem);

  const pumpCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.18, 72), goldMaterial);
  pumpCollar.position.y = 2.66;
  group.add(pumpCollar);

  const pumpHead = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.76, 64), goldMaterial);
  pumpHead.rotation.z = Math.PI / 2;
  pumpHead.position.set(0.31, 3.26, 0);
  group.add(pumpHead);

  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.78, 32), goldMaterial);
  spout.rotation.z = Math.PI / 2;
  spout.position.set(0.86, 3.2, 0);
  group.add(spout);

  const spoutTip = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.2, 24), goldMaterial);
  spoutTip.position.set(1.24, 3.09, 0);
  spoutTip.rotation.x = Math.PI / 2;
  group.add(spoutTip);

  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x7fdfff,
    transparent: true,
    opacity: 0.86,
    roughness: 0.055,
    metalness: 0.02,
    depthWrite: false,
  });

  [-2.16, -1.86, -1.46, -1.08, -0.68, -0.26, 0.18, 0.62].forEach((y, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.225 - (index > 5 ? 0.05 : 0), 0.026, 14, 160), ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    ring.renderOrder = 46;
    group.add(ring);
  });

  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.055, 14, 128), ringMaterial);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = -2.39;
  baseRing.renderOrder = 46;
  group.add(baseRing);

  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  [
    { x: -0.55, z: 1.13, h: 3.8, w: 0.08, r: -0.22 },
    { x: 0.68, z: 1.04, h: 3.1, w: 0.05, r: 0.18 },
    { x: -0.92, z: 0.78, h: 2.2, w: 0.035, r: -0.46 },
  ].forEach((strip) => {
    const shine = new THREE.Mesh(new THREE.PlaneGeometry(strip.w, strip.h), highlightMaterial);
    shine.position.set(strip.x, -0.2, strip.z);
    shine.rotation.y = strip.r;
    shine.renderOrder = 61;
    group.add(shine);
  });

  const causticBands = [];
  [-1.95, -1.42, -0.88, -0.34, 0.18].forEach((y, index) => {
    const causticMaterial = new THREE.MeshBasicMaterial({
      color: index % 2 ? 0xd9fbff : 0xffffff,
      transparent: true,
      opacity: 0.12 + index * 0.018,
      depthWrite: false,
      depthTest: false,
    });
    const caustic = new THREE.Mesh(
      new THREE.TorusGeometry(0.86 + index * 0.045, 0.0045, 8, 132),
      causticMaterial,
    );
    caustic.rotation.x = Math.PI / 2;
    caustic.rotation.z = index * 0.7;
    caustic.position.y = y;
    caustic.renderOrder = 45;
    caustic.userData.phase = index * 1.7;
    caustic.userData.speed = 0.00005 + index * 0.000012;
    causticBands.push(caustic);
    group.add(caustic);
  });

  group.userData.waterSurface = waterSurface;
  group.userData.meniscus = meniscus;
  group.userData.causticBands = causticBands;
  return group;
}

function setupBottleScene() {
  const canvas = document.getElementById("bottle-canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.18, 7.4);

  const bottle = createBottle();
  scene.add(bottle);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x6ba9cc, 2.55);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 4.8);
  key.position.set(4.5, 6, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.width = 1024;
  key.shadow.mapSize.height = 1024;
  scene.add(key);

  const fill = new THREE.PointLight(0xd7f8ff, 2.3, 9);
  fill.position.set(-3.2, 1.4, 3.8);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0x85e9ff, 3.2);
  rim.position.set(-5, 2.2, -3);
  scene.add(rim);

  const goldKick = new THREE.PointLight(0xffd780, 1.15, 7);
  goldKick.position.set(2.6, 3.2, 2.4);
  scene.add(goldKick);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(2.2, 96),
    new THREE.MeshBasicMaterial({
      color: 0x1599df,
      transparent: true,
      opacity: 0.08,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.38;
  scene.add(floor);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const mobile = width < 680;
    bottle.scale.setScalar(mobile ? 0.56 : 0.92);
    bottle.userData.baseY = mobile ? 0.92 : 0.02;
    bottle.position.set(mobile ? 0.94 : 1.62, bottle.userData.baseY, 0);
    bottle.rotation.y = mobile ? -0.03 : -0.16;
    camera.position.z = mobile ? 8.65 : 7.45;
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  let lastTime = performance.now();
  function animate(now) {
    const delta = Math.min(48, now - lastTime);
    lastTime = now;

    bottle.rotation.x = Math.sin(now * 0.0008) * 0.018;
    bottle.position.y = (bottle.userData.baseY ?? 0) + Math.sin(now * 0.0012) * 0.038;

    if (bottle.userData.waterSurface) {
      const surfacePulse = Math.sin(now * 0.0014) * 0.006;
      bottle.userData.waterSurface.scale.set(1 + surfacePulse, 1, 1 - surfacePulse);
    }

    if (bottle.userData.meniscus) {
      bottle.userData.meniscus.rotation.z += 0.00008 * delta;
    }

    for (const band of bottle.userData.causticBands || []) {
      band.rotation.z += band.userData.speed * delta;
      const pulse = Math.sin(now * 0.0012 + band.userData.phase) * 0.018;
      band.scale.set(1 + pulse, 1 + pulse * 0.35, 1 + pulse);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", () => {
  setupRevealAnimations();
  setupBottleScene();
  refreshIcons();
  setTimeout(refreshIcons, 200);
});
