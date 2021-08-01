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
