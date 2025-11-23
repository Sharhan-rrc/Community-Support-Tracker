/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Volunteer Hours Tracker - Stage One Tests', () => {
    let volunteerModule;
    
    beforeEach(() => {
        // Load HTML
        const html = fs.readFileSync(
            path.resolve(__dirname, '../volunteer-hours.html'),
            'utf8'
        );
        document.documentElement.innerHTML = html;
        
        // Clear module cache to get fresh instance
        jest.resetModules();
        
        // Import module
        volunteerModule = require('../js/volunteer-hours.js');
        
        // Reset tempVolunteerData
        volunteerModule.setTempVolunteerData({});
    });

    afterEach(() => {
        document.documentElement.innerHTML = '';
    });

    // ===== INTEGRATION TESTS =====
    
    describe('Integration Tests', () => {
        test('submitting valid form updates temporary data object', () => {
            // Fill in form fields
            document.getElementById('charityName').value = 'Habitat for Humanity';
            document.getElementById('hoursVolunteered').value = '8';
            document.getElementById('volunteerDate').value = '2024-01-20';
            document.getElementById('experienceRating').value = '5';
            
            // Trigger form submission
            const form = document.getElementById('volunteerForm');
            const submitEvent = new Event('submit', { 
                bubbles: true, 
                cancelable: true 
            });
            form.dispatchEvent(submitEvent);
            
            // Get data from module
            const data = volunteerModule.getTempVolunteerData();
            
            // Check if data was stored
            expect(data.charityName).toBe('Habitat for Humanity');
            expect(data.hoursVolunteered).toBe(8);
            expect(data.volunteerDate).toBe('2024-01-20');
            expect(data.experienceRating).toBe(5);
            expect(data.timestamp).toBeTruthy();
        });

        test('submitting invalid form shows error messages in DOM', () => {
            // Leave form fields empty
            document.getElementById('charityName').value = '';
            document.getElementById('hoursVolunteered').value = '';
            document.getElementById('volunteerDate').value = '';
            document.getElementById('experienceRating').value = '';
            
            // Trigger form submission
            const form = document.getElementById('volunteerForm');
            const submitEvent = new Event('submit', { 
                bubbles: true, 
                cancelable: true 
            });
            form.dispatchEvent(submitEvent);
            
            // Check if error messages are displayed
            const charityError = document.getElementById('charityNameError');
            const hoursError = document.getElementById('hoursError');
            const dateError = document.getElementById('dateError');
            const ratingError = document.getElementById('ratingError');
            
            expect(charityError.textContent).toBeTruthy();
            expect(hoursError.textContent).toBeTruthy();
            expect(dateError.textContent).toBeTruthy();
            expect(ratingError.textContent).toBeTruthy();
        });
    });

    // ===== UNIT TESTS - VALIDATION =====
    
    describe('Unit Tests - Validation', () => {
        test('identifies empty charity name field', () => {
            document.getElementById('charityName').value = '';
            document.getElementById('hoursVolunteered').value = '5';
            document.getElementById('volunteerDate').value = '2024-01-01';
            document.getElementById('experienceRating').value = '4';
            
            const isValid = volunteerModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('identifies empty hours volunteered field', () => {
            document.getElementById('charityName').value = 'Local Shelter';
            document.getElementById('hoursVolunteered').value = '';
            document.getElementById('volunteerDate').value = '2024-01-01';
            document.getElementById('experienceRating').value = '3';
            
            const isValid = volunteerModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('flags invalid hours volunteered (negative)', () => {
            document.getElementById('charityName').value = 'Community Center';
            document.getElementById('hoursVolunteered').value = '-5';
            document.getElementById('volunteerDate').value = '2024-01-01';
            document.getElementById('experienceRating').value = '4';
            
            const isValid = volunteerModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('flags invalid hours volunteered (non-numeric)', () => {
            document.getElementById('charityName').value = 'Food Bank';
            document.getElementById('hoursVolunteered').value = 'abc';
            document.getElementById('volunteerDate').value = '2024-01-01';
            document.getElementById('experienceRating').value = '5';
            
            const isValid = volunteerModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('identifies missing date field', () => {
            document.getElementById('charityName').value = 'Animal Rescue';
            document.getElementById('hoursVolunteered').value = '6';
            document.getElementById('volunteerDate').value = '';
            document.getElementById('experienceRating').value = '4';
            
            const isValid = volunteerModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('flags invalid experience rating (out of range - too low)', () => {
            document.getElementById('charityName').value = 'Youth Center';
            document.getElementById('hoursVolunteered').value = '4';
            document.getElementById('volunteerDate').value = '2024-01-01';
            document.getElementById('experienceRating').value = '0';
            
            const isValid = volunteerModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('flags invalid experience rating (out of range - too high)', () => {
            document.getElementById('charityName').value = 'Senior Center';
            document.getElementById('hoursVolunteered').value = '3';
            document.getElementById('volunteerDate').value = '2024-01-01';
            document.getElementById('experienceRating').value = '6';
            
            const isValid = volunteerModule.validateForm();
            
            expect(isValid).toBe(false);
        });

        test('accepts valid form data', () => {
            document.getElementById('charityName').value = 'Environmental Cleanup';
            document.getElementById('hoursVolunteered').value = '7.5';
            document.getElementById('volunteerDate').value = '2024-03-15';
            document.getElementById('experienceRating').value = '5';
            
            const isValid = volunteerModule.validateForm();
            
            expect(isValid).toBe(true);
        });
    });

    // ===== UNIT TESTS - DATA PROCESSING =====
    
    describe('Unit Tests - Data Processing', () => {
        test('collectFormData returns correct data object with valid inputs', () => {
            document.getElementById('charityName').value = 'Hospital Volunteer';
            document.getElementById('hoursVolunteered').value = '10.5';
            document.getElementById('volunteerDate').value = '2024-04-10';
            document.getElementById('experienceRating').value = '4';
            
            volunteerModule.collectFormData();
            
            // Get data from module
            const data = volunteerModule.getTempVolunteerData();
            
            expect(data.charityName).toBe('Hospital Volunteer');
            expect(data.hoursVolunteered).toBe(10.5);
            expect(data.volunteerDate).toBe('2024-04-10');
            expect(data.experienceRating).toBe(4);
            expect(data.timestamp).toBeTruthy();
        });

        test('correctly parses hours volunteered as number', () => {
            document.getElementById('charityName').value = 'Test Charity';
            document.getElementById('hoursVolunteered').value = '12.25';
            document.getElementById('volunteerDate').value = '2024-06-01';
            document.getElementById('experienceRating').value = '3';
            
            volunteerModule.collectFormData();
            
            // Get data from module
            const data = volunteerModule.getTempVolunteerData();
            
            expect(typeof data.hoursVolunteered).toBe('number');
            expect(data.hoursVolunteered).toBe(12.25);
        });

        test('correctly parses experience rating as integer', () => {
            document.getElementById('charityName').value = 'Library Volunteer';
            document.getElementById('hoursVolunteered').value = '6';
            document.getElementById('volunteerDate').value = '2024-05-15';
            document.getElementById('experienceRating').value = '5';
            
            volunteerModule.collectFormData();
            
            // Get data from module
            const data = volunteerModule.getTempVolunteerData();
            
            expect(typeof data.experienceRating).toBe('number');
            expect(data.experienceRating).toBe(5);
            expect(Number.isInteger(data.experienceRating)).toBe(true);
        });
    });
});