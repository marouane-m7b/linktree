import { lazy, Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { clone as cloneRig } from "three/addons/utils/SkeletonUtils.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, BookOpen, X } from "lucide-react";
import darkFantasyWorld from "@/assets/CinematicWorld.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { UI_TRANSLATIONS } from "@/lib/translations";
import { animateKnight, createKnight } from "./KnightModel";
import { getPortfolioData, skillGroups, type CodexTab } from "./gamePortfolioData";
import { createVillage, villageHeight, portalSites } from "./VillageWorld";
import { readController } from "./GamepadInput";
import { createSamuraiRealm, samuraiHeight } from "./SamuraiRealm";
import "./GamesPortfolio.css";

const PortfolioCodex = lazy(() => import("./PortfolioCodex"));

type Quest = { id: string; x: number; z: number; icon: string; title: string; subtitle: string; color: string; body: string; tab: CodexTab; link?: string; linkLabel?: string };
type MaleniaWalkRig = Map<string, { bone: THREE.Bone; rest: THREE.Quaternion; parentRest: THREE.Quaternion }>;
function animateMalenia(rig: MaleniaWalkRig | undefined, frame: THREE.Quaternion, now: number, walking: boolean, weight = 1, running = false) {
  if (!rig) return;
  const cycle = walking ? now * .0105 : now * .0018;
  const stride = walking ? Math.sin(cycle) * (running ? .72 : .44) * weight : Math.sin(cycle) * .025;
  const pose = (name: string, angle: number, axis = "sagittal") => {
    const entry = rig.get(name); if (!entry) return;
    const axisVector = axis === "sagittal" ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
    const worldOffset = frame.clone().multiply(new THREE.Quaternion().setFromAxisAngle(axisVector, angle)).multiply(frame.clone().invert());
    const localOffset = entry.parentRest.clone().invert().multiply(worldOffset).multiply(entry.parentRest);
    entry.bone.quaternion.copy(localOffset).multiply(entry.rest);
  };
  pose("L_hip_031", stride); pose("R_hip_035", -stride);
  pose("L_knee_032", -Math.max(0, -Math.sin(cycle)) * (running ? 1.05 : .65) * weight); pose("R_knee_036", -Math.max(0, Math.sin(cycle)) * (running ? 1.05 : .65) * weight);
  pose("L_ankle_033", -stride * .35); pose("R_ankle_037", stride * .35); pose("L_shldr_jnt_06", -stride * (running ? .95 : .65));
  pose("R_shldr_jnt_013", stride * (running ? .65 : .35));
  pose("L_elbow_jnt_07", (running ? -.65 : -.14) + Math.max(0, stride) * .22);
  pose("R_elbow_jnt_014", (running ? -.5 : -.16) + Math.max(0, -stride) * .18);
  pose("spine_jnt_03_04", walking ? Math.sin(cycle * 2) * .018 : Math.sin(now * .0015) * .01, "lateral");
}
const archivedQuests: Quest[] = [
  { id: "origin", x: -13, z: -13, icon: "✦", title: "THE WAYFINDER", subtitle: "Character profile", color: "#e5c985", body: "The path begins here: meet Marouane, his craft, and the principles behind the work.", tab: "about" },
  { id: "work", x: 13, z: -36, icon: "⚒", title: "THE FORGE", subtitle: "Selected work", color: "#c2c69a", body: "Seven real builds wait in the forge, each with its own tools, story, and field evidence.", tab: "projects" },
  { id: "certifications", x: -14, z: -60, icon: "◈", title: "THE SCRIPTORIUM", subtitle: "Licenses & certifications", color: "#d6bd85", body: "Five verified learning paths: Meta, IBM, Google, ENSET Mohammedia, and Vanderbilt University.", tab: "certifications" },
  { id: "awards", x: 12, z: -85, icon: "♜", title: "THE HALL OF HONORS", subtitle: "Honors & awards", color: "#e0be78", body: "Four milestones, including a national WorldSkills Morocco title in Web Technologies.", tab: "awards" },
  { id: "experience", x: -13, z: -110, icon: "⌛", title: "THE LONG ROAD", subtitle: "Experience & education", color: "#c4bc9d", body: "Follow the full journey through eleven chapters in work, education, competition, and mentorship.", tab: "experience" },
  { id: "skills", x: 12, z: -135, icon: "⚗", title: "THE ARMORY", subtitle: "Skills & tools", color: "#c6a77a", body: "Browse the living toolkit, from product-minded frontend work to backend systems, mobile apps, and delivery tools.", tab: "skills" },
  { id: "contact", x: -10, z: -161, icon: "✉", title: "THE LAST GRACE", subtitle: "Start a quest together", color: "#ecc77e", body: "Have a product to build or a good problem to solve? Let’s talk about it.", tab: "contact", link: "mailto:marouane.ma7boub@gmail.com", linkLabel: "Send a message" },
];
const quests: Quest[] = [
 { id: "guide", x: -5, z: -4, icon: "✦", title: "ROWAN", subtitle: "Village storyteller", color: "#e5c985", body: "Welcome to Aster. I keep the stories of travellers who pass through. Marouane is one of them. Ask me about him.", tab: "about" },
 { id: "work", x: 10, z: -8, icon: "⚒", title: "ELIAS", subtitle: "Village artisan", color: "#e5c985", body: "Welcome! I’m repairing things for the village. Looking for Marouane’s projects? Visit Ayame in Akari through the portal.", tab: "about" },
 { id: "study", x: -15, z: -17, icon: "✧", title: "MIRA", subtitle: "Scholar · Education", color: "#e5c985", body: "You found my little study. Knowledge travels farther than any road. Let me tell you about Marouane’s education and experience.", tab: "experience" },
 { id: "certificates", x: 16, z: -18, icon: "◈", title: "ALDEN", subtitle: "Archivist · Certifications", color: "#e5c985", body: "I collect proof of learning, not just promises. These are Marouane’s certifications.", tab: "certifications" },
 { id: "honors", x: -8, z: -30, icon: "♜", title: "CEDRIC", subtitle: "Veteran · Honors", color: "#e5c985", body: "A medal marks a moment. The effort behind it is the real story. Here are Marouane’s achievements.", tab: "awards" },
 { id: "skills", x: 5, z: -27, icon: "⚗", title: "IRIS", subtitle: "Alchemist · Skills", color: "#e5c985", body: "Every craft has its tools. Marouane works with React, TypeScript, Laravel, Spring Boot, SQL, Docker and more. His toolkit grows with every project.", tab: "skills" },
 { id: "contact", x: -8, z: 7, icon: "✉", title: "FINN", subtitle: "Messenger · Contact", color: "#e5c985", body: "A new adventure starts with a message. Have a project in mind? I can point you toward Marouane.", tab: "contact" },
 { id: "ayame", x: 1010, z: -71, icon: "✧", title: "AYAME", subtitle: "Keeper of the dojo", color: "#e5c985", body: "Welcome to the dojo. Discipline grows through practice. Let me show you Marouane’s projects and the challenges behind them.", tab: "projects" },
 { id: "haru", x: 987, z: -66, icon: "◈", title: "HARU", subtitle: "Village archivist", color: "#e5c985", body: "Every lesson leaves a mark. I keep the records of Marouane’s education and certifications. Which would you like to explore?", tab: "certifications" },
 { id: "samurai", x: 1000, z: -66, icon: "✧", title: "REN", subtitle: "Guardian of Akari", color: "#e5c985", body: "Welcome to Akari. I train here with Ayame while Haru keeps the village records. Speak with them to discover Marouane’s projects and learning journey. The portal returns to Aster.", tab: "about" },
 { id: "traveller", x: -40, z: -70, icon: "✦", title: "LYRA", subtitle: "Wandering traveller", color: "#e5c985", body: "The grove is quiet today. Stay a while. Sometimes the best part of a journey is the pause between destinations.", tab: "awards" },
];
const pathPoints = [new THREE.Vector3(0, 0, 3), new THREE.Vector3(-7, 0, -7), new THREE.Vector3(-14, 0, -16), new THREE.Vector3(-4, 0, -25), new THREE.Vector3(12, 0, -35), new THREE.Vector3(15, 0, -47), new THREE.Vector3(4, 0, -55), new THREE.Vector3(-14, 0, -63), new THREE.Vector3(-7, 0, -75), new THREE.Vector3(12, 0, -87), new THREE.Vector3(2, 0, -100), new THREE.Vector3(-13, 0, -111), new THREE.Vector3(5, 0, -122), new THREE.Vector3(14, 0, -135), new THREE.Vector3(-7, 0, -148), new THREE.Vector3(-10, 0, -166), new THREE.Vector3(5, 0, -184)];
const pathCurve = new THREE.CatmullRomCurve3(pathPoints);
const groundHeight = (x: number, z: number) => x > 500 ? samuraiHeight(x, z) : villageHeight(x, z);
const noise = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function makeGroundTexture() {
  const size = 256, pixels = new Uint8Array(size * size * 4);
  const smoothNoise = (x: number, y: number, cells: number) => { const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), wrap = (n: number) => (n % cells + cells) % cells, lattice = (a: number, b: number) => noise(wrap(a) * 374761 + wrap(b) * 668265); return THREE.MathUtils.lerp(THREE.MathUtils.lerp(lattice(ix, iy), lattice(ix + 1, iy), sx), THREE.MathUtils.lerp(lattice(ix, iy + 1), lattice(ix + 1, iy + 1), sx), sy); };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const u = x / size, v = y / size, broad = smoothNoise(u * 4, v * 4, 4), stones = smoothNoise(u * 18, v * 18, 18), grit = smoothNoise(u * size, v * size, size), fleck = Math.max(0, 1 - Math.abs(smoothNoise(u * 72, v * 72, 72) - .5) * 5); const i = (y * size + x) * 4, tone = (broad - .5) * 64 + (stones - .5) * 42 + (grit - .5) * 24 + fleck * 8; pixels[i] = THREE.MathUtils.clamp(61 + tone, 24, 128); pixels[i + 1] = THREE.MathUtils.clamp(59 + tone * .88, 23, 120); pixels[i + 2] = THREE.MathUtils.clamp(45 + tone * .7, 20, 98); pixels[i + 3] = 255; }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat); texture.colorSpace = THREE.SRGBColorSpace; texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(14, 16); texture.generateMipmaps = true; texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter; texture.needsUpdate = true; return texture;
}

function makeTerrain() {
  const cols = 150, rows = 210, width = 180, depth = 240, positions: number[] = [], colors: number[] = [], uvs: number[] = [], indices: number[] = [];
  const base = new THREE.Color("#30382c"), high = new THREE.Color("#5b604b"), path = new THREE.Color("#71664e"), rock = new THREE.Color("#343638");
  for (let iz = 0; iz <= rows; iz++) for (let ix = 0; ix <= cols; ix++) {
    const x = -width / 2 + ix / cols * width, z = 28 - iz / rows * depth;
    const y = groundHeight(x, z); positions.push(x, y, z);
    let nearPath = 999;
    for (let k = 0; k <= 55; k++) { const p = pathCurve.getPointAt(k / 55); nearPath = Math.min(nearPath, Math.hypot(x - p.x, z - p.z)); }
    const c = base.clone().lerp(high, THREE.MathUtils.clamp((y + .8) * .18 + noise(ix * 31 + iz) * .12, 0, .36));
    c.lerp(rock, noise(ix * 13 + iz * 19) * .13);
    if (nearPath < 5.5) c.lerp(path, (1 - nearPath / 5.5) * .54);
    colors.push(c.r, c.g, c.b);
    uvs.push(ix / cols, iz / rows);
    if (ix < cols && iz < rows) { const a = iz * (cols + 1) + ix, b = a + cols + 1; indices.push(a, a + 1, b, a + 1, b + 1, b); }
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices); geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: makeGroundTexture(), roughness: 1, metalness: 0 })); mesh.receiveShadow = true; return mesh;
}
function addRoad(scene: THREE.Scene) {
  const vertices: number[] = [], indices: number[] = [], samples = 340;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples, p = pathCurve.getPointAt(t), tangent = pathCurve.getTangentAt(t), side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const width = 1.05 + Math.sin(t * 53) * .08, y = groundHeight(p.x, p.z) + .035;
    vertices.push(p.x + side.x * width, y, p.z + side.z * width, p.x - side.x * width, y, p.z - side.z * width);
    if (i < samples) { const a = i * 2; indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ color: "#75694f", roughness: 1, side: THREE.DoubleSide }); const road = new THREE.Mesh(geometry, material); road.receiveShadow = true; scene.add(road);
  const slabGeo = new THREE.BoxGeometry(.72, .12, .62), slabMat = new THREE.MeshStandardMaterial({ color: "#726a57", roughness: .97 });
  const slabs = new THREE.InstancedMesh(slabGeo, slabMat, 240), dummy = new THREE.Object3D(); let count = 0;
  for (let i = 0; i < 240; i++) { const t = .025 + i / 240 * .95, p = pathCurve.getPointAt(t), tangent = pathCurve.getTangentAt(t), side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize(), offset = (noise(i + 93) - .5) * 1.45; dummy.position.set(p.x + side.x * offset, groundHeight(p.x, p.z) + .11, p.z + side.z * offset); dummy.rotation.set(0, Math.atan2(tangent.x, tangent.z) + (noise(i) - .5) * .3, 0); dummy.scale.set(.7 + noise(i * 7) * .7, .6 + noise(i * 5) * .35, .7 + noise(i * 3) * .6); dummy.updateMatrix(); slabs.setMatrixAt(count++, dummy.matrix); if (i % 3 === 0) slabs.setColorAt(i, new THREE.Color(i % 2 ? "#77705c" : "#8a7d62")); }
  slabs.count = count; slabs.castShadow = true; slabs.receiveShadow = true; scene.add(slabs);
}
function addForest(scene: THREE.Scene) {
  const trunkGeo = new THREE.CylinderGeometry(.13, .36, 5.3, 6), crownGeos = [new THREE.ConeGeometry(2.35, 4.1, 7), new THREE.ConeGeometry(1.9, 3.7, 7), new THREE.ConeGeometry(1.4, 3.2, 7)], trunkMat = new THREE.MeshStandardMaterial({ color: "#493b2b", roughness: 1 }), crownMats = ["#354533", "#3c4b39", "#46523e"].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }));
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, 220), crowns = crownGeos.map((geo, i) => new THREE.InstancedMesh(geo, crownMats[i], 220)), dummy = new THREE.Object3D(); let count = 0;
  for (let i = 0; i < 220; i++) {
    const x = (noise(i * 7 + 4) - .5) * 90, z = 12 - noise(i * 13 + 8) * 184; let nearest = 999; for (let k = 0; k <= 35; k++) { const p = pathCurve.getPointAt(k / 35); nearest = Math.min(nearest, Math.hypot(x - p.x, z - p.z)); }
    if (nearest < 7 || z > -2 || Math.abs(x) < 9 && z > -22) continue; const y = groundHeight(x, z), lean = (noise(i * 21) - .5) * .33, scale = .25 + noise(i * 3) * .27;
    dummy.position.set(x, y + 2.65 * scale, z); dummy.rotation.set(0, noise(i + 5) * 6.28, lean); dummy.scale.set(scale, scale, scale); dummy.updateMatrix(); trunks.setMatrixAt(count, dummy.matrix);
    for (let layer = 0; layer < crowns.length; layer++) { dummy.position.set(x + lean * 2, y + (4.1 + layer * 1.15) * scale, z); dummy.rotation.set(0, noise(i + layer * 7) * 6.28, 0); dummy.scale.set(scale, scale, scale); dummy.updateMatrix(); crowns[layer].setMatrixAt(count, dummy.matrix); crowns[layer].setColorAt(count, new THREE.Color(["#354533", "#3c4b39", "#46523e", "#505740"][i % 4])); } count++;
  }
  trunks.count = count; trunks.castShadow = true; crowns.forEach(crown => { crown.count = count; crown.castShadow = true; }); scene.add(trunks, ...crowns);
  const grassGeo = new THREE.ConeGeometry(.065, .25, 5), grassMat = new THREE.MeshStandardMaterial({ color: "#555f40", roughness: 1 }), grass = new THREE.InstancedMesh(grassGeo, grassMat, 850);
  for (let i = 0; i < 850; i++) { const x = (noise(i * 2 + 18) - .5) * 90, z = 16 - noise(i * 3 + 41) * 205; let near = 999; for (let k = 0; k <= 14; k++) { const p = pathCurve.getPointAt(k / 14); near = Math.min(near, Math.hypot(x - p.x, z - p.z)); } if (near < 2.1) continue; const y = groundHeight(x, z); dummy.position.set(x, y + .12, z); dummy.rotation.set(0, noise(i + 71) * 6.28, (noise(i) - .5) * .22); const s = .45 + noise(i * 9) * .6; dummy.scale.set(s, s, s); dummy.updateMatrix(); grass.setMatrixAt(i, dummy.matrix); }
  grass.castShadow = true; scene.add(grass);
}
function addRuin(scene: THREE.Scene, x: number, z: number, scale = 1) {
  const stone = new THREE.MeshStandardMaterial({ color: "#625d4f", roughness: .95, flatShading: true }), lightStone = new THREE.MeshStandardMaterial({ color: "#817760", roughness: 1, flatShading: true });
  const group = new THREE.Group(); group.position.set(x, groundHeight(x, z), z); group.scale.setScalar(scale); scene.add(group);
  const left = new THREE.Mesh(new THREE.CylinderGeometry(.52, .72, 6.1, 7), stone); left.position.set(-2.15, 3.05, 0); left.rotation.z = -.04; left.castShadow = true; group.add(left);
  const right = new THREE.Mesh(new THREE.CylinderGeometry(.6, .76, 5.2, 7), stone); right.position.set(2.15, 2.6, 0); right.rotation.z = .06; right.castShadow = true; group.add(right);
  const arch = new THREE.Mesh(new THREE.TorusGeometry(2.15, .46, 8, 14, Math.PI * .88), lightStone); arch.rotation.z = Math.PI * .06; arch.position.set(0, 5.6, 0); arch.castShadow = true; group.add(arch);
  for (let i = 0; i < 5; i++) { const block = new THREE.Mesh(new THREE.BoxGeometry(.76, .7, .95), i % 2 ? stone : lightStone); block.position.set(-2.4 + i * 1.1, 6.2 + Math.sin(i * .7) * .26, 0); block.rotation.z = (i - 2) * .07; block.castShadow = true; group.add(block); }
  for (const side of [-1, 1]) { const footing = new THREE.Mesh(new THREE.BoxGeometry(1.9, .7, 1.75), lightStone); footing.position.set(side * 2.15, .35, 0); footing.castShadow = true; group.add(footing); }
}
function addBeacon(scene: THREE.Scene, quest: Quest, completed: boolean) {
  const group = new THREE.Group(); group.position.set(quest.x, groundHeight(quest.x, quest.z), quest.z); scene.add(group);
  const gold = new THREE.Color(completed ? "#a6c89a" : quest.color), halo = new THREE.Mesh(new THREE.TorusGeometry(1.03, .055, 8, 48), new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: .84 })); halo.rotation.x = -Math.PI / 2; halo.position.y = .16; group.add(halo);
  const inner = new THREE.Mesh(new THREE.TorusGeometry(.63, .023, 6, 40), new THREE.MeshBasicMaterial({ color: "#ebd69b", transparent: true, opacity: .64 })); inner.rotation.x = -Math.PI / 2; inner.position.y = .18; group.add(inner);
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(.49, 0), new THREE.MeshStandardMaterial({ color: gold, emissive: gold, emissiveIntensity: 1.2, roughness: .27, metalness: .18 })); crystal.position.y = 1.88; crystal.castShadow = true; group.add(crystal);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(.12, .72, 6.2, 12, 1, true), new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: .075, side: THREE.DoubleSide, depthWrite: false })); beam.position.y = 3.35; group.add(beam);
  const light = new THREE.PointLight(gold, 21, 15, 1.7); light.position.y = 2.1; group.add(light);
  return { group, crystal, halo, light };
}

const Index = () => {
  const { lang, setLang } = useLanguage();
  const t = UI_TRANSLATIONS[lang];
  const sceneRef = useRef<HTMLDivElement>(null);
  const player = useRef({ x: 0, z: 2 });
  const completedRef = useRef<string[]>([]);
  const keys = useRef(new Set<string>());
  const nearbyRef = useRef<Quest | null>(null);
  const [nearby, setNearby] = useState<Quest | null>(null);
  const [conversation, setConversation] = useState(0); const dialogueOpen = useRef(false); const activeNpc = useRef<string | null>(null); const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<Quest | null>(null);
  const [codexTab, setCodexTab] = useState<CodexTab | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [preview, setPreview] = useState<{ src: string; title: string } | null>(null);
  const [videoPrompt, setVideoPrompt] = useState(false);
  const [controllerName, setControllerName] = useState("");
  const controllerUI = useRef<(action: string) => void>(() => {});
  const [coords, setCoords] = useState({ x: 0, z: 2 });

  useEffect(() => {
    const mount = sceneRef.current; if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" }); }
    catch { mount.classList.add("webgl-failed"); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6)); renderer.setSize(mount.clientWidth, mount.clientHeight, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .96; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); scene.background = new THREE.Color("#b6ddeb"); scene.backgroundRotation.set(-.48, .78, 0); scene.fog = new THREE.FogExp2("#b6ddeb", .005);
    const camera = new THREE.PerspectiveCamera(54, mount.clientWidth / mount.clientHeight, .1, 320); camera.position.set(0, 8, 14);
    const ambient = new THREE.HemisphereLight("#e2f1ff", "#819266", 1.65); scene.add(ambient);
    const sun = new THREE.DirectionalLight("#fff0d6", 2.0); sun.position.set(-24, 38, 14); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -46; sun.shadow.camera.right = 46; sun.shadow.camera.top = 44; sun.shadow.camera.bottom = -44; sun.shadow.bias = -.00025; sun.shadow.normalBias = .025; scene.add(sun); scene.add(sun.target);
    const rim = new THREE.DirectionalLight("#c5c9af", .62); rim.position.set(24, 15, -48); scene.add(rim);
    const warmFill = new THREE.PointLight("#f4bf6b", 2.2, 100, 1.4); warmFill.position.set(0, 14, -45); scene.add(warmFill);

    let worldPanorama: THREE.Texture | null = null;
    const village = createVillage(scene);
    const samuraiRealm = createSamuraiRealm(scene);
    // Seven discovery beacons lead from the character profile through every portfolio chapter.
    const playerRoot = new THREE.Group(); playerRoot.position.set(0, groundHeight(0, 2), 2); scene.add(playerRoot);
    const knight = createKnight();
    const fallbackKnight = knight.root;
    fallbackKnight.visible = false;
    let characterReady = false;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("/ranger.glb", async (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      const headAsset = await gltfLoader.loadAsync("/ranger-head-source.glb");
      if (disposed) return;
      model.updateMatrixWorld(true);
      headAsset.scene.updateMatrixWorld(true);
      headAsset.scene.traverse(obj => {
        const mesh = obj as THREE.SkinnedMesh;
        if (!mesh.isSkinnedMesh) return;
        const geometry = mesh.geometry.clone(), indices = geometry.index;
        const joints = geometry.getAttribute("skinIndex"), weights = geometry.getAttribute("skinWeight");
        const retained: number[] = [];
        const isHead = (vertex: number) => {
          let influence = 0;
          for (let k = 0; k < 4; k++) {
            const name = mesh.skeleton.bones[joints.getComponent(vertex, k)]?.name;
            if (name === "Head" || name === "neck_01") influence += weights.getComponent(vertex, k);
          }
          return influence > .5;
        };
        for (let i = 0; i < (indices?.count ?? geometry.getAttribute("position").count); i += 3) {
          const a = indices ? indices.getX(i) : i, b = indices ? indices.getX(i + 1) : i + 1, c = indices ? indices.getX(i + 2) : i + 2;
          if (isHead(a) && isHead(b) && isHead(c)) retained.push(a, b, c);
        }
        if (!retained.length) return;
        geometry.setIndex(retained); geometry.clearGroups(); geometry.addGroup(0, retained.length, 0);
        const head = new THREE.SkinnedMesh(geometry, mesh.material);
        head.name = "RangerFace_" + mesh.name;
        const bones = mesh.skeleton.bones.map(bone => model.getObjectByName(bone.name) as THREE.Bone);
        if (bones.some(bone => !bone)) return;
        head.bind(new THREE.Skeleton(bones, mesh.skeleton.boneInverses.map(inverse => inverse.clone())), mesh.bindMatrix);
        head.castShadow = true; head.frustumCulled = false; model.add(head);
      });
      model.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const scale = 4.3 / Math.max(size.y, .01);
      model.scale.setScalar(scale);
      const center = bounds.getCenter(new THREE.Vector3());
      model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
      model.rotation.y = Math.PI;
      model.traverse(obj => { const mesh = obj as THREE.Mesh; if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; } });
      playerRoot.add(model); fallbackKnight.visible = false;
      const mixer = new THREE.AnimationMixer(model);
      const animationLibrary = await gltfLoader.loadAsync("/animated-character.glb"); if (disposed) return; const actions: Record<string, THREE.AnimationAction> = {};
      for (const name of ["Idle_Loop", "Walk_Loop", "Jog_Fwd_Loop", "Sprint_Loop"]) {
        const clip = animationLibrary.animations.find(item => item.name === name);
        if (clip) actions[name] = mixer.clipAction(clip);
      }
      actions.Idle_Loop?.play();
      playerRoot.userData.animationMixer = mixer;
      playerRoot.userData.actions = actions;
      playerRoot.userData.ranger = { model, mixer, actions, activeAction: "Idle_Loop" };
      playerRoot.userData.activeAction = "Idle_Loop"; characterReady = true;
      const villagerAsset = await gltfLoader.loadAsync("/villager.glb");
      const humanLoader = new FBXLoader();
      const [humanSamurai, idleMotion, walkMotion, runMotion, slashMotion, katanaAsset] = await Promise.all([
        humanLoader.loadAsync("/world/samurai/shadowflame/Character.fbx"),
        humanLoader.loadAsync("/world/samurai/shadowflame/Idle.fbx"),
        humanLoader.loadAsync("/world/samurai/shadowflame/Walk.fbx"),
        humanLoader.loadAsync("/world/samurai/shadowflame/Run.fbx"),
        humanLoader.loadAsync("/world/samurai/shadowflame/Slash.fbx"),
        gltfLoader.loadAsync("/world/samurai/Katana.glb"),
      ]);
      if (disposed) return;
      const humanClips = [idleMotion, walkMotion, runMotion, slashMotion].map((motion, index) => {
        const clip = motion.animations[0].clone();
        clip.name = ["Idle_Loop", "Walk_Loop", "Sprint_Loop", "Sword_Attack"][index];
        // The controller owns horizontal movement; preserve the animation's vertical hip motion.
        for (const track of clip.tracks) if (track.name.endsWith("Hips.position")) {
          for (let i = 0; i < track.values.length; i += 3) {
            track.values[i] = track.values[0]; track.values[i + 2] = track.values[2];
          }
        }
        return clip;
      });
      const talkClip = humanClips[0].clone(); talkClip.name = "Idle_Talking_Loop";
      const knightAsset = { scene: humanSamurai, animations: [...humanClips, talkClip] };
      const dressSamurai = (character: THREE.Object3D, role: "player" | "samurai" | "ayame" | "haru") => {
        const palette = { player: "#ffffff", samurai: "#a9bfd8", ayame: "#d9a8a3", haru: "#c7c0a2" };
        character.traverse(object => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const copies = materials.map(material => {
            const copy = material.clone() as THREE.MeshStandardMaterial;
            // Keep skin and metal recognizable; distinguish each NPC's cloth and armour.
            if (/armor|top|legs/.test(copy.name)) copy.color.multiply(new THREE.Color(palette[role]));
            return copy;
          });
          mesh.material = Array.isArray(mesh.material) ? copies : copies[0];
        });
        if (role === "haru") return; // The archivist is unarmed.
        const hand = character.getObjectByName("mixamorigRightHand");
        if (!hand) { console.warn("Samurai sword hand was not found"); return; }
        const sword = katanaAsset.scene.clone(true);
        sword.name = "EquippedKatana";
        const bounds = new THREE.Box3().setFromObject(sword), size = bounds.getSize(new THREE.Vector3());
        sword.scale.setScalar(112 / size.y); // Character skeleton is in centimetres.
        sword.rotation.set(Math.PI / 2, 0, Math.PI / 2);
        sword.position.set(0, 3, 0);
        sword.traverse(object => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.material = new THREE.MeshStandardMaterial({ color: role === "ayame" ? "#997047" : "#d9e1e5", metalness: role === "ayame" ? .05 : .82, roughness: role === "ayame" ? .8 : .25 });
          mesh.castShadow = true; mesh.receiveShadow = true;
        });
        hand.add(sword);
      };
      const knightClips = { Idle_Loop: "Idle_Loop", Walk_Loop: "Walk_Loop", Sprint_Loop: "Sprint_Loop" };
      const knightModel = cloneRig(knightAsset.scene);
      knightModel.updateMatrixWorld(true);
      const knightBox = new THREE.Box3().setFromObject(knightModel), knightScale = 4.3 / knightBox.getSize(new THREE.Vector3()).y;
      knightModel.scale.setScalar(knightScale); const knightCenter = knightBox.getCenter(new THREE.Vector3());
      knightModel.position.set(-knightCenter.x * knightScale, -knightBox.min.y * knightScale, -knightCenter.z * knightScale);
      dressSamurai(knightModel, "player");
      knightModel.rotation.y = Math.PI; knightModel.visible = false; playerRoot.add(knightModel);
      knightModel.traverse(o => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; } });
      const knightMixer = new THREE.AnimationMixer(knightModel), knightActions: Record<string, THREE.AnimationAction> = {};
      for (const [key, suffix] of Object.entries(knightClips)) { const clip = knightAsset.animations.find(c => c.name.split("|").pop() === suffix); if (clip) knightActions[key] = knightMixer.clipAction(clip); }
      knightActions.Idle_Loop?.play(); playerRoot.userData.samurai = { model: knightModel, mixer: knightMixer, actions: knightActions, activeAction: "Idle_Loop" };
      if (disposed) return;
      const hairAssets = await Promise.all(["Hair_Beard", "Hair_Buzzed", "Hair_Long", "Hair_SimpleParted"].map(name => gltfLoader.loadAsync(`/world/characters/${name}.glb`)));
      if (disposed) return;
      for (const quest of quests) {
        const npc = cloneRig(quest.x > 500 ? knightAsset.scene : villagerAsset.scene);
        // Every NPC owns a separate skeleton, mesh and transform.
        const heads = model.children.filter(child => child.name.startsWith("RangerFace_"));
        for (const source of quest.x > 500 ? [] : heads) {
          const mesh = source as THREE.SkinnedMesh;
          const bones = mesh.skeleton.bones.map(bone => npc.getObjectByName(bone.name) as THREE.Bone);
          if (bones.some(bone => !bone)) continue;
          const head = new THREE.SkinnedMesh(mesh.geometry, mesh.material);
          head.bind(new THREE.Skeleton(bones, mesh.skeleton.boneInverses.map(m => m.clone())), mesh.bindMatrix);
          head.name = source.name; head.frustumCulled = false; npc.add(head);
        }
        const hairChoice = quests.indexOf(quest) % hairAssets.length;
        hairAssets[hairChoice].scene.traverse(obj => {
          const source = obj as THREE.SkinnedMesh; if (!source.isSkinnedMesh || quest.x > 500) return;
          const bones = source.skeleton.bones.map(bone => npc.getObjectByName(bone.name) as THREE.Bone);
          if (bones.some(bone => !bone)) return;
          const hair = new THREE.SkinnedMesh(source.geometry, source.material);
          hair.name = "NpcHair"; hair.bind(new THREE.Skeleton(bones, source.skeleton.boneInverses.map(m => m.clone())), source.bindMatrix); hair.frustumCulled = false; npc.add(hair);
        });
        npc.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(npc), factor = 4.1 / box.getSize(new THREE.Vector3()).y;
        npc.scale.setScalar(factor); const center = box.getCenter(new THREE.Vector3());
        npc.position.set(-center.x * factor, -box.min.y * factor, -center.z * factor);
        if (quest.x > 500) dressSamurai(npc, quest.id as "samurai" | "ayame" | "haru");
        const npcRoot = new THREE.Group(); npcRoot.position.set(quest.x, groundHeight(quest.x, quest.z), quest.z); npcRoot.add(npc); scene.add(npcRoot);
        npc.traverse(obj => { const mesh = obj as THREE.Mesh; if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
          if (quest.x < 500 && !mesh.name.startsWith("RangerFace_")) { const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]; const palette = ["#cfc7a0", "#bc9a78", "#a9bdd4", "#bfb094", "#b8948b", "#b2c49a", "#c7b5d5", "#b7c3d2"]; const tinted = materials.map(mat => { const copy = mat.clone() as THREE.MeshStandardMaterial; copy.color.multiply(new THREE.Color(palette[quests.indexOf(quest) % palette.length])); return copy; }); mesh.material = Array.isArray(mesh.material) ? tinted : tinted[0]; }
        } });
        const labelCanvas = document.createElement("canvas"); labelCanvas.width = 256; labelCanvas.height = 64; const ctx = labelCanvas.getContext("2d")!; ctx.font = "20px Georgia"; ctx.textAlign = "center"; ctx.fillStyle = "#243929"; ctx.roundRect(20, 8, 216, 48, 12); ctx.fill(); ctx.fillStyle = "#f4edd6"; ctx.fillText(quest.title, 128, 39); const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(labelCanvas), transparent: true, depthTest: true })); label.scale.set(3.5, .87, 1); label.position.y = 5.15; npcRoot.add(label);
        const npcMixer = new THREE.AnimationMixer(npc);
        const samuraiClips = knightAsset.animations;
        const idle = quest.x > 500 ? samuraiClips.find(clip => clip.name === "Idle_Loop") : animationLibrary.animations.find(clip => clip.name === "Idle_Loop");
        const talk = quest.x > 500 ? samuraiClips.find(clip => clip.name === "Idle_Talking_Loop") : animationLibrary.animations.find(clip => clip.name === "Idle_Talking_Loop");
        const idleAction = idle ? npcMixer.clipAction(idle).play() : null;
        const talkAction = talk ? npcMixer.clipAction(talk) : null;
        const patrol = ["guide", "skills", "contact", "traveller", "ayame"].includes(quest.id);
        const routineClip = quest.x > 500 ? samuraiClips.find(c => c.name === (patrol ? "Walk_Loop" : quest.id === "samurai" ? "Sword_Attack" : "Idle_Loop")) : animationLibrary.animations.find(c => c.name === (patrol ? "Walk_Loop" : quest.id === "work" ? "Fixing_Kneeling" : "PickUp_Table"));
        const routine = routineClip ? npcMixer.clipAction(routineClip) : null;
        if (patrol) routine?.setEffectiveTimeScale(.55);
        npcMixers.push(npcMixer); npcActors.push({ id: quest.id, root: npcRoot, idle: idleAction, talk: talkAction, routine, home: { x: quest.x, z: quest.z }, patrol, speaking: false, state: "idle" });
      }
    }, undefined, error => { fallbackKnight.visible = true; console.error("Character loading failed", error); });
    playerRoot.add(fallbackKnight);
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(.83, 24), new THREE.MeshBasicMaterial({ color: "#0d100d", transparent: true, opacity: .56, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, .065, 2); scene.add(shadow);
    const sites: ReturnType<typeof addBeacon>[] = [];

    const moteCount = 160, motePositions = new Float32Array(moteCount * 3), moteData: Array<{ x: number; y: number; z: number; speed: number }> = [];
    for (let i = 0; i < moteCount; i++) { const x = (noise(i + 81) - .5) * 145, z = 14 - noise(i * 3 + 10) * 150, y = .5 + noise(i * 5 + 33) * 18; moteData.push({ x, y, z, speed: .22 + noise(i + 19) * .8 }); motePositions[i * 3] = x; motePositions[i * 3 + 1] = y; motePositions[i * 3 + 2] = z; }
    const moteGeometry = new THREE.BufferGeometry(); moteGeometry.setAttribute("position", new THREE.BufferAttribute(motePositions, 3)); const motes = new THREE.Points(moteGeometry, new THREE.PointsMaterial({ color: "#f1ca78", size: .16, transparent: true, opacity: .8, depthWrite: false, sizeAttenuation: true })); scene.add(motes);
    const mists: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[] = [];
    for (let i = 0; i < 8; i++) { const fog = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshBasicMaterial({ color: i % 2 ? "#bdc3b8" : "#d0bd95", transparent: true, opacity: .055, depthWrite: false })); fog.scale.set(15 + (i % 3) * 5, .48, 3.7); fog.position.set(-34 + i * 10, .76 + (i % 3) * .16, -12 - i * 13); scene.add(fog); mists.push(fog); }

    const held = keys.current; let frame = 0, last = 0, lastUi = 0, disposed = false;
    const resize = () => { if (!mount.clientWidth || !mount.clientHeight) return; renderer.setSize(mount.clientWidth, mount.clientHeight, false); camera.aspect = mount.clientWidth / mount.clientHeight; camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(mount);
    let lastInterior: THREE.Group | null = null;
    let cameraYaw = 0, cameraPitch = .32, cameraDistance = 19, dragging = false, pointerX = 0, pointerY = 0;
    const canvas = renderer.domElement;
    canvas.style.touchAction = "none";
    canvas.title = "Drag to rotate camera · Scroll to zoom · Shift to run";
    const pointerDown = (e: PointerEvent) => { dragging = true; pointerX = e.clientX; pointerY = e.clientY; canvas.setPointerCapture(e.pointerId); };
    const pointerMove = (e: PointerEvent) => { if (!dragging) return; cameraYaw -= (e.clientX - pointerX) * .006; cameraPitch = THREE.MathUtils.clamp(cameraPitch + (e.clientY - pointerY) * .004, .12, 1.1); pointerX = e.clientX; pointerY = e.clientY; };
    const pointerUp = () => { dragging = false; };
    const zoom = (e: WheelEvent) => { e.preventDefault(); cameraDistance = THREE.MathUtils.clamp(cameraDistance + e.deltaY * .012, 7, 30); };
    canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointermove", pointerMove); canvas.addEventListener("pointerup", pointerUp); canvas.addEventListener("pointercancel", pointerUp); canvas.addEventListener("wheel", zoom, { passive: false });
    const npcMixers: THREE.AnimationMixer[] = [];
    let padIdentity = "", previousPadButtons = new Set<string>(), previousPadIndex = -1;
    const interact = () => {
      if (dialogueOpen.current) return;
      const portal = portalSites.find(site => Math.hypot(site.x - player.current.x, site.z - player.current.z) < 4);
      if (portal) { if (portal.target.x > 500 && !playerRoot.userData.samurai) return; nearbyRef.current = null; setNearby(null); player.current.x = portal.target.x; player.current.z = portal.target.z; camera.position.set(portal.target.x, groundHeight(portal.target.x, portal.target.z) + 8, portal.target.z + 17); }
      else if (nearbyRef.current) { const quest = nearbyRef.current; setConversation(0); setPage(0); setVideoPrompt(false); setDialog(quest); setCompleted(list => list.includes(quest.id) ? list : [...list, quest.id]); }
    };
    const npcActors: { id: string; root: THREE.Group; idle: THREE.AnimationAction | null; talk: THREE.AnimationAction | null; routine: THREE.AnimationAction | null; home: { x: number; z: number }; patrol: boolean; speaking: boolean; state: string }[] = []; const clock = new THREE.Clock(); let gaitTime = 0, gaitWeight = 0;
    const animate = (now: number) => {
      if (disposed) return; const dt = Math.min(clock.getDelta(), .045); npcMixers.forEach(mixer => mixer.update(dt)); const p = player.current;
      const pad = readController();
      const identity = pad.id || (pad.unsupported ? "Switch your controller to XInput mode" : "");
      if (identity !== padIdentity) { padIdentity = identity; setControllerName(identity); }
      if (pad.index !== previousPadIndex) { previousPadButtons.clear(); previousPadIndex = pad.index; }
      const padButtons = new Set([...["confirm", "back", "previous", "next", "up", "down", "menu"].filter(key => pad[key as keyof typeof pad] === true)]);
      for (const action of padButtons) if (document.hasFocus() && !previousPadButtons.has(action)) {
        if (action === "confirm" && !dialogueOpen.current) interact();
        else if (dialogueOpen.current) controllerUI.current(action);
      }
      previousPadButtons = padButtons;
      if (!dialogueOpen.current && document.hasFocus()) { cameraYaw -= pad.cameraX * dt * 2.2; cameraPitch = THREE.MathUtils.clamp(cameraPitch + pad.cameraY * dt * 1.4, .12, 1.1); }
      let dx = Number(held.has("d") || held.has("arrowright")) - Number(held.has("a") || held.has("arrowleft")); let dz = Number(held.has("s") || held.has("arrowdown")) - Number(held.has("w") || held.has("arrowup"));
      if (document.hasFocus()) { dx += pad.x; dz += pad.z; } else { dx = 0; dz = 0; }
      if (dialogueOpen.current) { dx = 0; dz = 0; }
      const inputMagnitude = Math.hypot(dx, dz); if (inputMagnitude > 1) { dx /= inputMagnitude; dz /= inputMagnitude; } const inputX = dx; const movementYaw = village.getInterior() ? Math.atan2(camera.position.x - p.x, camera.position.z - p.z) : cameraYaw; dx = inputX * Math.cos(movementYaw) + dz * Math.sin(movementYaw); dz = -inputX * Math.sin(movementYaw) + dz * Math.cos(movementYaw);
      const running = held.has("shift") || pad.sprint; const speed = running ? 12.2 : 7.2, nx = THREE.MathUtils.clamp(p.x + dx * speed * dt, p.x > 500 ? 945 : -90, p.x > 500 ? 1055 : 90), nz = THREE.MathUtils.clamp(p.z + dz * speed * dt, -100, 45);
      const radius = .65;
      const blocked = (x: number, z: number) => (x > 500 ? samuraiRealm.isBlocked(x, z, radius) : village.isBlocked(x, z, radius)) || npcActors.some(actor => actor.root.visible && Math.hypot(x - actor.root.position.x, z - actor.root.position.z) < 1.25);
      const previousX = p.x, previousZ = p.z;
      if (!blocked(nx, nz)) { p.x = nx; p.z = nz; }
      else {
        // Keep the free component of movement when brushing a wall or villager.
        if (!blocked(nx, p.z)) p.x = nx;
        if (!blocked(p.x, nz)) p.z = nz;
      }
      const movedX = p.x - previousX, movedZ = p.z - previousZ;
      village.update(now, p);
      const inSamuraiRealm = p.x > 500;
      village.setVisible(!inSamuraiRealm); samuraiRealm.root.visible = inSamuraiRealm; samuraiRealm.update(now);
      npcActors.forEach(actor => { actor.root.visible = (actor.home.x > 500) === inSamuraiRealm; });
      motes.visible = !inSamuraiRealm; mists.forEach(m => { m.visible = !inSamuraiRealm; });
      sun.position.set(p.x - 24, 38, p.z + 14); sun.target.position.set(p.x, 0, p.z);
      const skyColor = new THREE.Color(inSamuraiRealm ? "#dfb9bd" : "#b6ddeb");
      if (scene.background instanceof THREE.Color) scene.background.lerp(skyColor, .025);
      scene.fog?.color.lerp(skyColor, .025);
      if (scene.fog instanceof THREE.FogExp2) scene.fog.density = inSamuraiRealm ? .009 : .005;
      ambient.color.lerp(new THREE.Color(inSamuraiRealm ? "#ffe8dd" : "#e2f1ff"), .025);
      ambient.groundColor.lerp(new THREE.Color(inSamuraiRealm ? "#667352" : "#819266"), .025);
      sun.color.lerp(new THREE.Color(inSamuraiRealm ? "#ffd1a8" : "#fff0d6"), .025);
      sun.intensity = THREE.MathUtils.lerp(sun.intensity, inSamuraiRealm ? 2.2 : 2, .025);
      npcActors.forEach(actor => {
        const distance = Math.hypot(actor.root.position.x - p.x, actor.root.position.z - p.z);
        const speaking = activeNpc.current === actor.id;
        const attentive = distance < 5 || speaking;
        const state = speaking ? "talk" : attentive ? "idle" : "routine";
        if (state !== actor.state) {
          const previous = actor.state === "talk" ? actor.talk : actor.state === "routine" ? actor.routine : actor.idle;
          const next = state === "talk" ? actor.talk : state === "routine" ? actor.routine ?? actor.idle : actor.idle;
          if (next !== previous) { next?.reset().play(); if (next) previous?.crossFadeTo(next, .3, false); }
          actor.state = state;
        }
        actor.speaking = speaking;
        if (attentive) actor.root.rotation.y = Math.atan2(p.x - actor.root.position.x, p.z - actor.root.position.z);
        else if (actor.patrol) {
          const angle = now * .00055 + quests.findIndex(q => q.id === actor.id);
          const targetX = actor.home.x + Math.sin(angle) * 2, targetZ = actor.home.z + Math.cos(angle) * 2;
          const vx = targetX - actor.root.position.x, vz = targetZ - actor.root.position.z;
          const step = Math.min(1, dt * 2);
          const x = actor.root.position.x + vx * step, z = actor.root.position.z + vz * step;
          if (!village.isBlocked(x, z, .55)) { actor.root.position.set(x, groundHeight(x, z), z); actor.root.rotation.y = Math.atan2(vx, vz); }
        }
      });
      const walking = Math.hypot(movedX, movedZ) > .0001; gaitWeight = THREE.MathUtils.lerp(gaitWeight, walking ? 1 : 0, 1 - Math.exp(-10 * dt)); gaitTime += dt * 1000 * (speed / 7.2); const y = groundHeight(p.x, p.z); playerRoot.position.set(p.x, y, p.z); const facing = Math.atan2(-movedX, -movedZ); playerRoot.rotation.y += walking ? Math.atan2(Math.sin(facing - playerRoot.rotation.y), Math.cos(facing - playerRoot.rotation.y)) * (1 - Math.exp(-12 * dt)) : 0;  const actor = (inSamuraiRealm ? playerRoot.userData.samurai : null) ?? playerRoot.userData.ranger;
      if (playerRoot.userData.ranger) playerRoot.userData.ranger.model.visible = actor === playerRoot.userData.ranger;
      if (playerRoot.userData.samurai) playerRoot.userData.samurai.model.visible = actor === playerRoot.userData.samurai;
      const mixer = actor?.mixer as THREE.AnimationMixer | undefined; mixer?.update(dt); if (characterReady && actor) {
        const actions = actor.actions as Record<string, THREE.AnimationAction>;
        const next = walking ? running ? "Sprint_Loop" : "Walk_Loop" : "Idle_Loop";
        const previous = actor.activeAction as string;
        if (walking) actions[next]?.setEffectiveTimeScale(Math.max(.3, Math.min(1, inputMagnitude)));
        if (next !== previous && actions[next]) {
          actions[next].reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
          actions[previous]?.crossFadeTo(actions[next], .22, false);
          actor.activeAction = next;
        }
      } else animateKnight(knight, now, walking, dx);shadow.position.set(p.x, y + .068, p.z); shadow.scale.setScalar(walking ? 1.08 : 1);
      const interior = village.getInterior();
      const cameraTarget = new THREE.Vector3();
      const lookTarget = new THREE.Vector3(p.x, y + 2.3, p.z);
      if (interior) {
        // A room camera, under the roof and clear of the walls. Drag/right stick
        // can shift its angle without ever taking it outside the room.
        const localPlayer = interior.worldToLocal(new THREE.Vector3(p.x, y, p.z));
        const localCamera = new THREE.Vector3(
          THREE.MathUtils.clamp(localPlayer.x + Math.sin(cameraYaw + .55) * 2.6, -2.4, 2.4),
          THREE.MathUtils.clamp(2.1 + (cameraPitch - .32) * .45, 1.8, 2.6),
          THREE.MathUtils.clamp(localPlayer.z + Math.cos(cameraYaw + .55) * 2.6, -3.35, 3.35),
        );
        cameraTarget.copy(interior.localToWorld(localCamera));
      } else {
        cameraTarget.set(p.x + Math.sin(cameraYaw) * Math.cos(cameraPitch) * cameraDistance, y + 2.3 + Math.sin(cameraPitch) * cameraDistance, p.z + Math.cos(cameraYaw) * Math.cos(cameraPitch) * cameraDistance);
        const focus = new THREE.Vector3(p.x, y + 2.8, p.z);
        const ray = new THREE.Raycaster(focus, cameraTarget.clone().sub(focus).normalize(), .4, cameraDistance);
        const obstruction = ray.intersectObjects(inSamuraiRealm ? samuraiRealm.cameraMeshes : village.cameraMeshes, true)[0];
        if (obstruction) cameraTarget.copy(focus).addScaledVector(ray.ray.direction, Math.max(2.2, obstruction.distance - .6));
      }
      // Snap across the walls once; smooth movement continues within each view.
      if (interior !== lastInterior) camera.position.copy(cameraTarget);
      else camera.position.lerp(cameraTarget, 1 - Math.exp(-9 * dt));
      lastInterior = interior;
      const targetFov = interior ? 68 : 54;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.exp(-8 * dt));
      camera.updateProjectionMatrix();
      camera.lookAt(lookTarget);

      sites.forEach((site, i) => { const pulse = 1 + Math.sin(now * .0028 + i * 1.7) * .11; site.crystal.position.y = 1.9 + Math.sin(now * .0019 + i) * .17; site.crystal.rotation.y += dt * .62; site.crystal.rotation.x = now * .00045; site.halo.scale.setScalar(pulse); site.light.intensity = 15 + Math.sin(now * .003 + i) * 4; });
      mists.forEach((cloud, i) => { cloud.position.x += dt * (.27 + i * .025); if (cloud.position.x > 46) cloud.position.x = -48; cloud.material.opacity = .035 + (Math.sin(now * .0004 + i) + 1) * .016; });
      const pos = moteGeometry.attributes.position as THREE.BufferAttribute; for (let i = 0; i < moteCount; i++) { const m = moteData[i]; pos.array[i * 3] = m.x + Math.sin(now * .00025 + m.x) * .7; pos.array[i * 3 + 1] = m.y + Math.sin(now * .001 + i) * .8; pos.array[i * 3 + 2] = ((m.z + now * .0002 * m.speed + 160) % 160) - 145; } pos.needsUpdate = true;
      const nearbyActor = npcActors.find(actor => actor.root.visible && Math.hypot(actor.root.position.x - p.x, actor.root.position.z - p.z) < 2.8);
      const q = quests.find(item => item.id === nearbyActor?.id) || null;
      if (nearbyRef.current?.id !== q?.id) { nearbyRef.current = q; setNearby(q); }
      if (now - lastUi > 170) { setCoords({ x: Math.round(p.x), z: Math.round(p.z) }); lastUi = now; }
      renderer.render(scene, camera); frame = requestAnimationFrame(animate);
    };
    const keydown = (e: KeyboardEvent) => { const k = e.key.toLowerCase(); if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault(); held.add(k); if ((k === "e" || k === "enter") && !e.repeat && !(e.target instanceof HTMLButtonElement) && !(e.target instanceof HTMLAnchorElement)) interact(); if (k === "escape") controllerUI.current("back"); };
    const keyup = (e: KeyboardEvent) => { held.delete(e.key.toLowerCase()); };
    const blur = () => held.clear(); window.addEventListener("keydown", keydown); window.addEventListener("keyup", keyup); window.addEventListener("blur", blur); frame = requestAnimationFrame(animate);
    return () => { disposed = true; village.dispose(); samuraiRealm.dispose(); canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointermove", pointerMove); canvas.removeEventListener("pointerup", pointerUp); canvas.removeEventListener("pointercancel", pointerUp); canvas.removeEventListener("wheel", zoom); cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("keydown", keydown); window.removeEventListener("keyup", keyup); window.removeEventListener("blur", blur); scene.traverse(obj => { const node = obj as THREE.Mesh; node.geometry?.dispose?.(); const mat = node.material; if (Array.isArray(mat)) mat.forEach(m => m.dispose()); else mat?.dispose?.(); }); renderer.dispose(); renderer.domElement.remove(); };
  }, []);

  useEffect(() => {
    const root = document.querySelector(preview ? ".image-preview" : ".npc-conversation");
    if (root) { const choice = root.querySelector<HTMLElement>(preview ? "button" : ".npc-choices button"); choice?.focus(); }
    else if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, [dialog, preview]);
  dialogueOpen.current = Boolean(dialog || preview); activeNpc.current = dialog?.id ?? null;
  const data = getPortfolioData(lang);
  const local = (en: string, fr: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;
  const translatedBodies: Record<string, [string, string]> = {
    guide: ["Bienvenue à Aster. Je garde les histoires des voyageurs. Marouane est l’un d’eux. Que souhaitez-vous savoir ?", "مرحباً بك في أستر. أحتفظ بقصص المسافرين، ومروان أحدهم. ماذا تريد أن تعرف؟"],
    work: ["Bienvenue ! Je répare les objets du village. Pour découvrir les projets de Marouane, rendez visite à Ayame à Akari en passant par le portail.", "أهلاً! أصلح أغراض القرية. لاكتشاف مشاريع مروان، زر أيامي في أكاري عبر البوابة."],
    study: ["Bienvenue dans mon bureau. Parlons des études et de l’expérience de Marouane.", "مرحباً بك في مكتبي. لنتحدث عن دراسة مروان وخبراته."],
    certificates: ["Je conserve les preuves de l’apprentissage. Voici les certifications de Marouane.", "أجمع أدلة التعلم. هذه شهادات مروان."],
    honors: ["Une médaille marque un instant. Les efforts racontent l’histoire. Voici ses réussites.", "الميدالية تخلّد لحظة، والجهد يروي القصة. هذه إنجازاته."],
    skills: ["Chaque métier a ses outils : React, TypeScript, Laravel, Spring Boot, SQL, Docker et bien plus.", "لكل حرفة أدواتها: React وTypeScript وLaravel وSpring Boot وSQL وDocker وغيرها."],
    contact: ["Une nouvelle aventure commence par un message. Vous avez un projet ? Contactez Marouane.", "تبدأ المغامرة برسالة. لديك مشروع؟ تواصل مع مروان."],
    ayame: ["Bienvenue au dojo. La discipline se construit par la pratique. Découvrez les projets de Marouane et leurs défis.", "مرحباً بك في الدوجو. الانضباط ينمو بالممارسة. اكتشف مشاريع مروان والتحديات التي واجهها."],
    haru: ["Je conserve les preuves des études et certifications de Marouane. Que souhaitez-vous découvrir ?", "أحتفظ بسجلات دراسة مروان وشهاداته. ماذا تريد أن تكتشف؟"],
    samurai: ["Bienvenue au village d’Akari. La porte vous ramène au village d’Aster.", "مرحباً بك في قرية أكاري. تعيدك البوابة إلى قرية أستر."],
    traveller: ["Le bosquet est calme aujourd’hui. Restez un moment. Les pauses font aussi partie du voyage.", "البستان هادئ اليوم. ابقَ قليلاً. الاستراحة جزء جميل من الرحلة."],
  };
  const dialogBody = dialog ? lang === "en" ? dialog.body : translatedBodies[dialog.id]?.[lang === "fr" ? 0 : 1] ?? dialog.body : "";
  controllerUI.current = action => {
    if (action === "back" || action === "menu") { if (preview) setPreview(null); else if (videoPrompt) setVideoPrompt(false); else { setDialog(null); setConversation(0); } return; }
    const root = document.querySelector(preview ? ".image-preview" : ".npc-conversation");
    if (!root) return;
    const controls = Array.from(root.querySelectorAll<HTMLElement>("button:not(:disabled),a[href]"));
    const focused = controls.indexOf(document.activeElement as HTMLElement);
    if (action === "up" || action === "previous") controls[(focused - 1 + controls.length) % controls.length]?.focus();
    if (action === "down" || action === "next") controls[(focused + 1) % controls.length]?.focus();
    if (action === "confirm") { if (focused < 0) controls.find(control => control.closest(".npc-choices"))?.focus(); else controls[focused]?.click(); }
  };
  const currentProject = dialog?.tab === "projects" ? data.projects[page] : null;
  const videoUrl = currentProject ? currentProject.kind === "video" ? currentProject.url : currentProject.extraUrl.includes("youtube.com/watch") ? currentProject.extraUrl : "" : "";
  const portalNearby = portalSites.find(site => Math.hypot(site.x - coords.x, site.z - coords.z) < 4);
  const touchKey = (key: string, pressed: boolean) => { if (pressed) keys.current.add(key); else keys.current.delete(key); };
  const mapX = (x: number) => `${8 + (x + 43) / 86 * 84}%`;
  const mapY = (z: number) => `${5 + (16 - z) / 196 * 90}%`;
  return (
    <main className="rpg-game" aria-label="Explore Aster, an interactive fantasy portfolio village">
      <div className="game-topbar"><a className="game-logo" href="#" aria-label="Marouane Mahboub home"><span>✳</span> MAROUANE <b> / QUEST LOG</b></a><div className="top-location"><span className="location-pulse" />{nearby?.title ?? (coords.x > 500 ? "AKARI · SAMURAI VILLAGE" : "ASTER · THE TRAVELLER’S VILLAGE")}</div><div className="game-top-actions"><div className="language-switch" aria-label="Language"><button onClick={() => setLang(lang === "en" ? "fr" : lang === "fr" ? "ar" : "en")}>{lang.toUpperCase()} <span>⌄</span></button><div className="language-menu">{([["en", "English"], ["fr", "Français"], ["ar", "العربية"]] as const).map(([value, label]) => <button key={value} className={lang === value ? "selected" : ""} onClick={() => setLang(value)}>{label}{lang === value && <span>✦</span>}</button>)}</div></div><button className="top-tag codex-open" onClick={() => setCodexTab("projects")}><BookOpen size={13} />{lang === "fr" ? "PORTFOLIO COMPLET" : lang === "ar" ? "المعرض الكامل" : "OPEN PORTFOLIO"}</button></div></div>
      <section className="game-window"><div ref={sceneRef} className="three-world" role="img" aria-label="Explore the village with WASD or arrows. Press E near a villager or portal. Drag to rotate the camera." />
        <div className="game-hud"><div className="hud-portrait"><span>MM</span><i /></div><div className="hud-info"><b>THE WAYFINDER</b><span>{data.profile.role.toUpperCase()} · SDIA MASTER</span><div className="xp-track"><i style={{ width: `${16 + completed.length * 12}%` }} /></div></div><div className="hud-objective"><small>{lang === "fr" ? "QUÊTE EN COURS" : lang === "ar" ? "المهمة الحالية" : "ACTIVE QUEST"}</small><b>{completed.length === quests.length ? (lang === "fr" ? "Toutes les étapes accomplies" : lang === "ar" ? "اكتملت الرحلة" : "All chapters explored") : nearby ? (completed.includes(nearby.id) ? `REVISIT: ${nearby.title}` : `DISCOVER: ${nearby.title}`) : `${lang === "fr" ? "Chapitres du portfolio" : lang === "ar" ? "فصول المعرض" : "Portfolio chapters"} · ${completed.length}/${quests.length}`}</b><span>{nearby ? (lang === "fr" ? "Appuyez sur E pour explorer" : lang === "ar" ? "اضغط E للاستكشاف" : "Press E to explore") : (lang === "fr" ? "Rencontrez Rowan dans le sanctuaire" : lang === "ar" ? "قابل روان في الملاذ" : coords.x > 500 ? "Meet Ren · Explore the dojo · Speak with Haru" : "Meet the villagers · Explore the houses")}</span></div><div className="hud-coords">X {coords.x} <span>/</span> Z {coords.z}</div></div>
        {nearby && !dialog && <button className="interact-prompt" onClick={() => { setConversation(0); setPage(0); setDialog(nearby); setCompleted(list => list.includes(nearby.id) ? list : [...list, nearby.id]); }}><kbd>E</kbd> SPEAK WITH {nearby.title}</button>}
        {portalNearby && !dialog && <button className="interact-prompt" onClick={() => { player.current.x = portalNearby.target.x; player.current.z = portalNearby.target.z; }}><kbd>E</kbd> ENTER · {portalNearby.destination}</button>}
        <div className="world-legend"><span><i className="legend-dot gold" />{lang === "fr" ? "CHAPITRE À DÉCOUVRIR" : lang === "ar" ? "فصل جديد" : "DISCOVER A CHAPTER"}</span><span><i className="legend-dot green" />{lang === "fr" ? "MONDE SÛR" : lang === "ar" ? "عالم آمن" : "SAFE GROUND"}</span></div>
        <div className="controller-status">{controllerName ? <><b>🎮 {local("Controller connected", "Manette connectée", "وحدة التحكم متصلة")}</b><span>{controllerName.includes("XInput mode") ? controllerName : "Left stick / D-pad · Right stick camera · RT / L3 run · A interact · B back"}</span></> : <span>{local("Controller: connect and press a button", "Manette : connectez-la et appuyez sur un bouton", "التحكم: صِل الجهاز واضغط زراً")}</span>}</div>
        <a className="model-attribution" href="/asset-credits.html" target="_blank" rel="noreferrer">Asset credits · Sources &amp; licenses</a>
        <div className="minimap"><div className="map-path" /><span className="map-player" style={{ left: mapX(player.current.x), top: mapY(player.current.z) }} />{quests.map(q => <i key={q.id} title={q.title} style={{ left: mapX(q.x), top: mapY(q.z) }} />)}</div>
        <div className="touch-pad" aria-label="Movement controls"><button className="pad-up" onPointerDown={() => touchKey("arrowup", true)} onPointerUp={() => touchKey("arrowup", false)} onPointerLeave={() => touchKey("arrowup", false)}><ArrowUp /></button><button className="pad-left" onPointerDown={() => touchKey("arrowleft", true)} onPointerUp={() => touchKey("arrowleft", false)} onPointerLeave={() => touchKey("arrowleft", false)}><ArrowLeft /></button><button className="pad-down" onPointerDown={() => touchKey("arrowdown", true)} onPointerUp={() => touchKey("arrowdown", false)} onPointerLeave={() => touchKey("arrowdown", false)}><ArrowDown /></button><button className="pad-right" onPointerDown={() => touchKey("arrowright", true)} onPointerUp={() => touchKey("arrowright", false)} onPointerLeave={() => touchKey("arrowright", false)}><ArrowRight /></button></div>
        <div className="game-instructions"><span>WASD <i>OR</i> ARROW KEYS <span className="instruction-divider">·</span> SHIFT TO SPRINT · DRAG TO LOOK</span><span>{lang === "fr" ? "TROUVEZ UN CHAPITRE" : lang === "ar" ? "اعثر على فصل" : "TALK / ENTER PORTAL"} <b>→</b> PRESS <kbd>E</kbd></span></div>
      </section>
      {dialog && <section className="npc-conversation" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="npc-speaker"><span>✦</span><div><small>{dialog.subtitle}</small><h2 id="dialog-title">{dialog.title}</h2></div><button aria-label="Close conversation" onClick={() => { setDialog(null); setConversation(0); }}><X /></button></div>
        <p>{conversation === 0 ? dialogBody : dialog.id === "guide" ? conversation === 1 ? local("Marouane is a software engineer and Master’s student in Distributed Systems & AI. He builds web, mobile and desktop applications, explores RAG and multi-agent AI, and works with Git, Docker and Linux.", "Marouane est ingénieur logiciel et étudiant en master Systèmes distribués et IA. Web, mobile, desktop, RAG, systèmes multi-agents, Git, Docker et Linux font partie de son parcours.", "مروان مهندس برمجيات وطالب ماستر الأنظمة الموزعة والذكاء الاصطناعي. يبني تطبيقات الويب والجوال وسطح المكتب، ويستكشف RAG والوكلاء ويستخدم Git وDocker وLinux.") : local("He won first place nationally in Web Technologies at WorldSkills Morocco. His journey continues through study, real projects, and competition.", "Il a remporté la première place nationale en technologies web à WorldSkills Maroc. Son parcours continue à travers les études, les projets et la compétition.", "حصل على المركز الأول وطنياً في تقنيات الويب في WorldSkills المغرب، ويواصل مسيرته بالدراسة والمشاريع والمنافسة.") : dialogBody}</p>
        {conversation > 0 && currentProject && <div className="npc-evidence">
          {currentProject.image ? <button className="evidence-image" onClick={() => setPreview({ src: currentProject.image, title: currentProject.title })} aria-label={local("Enlarge project image", "Agrandir l’image du projet", "تكبير صورة المشروع")}><img src={currentProject.image} alt={currentProject.title} /><span>{local("View image ↗", "Voir l’image ↗", "عرض الصورة ↗")}</span></button> : <div className="project-art"><span>✧</span><small>{currentProject.tags.join(" · ")}</small></div>}
          <div><small>{local("PROJECT", "PROJET", "مشروع")} {page + 1} / {data.projects.length}</small><h3>{currentProject.title}</h3><p>{currentProject.description}</p><div className="evidence-actions">{videoUrl ? <button onClick={() => setVideoPrompt(true)}>{local("Would you like the video demo?", "Voir la démonstration vidéo ?", "هل تريد مشاهدة العرض بالفيديو؟")}</button> : <a href={currentProject.url} target="_blank" rel="noreferrer">{local("Open project ↗", "Ouvrir le projet ↗", "فتح المشروع ↗")}</a>}</div></div>
        </div>}
        {videoPrompt && videoUrl && <div className="video-question"><p>{local("Shall we watch this project on YouTube?", "Regarder ce projet sur YouTube ?", "هل نشاهد هذا المشروع على يوتيوب؟")}</p><a href={videoUrl} target="_blank" rel="noreferrer">{local("Yes, open YouTube ↗", "Oui, ouvrir YouTube ↗", "نعم، افتح يوتيوب ↗")}</a><button onClick={() => setVideoPrompt(false)}>{local("Stay here", "Rester ici", "البقاء هنا")}</button></div>}
        {conversation > 0 && dialog.tab === "certifications" && <div className="npc-evidence">
          {data.certifications[page].image ? <button className="evidence-image" onClick={() => setPreview({ src: data.certifications[page].image, title: data.certifications[page].title })} aria-label={local("Enlarge certificate", "Agrandir le certificat", "تكبير الشهادة")}><img src={data.certifications[page].image} alt={data.certifications[page].title} /><span>{local("View certificate ↗", "Voir le certificat ↗", "عرض الشهادة ↗")}</span></button> : <div className="project-art"><span>◈</span><small>{local("Certificate image coming soon", "Image du certificat à venir", "صورة الشهادة قريباً")}</small></div>}
          <div><small>{data.certifications[page].issuer}</small><h3>{data.certifications[page].title}</h3><p>{data.certifications[page].date}</p><small>{data.certifications[page].credentialId}</small>{data.certifications[page].credential && <p><a href={data.certifications[page].credential} target="_blank" rel="noreferrer">{local("Verify credential ↗", "Vérifier le certificat ↗", "التحقق من الشهادة ↗")}</a></p>}</div>
        </div>}
        {conversation > 0 && dialog.tab === "experience" && <div className="npc-entry"><small>{data.experiences[page].period}</small><h3>{data.experiences[page].title}</h3><p>{data.experiences[page].description}</p></div>}
        {conversation > 0 && dialog.tab === "awards" && dialog.id !== "traveller" && <div className="npc-entry"><h3>{data.awards[page].title}</h3><p>{data.awards[page].description}</p></div>}
        {dialog.tab === "skills" && <div className="npc-skill-groups">{skillGroups.map(group => <div key={group.key}><small>{group.key.toUpperCase()}</small><p>{group.skills.join(" · ")}</p></div>)}</div>}
        {dialog.tab === "contact" && <div className="npc-entry"><a href="mailto:marouane.ma7boub@gmail.com">marouane.ma7boub@gmail.com ↗</a></div>}
        <div className="npc-choices">
          {dialog.id === "guide" ? <><button onClick={() => setConversation(1)}>{local("Who is Marouane?", "Qui est Marouane ?", "من هو مروان؟")}</button><button onClick={() => setConversation(2)}>{local("What has he achieved?", "Ses réussites ?", "ما إنجازاته؟")}</button></> : !["work", "traveller", "samurai", "skills", "contact"].includes(dialog.id) ? <><button onClick={() => { setConversation(1); setPage(0); }}>{local("Show me.", "Montrez-moi.", "أرني.")}</button>{conversation > 0 && <button onClick={() => { setVideoPrompt(false); setPage((page + 1) % (dialog.tab === "projects" ? data.projects.length : dialog.tab === "certifications" ? data.certifications.length : dialog.tab === "awards" ? data.awards.length : data.experiences.length)); }}>{local("Next story →", "Histoire suivante →", "القصة التالية ←")}</button>}</> : null}
          <button onClick={() => { setDialog(null); setConversation(0); }}>{local("Farewell.", "À bientôt.", "إلى اللقاء.")}</button>
        </div>
      </section>}
      {preview && <section className="image-preview" role="dialog" aria-modal="true" aria-label={preview.title}><button className="preview-close" onClick={() => setPreview(null)} aria-label={local("Close image", "Fermer l’image", "إغلاق الصورة")}><X /></button><img src={preview.src} alt={preview.title} /><p>{preview.title}</p></section>}
      {codexTab && <Suspense fallback={<div className="codex-loading" role="status">OPENING THE PORTFOLIO ARCHIVE <i /></div>}><PortfolioCodex key={codexTab} initialTab={codexTab} onClose={() => setCodexTab(null)} /></Suspense>}
    </main>
  );
};
export default Index;














