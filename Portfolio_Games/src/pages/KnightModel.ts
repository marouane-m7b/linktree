import * as THREE from "three";

export type KnightRig = {
  root: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  cape: THREE.BufferGeometry;
  torso: THREE.Group;
  sword: THREE.Group;
};

const metal = new THREE.MeshStandardMaterial({ color: "#998d75", metalness: .66, roughness: .37, flatShading: true });
const brightMetal = new THREE.MeshStandardMaterial({ color: "#c4ae7b", metalness: .78, roughness: .29, flatShading: true });
const darkMetal = new THREE.MeshStandardMaterial({ color: "#333431", metalness: .58, roughness: .48, flatShading: true });
const leather = new THREE.MeshStandardMaterial({ color: "#422d27", roughness: .94 });
const crimson = new THREE.MeshStandardMaterial({ color: "#712c25", roughness: .93, side: THREE.DoubleSide, flatShading: true });
const cloth = new THREE.MeshStandardMaterial({ color: "#231f1c", roughness: 1 });

function piece(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) {
  const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}

export function createKnight(): KnightRig {
  const root = new THREE.Group();
  const torso = new THREE.Group(); torso.position.y = 1.04; root.add(torso);
  piece(torso, new THREE.CylinderGeometry(.31, .4, .46, 8), leather, 0, .1, 0);
  piece(torso, new THREE.CylinderGeometry(.34, .49, .24, 8), darkMetal, 0, .37, 0);
  piece(torso, new THREE.CylinderGeometry(.24, .37, .14, 8), brightMetal, 0, .52, 0);
  const breast = piece(torso, new THREE.SphereGeometry(1, 12, 9), metal, 0, .89, -.012, .48, .49, .3); breast.rotation.x = -.07;
  piece(torso, new THREE.BoxGeometry(.09, .63, .035), darkMetal, 0, .92, -.309);
  piece(torso, new THREE.SphereGeometry(.22, 10, 8), leather, 0, 1.31, 0, .69, .63, .7);
  piece(torso, new THREE.CylinderGeometry(.14, .18, .19, 8), darkMetal, 0, 1.42, 0);
  // Open-faced great helm, narrow eye slit, and a wind-swept crest.
  piece(torso, new THREE.SphereGeometry(.3, 12, 10), metal, 0, 1.7, 0, .88, 1.08, .86);
  piece(torso, new THREE.SphereGeometry(.215, 10, 8), darkMetal, 0, 1.66, -.23, .76, .74, .63);
  piece(torso, new THREE.BoxGeometry(.26, .028, .035), brightMetal, 0, 1.71, -.423);
  piece(torso, new THREE.ConeGeometry(.085, .43, 5), crimson, 0, 2.12, .03).rotation.x = -.62;
  piece(torso, new THREE.BoxGeometry(.5, .07, .08), brightMetal, 0, 1.43, -.14);

  // Articulated, layered pauldrons and gauntlets.
  const arm = (side: number) => {
    const pivot = new THREE.Group(); pivot.position.set(side * .49, 1.27, 0); torso.add(pivot);
    const shoulder = piece(pivot, new THREE.SphereGeometry(.31, 9, 7), brightMetal, side * .07, -.04, 0, 1.16, .85, 1.05);
    shoulder.rotation.z = side * .19;
    piece(pivot, new THREE.CapsuleGeometry(.15, .34, 4, 7), darkMetal, side * .12, -.38, 0, 1, 1, 1);
    piece(pivot, new THREE.CylinderGeometry(.14, .12, .18, 8), metal, side * .12, -.67, 0);
    piece(pivot, new THREE.SphereGeometry(.16, 8, 6), leather, side * .12, -.81, -.015, .83, 1.18, .7);
    piece(pivot, new THREE.CapsuleGeometry(.115, .34, 4, 7), metal, side * .12, -1.08, .012);
    piece(pivot, new THREE.SphereGeometry(.14, 8, 6), brightMetal, side * .12, -1.3, -.04, .88, .78, .72);
    return pivot;
  };
  const leftArm = arm(-1), rightArm = arm(1);

  const leg = (side: number) => {
    const pivot = new THREE.Group(); pivot.position.set(side * .225, .94, 0); root.add(pivot);
    piece(pivot, new THREE.CapsuleGeometry(.18, .32, 4, 7), leather, 0, -.31, 0);
    piece(pivot, new THREE.BoxGeometry(.31, .37, .37), darkMetal, 0, -.42, -.035);
    piece(pivot, new THREE.BoxGeometry(.285, .36, .15), metal, 0, -.46, -.228);
    piece(pivot, new THREE.CapsuleGeometry(.14, .36, 4, 7), leather, 0, -.78, 0);
    piece(pivot, new THREE.CapsuleGeometry(.155, .36, 4, 7), metal, 0, -.78, -.08, .91, 1, .65);
    piece(pivot, new THREE.BoxGeometry(.32, .18, .46), darkMetal, 0, -1.04, -.095);
    piece(pivot, new THREE.BoxGeometry(.34, .15, .42), brightMetal, 0, -1.1, -.125);
    return pivot;
  };
  const leftLeg = leg(-1), rightLeg = leg(1);

  // A visibly dimensional red mantle with enough segments to ripple while running.
  const columns = 8, rows = 9, vertices: number[] = [], indices: number[] = [];
  for (let row = 0; row <= rows; row++) for (let col = 0; col <= columns; col++) {
    const t = row / rows, u = col / columns, width = .36 + t * .52;
    vertices.push((u - .5) * width, -.04 - t * 1.13, .12 + t * .58);
    if (row < rows && col < columns) { const a = row * (columns + 1) + col, b = a + columns + 1; indices.push(a, a + 1, b, a + 1, b + 1, b); }
  }
  const cape = new THREE.BufferGeometry(); cape.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); cape.setIndex(indices); cape.computeVertexNormals();
  const mantle = new THREE.Mesh(cape, crimson); mantle.castShadow = true; mantle.frustumCulled = false; torso.add(mantle);
  const mantleLining = piece(torso, new THREE.CylinderGeometry(.48, .18, .12, 12, 1, true), crimson, 0, .02, .32, 1, 1, .54); mantleLining.rotation.x = .45;

  // Long blade, crossguard, leather-wrapped grip and pommel held low at the knight's side.
  const sword = new THREE.Group(); sword.position.set(.58, .32, -.1); sword.rotation.z = -.28; root.add(sword);
  piece(sword, new THREE.BoxGeometry(.105, 1.42, .042), brightMetal, 0, .87, 0);
  piece(sword, new THREE.ConeGeometry(.075, .3, 4), metal, 0, 2, 0).rotation.z = Math.PI;
  piece(sword, new THREE.BoxGeometry(.48, .075, .13), brightMetal, 0, .2, 0).rotation.z = -.08;
  piece(sword, new THREE.CylinderGeometry(.06, .06, .45, 8), leather, 0, -.055, 0);
  piece(sword, new THREE.SphereGeometry(.105, 8, 6), brightMetal, 0, -.31, 0, 1, .84, 1);

  return { root, leftLeg, rightLeg, leftArm, rightArm, cape, torso, sword };
}

export function animateKnight(rig: KnightRig, time: number, walking: boolean, directionX: number) {
  const stride = walking ? Math.sin(time * .0108) * .62 : Math.sin(time * .0014) * .025;
  rig.leftLeg.rotation.x = stride; rig.rightLeg.rotation.x = -stride;
  rig.leftArm.rotation.x = -stride * .48; rig.rightArm.rotation.x = stride * .65;
  rig.torso.position.y = 1.04 + Math.abs(stride) * .045;
  rig.torso.rotation.z += (directionX * -.26 - rig.torso.rotation.z) * .085;
  rig.sword.rotation.x = walking ? Math.sin(time * .0108 + Math.PI) * .10 : Math.sin(time * .0019) * .025;
  const vertices = rig.cape.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < vertices.count; i++) {
    const row = Math.floor(i / 9), col = i % 9, t = row / 9, u = col / 8;
    vertices.setZ(i, .12 + t * .58 + t * t * Math.sin(time * .004 - u * 2.5) * (walking ? .28 : .07));
    vertices.setX(i, (u - .5) * (.36 + t * .52) + t * t * Math.sin(time * .0032 + t * 4) * (walking ? .075 : .02));
  }
  vertices.needsUpdate = true; rig.cape.computeVertexNormals();
}
