"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const logoHome = document.querySelector("#logo-home");

    const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

function closeMenu() {
    if (!menuToggle || !mainNav) {
        return;
    }

    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("is-open");
}

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const menuIsOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute(
            "aria-expanded",
            String(!menuIsOpen)
        );

        mainNav.classList.toggle("is-open", !menuIsOpen);

if (menuIsOpen) {
    menuToggle.focus();
    }
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 850) {
            closeMenu();
        }
    });
}

const navigationLinks = Array.from(
    document.querySelectorAll('.main-nav a[href^="#"]')
);

const navigationSections = navigationLinks
    .map((link) => {
        return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

let isReturningToTop = false;
let navigationTargetId = null;
let navigationTargetScrollY = null;

function setActiveNavigation(sectionId) {
    navigationLinks.forEach((link) => {
        const isActive =
            link.getAttribute("href") === `#${sectionId}`;

        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function clearActiveNavigation() {
    navigationLinks.forEach((link) => {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
    });
}

if (logoHome) {
    logoHome.addEventListener("click", () => {
        isReturningToTop = true;
navigationTargetId = null;
navigationTargetScrollY = null;
clearActiveNavigation();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

if (
    navigationLinks.length > 0 &&
    navigationSections.length > 0
) {
    let navigationScrollFrame = null;

    function updateActiveNavigation() {
    if (isReturningToTop) {
        return;
    }

    if (window.scrollY <= 10) {
        clearActiveNavigation();
        return;
    }

    if (
        navigationTargetId &&
        navigationTargetScrollY !== null
    ) {
        setActiveNavigation(navigationTargetId);

        const maximumScrollY =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const reachedTarget =
            Math.abs(
                window.scrollY - navigationTargetScrollY
            ) <= 6;

        const reachedPageEnd =
            window.scrollY >= maximumScrollY - 6;

        if (reachedTarget || reachedPageEnd) {
            navigationTargetId = null;
            navigationTargetScrollY = null;
        }

        return;
    }

    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;
    const activationLine = headerHeight + 1;

    let activeSection = navigationSections[0];

    navigationSections.forEach((section) => {
        const sectionTop =
            section.getBoundingClientRect().top;

        if (sectionTop <= activationLine) {
            activeSection = section;
        }
    });

    if (activeSection) {
        setActiveNavigation(activeSection.id);
    }
}
    function scheduleNavigationUpdate() {
        if (navigationScrollFrame !== null) {
            return;
        }

        navigationScrollFrame = window.requestAnimationFrame(() => {
            updateActiveNavigation();
            navigationScrollFrame = null;
        });
    }

    navigationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const sectionId = link
            .getAttribute("href")
            .slice(1);

        const targetSection =
            document.getElementById(sectionId);

        if (!targetSection) {
            return;
        }

        const header =
            document.querySelector(".site-header");

        const headerHeight =
            header ? header.offsetHeight : 0;

        const targetTop =
            window.scrollY +
            targetSection.getBoundingClientRect().top;

        const maximumScrollY =
            document.documentElement.scrollHeight -
            window.innerHeight;

        navigationTargetId = sectionId;

        navigationTargetScrollY = Math.min(
    Math.max(
        targetTop - headerHeight,
        0
    ),
    maximumScrollY
);

        setActiveNavigation(sectionId);

        window.scrollTo({
            top: navigationTargetScrollY,
            behavior: "smooth"
        });
    });
});

    window.addEventListener(
        "scroll",
        scheduleNavigationUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        scheduleNavigationUpdate
    );

    updateActiveNavigation();
}

window.addEventListener(
    "scroll",
    () => {
        if (
            window.scrollY <= 10 &&
            navigationTargetId === null
        ) {
            isReturningToTop = false;
            navigationTargetScrollY = null;
            clearActiveNavigation();
        }
    },
    { passive: true }
);
const placeholderLinks = document.querySelectorAll('a[href="#"]');

placeholderLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
    });
});

const stepsList = document.querySelector(".steps-list");
let stepsProgressTimer = null;

function updateStepsProgress() {
    if (!stepsList) {
        return;
    }

    const stepsRect = stepsList.getBoundingClientRect();
    const progressStart = window.innerHeight * 0.75;
    const progressEnd = window.innerHeight * 0.35;
    const progressDistance =
        stepsRect.height + progressStart - progressEnd;

    const progress = Math.min(
        1,
        Math.max(
            0,
            (progressStart - stepsRect.top) / progressDistance
        )
    );

    stepsList.style.setProperty(
        "--steps-progress",
        progress.toFixed(3)
    );
}

function scheduleStepsProgressUpdate() {
    if (stepsProgressTimer !== null) {
        return;
    }

    stepsProgressTimer = window.setTimeout(() => {
        updateStepsProgress();
        stepsProgressTimer = null;
    }, 20);
}

if (stepsList) {
    updateStepsProgress();

    window.addEventListener(
        "scroll",
        scheduleStepsProgressUpdate
    );

    window.addEventListener(
        "resize",
        scheduleStepsProgressUpdate
    );
}

    const form = document.querySelector("#contact-form");
    const formStatus = document.querySelector("#form-status");

    if (!form || !formStatus) {
        console.error("Não foi possível encontrar o formulário.");
        return;
    }

    const fields = [
        {
            element: document.querySelector("#name"),
            error: document.querySelector("#name-error"),
            message: "Falta o teu nome."
        },
        {
            element: document.querySelector("#email"),
            error: document.querySelector("#email-error"),
            message: "Falta o teu email. Precisamos dele para te responder."
        },
        {
            element: document.querySelector("#situation"),
            error: document.querySelector("#situation-error"),
            message: "Escolhe a opção que melhor descreve a tua situação."
        },
        {
            element: document.querySelector("#message"),
            error: document.querySelector("#message-error"),
            message: "Conta-nos brevemente o que precisas."
        }
    ];

    function showError(field, message) {
        field.element.classList.add("invalid");
        field.element.setAttribute("aria-invalid", "true");
        field.error.textContent = message;
    }

    function clearError(field) {
        field.element.classList.remove("invalid");
        field.element.removeAttribute("aria-invalid");
        field.error.textContent = "";
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function validateField(field) {
        const value = field.element.value.trim();

        clearError(field);

        if (value === "") {
            showError(field, field.message);
            return false;
        }

        if (
            field.element.id === "email" &&
            !validateEmail(value)
        ) {
            showError(
                field,
                "Introduz um endereço de email válido."
            );

            return false;
        }

        return true;
    }

    fields.forEach((field) => {
        field.element.addEventListener("blur", () => {
            validateField(field);
        });

        field.element.addEventListener("input", () => {
            if (field.element.classList.contains("invalid")) {
                validateField(field);
            }
        });

        field.element.addEventListener("change", () => {
            if (field.element.classList.contains("invalid")) {
                validateField(field);
            }
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        formStatus.textContent = "";

        const results = fields.map((field) => {
            return validateField(field);
        });

        const formIsValid = results.every((result) => {
            return result === true;
        });

        if (!formIsValid) {
            formStatus.textContent =
                "Confirma os campos assinalados antes de enviares.";

            const firstInvalidField = form.querySelector(".invalid");

            if (firstInvalidField) {
                firstInvalidField.focus();
            }

            return;
        }

        formStatus.textContent =
            "Formulário validado. Por ser um projeto demonstrativo, a mensagem não foi enviada.";

        form.reset();
        fields.forEach((field) => {
    clearError(field);
});
        });
});
