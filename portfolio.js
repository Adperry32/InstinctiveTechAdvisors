document.addEventListener("DOMContentLoaded", () => {
    /************ SECTION 1: Select Elements and Initialize Variables ************/
    const canvas = document.getElementById("logoCanvas"); // Canvas element for animated logos
    const ctx = canvas.getContext("2d"); // Canvas 2D rendering context
    const logos = []; // Array to store all logo objects
    const logoCount = 10; // Number of logos to animate

    // *** ADJUST LOGO SIZE HERE ***
    // Initial logo size, can be adjusted based on your preference
    let logoSize = 120; 

    const fadeElements = document.querySelectorAll('.fade-in'); // Elements for fade-in animations
    const dropdownLinks = document.querySelectorAll('.dropdown-content a'); // Links in the dropdown menu
    const popupContainer = document.getElementById("popupForm"); // Popup container for contact form
    const closePopupButton = document.getElementById("closePopup"); // Button to close the popup
    const popupForm = document.getElementById("contactForm"); // Popup contact form
    const footerForm = document.getElementById("contact"); // Footer contact form
    const learnMoreButtons = document.querySelectorAll(".spacer-button, .banner button"); // Buttons to trigger popup
    let popupFormSubmitted = false; // Flag to prevent multiple submissions of the popup form
    let footerFormSubmitted = false; // Flag to prevent multiple submissions of the footer form

    const logoImages = [
        "logos/echelon.JPG",
        "logos/fullsaillogo.JPG",
        "logos/iHeart.JPG",
        "logos/kwLogo.JPG",
        "logos/plaid.PNG",
        "logos/skillstorm-logo.PNG",
        "logos/walgreens.PNG",
        "logos/wyndham.PNG", 
        "logos/fitstir.PNG",
        "logos/revvi.PNG"
    ];

    /************ SECTION 2: Resize Canvas and Adjust Logo Size ************/
    function adjustLogoSize() {
        // *** ADJUST LOGO SIZE HERE ***
        // Adjust logo size based on canvas width or other conditions
        // For example, scale logo size proportionally to canvas width, with limits.
        logoSize = Math.max(100, Math.min(150, canvas.width / 10));
        console.log(`Adjusted logo size: ${logoSize}px`); // Log for debugging purposes
    }

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        adjustLogoSize(); // Adjust the logo size whenever the canvas is resized

        // Log resizing information for debugging
        console.log(`Canvas resized: width=${canvas.width}, height=${canvas.height}`);

        // Adjust logo positions proportionally to the new canvas size
        logos.forEach(logo => {
            logo.x = Math.random() * (canvas.width - logoSize);
            logo.y = Math.random() * (canvas.height - logoSize + 2);
        });
    }

    resizeCanvas(); // Set initial size of the canvas
    window.addEventListener("resize", resizeCanvas); // Resize canvas on window resize

    /************ SECTION 3: Logo Class ************/
    class Logo {
        constructor(imageSrc, x, y, dx, dy) {
            this.image = new Image();
            this.image.src = imageSrc;
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.image.onload = () => {
                this.draw();
            };
        }

        draw() {
            // *** ADJUST LOGO SIZE HERE ***
            // Draw logo using the dynamically adjusted size
            ctx.drawImage(this.image, this.x, this.y, logoSize, logoSize);
        }

        update() {
            // Bounce off the edges
            if (this.x <= 0 || this.x + logoSize >= canvas.width) this.dx *= -1;
            if (this.y <= 0 || this.y + logoSize >= canvas.height) this.dy *= -1;

            // Check for collisions with other logos
            for (const other of logos) {
                if (other === this) continue;

                const distance = Math.hypot(this.x - other.x, this.y - other.y);
                if (distance < logoSize) {
                    // Simple collision response by reversing direction
                    const angle = Math.atan2(this.y - other.y, this.x - other.x);
                    this.dx = Math.cos(angle);
                    this.dy = Math.sin(angle);
                    other.dx = -Math.cos(angle);
                    other.dy = -Math.sin(angle);
                }
            }

            // Update positions
            this.x += this.dx;
            this.y += this.dy;

            // Draw the updated position
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
                
                // Check if the new logo overlaps with any existing logo
                for (const logo of logos) {
                    const distance = Math.hypot(x - logo.x, y - logo.y);
                    if (distance < logoSize) {
                        overlapping = true;
                        break;
                    }
                }
            } while (overlapping);

            const dx = (Math.random() - 0.5) * 1.5; // Slower velocity in x direction
            const dy = (Math.random() - 0.5) * 1.5; // Slower velocity in y direction
            const logo = new Logo(logoImages[i % logoImages.length], x, y, dx, dy);
            logos.push(logo);
        }
    }

    initializeLogos();

    /************ SECTION 5: Animate Logos ************/
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before each redraw
        logos.forEach(logo => logo.update()); // Update each logo's position
        requestAnimationFrame(animate); // Request the next frame for animation
    }

    animate(); // Start the animation loop

    /************ SECTION 6: Fade-In Animations ************/
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    });

    fadeElements.forEach(el => observer.observe(el));

    /************ SECTION 7: Smooth Scrolling for Navigation ************/
    dropdownLinks.forEach(link => {
        link.addEventListener('click', event => {
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

        emailjs.send("service_g9gvw04", "template_xgp1r5q", popupFormData)
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

    learnMoreButtons.forEach(button => {
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

        emailjs.send("service_g9gvw04", "template_2jplk7p", footerFormData)
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
