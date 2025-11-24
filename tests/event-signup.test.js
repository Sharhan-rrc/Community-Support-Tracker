/**
 * @jest-environment jsdom
 */

const fs = require('fs'); 
const path = require('path');

describe('Event Signup - Stage One Tests', () => {
    let eventModule;
    
    beforeEach(() => {
        // Load HTML
        const html = fs.readFileSync(
            path.resolve(__dirname, '../event-signup.html'), 
            'utf8'
        );
        document.documentElement.innerHTML = html;
        
        // Clear module cache to get fresh instance
        jest.resetModules();
        
        // Import module
        eventModule = require('../JS/event-signup.js'); 
        
        // Reset eventSignups
        eventModule.setEventSignups([]);
    });

    afterEach(() => {
        document.documentElement.innerHTML = '';
    });

    // ===== INTEGRATION TESTS =====
    
    describe('Integration Tests', () => {
        test('submitting valid form updates temporary data array', () => {
            // Fill in form fields
            document.getElementById('event-name').value = 'Community Cleanup';
            document.getElementById('representative-name').value = 'John Doe';
            document.getElementById('representative-email').value = 'john@pixellriver.com';
            document.getElementById('role-selection').value = 'sponsor';
            
            // Trigger form submission
            const form = document.getElementById('event-signup-form');
            const submitEvent = new Event('submit', { 
                bubbles: true, 
                cancelable: true 
            });
            form.dispatchEvent(submitEvent);
            
            // Get data from module
            const signups = eventModule.getEventSignups();
            
            // Check if data was stored
            expect(signups.length).toBe(1);
            expect(signups[0].eventName).toBe('Community Cleanup');
            expect(signups[0].representativeName).toBe('John Doe');
            expect(signups[0].representativeEmail).toBe('john@pixellriver.com');
            expect(signups[0].role).toBe('sponsor');
            expect(signups[0].timestamp).toBeTruthy();
        });

        test('submitting invalid form shows error messages in DOM', () => {
            // Leave form fields empty
            document.getElementById('event-name').value = '';
            document.getElementById('representative-name').value = '';
            document.getElementById('representative-email').value = '';
            document.getElementById('role-selection').value = '';
            
            // Trigger form submission
            const form = document.getElementById('event-signup-form');
            const submitEvent = new Event('submit', { 
                bubbles: true, 
                cancelable: true 
            });
            form.dispatchEvent(submitEvent);
            
            // Check if error messages are displayed
            const eventError = document.getElementById('event-name-error');
            const nameError = document.getElementById('representative-name-error');
            const emailError = document.getElementById('representative-email-error');
            const roleError = document.getElementById('role-selection-error');
            
            expect(eventError.textContent).toBeTruthy();
            expect(nameError.textContent).toBeTruthy();
            expect(emailError.textContent).toBeTruthy();
            expect(roleError.textContent).toBeTruthy();
        });

        test('form displays success message after valid submission', () => {
            // Fill in valid data
            document.getElementById('event-name').value = 'Charity Gala';
            document.getElementById('representative-name').value = 'Jane Smith';
            document.getElementById('representative-email').value = 'jane@pixellriver.com';
            document.getElementById('role-selection').value = 'organizer';
            
            // Submit form
            const form = document.getElementById('event-signup-form');
            const submitEvent = new Event('submit', { 
                bubbles: true, 
                cancelable: true 
            });
            form.dispatchEvent(submitEvent);
            
            // Check success message visibility
            const successMessage = document.getElementById('success-message');
            expect(successMessage.style.display).toBe('block');
        });
    });

    // ===== UNIT TESTS - VALIDATION =====
    
    describe('Unit Tests - Validation', () => {
        test('identifies empty event name field', () => {
            document.getElementById('event-name').value = '';
            document.getElementById('representative-name').value = 'John Doe';
            document.getElementById('representative-email').value = 'john@test.com';
            document.getElementById('role-selection').value = 'sponsor';
            
            const isValid = eventModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('identifies empty representative name field', () => {
            document.getElementById('event-name').value = 'Food Drive';
            document.getElementById('representative-name').value = '';
            document.getElementById('representative-email').value = 'test@test.com';
            document.getElementById('role-selection').value = 'participant';
            
            const isValid = eventModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('identifies empty email field', () => {
            document.getElementById('event-name').value = 'Marathon';
            document.getElementById('representative-name').value = 'Jane Doe';
            document.getElementById('representative-email').value = '';
            document.getElementById('role-selection').value = 'volunteer';
            
            const isValid = eventModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('flags invalid email format', () => {
            document.getElementById('event-name').value = 'Conference';
            document.getElementById('representative-name').value = 'Bob Smith';
            document.getElementById('representative-email').value = 'notanemail';
            document.getElementById('role-selection').value = 'sponsor';
            
            const isValid = eventModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('identifies missing role selection', () => {
            document.getElementById('event-name').value = 'Workshop';
            document.getElementById('representative-name').value = 'Alice Jones';
            document.getElementById('representative-email').value = 'alice@test.com';
            document.getElementById('role-selection').value = '';
            
            const isValid = eventModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('accepts valid form data', () => {
            document.getElementById('event-name').value = 'Annual Fundraiser';
            document.getElementById('representative-name').value = 'Michael Brown';
            document.getElementById('representative-email').value = 'michael@pixellriver.com';
            document.getElementById('role-selection').value = 'organizer';
            
            const isValid = eventModule.validateForm();
            
            expect(isValid).toBe(true);
        });
    });

    // ===== UNIT TESTS - HELPER FUNCTIONS =====
    
    describe('Unit Tests - Helper Functions', () => {
        test('validateRequiredField identifies empty fields', () => {
            expect(eventModule.validateRequiredField('')).toBe(false);
            expect(eventModule.validateRequiredField('   ')).toBe(false);
        });

        test('validateRequiredField accepts non-empty fields', () => {
            expect(eventModule.validateRequiredField('Test')).toBe(true);
            expect(eventModule.validateRequiredField('Community Event')).toBe(true);
        });

        test('validateEmail flags invalid email formats', () => {
            expect(eventModule.validateEmail('notanemail')).toBe(false);
            expect(eventModule.validateEmail('missing@domain')).toBe(false);
            expect(eventModule.validateEmail('@nodomain.com')).toBe(false);
        });

        test('validateEmail accepts valid email formats', () => {
            expect(eventModule.validateEmail('john@pixellriver.com')).toBe(true);
            expect(eventModule.validateEmail('test.user@example.co.uk')).toBe(true);
        });
    });

    // ===== UNIT TESTS - DATA COLLECTION =====
    
    describe('Unit Tests - Data Collection', () => {
        test('collectFormData stores correct data with valid inputs', () => {
            document.getElementById('event-name').value = 'Tech Conference';
            document.getElementById('representative-name').value = 'Sarah Wilson';
            document.getElementById('representative-email').value = 'Sarah@Example.com';
            document.getElementById('role-selection').value = 'participant';
            
            eventModule.collectFormData();
            
            const signups = eventModule.getEventSignups();
            
            expect(signups.length).toBe(1);
            expect(signups[0].eventName).toBe('Tech Conference');
            expect(signups[0].representativeName).toBe('Sarah Wilson');
            expect(signups[0].representativeEmail).toBe('sarah@example.com');
            expect(signups[0].role).toBe('participant');
            expect(signups[0].id).toBeTruthy();
            expect(signups[0].timestamp).toBeTruthy();
        });

        test('email is stored in lowercase', () => {
            document.getElementById('event-name').value = 'Workshop';
            document.getElementById('representative-name').value = 'Test User';
            document.getElementById('representative-email').value = 'TEST@EXAMPLE.COM';
            document.getElementById('role-selection').value = 'volunteer';
            
            eventModule.collectFormData();
            
            const signups = eventModule.getEventSignups();
            
            expect(signups[0].representativeEmail).toBe('test@example.com');
        });
    });

    // ===== UNIT TESTS - ERROR HANDLING =====
    
    describe('Unit Tests - Error Handling', () => {
        test('showError displays error message for specific field', () => {
            eventModule.showError('event-name', 'This field is required');
            
            const errorElement = document.getElementById('event-name-error');
            const formGroup = document.getElementById('event-name').closest('.form-group');
            
            expect(errorElement.textContent).toBe('This field is required');
            expect(formGroup.classList.contains('error')).toBe(true);
        });

        test('clearErrors removes all error messages and styling', () => {
            // Add some errors first
            eventModule.showError('event-name', 'Error 1');
            eventModule.showError('representative-email', 'Error 2');
            
            // Clear errors
            eventModule.clearErrors();
            
            const errorGroups = document.querySelectorAll('.form-group.error');
            expect(errorGroups.length).toBe(0);
        });
    });
});