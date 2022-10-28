const carrusel = document.querySelector(".carrousel-items");

let maxScrollLeft = carrusel.scrollWidth - carrusel.clientWidth;
let intervalo = null;
let step = 2;
const start = () => {
  intervalo = setInterval(function () {
    carrusel.scrollLeft = carrusel.scrollLeft + step;
    if (carrusel.scrollLeft === maxScrollLeft) {
      step = step * -1;
     } else if (carrusel.scrollLeft=== 0) {
      step = step * -1;
    } 
  },50);
};

start();