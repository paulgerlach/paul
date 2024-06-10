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

    const s5 = new Swiper('.chart-swiper', {
        // Optional parameters
        // loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        mousewheel: true,
        breakpoints: {
            1024: {
                mousewheel: false
            }
        },
        // If we need pagination
        pagination: {
            el: '.chart-swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                // Retrieve the data-slide-name attribute of the slide
                const slideName = this.slides[index].getAttribute('data-slide-name');

                // Return the bullet with the slide name
                return '<span class="' + className + '">' + slideName + '</span>';
            }
        }
    });
});

/* SLIDE UP */
let slideUp = (target, duration = 300) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.style.border = 'none';

    window.setTimeout(() => {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.style.removeProperty('border');
    }, duration);
};
/* SLIDE DOWN */
let slideDown = (target, duration = 300) => {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none') display = 'grid';
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.border = 'none';

    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('border');

    window.setTimeout(() => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.style.removeProperty('border');
    }, duration);
};

function addAccordionFunctionality(container) {
    const items = container.querySelectorAll('.faq-answer-item');
    const headers = container.querySelectorAll('.faq-answer-header');

    headers.forEach((header, index) => {
        header.addEventListener('click', headerClickHandler);
    });
}

function headerClickHandler() {
    const parent = this.parentNode;
    const content = parent.querySelector('.faq-answer-content');

    if (!parent.classList.contains('active')) {
        parent.classList.add('active');
        slideDown(content);
    } else {
        parent.classList.remove('active');
        slideUp(content);
    }

    const items = parent.parentNode.querySelectorAll('.faq-answer-item');
    items.forEach((item, i) => {
        const itemContent = item.querySelector('.faq-answer-content');
        if (item !== parent && item.classList.contains('active')) {
            slideUp(itemContent);
            item.classList.remove('active');
        }
    });
}

const faqTabsAnswers = document.querySelectorAll('.faq-answers-container');

function initFAQ() {
    faqTabsAnswers.forEach((tab) => {
        addAccordionFunctionality(tab);
    });
}

initFAQ();

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