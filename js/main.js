function burgerMenu() {
    const burger = document.querySelector('.burger')
    const menu = burger.parentNode;

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('_lock');
    })
}

burgerMenu();

const header = document.querySelector('#header');

document.addEventListener('scroll', animateNavbarOnScroll);

function animateNavbarOnScroll() {
    let totalHeight = header.clientHeight + 250
    if (window.scrollY >= totalHeight) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Swiper(".brands-swiper", {
        // Optional parameters
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 75,

        // If we need pagination
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + "</span>";
            },
        },
    });
});