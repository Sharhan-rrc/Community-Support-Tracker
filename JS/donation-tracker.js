// Temporary data storage (Stage One requirement)
let tempDonationData = {};

// Get form elements
const donationForm = document.getElementById('donationForm');
const successMessage = document.getElementById('successMessage');

// Form submission handler
donationForm.addEventListener('submit', function(e) {
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
        donationForm.reset();
        
        // Log data for verification (Stage One requirement)
        console.log('Donation Data Stored:', tempDonationData);
    }
});

/**
 * Validates all form inputs
 * @returns {boolean} - Returns true if all validations pass
 */
function validateForm() {
    let isValid = true;
    
    // Validate charity name
    const charityName = document.getElementById('charityName');
    if (!charityName.value.trim()) {
        showError('charityName', 'Charity name is required');
        isValid = false;
    }
    
    // Validate donation amount
    const donationAmount = document.getElementById('donationAmount');
    const amount = parseFloat(donationAmount.value);
    if (!donationAmount.value || amount <= 0 || isNaN(amount)) {
        showError('donationAmount', 'Please enter a valid donation amount');
        isValid = false;
    }
    
    // Validate date
    const donationDate = document.getElementById('donationDate');
    if (!donationDate.value) {
        showError('donationDate', 'Date is required');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Collects form data and stores in temporary object
 */
function collectFormData() {
    tempDonationData = {
        charityName: document.getElementById('charityName').value.trim(),
        donationAmount: parseFloat(document.getElementById('donationAmount').value),
        donationDate: document.getElementById('donationDate').value,
        donorComment: document.getElementById('donorComment').value.trim() || 'No comment provided',
        timestamp: new Date().toISOString()
    };
}

/**
 * Displays error message for a specific field
 * @param {string} fieldId - The ID of the form field
 * @param {string} message - The error message to display
 */
function showError(fieldId, message) {
    const formGroup = document.getElementById(fieldId).closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    errorElement.textContent = message;
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
    successMessage.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        collectFormData,
        tempDonationData
    };
}