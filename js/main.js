function burgerMenu() {
  const burger = document.querySelector(".burger");
  const menu = burger.parentNode;

  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    menu.classList.toggle("active");
    document.body.classList.toggle("_lock");
  });
}

burgerMenu();

const header = document.querySelector("#header");

document.addEventListener("scroll", animateNavbarOnScroll);

function animateNavbarOnScroll() {
  let totalHeight = header.clientHeight + 250;
  if (window.scrollY >= totalHeight) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const s1 = new Swiper(".brands-swiper", {
    // Optional parameters
    // loop: true,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 75,
    mousewheel: true,

    // If we need pagination
    pagination: {
      el: ".brand-swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        // Calculate which bullets to show

        return '<span class="' + className + '">' + "</span>";
      },
      dynamicBullets: true,
    },
  });
});

let init = false;
let newsSwiper;
let functionsSwiper;
function swiperCard() {
  if (window.innerWidth <= 768) {
    if (!init) {
      init = true;
      newsSwiper = new Swiper(".news-swiper", {
        // Optional parameters
        // loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 75,
        mousewheel: true,

        // If we need pagination
        pagination: {
          el: ".news-swiper-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            // Calculate which bullets to show

            return '<span class="' + className + '">' + "</span>";
          },
          dynamicBullets: true,
        },
      });
      functionsSwiper = new Swiper(".functions-swiper", {
        // Optional parameters
        // loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 75,
        mousewheel: true,

        // If we need pagination
        pagination: {
          el: ".functions-swiper-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            // Calculate which bullets to show

            return '<span class="' + className + '">' + "</span>";
          },
          dynamicBullets: true,
        },
      });
    }
  } else if (init) {
    newsSwiper.destroy();
    functionsSwiper.destroy();
    init = false;
  }
}
swiperCard();
window.addEventListener("resize", swiperCard);
