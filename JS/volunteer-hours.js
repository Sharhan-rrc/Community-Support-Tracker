// Temporary data storage (Stage One requirement)
let tempVolunteerData = {};

// Initialize when DOM is ready. Attach immediately if DOM already loaded
if (typeof document !== 'undefined') {
    const init = function() {
        const volunteerForm = document.getElementById('volunteerForm');
        if (volunteerForm) {
            volunteerForm.addEventListener('submit', handleFormSubmit);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

/**
 * Handles form submission
 * @param {Event} e - The submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    // Validate form
    if (validateForm()) {
        // Collect form data
        collectFormData();
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        const form = document.getElementById('volunteerForm');
        if (form) {
            form.reset();
        }
        
        // Log data for verification (Stage One requirement)
        console.log('Volunteer Hours Data Stored:', tempVolunteerData);
    }
}

/**
 * Validates all form inputs
 * @returns {boolean} - Returns true if all validations pass
 */
function validateForm() {
    let isValid = true;
    
    // Validate charity name
    const charityName = document.getElementById('charityName');
    if (!charityName || !charityName.value.trim()) {
        showError('charityName', 'Charity name is required');
        isValid = false;
    }
    
    // Validate hours volunteered
    const hoursVolunteered = document.getElementById('hoursVolunteered');
    if (!hoursVolunteered) {
        return false;
    }
    
    const hours = parseFloat(hoursVolunteered.value);
    if (!hoursVolunteered.value || hours <= 0 || isNaN(hours)) {
        showError('hoursVolunteered', 'Please enter valid hours volunteered');
        isValid = false;
    }
    
    // Validate date
    const volunteerDate = document.getElementById('volunteerDate');
    if (!volunteerDate || !volunteerDate.value) {
        showError('volunteerDate', 'Date is required');
        isValid = false;
    }
    
    // Validate experience rating
    const experienceRating = document.getElementById('experienceRating');
    if (!experienceRating) {
        return false;
    }
    
    const rating = parseInt(experienceRating.value);
    if (!experienceRating.value || rating < 1 || rating > 5 || isNaN(rating)) {
        showError('experienceRating', 'Rating must be between 1 and 5');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Collects form data and stores in temporary object
 */
function collectFormData() {
    const charityName = document.getElementById('charityName');
    const hoursVolunteered = document.getElementById('hoursVolunteered');
    const volunteerDate = document.getElementById('volunteerDate');
    const experienceRating = document.getElementById('experienceRating');
    
    tempVolunteerData = {
        charityName: charityName ? charityName.value.trim() : '',
        hoursVolunteered: hoursVolunteered ? parseFloat(hoursVolunteered.value) : 0,
        volunteerDate: volunteerDate ? volunteerDate.value : '',
        experienceRating: experienceRating ? parseInt(experienceRating.value) : 0,
        timestamp: new Date().toISOString()
    };
}

/**
 * Displays error message for a specific field
 * @param {string} fieldId - The ID of the form field
 * @param {string} message - The error message to display
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Clears all error messages and styling
 */
function clearErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    });
}

/**
 * Shows success message after form submission
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
}

/**
 * Gets the current temporary volunteer data
 * @returns {object} - The temporary volunteer data
 */
function getTempVolunteerData() {
    return tempVolunteerData;
}

/**
 * Sets the temporary volunteer data (for testing purposes)
 * @param {object} data - The data to set
 */
function setTempVolunteerData(data) {
    tempVolunteerData = data;
}

// Export functions for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        collectFormData,
        showError,
        clearErrors,
        showSuccessMessage,
        getTempVolunteerData,
        setTempVolunteerData,
        handleFormSubmit
    };
}