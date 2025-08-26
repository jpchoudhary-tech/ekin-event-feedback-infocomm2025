// --- PASTE YOUR GOOGLE APPS SCRIPT URL HERE ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9qaY9tINqeZEIFYjxrl4f8CSnHHJV3MFFnV7thNvxOJz9sfs1V3VMbysYR6k3GDO2/exec'; 

// Get the form and other elements from the HTML
const form = document.getElementById('ekin-event-feedback-infocomm2025');
const submitButton = document.getElementById('submit-btn');
const formContainer = document.querySelector('.form-container');
const thankYouMessage = document.getElementById('thank-you-message');

// --- Star Rating Logic ---
document.querySelectorAll('.star-rating').forEach(ratingGroup => {
    const stars = ratingGroup.querySelectorAll('.star');
    const hiddenInputId = ratingGroup.id + '-value'; // e.g., 'interest-level-value'
    const hiddenInput = document.getElementById(hiddenInputId);

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');
            hiddenInput.value = value; // Set the value on the hidden input

            // Visually update the stars
            stars.forEach(s => {
                s.classList.toggle('selected', s.getAttribute('data-value') <= value);
            });
        });
    });
});

// --- Form Submission Logic ---
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    // Create a FormData object from the form
    const formData = new FormData(form);
    const data = {};
    // The Apps Script expects a plain JSON object, so we convert FormData
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Send the data to the Google Apps Script
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for sending to Google Scripts
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(res => {
        // Show the thank you message
        form.classList.add('hidden');
        thankYouMessage.classList.remove('hidden');

        // Reset the form after a delay for the next user
        setTimeout(() => {
            form.reset();
            document.querySelectorAll('.star.selected').forEach(s => s.classList.remove('selected'));
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Feedback';
            
            form.classList.remove('hidden');
            thankYouMessage.classList.add('hidden');
        }, 5000); // Reset after 5 seconds
    })
    .catch(err => {
        // Handle errors
        console.error('Error:', err);
        alert('An error occurred. Please try again.');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Feedback';
    });

});

