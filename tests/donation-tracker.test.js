/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the HTML file
const html = fs.readFileSync(
    path.resolve(__dirname, '../donation-tracker.html'),
    'utf8'
);

describe('Donation Tracker - Stage One Tests', () => {
    let donationTracker;
    
    beforeEach(() => {
        // Set up DOM
        document.documentElement.innerHTML = html;
        
        // Load the JavaScript module
        const scriptContent = fs.readFileSync(
            path.resolve(__dirname, '../js/donation-tracker.js'),
            'utf8'
        );
        
        // Execute script in test environment
        eval(scriptContent);
        
        // Get exported functions
        donationTracker = {
            validateForm,
            collectFormData,
            showError,
            clearErrors
        };
        
        // Initialize tempDonationData
        global.tempDonationData = {};
    });

    afterEach(() => {
        // Clean up
        document.documentElement.innerHTML = '';
    });

    // ===== INTEGRATION TESTS =====
    
    describe('Integration Tests', () => {
        test('submitting valid form updates temporary data object', () => {
            // Fill in form fields
            document.getElementById('charityName').value = 'Red Cross';
            document.getElementById('donationAmount').value = '500';
            document.getElementById('donationDate').value = '2024-01-15';
            document.getElementById('donorComment').value = 'Great cause!';
            
            // Trigger form submission
            const form = document.getElementById('donationForm');
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
            
            // Check if data was stored
            expect(tempDonationData.charityName).toBe('Red Cross');
            expect(tempDonationData.donationAmount).toBe(500);
            expect(tempDonationData.donationDate).toBe('2024-01-15');
            expect(tempDonationData.donorComment).toBe('Great cause!');
        });

        test('submitting invalid form shows error messages in DOM', () => {
            // Leave form fields empty
            document.getElementById('charityName').value = '';
            document.getElementById('donationAmount').value = '';
            document.getElementById('donationDate').value = '';
            
            // Trigger form submission
            const form = document.getElementById('donationForm');
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
            
            // Check if error messages are displayed
            const charityError = document.getElementById('charityNameError');
            const amountError = document.getElementById('amountError');
            const dateError = document.getElementById('dateError');
            
            expect(charityError.textContent).toBeTruthy();
            expect(amountError.textContent).toBeTruthy();
            expect(dateError.textContent).toBeTruthy();
        });

        test('form displays success message after valid submission', () => {
            // Fill in valid data
            document.getElementById('charityName').value = 'UNICEF';
            document.getElementById('donationAmount').value = '1000';
            document.getElementById('donationDate').value = '2024-02-01';
            
            // Submit form
            const form = document.getElementById('donationForm');
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
            
            // Check success message visibility
            const successMessage = document.getElementById('successMessage');
            expect(successMessage.style.display).toBe('block');
        });
    });

    // ===== UNIT TESTS =====
    
    describe('Unit Tests - Validation', () => {
        test('identifies empty charity name field', () => {
            document.getElementById('charityName').value = '';
            document.getElementById('donationAmount').value = '100';
            document.getElementById('donationDate').value = '2024-01-01';
            
            const isValid = donationTracker.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('identifies empty donation amount field', () => {
            document.getElementById('charityName').value = 'Save the Children';
            document.getElementById('donationAmount').value = '';
            document.getElementById('donationDate').value = '2024-01-01';
            
            const isValid = donationTracker.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('flags invalid donation amount (negative)', () => {
            document.getElementById('charityName').value = 'Charity';
            document.getElementById('donationAmount').value = '-50';
            document.getElementById('donationDate').value = '2024-01-01';
            
            const isValid = donationTracker.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('flags invalid donation amount (non-numeric)', () => {
            document.getElementById('charityName').value = 'Charity';
            document.getElementById('donationAmount').value = 'abc';
            document.getElementById('donationDate').value = '2024-01-01';
            
            const isValid = donationTracker.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('identifies missing date field', () => {
            document.getElementById('charityName').value = 'Red Cross';
            document.getElementById('donationAmount').value = '200';
            document.getElementById('donationDate').value = '';
            
            const isValid = donationTracker.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('accepts valid form data', () => {
            document.getElementById('charityName').value = 'World Wildlife Fund';
            document.getElementById('donationAmount').value = '750.50';
            document.getElementById('donationDate').value = '2024-03-15';
            
            const isValid = donationTracker.validateForm();
            
            expect(isValid).toBe(true);
        });
    });

    describe('Unit Tests - Data Processing', () => {
        test('collectFormData returns correct data object with valid inputs', () => {
            document.getElementById('charityName').value = 'Doctors Without Borders';
            document.getElementById('donationAmount').value = '1250.75';
            document.getElementById('donationDate').value = '2024-04-10';
            document.getElementById('donorComment').value = 'Keep up the great work!';
            
            donationTracker.collectFormData();
            
            expect(tempDonationData.charityName).toBe('Doctors Without Borders');
            expect(tempDonationData.donationAmount).toBe(1250.75);
            expect(tempDonationData.donationDate).toBe('2024-04-10');
            expect(tempDonationData.donorComment).toBe('Keep up the great work!');
            expect(tempDonationData.timestamp).toBeTruthy();
        });

        test('handles empty comment field with default message', () => {
            document.getElementById('charityName').value = 'Local Food Bank';
            document.getElementById('donationAmount').value = '300';
            document.getElementById('donationDate').value = '2024-05-01';
            document.getElementById('donorComment').value = '';
            
            donationTracker.collectFormData();
            
            expect(tempDonationData.donorComment).toBe('No comment provided');
        });

        test('correctly parses donation amount as number', () => {
            document.getElementById('charityName').value = 'Test Charity';
            document.getElementById('donationAmount').value = '999.99';
            document.getElementById('donationDate').value = '2024-06-01';
            
            donationTracker.collectFormData();
            
            expect(typeof tempDonationData.donationAmount).toBe('number');
            expect(tempDonationData.donationAmount).toBe(999.99);
        });
    });

    describe('Unit Tests - Error Handling', () => {
        test('showError displays error message for specific field', () => {
            donationTracker.showError('charityName', 'This field is required');
            
            const errorElement = document.getElementById('charityNameError');
            const formGroup = document.getElementById('charityName').closest('.form-group');
            
            expect(errorElement.textContent).toBe('This field is required');
            expect(formGroup.classList.contains('error')).toBe(true);
        });

        test('clearErrors removes all error messages and styling', () => {
            // Add some errors first
            donationTracker.showError('charityName', 'Error 1');
            donationTracker.showError('donationAmount', 'Error 2');
            
            // Clear errors
            donationTracker.clearErrors();
            
            const errorGroups = document.querySelectorAll('.form-group.error');
            expect(errorGroups.length).toBe(0);
        });
    });
});