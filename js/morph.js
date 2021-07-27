"use strict";
const cursor = document.querySelector("#cursor");
const menu = document.querySelector("#nav-icon");
const DEFAULT_CURSOR_SIZE = cursor.style.getPropertyValue("--height");
const DEFAULT_CURSOR_BORDER_RADIUS =
  cursor.firstElementChild.style.getPropertyValue("border-radius");
let isCursorLocked = false;

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

if (isTouchDevice()) {
  alert("MOBILE");
  document.querySelector("#cursor").style.setProperty("display", "none");
}

if (!isMobile.any() || !isTouchDevice()) {
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

  //MENU
  menu.addEventListener(
    "mouseenter",
    ({ target }) => {
      isCursorLocked = true;
      var circle = target.getBoundingClientRect();
      cursor.classList.add("is-locked");
      cursor.style.setProperty("--width", circle.width + "px");
      cursor.style.setProperty("--height", circle.height + "px");
      cursor.firstElementChild.style.setProperty("border-radius", "50%");
      target.style.setProperty("--scale", 1.05);
    },
    { passive: true }
  );

  menu.addEventListener(
    "mouseleave",
    ({ target }) => {
      isCursorLocked = false;
      cursor.style.setProperty("--width", DEFAULT_CURSOR_SIZE);
      cursor.style.setProperty("--height", DEFAULT_CURSOR_SIZE);
      cursor.firstElementChild.style.setProperty(
        "border-radius",
        DEFAULT_CURSOR_BORDER_RADIUS
      );
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

  // LINKS
  document.querySelectorAll("a").forEach((a) => {
    let rect = null;
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
  });

  // PARAGRAPH
  document.querySelectorAll("p").forEach((p) => {
    p.addEventListener(
      "mouseover",
      () => {
        cursor.style.setProperty("--width", "0.2em");
        cursor.style.setProperty("--height", "1.5em");
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

  // CUSTOM HOVER
  document
    .querySelector("div.experiments-wrapper")
    .lastElementChild.addEventListener("mouseenter", () => {
      document.getElementById("cursor__content").style.border =
        "2.5px solid #000";
    });

  document
    .querySelector("div.experiments-wrapper")
    .lastElementChild.addEventListener("mouseleave", () => {
      document.getElementById("cursor__content").style.border =
        "2.5px solid #fff";
    });
}
