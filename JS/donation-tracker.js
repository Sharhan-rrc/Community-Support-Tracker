// Temporary data storage (Stage One requirement)
let tempDonationData = {};

// Initialize when DOM is ready. Attach immediately if DOM already loaded
if (typeof document !== 'undefined') {
    const init = function() {
        const donationForm = document.getElementById('donationForm');
        if (donationForm) {
            donationForm.addEventListener('submit', handleFormSubmit);
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
        const form = document.getElementById('donationForm');
        if (form) {
            form.reset();
        }
        
        // Log data for verification (Stage One requirement)
        console.log('Donation Data Stored:', tempDonationData);
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
    
    // Validate donation amount
    const donationAmount = document.getElementById('donationAmount');
    if (!donationAmount) {
        return false;
    }
    
    const amount = parseFloat(donationAmount.value);
    if (!donationAmount.value || amount <= 0 || isNaN(amount)) {
        showError('donationAmount', 'Please enter a valid donation amount');
        isValid = false;
    }
    
    // Validate date
    const donationDate = document.getElementById('donationDate');
    if (!donationDate || !donationDate.value) {
        showError('donationDate', 'Date is required');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Collects form data and stores in temporary object
 */
function collectFormData() {
    const charityName = document.getElementById('charityName');
    const donationAmount = document.getElementById('donationAmount');
    const donationDate = document.getElementById('donationDate');
    const donorComment = document.getElementById('donorComment');
    
    tempDonationData = {
        charityName: charityName ? charityName.value.trim() : '',
        donationAmount: donationAmount ? parseFloat(donationAmount.value) : 0,
        donationDate: donationDate ? donationDate.value : '',
        donorComment: donorComment && donorComment.value.trim() ? donorComment.value.trim() : 'No comment provided',
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
 * Gets the current temporary donation data
 * @returns {object} - The temporary donation data
 */
function getTempDonationData() {
    return tempDonationData;
}

/**
 * Sets the temporary donation data (for testing purposes)
 * @param {object} data - The data to set
 */
function setTempDonationData(data) {
    tempDonationData = data;
}

// Export functions for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        collectFormData,
        showError,
        clearErrors,
        showSuccessMessage,
        getTempDonationData,
        setTempDonationData,
        handleFormSubmit
    };
}