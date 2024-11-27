document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('.dropdown-content a');
    const moreLinks = document.querySelectorAll('.more-link');
    const popupContainer = document.getElementById("popupForm");
    const closePopupButton = document.getElementById("closePopup");
    const popupForm = document.getElementById("contactForm");
    const footerForm = document.getElementById("contact");
    const learnMoreButtons = document.querySelectorAll(".spacer-button, .banner button");
    const header = document.querySelector('header');
    const headerOffset = header ? header.offsetHeight : 0; // Header height as offset
    let isScrolling = false; // Lock to prevent multiple scrolls

    /************ SECTION 1: Smooth Scroll with Animation Frame ************/
    const smoothScrollTo = (targetPosition) => {
        let startPosition = window.scrollY;
        let distance = targetPosition - startPosition;
        let duration = 800; // Scroll duration in ms
        let startTime = null;

        const easeInOutQuad = (time, start, change, duration) => {
            time /= duration / 2;
            if (time < 1) return change / 2 * time * time + start;
            time--;
            return -change / 2 * (time * (time - 2) - 1) + start;
        };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            let timeElapsed = currentTime - startTime;
            let nextPosition = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, nextPosition);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                isScrolling = false; // Unlock scrolling
            }
        };

        requestAnimationFrame(animation);
    };

    links.forEach(link => {
        link.addEventListener('click', event => {
            if (isScrolling) return; // Prevent multiple scroll actions
            event.preventDefault();
            isScrolling = true; // Lock scrolling while animating

            const targetId = link.getAttribute("href").split("#")[1];
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                // Smooth scroll with offset adjustment
                smoothScrollTo(offsetPosition);

                // Update the URL hash without jumping
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });

    // Handle page load with a hash in the URL (e.g., servicesPage.html#service1)
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            setTimeout(() => {
                const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                // Smooth scroll with offset adjustment
                smoothScrollTo(offsetPosition);
            }, 200); // Delay to ensure all content is fully loaded
        }
    }

    /************ SECTION 2: Popup Form Handling ************/
    // Handle popup form submission
    popupForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

        if (popupFormSubmitted) {
            alert("You have already submitted your request. Thank you!");
            return;
        }

        // Gather popup form data
        const popupFormData = {
            first_name: document.getElementById("firstName").value.trim(),
            last_name: document.getElementById("lastName").value.trim(),
            company_name: document.getElementById("companyName").value.trim() || "N/A",
            email: document.getElementById("email").value.trim(),
            contact_time: document.querySelector("input[name='contactTime']:checked")?.value.trim() || "No Preference",
            phone: document.getElementById("phone").value.trim(),
            message: document.getElementById("message").value.trim || "No message provided",
        };

        // Send email using EmailJS
        emailjs.send("service_g9gvw04", "template_xgp1r5q", popupFormData)
            .then(() => {
                alert("Your message has been sent successfully!");
                popupContainer.style.visibility = "hidden";
                popupContainer.style.opacity = "0";
                popupContainer.style.display = "none"; // Fallback for hiding
                popupForm.reset();
                popupFormSubmitted = true; // Prevent further submissions
            })
            .catch((error) => {
                alert("Failed to send your message. Please try again later.");
                console.error("EmailJS Error:", error);
            });
    });

    // Close popup form on button click
    closePopupButton.addEventListener("click", () => {
        popupContainer.style.visibility = "hidden";
        popupContainer.style.opacity = "0";
        popupForm.reset();
    });

    // Show popup when learn more buttons are clicked
    learnMoreButtons.forEach(button => {
        button.addEventListener("click", () => {
            popupContainer.style.visibility = "visible";
            popupContainer.style.opacity = "1";
        });
    });

    /************ SECTION 3: Footer Form Handling ************/
    // Handle footer form submission
    footerForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

        if (footerFormSubmitted) {
            alert("You have already submitted your request. Thank you!");
            return;
        }

        // Gather footer form data
        const footerFormData = {
            name: document.getElementById("footerName").value.trim(),
            email: document.getElementById("footerEmail").value.trim(),
            message: document.getElementById("footerMessage").value.trim(),
        };

        // Validate form inputs
        if (!footerFormData.name || !footerFormData.email || !footerFormData.message) {
            alert("Please fill in all fields.");
            return;
        }

        // Send email using EmailJS
        emailjs.send("service_g9gvw04", "template_2jplk7p", footerFormData)
            .then(() => {
                alert("Thank you for contacting us! We'll get back to you soon.");
                footerForm.style.display = "none"; // Hide the form after submission
                footerFormSubmitted = true; // Prevent further submissions
                footerForm.reset(); // Clear the form
            })
            .catch((error) => {
                alert("Failed to send your message. Please try again later.");
                console.error("EmailJS Error (Footer Form):", error);
                footerFormSubmitted = false; // Allow resubmission
            });
    });

    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute("href").split("#")[1];
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                // Smooth scroll with offset adjustment
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Update the URL hash without jumping
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });


    /********* SECTION 4: Reveal Services on Scroll (Optimized with Intersection Observer) *********/
    const services = document.querySelectorAll(".service");
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is in view
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    services.forEach(service => {
        observer.observe(service);
    });

    /********* SECTION 5: Expanding TextView of Descriptions *************/
    moreLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Dynamically find the closest parent container
            const container = event.target.closest('.service, .foundation-article');
            if (!container) return;

            // Select the more text within the container
            const moreText = container.querySelector('.more-text');
            if (!moreText) return;

            // Toggle visibility
            if (moreText.style.display === 'none' || !moreText.style.display) {
                moreText.style.display = 'inline';
                event.target.textContent = 'less...';
            } else {
                moreText.style.display = 'none';
                event.target.textContent = 'more...';
            }
        });
    });

});
