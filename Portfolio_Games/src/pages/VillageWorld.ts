import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const villageHeight = (x: number, z: number) => Math.sin(x * .045) * .5 + Math.cos(z * .05) * .45 + Math.pow(Math.max(0, Math.hypot(x, z + 25) - 80) / 25, 2) * 8;
const rand = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
export const portalSites = [
  { x: -32, z: -30, destination: "Akari · Samurai village", target: { x: 1000, z: -52 }, color: "#edb2b9" },
  { x: 1000, z: -44, destination: "Aster village", target: { x: -32, z: -36 }, color: "#edb2b9" },
];

export function createVillage(scene: THREE.Scene) {
  const root = new THREE.Group(); scene.add(root);
  const loader = new GLTFLoader(), cache = new Map<string, Promise<THREE.Group>>();
  let disposed = false;
  const wallColliders: { inverse: THREE.Matrix4; scale: number; walls: THREE.Box3[] }[] = []; const cameraMeshes: THREE.Object3D[] = [];
  const collisionPoint = new THREE.Vector3();
  const windPlants: THREE.Group[] = [], roofGroups: { roof: THREE.Group; house: THREE.Group; inside: boolean }[] = [];
  const lit = new THREE.MeshStandardMaterial({ color: "#ffc675", emissive: "#ffb55d", emissiveIntensity: 1.4 });
  const wood = new THREE.MeshStandardMaterial({ color: "#67503b", roughness: .9 });
  const mesh = (geo: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number) => { const m = new THREE.Mesh(geo, material); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
  const asset = (url: string) => { if (!cache.has(url)) cache.set(url, loader.loadAsync(url).then(g => g.scene)); return cache.get(url)!; };
  const put = async (name: string, x: number, z: number, height: number, turn = 0) => {
    const original = await asset(`/world/nature/GLTF format/${name}.glb`); if (disposed) return;
    const model = original.clone(true), bounds = new THREE.Box3().setFromObject(model), scale = height / bounds.getSize(new THREE.Vector3()).y;
    model.scale.setScalar(scale); model.rotation.y = turn;
    model.position.set(x, villageHeight(x, z) - bounds.min.y * scale, z);
    model.traverse(o => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true;
      if (name.startsWith("tree")) { const mats = Array.isArray(m.material) ? m.material : [m.material]; const tinted = mats.map(mat => { const copy = mat.clone() as THREE.MeshStandardMaterial; copy.color.multiply(new THREE.Color("#a5b66d")); return copy; }); m.material = Array.isArray(m.material) ? tinted : tinted[0]; } } }); root.add(model); if (name.startsWith("tree")) cameraMeshes.push(model);
    if (name.startsWith("tree") || name.startsWith("grass")) windPlants.push(model);
  };
  const terrainGeo = new THREE.PlaneGeometry(230, 230, 120, 120); terrainGeo.rotateX(-Math.PI / 2);
  const positions = terrainGeo.getAttribute("position"), colors: number[] = [];
  for (let i = 0; i < positions.count; i++) { const x = positions.getX(i), z = positions.getZ(i); positions.setY(i, villageHeight(x, z)); const color = new THREE.Color("#8caa65").lerp(new THREE.Color("#b6c886"), rand(i) * .25); colors.push(color.r, color.g, color.b); }
  terrainGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); terrainGeo.computeVertexNormals();
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!; ctx.fillStyle = "#aab884"; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 3500; i++) { ctx.fillStyle = i % 2 ? "#879d6660" : "#dde1ad50"; ctx.fillRect(rand(i * 3) * 256, rand(i * 7) * 256, 1, 2); }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(65, 65);
  const terrain = new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ map: texture, vertexColors: true, roughness: 1 })); terrain.receiveShadow = true; root.add(terrain);
  // A compact settlement surrounded by a meadow, with a second clearing through the portal.
  for (let i = 0; i < 48; i++) { const a = i * 2.4, radius = 34 + rand(i + 8) * 35, x = Math.cos(a) * radius, z = -20 + Math.sin(a) * radius; if (Math.hypot(x - 60, z + 66) < 34) continue; void put(i % 3 ? "tree_fat" : "tree_thin", x, z, 10 + rand(i) * 8, a); }
  for (let i = 0; i < 160; i++) { const x = (rand(i * 7) - .5) * 110, z = 20 - rand(i * 13) * 120; if (Math.abs(x) < 23 && z > -38) continue; void put(["flower_purpleA", "flower_yellowA", "grass_large"][i % 3], x, z, .45 + rand(i + 9) * .7, i); }
  for (let i = 0; i < 110; i++) { const angle = i * 2.39, r = 11 + rand(i + 22) * 5; const x = Math.cos(angle) * r, z = -8 + Math.sin(angle) * r; if (Math.abs(x) > 10 && z < -10) continue; void put(i % 3 ? "grass_leafs" : "flower_purpleA", x, z, .35 + rand(i) * .35, i); }
  for (let i = 0; i < 12; i++) void put("rock_smallA", -38 + rand(i) * 76, -40 - rand(i + 7) * 40, 1 + rand(i + 2), i);
  void put("campfire_stones", -5, -8, .65);
  void put("log_stack", 10, -9.8, 1.2);
  void put("tent_detailedOpen", -50, -68, 5, .8);
  void put("log_stack", -20, -9, 1.8, .2);
  void put("log_large", -49, -72, .8, .5);
  // A shallow pond is part of the terrain, with a reflective water surface.
  const pond = mesh(new THREE.CircleGeometry(9, 64), new THREE.MeshPhysicalMaterial({ color: "#639da8", roughness: .18, metalness: .25, transparent: true, opacity: .85 }), root, 35, villageHeight(35, -4) + .12, -4); pond.rotation.x = -Math.PI / 2; pond.scale.y = .6;
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; void put("rock_smallFlatA", 35 + Math.cos(a) * 9, -4 + Math.sin(a) * 5.4, .5 + rand(i) * .5, a); }
  // Painted cloud sprites leave the horizon open and move slowly over the meadow.
  const cloudCanvas = document.createElement("canvas"); cloudCanvas.width = 256; cloudCanvas.height = 128;
  const cloudCtx = cloudCanvas.getContext("2d")!;
  for (let i = 0; i < 8; i++) { const x = 30 + i * 28, y = 64 + Math.sin(i * 2) * 15; const gradient = cloudCtx.createRadialGradient(x, y, 0, x, y, 42); gradient.addColorStop(0, "#fffdf5bb"); gradient.addColorStop(1, "#fffdf500"); cloudCtx.fillStyle = gradient; cloudCtx.fillRect(x - 42, y - 42, 84, 84); }
  const cloudTexture = new THREE.CanvasTexture(cloudCanvas), clouds: THREE.Sprite[] = [];
  for (let i = 0; i < 12; i++) { const cloud = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTexture, transparent: true, depthWrite: false, opacity: .7 })); cloud.position.set(-105 + i * 20, 38 + rand(i) * 14, -80 - rand(i + 2) * 40); cloud.scale.set(35 + rand(i) * 20, 15, 1); root.add(cloud); clouds.push(cloud); }

  const house = async (x: number, z: number, turn: number, scale = 1.65) => {
    const group = new THREE.Group(); group.position.set(x, villageHeight(x, z) - .12, z); group.rotation.y = turn; group.scale.setScalar(scale); root.add(group); cameraMeshes.push(group);
    const roof = new THREE.Group(); group.add(roof); roofGroups.push({ roof, house: group, inside: false });
    const part = async (name: string, px: number, py: number, pz: number, angle = 0) => { const source = await asset(`/world/village/${name}.glb`); if (disposed) return; const m = source.clone(true); m.position.set(px, py, pz); m.rotation.y = angle; m.traverse(o => { const mesh = o as THREE.Mesh; if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; } }); (name.startsWith("Roof_") || name === "Prop_Chimney" ? roof : group).add(m); };
    for (const px of [-2, 0, 2]) { void part(px === 0 ? "Wall_Plaster_Door_Round" : "Wall_Plaster_Window_Wide_Flat", px, 0, 4); void part("Wall_Plaster_Straight", px, 0, -4, Math.PI); }
    for (const side of [-1, 1]) for (const pz of [-3, -1, 1, 3]) void part("Wall_Plaster_Straight", side * 3, 0, pz, side * Math.PI / 2);
    for (const px of [-2, 0, 2]) for (const pz of [-3, -1, 1, 3]) void part("Floor_WoodLight", px, 0, pz);
    void part("Roof_RoundTiles_6x8", 0, 3, 0); void part("Roof_Front_Brick6", 0, 3, 4); void part("Roof_Front_Brick6", 0, 3, -4, Math.PI); void part("Prop_Chimney", 1.5, 5, -1);
    for (const px of [-2, 2]) { void part("Window_Wide_Flat1", px, 0, 4.12); void part("WindowShutters_Wide_Flat_Open", px, 0, 4.16); }
    void part("Prop_Crate", -4, 0, 3); void part("Prop_Vine1", -3, 0, 4.15);
    // Furnishings stay beside the walls, keeping the doorway and NPC clear.
    mesh(new THREE.BoxGeometry(1.6, .12, 1.1), wood, group, -1.65, 1.1, -2.3);
    for (const a of [-1, 1]) for (const b of [-1, 1]) mesh(new THREE.BoxGeometry(.12, 1.05, .12), wood, group, -1.65 + a * .65, .52, -2.3 + b * .4);
    for (const y of [.3, 1.1, 1.9]) { mesh(new THREE.BoxGeometry(1.8, .12, .45), wood, group, 1.8, y, -3.5); for (let j = 0; j < 6; j++) mesh(new THREE.BoxGeometry(.15, .35 + rand(j) * .16, .28), new THREE.MeshStandardMaterial({ color: ["#7e5250", "#698268", "#53657f", "#aa915f"][j % 4] }), group, 1.1 + j * .25, y + .27, -3.5); }
    for (const side of [-1, 1]) { const lantern = mesh(new THREE.BoxGeometry(.22, .38, .22), lit, group, side * .8, 1.9, 4.15); lantern.castShadow = false; }
    const lamp = new THREE.PointLight("#ffcd88", 12, 12, 2); lamp.position.set(0, 2.6, 0); group.add(lamp);
    // Physical walls leave a real doorway and a walkable interior.
    const walls = [new THREE.Box3(new THREE.Vector3(-3.3, -1, -4.3), new THREE.Vector3(3.3, 8, -3.7)), new THREE.Box3(new THREE.Vector3(-3.3, -1, -4), new THREE.Vector3(-2.7, 8, 4)), new THREE.Box3(new THREE.Vector3(2.7, -1, -4), new THREE.Vector3(3.3, 8, 4)), new THREE.Box3(new THREE.Vector3(-3, -1, 3.7), new THREE.Vector3(-.8, 8, 4.3)), new THREE.Box3(new THREE.Vector3(.8, -1, 3.7), new THREE.Vector3(3, 8, 4.3))];
    group.updateMatrixWorld(true);
    wallColliders.push({ inverse: group.matrixWorld.clone().invert(), scale, walls });
  };
  void house(-15, -17, .2, 2.7); void house(16, -18, -.22, 2.64); void house(-6, -42, .1, 2.82);
  const portals: THREE.Mesh[] = [];
  portalSites.filter(site => site.x < 500).forEach(site => { const group = new THREE.Group(); group.position.set(site.x, villageHeight(site.x, site.z) + 3.4, site.z); root.add(group); const ring = new THREE.Mesh(new THREE.TorusGeometry(2.8, .19, 12, 64), new THREE.MeshStandardMaterial({ color: "#ddd3b8", emissive: site.color, emissiveIntensity: .7 })); group.add(ring); const veil = new THREE.Mesh(new THREE.CircleGeometry(2.6, 64), new THREE.MeshBasicMaterial({ color: site.color, transparent: true, opacity: .5, side: THREE.DoubleSide, depthWrite: false })); group.add(veil); portals.push(veil); const light = new THREE.PointLight(site.color, 18, 12); group.add(light); });
  return { cameraMeshes,
    setVisible: (visible: boolean) => { root.visible = visible; if (!visible) roofGroups.forEach(entry => { entry.inside = false; }); },
    isBlocked: (x: number, z: number, radius: number) => wallColliders.some(collider => {
      // Check in the house's own coordinates so rotated walls do not block open grass.
      collisionPoint.set(x, 0, z).applyMatrix4(collider.inverse);
      const localRadius = radius / collider.scale;
      return collider.walls.some(wall => {
        const closestX = THREE.MathUtils.clamp(collisionPoint.x, wall.min.x, wall.max.x);
        const closestZ = THREE.MathUtils.clamp(collisionPoint.z, wall.min.z, wall.max.z);
        return (collisionPoint.x - closestX) ** 2 + (collisionPoint.z - closestZ) ** 2 < localRadius ** 2;
      });
    }),
    getInterior: () => roofGroups.find(entry => entry.inside)?.house ?? null,
    update: (time: number, player?: { x: number; z: number }) => {
    portals.forEach(p => { (p.material as THREE.MeshBasicMaterial).opacity = .35 + Math.sin(time * .002) * .12; p.rotation.z = time * .0001; });
    windPlants.forEach((plant, i) => { plant.rotation.z = Math.sin(time * .00065 + i) * .009; });
    clouds.forEach((cloud, i) => { cloud.position.x = ((-105 + i * 20 + time * .00025) % 240) - 10; });
    if (player) roofGroups.forEach(entry => {
      const local = entry.house.worldToLocal(new THREE.Vector3(player.x, entry.house.position.y, player.z));
      // Switch camera beyond the doorway; separate bounds avoid repeated switches.
      if (entry.inside) {
        if (Math.abs(local.x) > 2.7 || Math.abs(local.z) > 3.85) entry.inside = false;
      } else if (Math.abs(local.x) < 2.35 && Math.abs(local.z) < 3.45) {
        entry.inside = true;
      }
      // The indoor camera sits below the ceiling, so the roof stays intact.
      entry.roof.visible = true;
    });
  }, dispose: () => { disposed = true; cloudTexture.dispose(); texture.dispose(); } };
}
