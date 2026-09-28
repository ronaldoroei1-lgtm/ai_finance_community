import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Cell = { walls: boolean[]; visited: boolean };
const SIZE = 9;
const STEP = 0.76;

// A seeded perfect maze keeps both the sculpture and its solution reproducible.
function makeMaze() {
  let seed = 317;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const cells: Cell[] = Array.from({ length: SIZE * SIZE }, () => ({ walls: [true, true, true, true], visited: false }));
  const parents = new Map<number, number>();
  const stack = [0];
  cells[0].visited = true;
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  while (stack.length) {
    const current = stack[stack.length - 1];
    const x = current % SIZE, z = Math.floor(current / SIZE);
    const options = directions.flatMap(([dx, dz], d) => {
      const nx = x + dx, nz = z + dz;
      const next = nz * SIZE + nx;
      return nx >= 0 && nx < SIZE && nz >= 0 && nz < SIZE && !cells[next].visited ? [{ next, d }] : [];
    });
    if (!options.length) { stack.pop(); continue; }
    const { next, d } = options[Math.floor(random() * options.length)];
    cells[current].walls[d] = false;
    cells[next].walls[(d + 2) % 4] = false;
    cells[next].visited = true;
    parents.set(next, current);
    stack.push(next);
  }
  const route = [SIZE * SIZE - 1];
  while (route[route.length - 1] !== 0) route.push(parents.get(route[route.length - 1])!);
  cells[0].walls[0] = false;
  cells[SIZE * SIZE - 1].walls[2] = false;
  return { cells, route: route.reverse() };
}

function MazeFallback() {
  return <svg viewBox="0 0 700 580" width="100%" height="100%" style={{ position: "absolute", inset: 0 }} focusable="false">
    <defs>
      <linearGradient id="maze-slab" x2="1" y2="1"><stop stopColor="#184279"/><stop offset="1" stopColor="#071a36"/></linearGradient>
      <filter id="maze-glow"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <ellipse cx="350" cy="455" rx="240" ry="48" fill="#00102d" opacity=".6"/>
    <path d="M65 290 350 125 635 290 635 328 350 493 65 328Z" fill="#07182f" stroke="#235183"/>
    <path d="M65 290 350 125 635 290 350 455Z" fill="url(#maze-slab)" stroke="#4d7cb0" strokeOpacity=".4"/>
    <g transform="translate(350 144) matrix(.72 .415 -.72 .415 0 0)" fill="none" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M40 0H0V360H360V0H80 M40 40V200H120V120H280V280H200V200H160V320H320V40H80V80H240 M40 240H120V320H40 M80 120V160 M160 40V80 M200 120V160H240V240 M0 280H80 M120 0V40 M360 160H320 M360 320H320" stroke="#030f25" strokeWidth="18" transform="translate(0 12)"/>
      <path d="M40 0H0V360H360V0H80 M40 40V200H120V120H280V280H200V200H160V320H320V40H80V80H240 M40 240H120V320H40 M80 120V160 M160 40V80 M200 120V160H240V240 M0 280H80 M120 0V40 M360 160H320 M360 320H320" stroke="#3d6997" strokeWidth="10"/>
      <path d="M60 -20V20H300V300H180V180H140V340H340V380" stroke="#4ad7ff" strokeWidth="12" filter="url(#maze-glow)" opacity=".5"/>
      <path d="M60 -20V20H300V300H180V180H140V340H340V380" stroke="#79dfff" strokeWidth="3"/>
    </g>
  </svg>;
}

export default function MazeScene({ className = "", paused = false }: { className?: string; paused?: boolean }) {
  const pauseRef = useRef(paused);
  const resumeRef = useRef<() => void>(() => {});
  useEffect(() => {pauseRef.current=paused;resumeRef.current();}, [paused]);
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x041452, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 60);
    camera.position.set(10, 11, 12);
    camera.lookAt(0, 0, 0);
    const sculpture = new THREE.Group();
    sculpture.rotation.y = -0.1;
    scene.add(sculpture);
    scene.add(new THREE.HemisphereLight(0xbad7ff, 0x051329, 2.4));
    const key = new THREE.DirectionalLight(0xd6e7ff, 4);
    key.position.set(-4, 9, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 });
    key.shadow.normalBias = 0.035;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x389bff, 4);
    rim.position.set(5, 3, -6);
    scene.add(rim);
    const span = SIZE * STEP;
    const center = (SIZE - 1) * STEP / 2;
    const floor = new THREE.Mesh(new THREE.BoxGeometry(span + 0.45, 0.25, span + 0.45), new THREE.MeshStandardMaterial({ color: 0x10243e, roughness: 0.45, metalness: 0.55 }));
    floor.position.y = -0.15;
    floor.receiveShadow = true;
    floor.castShadow = true;
    sculpture.add(floor);
    const lower = new THREE.Mesh(new THREE.BoxGeometry(span + 0.28, 0.12, span + 0.28), new THREE.MeshStandardMaterial({ color: 0x071324, roughness: 0.5, metalness: 0.65 }));
    lower.position.y = -0.33;
    sculpture.add(lower);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(floor.geometry), new THREE.LineBasicMaterial({ color: 0x719dcb, transparent: true, opacity: 0.25 }));
    edge.position.copy(floor.position);
    sculpture.add(edge);
    const { cells, route } = makeMaze();
    const walls: { x: number; z: number; horizontal: boolean }[] = [];
    cells.forEach((cell, index) => {
      const x = (index % SIZE) * STEP - center, z = Math.floor(index / SIZE) * STEP - center;
      if (cell.walls[0]) walls.push({ x, z: z - STEP / 2, horizontal: true });
      if (cell.walls[3]) walls.push({ x: x - STEP / 2, z, horizontal: false });
      if (index % SIZE === SIZE - 1 && cell.walls[1]) walls.push({ x: x + STEP / 2, z, horizontal: false });
      if (Math.floor(index / SIZE) === SIZE - 1 && cell.walls[2]) walls.push({ x, z: z + STEP / 2, horizontal: true });
    });
    const wallMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x25476b, roughness: 0.37, metalness: 0.48 }), walls.length);
    const dummy = new THREE.Object3D();
    walls.forEach(({ x, z, horizontal }, index) => {
      dummy.position.set(x, 0.235, z);
      dummy.scale.set(horizontal ? STEP + 0.095 : 0.095, 0.5, horizontal ? 0.095 : STEP + 0.095);
      dummy.updateMatrix();
      wallMesh.setMatrixAt(index, dummy.matrix);
    });
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    sculpture.add(wallMesh);
    const points = route.map(index => new THREE.Vector3((index % SIZE) * STEP - center, 0.035, Math.floor(index / SIZE) * STEP - center));
    points.unshift(new THREE.Vector3(-center, 0.035, -span / 2 - 0.2));
    points.push(new THREE.Vector3(center, 0.035, span / 2 + 0.2));
    const curve = new THREE.CurvePath<THREE.Vector3>();
    points.slice(1).forEach((point, i) => curve.add(new THREE.LineCurve3(points[i], point)));
    const routeMaterial = new THREE.MeshStandardMaterial({ color: 0x8ce4ff, emissive: 0x289fff, emissiveIntensity: 3, roughness: 0.3 });
    const pathGeometry = new THREE.TubeGeometry(curve, points.length * 6, 0.032, 6, false);
    sculpture.add(new THREE.Mesh(pathGeometry, routeMaterial));
    const glowGeometry = new THREE.TubeGeometry(curve, points.length * 6, 0.09, 6, false);
    sculpture.add(new THREE.Mesh(glowGeometry, new THREE.MeshBasicMaterial({ color: 0x268fff, transparent: true, opacity: 0.18, depthWrite: false })));
    // A single travelling light makes the path readable without a particle cloud.
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 8), new THREE.MeshBasicMaterial({ color: 0xe8fbff }));
    sculpture.add(marker);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = true, stopped = false, frame = 0, progress = 0, lastTime = 0, elapsed = 0;
    const pointer = { x: 0, y: 0 };
    const draw = (time: number) => {
      frame = 0;
      if (stopped || !inView || document.hidden) return;
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (!reduced.matches && !pauseRef.current) {
        elapsed += delta;
        progress = (progress + delta * 0.10) % 1;
        sculpture.rotation.y += (-0.1 + pointer.x * 0.1 - sculpture.rotation.y) * 0.04;
        sculpture.rotation.x += (pointer.y * 0.025 - sculpture.rotation.x) * 0.04;
      }
      const build = reduced.matches ? 1 : Math.min(1, elapsed / 1.2);
      wallMesh.scale.y = 0.05 + 0.95 * (1 - Math.pow(1-build,3));
      const reveal = reduced.matches ? 1 : Math.min(1, Math.max(0, (elapsed - .5) / 3.5));
      for(const geometry of [pathGeometry,glowGeometry]) {const total=geometry.index!.count;geometry.setDrawRange(0, Math.floor(total*reveal/3)*3);}
      marker.visible = reveal > 0;
      marker.position.copy(curve.getPoint(reduced.matches ? 0.72 : reveal < 1 ? reveal : progress));
      sculpture.position.y = reduced.matches ? 0 : Math.sin(elapsed*.7)*.055;
      renderer.render(scene, camera);
      if (!reduced.matches && !pauseRef.current) frame = requestAnimationFrame(draw);
    };
    const start = () => { if (!frame && !stopped && inView && !document.hidden) { lastTime = performance.now(); frame = requestAnimationFrame(draw); } };
    resumeRef.current = start;
    const resize = () => {
      const width = container.clientWidth, height = container.clientHeight;
      if (!width || !height) return;
      const aspect = width / height;
      const halfHeight = Math.max(4.6, 5.35 / aspect);
      camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
      camera.top = halfHeight; camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      start();
    };
    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const onLeave = () => { pointer.x = 0; pointer.y = 0; };
    const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else start(); };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: "100px" });
    observer.observe(container);
    const resizer = new ResizeObserver(resize);
    resizer.observe(container);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", start);
    const lost = (event: Event) => { event.preventDefault(); stopped = true; cancelAnimationFrame(frame); renderer.domElement.style.display = "none"; setReady(false); };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    resize();
    renderer.render(scene, camera);
    setReady(true);
    return () => {
      stopped = true;
      resumeRef.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect(); resizer.disconnect();
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", start);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
        }
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      key.shadow.map?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className={className} aria-hidden="true" style={{ position: "relative", width: "100%", aspectRatio: "1.25", isolation: "isolate" }}>
    <div style={{ position: "absolute", inset: "12% 5% 7%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(25,99,179,.2), transparent 68%)", pointerEvents: "none" }} />
    {!ready && <MazeFallback />}
  </div>;
}
