document.addEventListener("DOMContentLoaded", () => {
    // Select elements for fade-in animations, dropdown links, popup handling, and forms
    const fadeElements = document.querySelectorAll('.fade-in'); // Elements to apply fade-in animation
    const dropdownLinks = document.querySelectorAll('.dropdown-content a'); // Links in the dropdown menu
    const popupContainer = document.getElementById("popupForm"); // Container for the popup contact form
    const closePopupButton = document.getElementById("closePopup"); // Button to close the popup
    const popupForm = document.getElementById("contactForm"); // Popup contact form element
    const footerForm = document.getElementById("contact"); // Footer contact form element
    const learnMoreButtons = document.querySelectorAll(".spacer-button, .banner button"); // Buttons to trigger the popup
    const logoLink = document.getElementById('home-logo');
    let popupFormSubmitted = false; // Flag to prevent multiple submissions of the popup form
    let footerFormSubmitted = false; // Flag to prevent multiple submissions of the footer form

    /************ SECTION 1: Fade-In Animations ************/
    // Set up IntersectionObserver to animate elements when they enter the viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('service-item')) {
                    // Apply fade-in styles to non-service-item elements
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = "translateY(0)";
                } else {
                    // Add 'visible' class to service items for CSS transitions
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target); // Stop observing the element once animated
            }
        });
    });

    // Observe each element with the class 'fade-in'
    fadeElements.forEach(el => observer.observe(el));

    /************ SECTION 2: Popup Form Handling ************/
    // Handle popup form submission
    popupForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        if (popupFormSubmitted) {
            alert("You have already submitted your request. Thank you!");
            return;
        }

        // Collect input values from the popup form
        const popupFormData = {
            first_name: document.getElementById("firstName").value.trim(),
            last_name: document.getElementById("lastName").value.trim(),
            company_name: document.getElementById("companyName").value.trim() || "N/A",
            email: document.getElementById("email").value.trim(),
            contact_time: document.querySelector("input[name='contactTime']:checked")?.value.trim() || "No Preference",
            phone: document.getElementById("phone").value.trim(),
            message: document.getElementById("message").value.trim() || "No message provided",
        };

        // Send the form data using EmailJS
        emailjs.send("service_g9gvw04", "template_xgp1r5q", popupFormData)
            .then(() => {
                alert("Your message has been sent successfully!");
                popupContainer.style.visibility = "hidden"; // Hide the popup
                popupContainer.style.opacity = "0";
                popupContainer.style.display = "none"; // Fallback for older browsers
                popupForm.reset(); // Reset the form fields
                popupFormSubmitted = true; // Mark the form as submitted
            })
            .catch((error) => {
                alert("Failed to send your message. Please try again later.");
                console.error("EmailJS Error:", error);
            });
    });

    // Close the popup when the close button is clicked
    closePopupButton.addEventListener("click", () => {
        popupContainer.style.visibility = "hidden";
        popupContainer.style.opacity = "0";
        popupForm.reset(); // Reset form fields when popup is closed
    });

    // Show the popup when "Learn More" buttons are clicked
    learnMoreButtons.forEach(button => {
        button.addEventListener("click", () => {
            popupContainer.style.visibility = "visible"; // Make popup visible
            popupContainer.style.opacity = "1"; // Fade in effect
        });
    });

    /************ SECTION 3: Footer Form Handling ************/
    // Handle footer form submission
    footerForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        if (footerFormSubmitted) {
            alert("You have already submitted your request. Thank you!");
            return;
        }

        // Collect input values from the footer form
        const footerFormData = {
            name: document.getElementById("footerName").value.trim(),
            email: document.getElementById("footerEmail").value.trim(),
            message: document.getElementById("footerMessage").value.trim(),
        };

        // Validate that all fields are filled out
        if (!footerFormData.name || !footerFormData.email || !footerFormData.message) {
            alert("Please fill in all fields.");
            return;
        }

        // Send the form data using EmailJS
        emailjs.send("service_g9gvw04", "template_2jplk7p", footerFormData)
            .then(() => {
                alert("Thank you for contacting us! We'll get back to you soon.");
                footerForm.style.display = "none"; // Hide the form after submission
                footerFormSubmitted = true; // Mark the form as submitted
                footerForm.reset(); // Reset the form fields
            })
            .catch((error) => {
                alert("Failed to send your message. Please try again later.");
                console.error("EmailJS Error (Footer Form):", error);
                footerFormSubmitted = false; // Allow resubmission if an error occurs
            });
    });

    /************ SECTION 4: Smooth Scrolling for Dropdown Links ************/
    // Add smooth scrolling behavior to dropdown menu links
    dropdownLinks.forEach(link => {
        link.addEventListener('click', event => {
            const targetHref = link.getAttribute("href");
            const [page, sectionId] = targetHref.split("#");

            if (window.location.pathname.includes(page)) {
                // If the link points to a section on the current page
                event.preventDefault();
                const targetSection = document.getElementById(sectionId);

                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to section
                    history.pushState(null, null, `#${sectionId}`); // Update URL without reloading
                }
            } else {
                // Allow default navigation for links to other pages
                return;
            }
        });
    });

    // Handle page load with a hash in the URL (e.g., servicesPage.html#service1)
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1); // Extract the hash value
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to section
            }, 0); // Delay to ensure the DOM is fully loaded
        }
    }

    /*******SECTION 5 Header Icon Handling********/
    logoLink.addEventListener('click', function (event) {
        // Check if we're on the home page
        if (window.location.pathname.includes("homePage.html")) {
            // Prevent the default link behavior
            event.preventDefault();
            // Scroll to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

});


