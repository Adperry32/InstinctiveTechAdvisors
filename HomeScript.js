document.addEventListener("DOMContentLoaded", () => {


    /********Special section for mobile compatibility *********/
    function toggleMenu() {
        const nav = document.querySelector('nav'); // Your existing nav
        const mobileNav = document.getElementById('mobileMenu'); // Mobile nav
        nav.classList.toggle('show'); // For desktop
        mobileNav.classList.toggle('active'); // For mobile
    }
    

    /************ SECTION 1: Global Variables ************/
    const apiCache = new Map(); // Caching for API requests
    let requestCount = 0; // Request count for rate limiting
    const requestLimit = 10; // Max requests in a time window
    const timeWindow = 60000; // 1 minute in milliseconds
    let timeWindowStart = Date.now(); // Start of rate-limiting window
    const logoLink = document.getElementById('home-logo');
    const fadeElements = document.querySelectorAll('.fade-in'); // Elements for fade-in animation
    const popupContainer = document.getElementById("popupForm"); // Popup container for contact form
    const closePopupButton = document.getElementById("closePopup"); // Close button for popup
    const popupForm = document.getElementById("contactForm"); // Popup form element
    const footerForm = document.getElementById("contact"); // Footer form element
    const learnMoreButtons = document.querySelectorAll(".spacer-button, .banner button"); // Buttons that trigger popup
    let popupFormSubmitted = false; // Prevent multiple submissions for popup form
    let footerFormSubmitted = false; // Prevent multiple submissions for footer form

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
                alert("Thank you for contacting us! A team member will reach out within 48 hours.");
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

    /************ SECTION 4: Animation Handling ************/
    // IntersectionObserver for fade-in elements
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    });
    fadeElements.forEach(el => observer.observe(el));

    /***********SECTION 5: Card Flip animation for service section & service topic section **************/
    const serviceItems = document.querySelectorAll(".service-item, .service-itemTopics");
    serviceItems.forEach(item => {
        item.addEventListener("click", () => {
            item.classList.toggle("clicked");
        });
    });



    // Smooth scroll for dropdown content links
    if (window.location.pathname.includes("servicesPage.html")) {
        const links = document.querySelectorAll('.dropdown-content a');
        links.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const targetId = link.getAttribute("href").split("#")[1];
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" });
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });
    }

    /************ SECTION 6: Quote Section Animation ************/
    const quoteSection = document.querySelector(".quote-section");
    const quoteLines = document.querySelectorAll(".quote-line");

    if (quoteSection && quoteLines.length > 0) {
        quoteLines.forEach((line, index) => {
            line.classList.add(index % 2 === 0 ? "line-left" : "line-right");
        });

        const quoteObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    quoteLines.forEach((line, index) => {
                        setTimeout(() => {
                            line.classList.add("visible");
                        }, index * 500); // Stagger animation
                    });
                    quoteObserver.unobserve(entry.target);
                }
            });
        });

        quoteObserver.observe(quoteSection);
    }

    /************ SECTION 7: API Request Handling ************/
    function makeApiRequest(endpoint, options) {
        const now = Date.now();
        if (requestCount >= requestLimit && now - timeWindowStart < timeWindow) {
            console.warn("Request limit reached. Try again later.");
            return Promise.reject(new Error("Request limit reached. Try again later."));
        } else if (now - timeWindowStart >= timeWindow) {
            requestCount = 0;
            timeWindowStart = now;
        }

        if (apiCache.has(endpoint)) {
            return Promise.resolve(apiCache.get(endpoint));
        }

        requestCount++;
        return fetch(endpoint, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                apiCache.set(endpoint, data);
                return data;
            })
            .catch(error => {
                console.error("Error fetching API data:", error);
                throw error;
            });
    }

    // Example: Fetch link previews
    const urls = [
        // List of URLs to fetch previews
        'https://theclose.com/real-estate-blogs/',
        'https://geekestateblog.com/',
        'https://www.bigcommerce.com/articles/ecommerce/ecommerce-trends/',
        'https://www.syskit.com/blog/microsoft-power-platform-in-numbers/',
        'https://toolyt.com/blog/ai-artificial-intelligence/role-of-ai-and-machine-learning-in-modern-crm-platforms/',
        'https://educate360.com/blog/benefits-of-continuous-learning-and-development/',
        'https://www.revfine.com/technology-trends-hospitality-industry/',
        'https://corehandf.com/2024-fitness-trends-personalization-wellness-digital-technology/'
    ];

    urls.forEach(url => {
        fetchLinkPreview(url);
    });

    async function fetchLinkPreview(url) {
        try {
            const endpoint = `https://api.linkpreview.net/?key=590a461bbaa3aa105fb6374ed426221a&q=${encodeURIComponent(url)}`;
            const data = await makeApiRequest(endpoint);

            const topicItem = document.createElement('div');
            topicItem.className = 'topic-item';
            topicItem.innerHTML = `
                <a href="${data.url}" target="_blank">
                    <img src="${data.image}" alt="Preview Image" class="topic-image">
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                </a>
            `;

            document.querySelector('.topics-container').appendChild(topicItem);
        } catch (error) {
            console.error("Error fetching preview:", error);
        }
    }

    /*******SECTION 8 Header Icon Handling********/
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

   

