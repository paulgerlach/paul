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
    breakpoints: {
      1024: {
        mousewheel: false,
      },
    },
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

  const s2 = new Swiper(".counters-swiper", {
    // Optional parameters
    loop: true,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 75,
    mousewheel: true,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 75,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 120,
        mousewheel: false,
      },
      1920: {
        slidesPerView: 5,
        spaceBetween: 120,
        mousewheel: false,
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const s4 = new Swiper(".reviews-swiper", {
    // Optional parameters
    slidesPerView: 1.3,
    spaceBetween: 65,
    mousewheel: true,

    // Responsive breakpoints
    breakpoints: {
      1024: {
        mousewheel: false,
      },
      1920: {
        mousewheel: false,
      },
    },

    // Navigation buttons
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // Event listener for slide change
    on: {
      slideChange: function () {
        // Pause all videos in slides
        document.querySelectorAll('.reviews-swiper .swiper-slide video').forEach(video => {
          if (!video.paused) {
            video.pause();
          }
        });

        // Get the active slide
        const activeSlide = this.slides[this.activeIndex];
        const video = activeSlide.querySelector('video');

        // Play the video if it exists in the active slide
        if (video) {
          video.play();
        }
      },
    },
  });

  document.querySelectorAll('.reviews-swiper .swiper-slide video').forEach((video, index) => {
    if (index !== s4.activeIndex) {
      video.pause();
    } else {
      video.play();
    }
  });

  const s3 = new Swiper(".numbered-swiper", {
    // Optional parameters
    // loop: true,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 75,
    mousewheel: true,
    breakpoints: {
      1024: {
        mousewheel: false,
      },
    },
    // If we need pagination
    pagination: {
      el: ".numbered-swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        // Calculate which bullets to show

        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const s5 = new Swiper(".chart-swiper", {
    // Optional parameters
    // loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    mousewheel: true,
    breakpoints: {
      1024: {
        mousewheel: false,
      },
    },
    // If we need pagination
    pagination: {
      el: ".chart-swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        // Retrieve the data-slide-name attribute of the slide
        const slideName = this.slides[index].getAttribute("data-slide-name");

        // Return the bullet with the slide name
        return '<span class="' + className + '">' + slideName + "</span>";
      },
    },
  });
});

