document.addEventListener("DOMContentLoaded", () => {
    /************ SECTION 1: Select Elements and Initialize Variables ************/
    const canvas = document.getElementById("logoCanvas"); // Canvas element for animated logos
    const ctx = canvas.getContext("2d"); // Canvas 2D rendering context
    const logos = []; // Array to store all logo objects
    const logoCount = 10; // Number of logos to animate

    // Initial logo size
    let logoSize = 120;

    const fadeElements = document.querySelectorAll(".fade-in");
    const dropdownLinks = document.querySelectorAll(".dropdown-content a");
    const popupContainer = document.getElementById("popupForm");
    const closePopupButton = document.getElementById("closePopup");
    const popupForm = document.getElementById("contactForm");
    const footerForm = document.getElementById("contact");
    const learnMoreButtons = document.querySelectorAll(".spacer-button, .banner button");

    let popupFormSubmitted = false;
    let footerFormSubmitted = false;

    const logoImages = [
        "Logos/echelon.jpg",
        "Logos/fullsaillogo.JPG",
        "Logos/iHeart.JPG",
        "Logos/kwLogo.JPG",
        "Logos/plaid.PNG",
        "Logos/skillstorm-logo.PNG",
        "Logos/walgreens.PNG",
        "Logos/wyndham.PNG",
        "Logos/fitstir.png",
        "Logos/revvi.png",
    ];

    /************ SECTION 2: Resize Canvas and Adjust Logo Size ************/
    function adjustLogoSize() {
        logoSize = Math.max(100, Math.min(150, canvas.width / 10));
    }

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        adjustLogoSize();

        logos.forEach((logo) => {
            logo.x = Math.random() * (canvas.width - logoSize);
            logo.y = Math.random() * (canvas.height - logoSize);
        });
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /************ SECTION 3: Logo Class ************/
    class Logo {
        constructor(imageSrc, x, y, dx, dy) {
            this.image = new Image();
            this.image.src = imageSrc;
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.isLoaded = false;

            this.image.onload = () => {
                this.isLoaded = true;
                this.draw();
            };

            this.image.onerror = () => {
                console.error(`Failed to load image: ${imageSrc}`);
            };
        }

        draw() {
            if (this.isLoaded) {
                ctx.drawImage(this.image, this.x, this.y, logoSize, logoSize);
            }
        }

        update() {
            if (!this.isLoaded) return;

            if (this.x <= 0 || this.x + logoSize >= canvas.width) this.dx *= -1;
            if (this.y <= 0 || this.y + logoSize >= canvas.height) this.dy *= -1;

            for (const other of logos) {
                if (other === this) continue;

                const distance = Math.hypot(this.x - other.x, this.y - other.y);
                if (distance < logoSize) {
                    const angle = Math.atan2(this.y - other.y, this.x - other.x);
                    this.dx = Math.cos(angle);
                    this.dy = Math.sin(angle);
                    other.dx = -Math.cos(angle);
                    other.dy = -Math.sin(angle);
                }
            }

            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }

    /************ SECTION 4: Initialize Logos ************/
    function initializeLogos() {
        for (let i = 0; i < logoCount; i++) {
            let x, y;
            let overlapping;

            do {
                overlapping = false;
                x = Math.random() * (canvas.width - logoSize);
                y = Math.random() * (canvas.height - logoSize);

                for (const logo of logos) {
                    const distance = Math.hypot(x - logo.x, y - logo.y);
                    if (distance < logoSize) {
                        overlapping = true;
                        break;
                    }
                }
            } while (overlapping);

            const dx = (Math.random() - 0.5) * 1.5;
            const dy = (Math.random() - 0.5) * 1.5;
            const logo = new Logo(logoImages[i % logoImages.length], x, y, dx, dy);
            logos.push(logo);
        }
    }

    initializeLogos();

    /************ SECTION 5: Animate Logos ************/
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        logos.forEach((logo) => logo.update());
        requestAnimationFrame(animate);
    }

    animate();

    /************ SECTION 6: Fade-In Animations ************/
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    });

    fadeElements.forEach((el) => observer.observe(el));

    /************ SECTION 7: Smooth Scrolling for Navigation ************/
    dropdownLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetHref = link.getAttribute("href");
            const [page, sectionId] = targetHref.split("#");

            if (window.location.pathname.includes(page)) {
                event.preventDefault();
                const targetSection = document.getElementById(sectionId);

                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" });
                    history.pushState(null, null, `#${sectionId}`);
                }
            }
        });
    });

    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: "smooth" });
            }, 0);
        }
    }

    /************ SECTION 8: Popup Form Handling ************/
    popupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (popupFormSubmitted) {
            alert("You have already submitted your request. Thank you!");
            return;
        }

        const popupFormData = {
            first_name: document.getElementById("firstName").value.trim(),
            last_name: document.getElementById("lastName").value.trim(),
            company_name: document.getElementById("companyName").value.trim() || "N/A",
            email: document.getElementById("email").value.trim(),
            contact_time: document.querySelector("input[name='contactTime']:checked")?.value.trim() || "No Preference",
            phone: document.getElementById("phone").value.trim(),
            message: document.getElementById("message").value.trim() || "No message provided",
        };

        emailjs
            .send("service_g9gvw04", "template_xgp1r5q", popupFormData)
            .then(() => {
                alert("Your message has been sent successfully!");
                popupContainer.style.visibility = "hidden";
                popupContainer.style.opacity = "0";
                popupContainer.style.display = "none";
                popupForm.reset();
                popupFormSubmitted = true;
            })
            .catch((error) => {
                alert("Failed to send your message. Please try again later.");
                console.error("EmailJS Error:", error);
            });
    });

    closePopupButton.addEventListener("click", () => {
        popupContainer.style.visibility = "hidden";
        popupContainer.style.opacity = "0";
        popupForm.reset();
    });

    learnMoreButtons.forEach((button) => {
        button.addEventListener("click", () => {
            popupContainer.style.visibility = "visible";
            popupContainer.style.opacity = "1";
        });
    });

    /************ SECTION 9: Footer Form Handling ************/
    footerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (footerFormSubmitted) {
            alert("You have already submitted your request. Thank you!");
            return;
        }

        const footerFormData = {
            name: document.getElementById("footerName").value.trim(),
            email: document.getElementById("footerEmail").value.trim(),
            message: document.getElementById("footerMessage").value.trim(),
        };

        if (!footerFormData.name || !footerFormData.email || !footerFormData.message) {
            alert("Please fill in all fields.");
            return;
        }

        emailjs
            .send("service_g9gvw04", "template_2jplk7p", footerFormData)
            .then(() => {
                alert("Thank you for contacting us! We'll get back to you soon.");
                footerForm.style.display = "none";
                footerFormSubmitted = true;
                footerForm.reset();
            })
            .catch((error) => {
                alert("Failed to send your message. Please try again later.");
                console.error("EmailJS Error (Footer Form):", error);
                footerFormSubmitted = false;
            });
    });
});
