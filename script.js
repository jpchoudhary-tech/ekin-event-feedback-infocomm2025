// --- PASTE YOUR GOOGLE APPS SCRIPT URL HERE ---
const SCRIPT_URL = 'https://script.google.com/a/macros/ensonic.in/s/AKfycbxbk90cEAZkexlJROo34r3z7x82sAzw2Cmnx7ASUSq48y8JwoxynqnDZBBEgU20TB1TYg/exec'; 

// Get the form and other elements from the HTML
const form = document.getElementById('feedback-form');
const submitButton = document.getElementById('submit-btn');
const formContainer = document.querySelector('.form-container');
const thankYouMessage = document.getElementById('thank-you-message');

// --- Star Rating Logic ---
document.querySelectorAll('.star-rating').forEach(ratingGroup => {
    const stars = ratingGroup.querySelectorAll('.star');
    const hiddenInputId = ratingGroup.id + '-value';
    const hiddenInput = document.getElementById(hiddenInputId);

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');
            hiddenInput.value = value;
            stars.forEach(s => {
                s.classList.toggle('selected', s.getAttribute('data-value') <= value);
            });
        });
    });
});

// --- Form Submission Logic ---
form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // --- UPDATED FETCH REQUEST ---
    // This new version properly handles the cross-origin request and response.
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data) 
    })
    .then(response => {
        if (!response.ok) {
            // If the server response is not OK (e.g., 404 or 500), throw an error.
            throw new Error('Network response was not ok');
        }
        return response.json(); // We expect a JSON response from the Google Script.
    })
    .then(data => {
        console.log('Success:', data); // Log the success response from the script.
        
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
    .catch(error => {
        // Handle any errors that occurred during the fetch.
        console.error('Error:', error);
        alert('An error occurred while submitting. Please try again.');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Feedback';
    });
});


