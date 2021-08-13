import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

//!
//!MORPH
("use strict");
const cursor = document.querySelector("#cursor");
// const about_box = document.querySelectorAll(".a-box");
const DEFAULT_CURSOR_SIZE = cursor.style.getPropertyValue("--height");
const DEFAULT_CURSOR_BORDER_RADIUS =
  cursor.firstElementChild.style.getPropertyValue("border-radius");
let isCursorLocked = false;

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

// LINKS && H3;
document.querySelectorAll("a").forEach((a) => {
  let rect = null;
  if (a.parentNode.nodeName != "H3") {
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
  } else {
    //!h3
    a.addEventListener(
      "mouseenter",
      ({ target }) => {
        isCursorLocked = true;
        rect = target.getBoundingClientRect();
        cursor.classList.add("is-locked");
        cursor.style.setProperty("--top", rect.top + rect.height + "px");
        cursor.style.setProperty("--left", rect.left + rect.width / 2 + "px");
        cursor.style.setProperty("--width", rect.width + "px");
        cursor.style.setProperty("--height", "0.2em");
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
      cursor.style.setProperty("--width", "0.2em");
      cursor.style.setProperty("--height", "1.2em");
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

//!
//!FACE
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("load", init);
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
window.addEventListener("mousemove", onMouseMove, false);

function init() {
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
  });
  renderer.setSize(500, 500);
  scene.add(new THREE.AmbientLight(0x404040));

  //Use this to load face
  const loader = new OBJLoader();
  loader.load(
    // "./face.obj",
    "https://cdn.glitch.com/936f10d8-3f68-47e2-9089-ee16ea821370%2Fface.obj?v=1628558804721",
    (obj) => {
      let material = new THREE.PointsMaterial({ color: 0xe6f1ff, size: 0.02 });
      mesh = new THREE.Points(obj.children[0].geometry, material);
      mesh.position.y = -5;
      mesh.position.z = 1;
      mesh.position.x = 5;
      scene.add(mesh);
    },
    // onProgress callback
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },

    // onError callback
    (err) => {
      console.error("An error happened");
    }
  );
  animationLoop();
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
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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

//!EXTRAS
var actualYear = new Date().getFullYear();
document.getElementById("year").innerHTML = actualYear;
document.getElementById("age").innerHTML = actualYear - 2001;

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

if (isTouchDevice()) {
  document.querySelector("#cursor").style.setProperty("display", "none");
}
