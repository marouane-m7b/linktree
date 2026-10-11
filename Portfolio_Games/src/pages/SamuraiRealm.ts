import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const samuraiHeight = (x: number, z: number) => {
  const distance = Math.hypot(x - 1000, z + 65);
  return Math.sin((x - 1000) * .08) * .18 + Math.cos(z * .08) * .18 + Math.max(0, distance - 42) ** 2 * .012;
};
export function createSamuraiRealm(scene: THREE.Scene) {
  const root = new THREE.Group(); root.visible = false; scene.add(root);
  const cameraMeshes: THREE.Object3D[] = [], walls: THREE.Box3[] = [];
  const loader = new GLTFLoader(), cache = new Map<string, Promise<THREE.Group>>(); let disposed = false;
  const terrain = new THREE.PlaneGeometry(190, 190, 100, 100); terrain.rotateX(-Math.PI / 2);
  const positions = terrain.getAttribute("position"), colors: number[] = [];
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i) + 1000, z = positions.getZ(i) - 65, y = samuraiHeight(x, z);
    positions.setXYZ(i, x, y, z);
    const distance = Math.hypot(x - 1000, z + 66);
    const color = new THREE.Color(distance < 19 ? "#bcb5a0" : "#7d956d").lerp(new THREE.Color("#687278"), THREE.MathUtils.clamp(y / 24, 0, 1));
    color.multiplyScalar(.95 + Math.sin(i * 23.7) * .035); colors.push(color.r, color.g, color.b);
  }
  terrain.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); terrain.computeVertexNormals();
  const ground = new THREE.Mesh(terrain, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })); ground.receiveShadow = true; root.add(ground);
  const put = async (name: string, x: number, z: number, size: number, turn = 0, solid = false) => {
    try {
      if (!cache.has(name)) cache.set(name, loader.loadAsync(`/world/samurai/${name}.glb`).then(g => g.scene));
      const original = await cache.get(name)!; if (disposed) return;
      const model = original.clone(true); model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model), dimensions = box.getSize(new THREE.Vector3());
      model.scale.setScalar(size / Math.max(dimensions.x, dimensions.y, dimensions.z)); model.rotation.y = turn;
      model.updateMatrixWorld(true); const bounds = new THREE.Box3().setFromObject(model), center = bounds.getCenter(new THREE.Vector3());
      model.position.set(x - center.x, samuraiHeight(x, z) - bounds.min.y, z - center.z);
      model.traverse(o => { const mesh = o as THREE.Mesh; if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const copies = materials.map(material => { const m = material.clone() as THREE.MeshStandardMaterial; m.opacity = 1; m.transparent = false; m.alphaTest = 0;
          if (name === "Cherry" && m.color.g > m.color.r * 1.1) m.color.set("#df9dac"); return m; }); mesh.material = Array.isArray(mesh.material) ? copies : copies[0];
      } }); root.add(model); cameraMeshes.push(model);
      if (solid) { model.updateMatrixWorld(true); const box = new THREE.Box3().setFromObject(model); box.expandByScalar(-.8); walls.push(box); }
    } catch (error) { console.error("Samurai village asset failed", name, error); }
  };
  void put("Pagoda", 1000, -91, 23, 0, true);
  void put("House", 983, -80, 18, Math.PI / 2, true);
  void put("House", 1018, -81, 18, -Math.PI / 2, true);
  void put("House", 978, -54, 15.6, .4, true);
  void put("Torii", 1000, -57, 11);
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    void put("Cherry", 1000 + Math.cos(a) * 30, -68 + Math.sin(a) * 28, 10 + i % 3, a);
  }
  for (let i = 0; i < 16; i++) {
    const a = i * 2.39; void put("Bamboo", 1000 + Math.cos(a) * 40, -68 + Math.sin(a) * 38, 8, a);
  }
  for (const x of [994, 1006]) for (const z of [-62, -72, -82]) void put("Lantern", x, z, 2.5);
  const pond = new THREE.Mesh(new THREE.CircleGeometry(8, 64), new THREE.MeshPhysicalMaterial({ color: "#83afb7", roughness: .16, metalness: .25, transparent: true, opacity: .8 }));
  pond.rotation.x = -Math.PI / 2; pond.scale.y = .65; pond.position.set(1026, samuraiHeight(1026, -59) + .05, -59); root.add(pond);
  const portal = new THREE.Group(); portal.position.set(1000, samuraiHeight(1000, -44) + 3.4, -44); root.add(portal);
  portal.add(new THREE.Mesh(new THREE.TorusGeometry(2.8, .16, 12, 64), new THREE.MeshStandardMaterial({ color: "#efd6d9", emissive: "#e9b4c7", emissiveIntensity: .7 })));
  portal.add(new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), new THREE.MeshBasicMaterial({ color: "#dab7d7", side: THREE.DoubleSide, transparent: true, opacity: .45 })));
  const sun = new THREE.Mesh(new THREE.SphereGeometry(9, 24, 16), new THREE.MeshBasicMaterial({ color: "#fff0cc", fog: false })); sun.position.set(1035, 45, -150); root.add(sun);
  const petals = new THREE.BufferGeometry(), petalPositions = new Float32Array(180 * 3);
  for (let i = 0; i < 180; i++) { petalPositions[i * 3] = 960 + (i * 23.7 % 80); petalPositions[i * 3 + 1] = 1 + i * 1.71 % 15; petalPositions[i * 3 + 2] = -100 + i * 17.3 % 60; }
  petals.setAttribute("position", new THREE.BufferAttribute(petalPositions, 3));
  const falling = new THREE.Points(petals, new THREE.PointsMaterial({ color: "#f4c6d7", size: .13, transparent: true, opacity: .85, depthWrite: false })); root.add(falling);
  return { root, cameraMeshes,
    isBlocked: (x: number, z: number, radius: number) => walls.some(w => x > w.min.x - radius && x < w.max.x + radius && z > w.min.z - radius && z < w.max.z + radius),
    update: (time: number) => { falling.position.y = -(time * .0006 % 6); falling.position.x = Math.sin(time * .0002) * 2; },
    dispose: () => { disposed = true; }
  };
}
