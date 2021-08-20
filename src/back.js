import * as THREE from "three";
import SimplexNoise from "simplex-noise";

var noise = new SimplexNoise(Math.random);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.needsUpdate = true;

var display = document.querySelector("div.bg");

display.appendChild(renderer.domElement);
window.addEventListener("resize", onWindowResize, false);


var normalNoWire = new THREE.MeshNormalMaterial();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  1,
  500
);
var scene = new THREE.Scene();
var cameraRange = 3;

var setcolor = 0x060609;

scene.background = new THREE.Color(setcolor);
scene.fog = new THREE.Fog(setcolor, 2.5, 3.5);

//-------------------------------------------------------------- SCENE

var sceneGruop = new THREE.Object3D();
var particularGruop = new THREE.Object3D();
var modularGruop = new THREE.Object3D();

function generateParticle(num, amp = 2) {
  var gmaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  var gparticular = new THREE.CircleGeometry(0.2, 5);

  for (var i = 1; i < num; i++) {
    var pscale = 0.001 + Math.abs(randomNumber(0.03));
    var particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(
      randomNumber(amp),
      randomNumber(amp),
      randomNumber(amp)
    );
    particular.rotation.set(randomNumber(), randomNumber(), randomNumber());
    particular.scale.set(pscale, pscale, pscale);
    particular.speedValue = randomNumber();

    particularGruop.add(particular);
  }
}

generateParticle(200, 2);

sceneGruop.add(particularGruop);
scene.add(modularGruop);
scene.add(sceneGruop);

function randomNumber(num = 1) {
  var setNumber = -Math.random() * num + Math.random() * num;
  return setNumber;
}

//------------------------------------------------------------- INIT
function init() {
  var max = Math.floor(Math.random() * 10) + 3;
  var shape;
  var geometry;

  for (var i = 0; i < max; i++) {
    if (i % 3) {
      geometry = new THREE.TorusKnotBufferGeometry(5, 2, 64, 64, 10, 20);
      geometry.scale(0.05, 0.05, 0.05);
    } else {
      geometry = new THREE.IcosahedronGeometry(0.8);
    }
    shape = new THREE.Mesh(geometry, normalNoWire);

    shape.speedRotation = Math.random() * 0.01;
    shape.positionX = randomNumber() * 3;
    shape.positionY = randomNumber() * 2;
    shape.positionZ = randomNumber() * 1.5;
    shape.castShadow = true;
    shape.receiveShadow = true;

    var newScaleValue = randomNumber(0.35);

    shape.scale.set(newScaleValue, newScaleValue, newScaleValue);
    //---
    shape.rotation.x = randomNumber((180 * Math.PI) / 180);
    shape.rotation.y = randomNumber((180 * Math.PI) / 180);
    shape.rotation.z = randomNumber((180 * Math.PI) / 180);
    //
    shape.position.set(shape.positionX, shape.positionY, shape.positionZ);
    modularGruop.add(shape);
  }
}

//------------------------------------------------------------- CAMERA
camera.position.set(0, 0, cameraRange);
var cameraValue = false;

function cameraSet() {
  if (!cameraValue) {
    TweenMax.to(camera.position, 1, { z: cameraRange, ease: Power4.easeInOut });
    cameraValue = true;
  } else {
    TweenMax.to(camera.position, 1, {
      z: cameraRange,
      x: 0,
      y: 0,
      ease: Power4.easeInOut,
    });
    INTERSECTED = null;
    cameraValue = false;
  }
}

//------------------------------------------------------------- SCENE
var ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
// scene.add(ambientLight);

var light = new THREE.SpotLight(0xffffff, 3);
light.position.set(5, 5, 2);
light.castShadow = true;
light.shadow.mapSize.width = 10000;
light.shadow.mapSize.height = light.shadow.mapSize.width;
light.penumbra = 0.5;

scene.add(sceneGruop);
scene.add(light);

var rectSize = 2;
var intensity = 100;
var rectLight = new THREE.RectAreaLight(
  0x0fffff,
  intensity,
  rectSize,
  rectSize
);
rectLight.position.set(0, 0, 1);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);

//------------------------------------------------------------- RAYCASTER
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
  INTERSECTED;
var intersected;

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseDown(event) {
  event.preventDefault();
  onMouseMove(event);
  raycaster.setFromCamera(mouse, camera);
  var intersected = raycaster.intersectObjects(modularGruop.children);
  if (intersected.length > 0) {
    cameraValue = false;
    if (INTERSECTED != intersected[0].object) {
      if (INTERSECTED)
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      INTERSECTED = intersected[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xffff00);
      //INTERSECTED.material.map = null;
      //lightBack.position.set(INTERSECTED.position.x,INTERSECTED.position.y,INTERSECTED.position.z);

      TweenMax.to(camera.position, 1, {
        x: INTERSECTED.position.x,
        y: INTERSECTED.position.y,
        z: INTERSECTED.position.z + 3,
        ease: Power2.easeInOut,
      });
    } else {
      if (INTERSECTED)
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = null;
    }
  }
  //   console.log(intersected.length);
}
function onMouseUp(event) {}

window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener("mouseup", onMouseUp, false);
window.addEventListener("mousemove", onMouseMove, false);

//------------------------------------------------------------- RENDER
var uSpeed = 0.01;
function animate() {
  var time = performance.now() * 0.0003;
  requestAnimationFrame(animate);
  //---
  for (var i = 0, l = particularGruop.children.length; i < l; i++) {
    var newObject = particularGruop.children[i];
    newObject.rotation.x += newObject.speedValue / 10;
    newObject.rotation.y += newObject.speedValue / 10;
    newObject.rotation.z += newObject.speedValue / 10;
    //---
    //newObject.position.y = Math.sin(time) * 3;
  }

  for (var i = 0, l = modularGruop.children.length; i < l; i++) {
    // updateVertice(animeShape);

    var animeShape = modularGruop.children[i];
    animeShape.rotation.x += 0.008;
    animeShape.rotation.y += 0.005;
    animeShape.rotation.z += 0.003;
    //---
    animeShape.position.x =
      Math.sin(time * animeShape.positionZ) * animeShape.positionY;
    animeShape.position.y =
      Math.cos(time * animeShape.positionX) * animeShape.positionZ;
    animeShape.position.z =
      Math.sin(time * animeShape.positionY) * animeShape.positionX;
  }
  //---
  particularGruop.rotation.y += 0.004;
  //---
  modularGruop.rotation.y -= (mouse.x * 4 + modularGruop.rotation.y) * uSpeed;
  modularGruop.rotation.x -= (-mouse.y * 4 + modularGruop.rotation.x) * uSpeed;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

animate();
init();

//TODO: reform this file
