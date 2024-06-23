function burgerMenu() {
    const burger = document.querySelector('.burger');
    const menu = burger.parentNode;

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('_lock');
    });
}

burgerMenu();

const header = document.querySelector('#header');

document.addEventListener('scroll', animateNavbarOnScroll);

function animateNavbarOnScroll() {
    let totalHeight = header.clientHeight + 250;
    if (window.scrollY >= totalHeight) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

document.addEventListener('DOMContentLoaded', () => {
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
});

const reviewsVideos = document.querySelectorAll('.reviews-swiper video');

reviewsVideos.forEach((video) => {
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
});