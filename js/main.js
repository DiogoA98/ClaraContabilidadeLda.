"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const logoHome = document.querySelector("#logo-home");

    if (logoHome) {
        logoHome.addEventListener("click", () => {
        window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
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
            "Mensagem enviada. Respondemos até ao fim do dia útil seguinte.";

        form.reset();
    });
});
