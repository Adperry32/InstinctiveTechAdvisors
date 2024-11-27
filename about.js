document.addEventListener("DOMContentLoaded", () => {

    const moreLinks = document.querySelectorAll('.more-link');

    /********* SECTION 1: Expanding TextView of Descriptions *************/
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

    /********* SECTION 2: Focus on Person Bio *************/
    document.querySelectorAll('.person').forEach(person => {
        person.addEventListener('click', () => {
            focusBio(person);
        });
    });

});



function focusBio(element) {
    const isFocused = element.classList.contains("focused");
    const allPersons = document.querySelectorAll(".person");
    const body = document.body;

    // Reset all persons if one is already focused
    allPersons.forEach((person) => person.classList.remove("focused"));

    if (!isFocused) {
        // Focus this one
        element.classList.add("focused");
        body.classList.add("dimmed");
    } else {
        // If clicked again, unfocus
        body.classList.remove("dimmed");
    }
}
