// Temporary data storage
let eventSignups = [];

// Grab refs to the DOM elements
const form = document.getElementById('event-signup-form');
const successMessage = document.getElementById('success-message');
const signupsList = document.getElementById('signups-list');

// Form field elements
const eventNameInput = document.getElementById('event-name');
const representativeNameInput = document.getElementById('representative-name');
const representativeEmailInput = document.getElementById('representative-email');  
const roleSelect = document.getElementById('role-selection'); 

// Helper function for validating required fields (for unit testing)
const validateRequiredField = (value) => {
    return value.trim() !== '';
}

// Helper function for validating email (for unit testing)
const validateEmail = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(email);
}

// Listen for form submission
form.addEventListener("submit", (event) => {
    // Prevent the form from submitting
    event.preventDefault();

    // Hide success message
    successMessage.classList.add('hidden');

    // Clear all previous error messages
    const errorMessages = document.querySelectorAll(".error-message");
    for(const el of errorMessages) {
        el.innerText = ''; 
    }

    // Clear error styling
    const inputs = form.querySelectorAll('input, select');
    for(const input of inputs) {
        input.classList.remove('error');
    }

    // Evaluate the return of the validateForm function
    if(validateForm()) {
        // Get form data
        const formData = {
            eventName: eventNameInput.value,
            representativeName: representativeNameInput.value,
            representativeEmail: representativeEmailInput.value,
            role: roleSelect.value
        };

        // Process and store data
        const signupData = processFormData(formData);
        eventSignups.push(signupData);

        // Show success message
        successMessage.classList.remove('hidden');

        // Reset form
        form.reset();

        // Render updated signups list
        renderSignups();

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);

        console.log("Event signup successful");
    } else {
        console.log("Validation failed");  
    }
});

// Where the heavy lifting for validation is done
const validateForm = () => {
    let isValid = true;

    // Validate Event Name
    if (!validateRequiredField(eventNameInput.value)) {
        showInputError(eventNameInput, "Event name is required");  
        isValid = false; 
    }

    // Validate Representative Name
    if (!validateRequiredField(representativeNameInput.value)) {
        showInputError(representativeNameInput, "Representative name is required");  
        isValid = false; 
    }

    // Validate Representative Email
    const emailValue = representativeEmailInput.value.trim();
    
    if(!validateRequiredField(emailValue)) {
        showInputError(representativeEmailInput, "Email is required");  
        isValid = false;
    } else if(!validateEmail(emailValue)) {  
        showInputError(representativeEmailInput, "Please enter a valid email address"); 
        isValid = false;   
    }

    // Validate Role Selection
    if (!validateRequiredField(roleSelect.value)) {
        showInputError(roleSelect, "Please select a role");  
        isValid = false; 
    }

    return isValid; 
}

// This function displays an error message next to a form input
const showInputError = (inputElement, message) => {
    // Find the error message span for this input
    const errorDisplay = inputElement.parentElement.querySelector('.error-message');
    errorDisplay.innerText = message;
    errorDisplay.setAttribute("role", "alert"); 

    // Add error styling to the input
    inputElement.classList.add('error');
}




// Export functions for testing
if (typeof module !== 'undefined' && module.exports) { 
    module.exports = {
        validateRequiredField,
        validateEmail,
        processFormData,
        validateForm,


    };
} 
