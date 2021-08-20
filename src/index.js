import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import AOS from "aos";
import "aos/dist/aos.css";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = document.querySelector("#cursor");
const DEFAULT_CURSOR_SIZE = cursor.style.getPropertyValue("--height");
const canvas = document.querySelector("canvas.face");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);

camera.position.z = 35;
var renderer;
var mesh;
var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -15);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var pointOfIntersection = new THREE.Vector3();

var actualYear = new Date().getFullYear();

var sceneGruop = new THREE.Object3D();
var modularGruop = new THREE.Object3D();
var particularGruop = new THREE.Object3D();

window.onload = () => {
  AOS.init(), extras(), morph(), background(), face();
};

function extras() {
  document.getElementById("year").innerHTML = actualYear;
  document.getElementById("age").innerHTML = actualYear - 2001;

  if (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  ) {
    document.querySelector("#cursor").style.setProperty("display", "none");
  }
}

function morph() {
  var isCursorLocked = false;

  document.addEventListener("mousedown", () => {
    if (!isCursorLocked) {
      cursor.style.setProperty("--scale", 0.9);
    }
  });

  document.addEventListener("mouseup", () => {
    if (!isCursorLocked) {
      cursor.style.setProperty("--scale", 1);
    }
  });

  document.addEventListener("mousemove", ({ x, y }) => {
    if (!isCursorLocked) {
      cursor.style.setProperty("--top", y + "px");
      cursor.style.setProperty("--left", x + "px");
    }
  });

  // LINKS && H3 && P;
  document.querySelectorAll("a").forEach((a) => {
    let rect = null;
    if (a.parentNode.nodeName == "H3" || a.parentElement.nodeName == "P") {
      a.addEventListener(
        "mouseenter",
        ({ target }) => {
          isCursorLocked = true;
          rect = target.getBoundingClientRect();
          cursor.classList.add("is-locked");
          cursor.style.setProperty("--top", rect.top + rect.height + "px");
          cursor.style.setProperty("--left", rect.left + rect.width / 2 + "px");
          cursor.style.setProperty("--width", rect.width + "px");
          cursor.style.setProperty("--height", "0.15em");
          target.style.setProperty("--scale", 1.0);
        },
        { passive: true }
      );
      a.addEventListener(
        "mousemove",
        ({ target }) => {
          const halfHeight = rect.height / 2;
          const topOffset = (event.y - rect.top - halfHeight) / halfHeight;
          const halfWidth = rect.width / 2;
          const leftOffset = (event.x - rect.left - halfWidth) / halfWidth;
          cursor.style.setProperty("--translateX", `${leftOffset * 3}px`);
          cursor.style.setProperty("--translateY", `${topOffset * 3}px`);
          target.style.setProperty("--translateX", `${leftOffset * 6}px`);
          target.style.setProperty("--translateY", `${topOffset * 4}px`);
        },
        { passive: true }
      );
      a.addEventListener(
        "mouseleave",
        ({ target }) => {
          isCursorLocked = false;
          cursor.style.setProperty("--width", DEFAULT_CURSOR_SIZE);
          cursor.style.setProperty("--height", DEFAULT_CURSOR_SIZE);
          cursor.style.setProperty("--translateX", 0);
          cursor.style.setProperty("--translateY", 0);
          target.style.setProperty("--translateX", 0);
          target.style.setProperty("--translateY", 0);
          target.style.setProperty("--scale", 1);
          setTimeout(() => {
            if (!isCursorLocked) {
              cursor.classList.remove("is-locked");
            }
          }, 100);
        },
        { passive: true }
      );
    } else {
      a.addEventListener(
        "mouseenter",
        ({ target }) => {
          isCursorLocked = true;
          rect = target.getBoundingClientRect();
          cursor.classList.add("is-locked");
          cursor.style.setProperty("--top", rect.top + rect.height / 2 + "px");
          cursor.style.setProperty("--left", rect.left + rect.width / 2 + "px");
          cursor.style.setProperty("--width", rect.width + "px");
          cursor.style.setProperty("--height", rect.height + "px");
          target.style.setProperty("--scale", 1.05);
        },
        { passive: true }
      );
      a.addEventListener(
        "mousemove",
        ({ target }) => {
          const halfHeight = rect.height / 2;
          const topOffset = (event.y - rect.top - halfHeight) / halfHeight;
          const halfWidth = rect.width / 2;
          const leftOffset = (event.x - rect.left - halfWidth) / halfWidth;
          cursor.style.setProperty("--translateX", `${leftOffset * 3}px`);
          cursor.style.setProperty("--translateY", `${topOffset * 3}px`);
          target.style.setProperty("--translateX", `${leftOffset * 6}px`);
          target.style.setProperty("--translateY", `${topOffset * 4}px`);
        },
        { passive: true }
      );
      a.addEventListener(
        "mouseleave",
        ({ target }) => {
          isCursorLocked = false;
          cursor.style.setProperty("--width", DEFAULT_CURSOR_SIZE);
          cursor.style.setProperty("--height", DEFAULT_CURSOR_SIZE);
          cursor.style.setProperty("--translateX", 0);
          cursor.style.setProperty("--translateY", 0);
          target.style.setProperty("--translateX", 0);
          target.style.setProperty("--translateY", 0);
          target.style.setProperty("--scale", 1);
          setTimeout(() => {
            if (!isCursorLocked) {
              cursor.classList.remove("is-locked");
            }
          }, 100);
        },
        { passive: true }
      );
    }
  });

  // PARAGRAPH
  document.querySelectorAll("p").forEach((p) => {
    p.addEventListener(
      "mouseover",
      () => {
        cursor.style.setProperty("--width", "0.15em");
        cursor.style.setProperty("--height", "1em");
      },
      { passive: true }
    );
    p.addEventListener(
      "mouseout",
      () => {
        cursor.style.setProperty("--width", DEFAULT_CURSOR_SIZE);
        cursor.style.setProperty("--height", DEFAULT_CURSOR_SIZE);
      },
      { passive: true }
    );
  });
}

function background() {
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

  generateParticle(200, 2);

  sceneGruop.add(particularGruop);
  scene.add(modularGruop);
  scene.add(sceneGruop);

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
    shape.rotation.x = randomNumber((180 * Math.PI) / 180);
    shape.rotation.y = randomNumber((180 * Math.PI) / 180);
    shape.rotation.z = randomNumber((180 * Math.PI) / 180);
    shape.position.set(shape.positionX, shape.positionY, shape.positionZ);
    modularGruop.add(shape);
  }

  camera.position.set(0, 0, cameraRange);

  var light = new THREE.SpotLight(0xffffff, 3);
  light.position.set(5, 5, 2);
  light.castShadow = true;
  light.shadow.mapSize.width = 10000;
  light.shadow.mapSize.height = light.shadow.mapSize.width;
  light.penumbra = 0.5;

  scene.add(sceneGruop);
  scene.add(light);

  window.addEventListener("mousemove", onMouseMove, false);
  function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function animate() {
    var uSpeed = 0.01;
    var time = performance.now() * 0.0003;
    requestAnimationFrame(animate);
    for (var i = 0, l = particularGruop.children.length; i < l; i++) {
      var particle = particularGruop.children[i];
      particle.rotation.x += particle.speedValue / 10;
      particle.rotation.y += particle.speedValue / 10;
      particle.rotation.z += particle.speedValue / 10;
    }

    for (var i = 0, l = modularGruop.children.length; i < l; i++) {
      var animeShape = modularGruop.children[i];
      animeShape.rotation.x += 0.008;
      animeShape.rotation.y += 0.005;
      animeShape.rotation.z += 0.003;
      animeShape.position.x =
        Math.sin(time * animeShape.positionZ) * animeShape.positionY;
      animeShape.position.y =
        Math.cos(time * animeShape.positionX) * animeShape.positionZ;
      animeShape.position.z =
        Math.sin(time * animeShape.positionY) * animeShape.positionX;
    }

    particularGruop.rotation.y += 0.004;
    modularGruop.rotation.y -= (mouse.x * 4 + modularGruop.rotation.y) * uSpeed;
    modularGruop.rotation.x -=
      (-mouse.y * 4 + modularGruop.rotation.x) * uSpeed;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  animate();
}

function face() {
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
  });
  renderer.setSize(500, 500);

  const loader = new OBJLoader();
  loader.load(
    // "./face.obj",
    "https://raw.githubusercontent.com/rchiarino/rchiarino.github.io/main/936f10d8-3f68-47e2-9089-ee16ea821370-face.obj",
    (obj) => {
      let material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.02,
      });
      mesh = new THREE.Points(obj.children[0].geometry, material);
      mesh.position.y = -5;
      mesh.position.z = 1;
      mesh.position.x = 5;
      scene.add(mesh);
      window.addEventListener("mousemove", onMouseMove, false);
    },
    // onProgress callback
    (xhr) => {
      //   console.warn((xhr.loaded / xhr.total) * 100 + "%");
    },

    // onError callback
    (err) => {
      console.error("An error happened");
    }
  );
  animationLoop();
}

function randomNumber(num = 1) {
  var setNumber = -Math.random() * num + Math.random() * num;
  return setNumber;
}

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

function animationLoop() {
  if (resize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);

  requestAnimationFrame(animationLoop);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, pointOfIntersection);
  mesh.lookAt(pointOfIntersection);
}

function resize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
