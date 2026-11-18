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
        clearActiveNavigation();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

if (
    navigationLinks.length > 0 &&
    navigationSections.length > 0 &&
    "IntersectionObserver" in window
) {
    const navigationObserver = new IntersectionObserver(
    (entries) => {
        if (isReturningToTop) {
            return;
        }

        if (navigationTargetId) {
            const targetReached = entries.some((entry) => {
                return (
                    entry.target.id === navigationTargetId &&
                    entry.isIntersecting
                );
            });

            if (targetReached) {
                setActiveNavigation(navigationTargetId);
                navigationTargetId = null;
            }

            return;
        }

        const visibleSections = entries
            .filter((entry) => entry.isIntersecting)
            .sort((firstEntry, secondEntry) => {
                return (
                    secondEntry.intersectionRatio -
                    firstEntry.intersectionRatio
                );
            });

        if (visibleSections.length > 0) {
            setActiveNavigation(
                visibleSections[0].target.id
            );
        }
    },
    {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
    }
);

    navigationSections.forEach((section) => {
        navigationObserver.observe(section);
    });

        navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const sectionId = link
            .getAttribute("href")
            .slice(1);

        navigationTargetId = sectionId;
        setActiveNavigation(sectionId);
    });
});
}

window.addEventListener("scroll", () => {
    if (window.scrollY <= 10) {
        isReturningToTop = false;
        clearActiveNavigation();
    }
});

const placeholderLinks = document.querySelectorAll('a[href="#"]');

placeholderLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
    });
});

const claraSlides = Array.from(
    document.querySelectorAll("[data-clara-slide]")
);

const claraSlider = document.querySelector(
    "[data-clara-slider]"
);

function showClaraSlide(index) {
    if (claraSlides.length === 0) {
        return;
    }

    const safeIndex = Math.max(
        0,
        Math.min(index, claraSlides.length - 1)
    );

    claraSlides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === safeIndex;

        slide.hidden = !isActive;
        slide.classList.toggle("is-active", isActive);
    });

    if (claraSlider) {
        claraSlider.value = String(safeIndex);
        claraSlider.setAttribute(
            "aria-valuetext",
            `Mensagem ${safeIndex + 1} de ${claraSlides.length}`
        );
    }
}

if (claraSlides.length > 0 && claraSlider) {
    claraSlider.max = String(claraSlides.length - 1);

    claraSlider.addEventListener("input", () => {
        showClaraSlide(Number(claraSlider.value));
    });

    showClaraSlide(0);
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
