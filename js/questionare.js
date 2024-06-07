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

/* SLIDE UP */
let slideUp = (target, duration = 300) => {
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.boxSizing = "border-box";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.style.border = "none";

    window.setTimeout(() => {
        target.style.display = "none";
        target.style.removeProperty("height");
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.style.removeProperty("border");
    }, duration);
};
/* SLIDE DOWN */
let slideDown = (target, duration = 300) => {
    target.style.removeProperty("display");
    let display = window.getComputedStyle(target).display;
    if (display === "none") display = "grid";
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = "border-box";
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.border = "none";

    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    target.style.removeProperty("border");

    window.setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.style.removeProperty("border");
    }, duration);
};

document.addEventListener("DOMContentLoaded", () => {
    const questionareInfo = document.querySelector(".questionare-info");
    const questionareInfoHeader = questionareInfo.querySelector(
        ".questionare-answer-header"
    );
    const questionareInfoContent = questionareInfo.querySelector(
        ".questionare-answer-content"
    );

    slideUp(questionareInfoContent);

    questionareInfoHeader.addEventListener("click", () => {
        if (questionareInfoHeader.classList.contains("opened")) {
            questionareInfoHeader.classList.remove("opened");
            slideDown(questionareInfoContent);
        } else {
            questionareInfoHeader.classList.add("opened");
            slideUp(questionareInfoContent);
        }
    });
});

let currentStep = '1';
const totalSteps = '7';

const nextStepButton = document.querySelector('#next-step');
const prevStepButton = document.querySelector('#prev-step');
const skipStepButton = document.querySelector('#skip-step');

function nextStep() {
    if (currentStep.toString() === totalSteps.toString()) {
        document.querySelector('.questionare-steps').classList.add('hidden');
        document.getElementById('questionare-final').classList.remove('hidden');
        document.querySelector('.steps-progress').classList.add('hidden');
    }
    if (currentStep < totalSteps) {
        // Hide current step
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        currentStepElement.classList.add('hidden');
        document.querySelector('.steps-progress').classList.remove('hidden');

        // Show next step
        currentStep++;
        const nextStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        nextStepElement.classList.remove('hidden');
        prevStepButton.classList.remove('hidden');

        // Update progress bar
        const progressStepElement = document.querySelector(`[data-step-index="${currentStep - 1}"]`);
        progressStepElement.classList.remove('bg-dark_green/10');
        progressStepElement.classList.add('bg-green');

        // Update progress bar attribute
        document.querySelector('.steps-progress').setAttribute('data-filled-steps', currentStep - 1);
    }
}

function prevStep() {
    if (currentStep > 1) {
        // Hide current step
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        currentStepElement.classList.add('hidden');

        // Show previous step
        currentStep--;
        const prevStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        prevStepElement.classList.remove('hidden');

        // Update progress bar
        const progressStepElement = document.querySelector(`[data-step-index="${currentStep}"]`);
        progressStepElement.classList.add('bg-dark_green/10');
        progressStepElement.classList.remove('bg-green');

        // Update progress bar attribute
        document.querySelector('.steps-progress').setAttribute('data-filled-steps', currentStep - 1);
    }
}

nextStepButton.addEventListener('click', () => nextStep());
skipStepButton.addEventListener('click', () => nextStep());
prevStepButton.addEventListener('click', () => prevStep());

document.addEventListener("DOMContentLoaded", function() {
    const customSelectWrapper = document.querySelector(".custom-select-wrapper");
    const customSelect = document.querySelector(".custom-select");
    const customSelectTrigger = document.querySelector(".custom-select-trigger");
    const customOptions = document.querySelector(".custom-options");
    const customOptionsItems = document.querySelectorAll(".custom-option");
    const selectElement = document.querySelector("#form_select");

    customSelectTrigger.addEventListener("click", function() {
        customOptions.classList.toggle("open");
    });

    customOptionsItems.forEach(option => {
        option.addEventListener("click", function() {
            customOptionsItems.forEach(item => item.classList.remove("selected"));
            this.classList.add("selected");
            customSelectTrigger.querySelector("span").textContent = this.textContent;
            selectElement.value = this.getAttribute("data-value");
            customOptions.classList.remove("open");
        });
    });

    document.addEventListener("click", function(event) {
        if (!customSelect.contains(event.target)) {
            customOptions.classList.remove("open");
        }
    });
});