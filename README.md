# Community Support Tracker

## Group 7

- **Sharhan**: Donation Tracker Component
- **Rudra**: Volunteer Hours Tracker Component
- **Thea**: Event Signup Component

## Overview

This repository contains a small front-end project to track community support activities for PiXELL River Financial. It includes three main components:

- Donation Tracker (form-based input, temporary storage)
- Volunteer Hours Tracker
- Event Signup

The project includes unit and integration tests for the Donation Tracker component and basic styling for all pages.

## Work completed by Sharhan (Donation Tracker)

As the member responsible for the Donation Tracker, I (Sharhan) completed the following tasks in this assignment:

- Implemented the Donation Tracker page structure and form (`donation-tracker.html`):
	- Added form fields for `charityName`, `donationAmount`, `donationDate`, and `donorComment`.
	- Added inline error message elements (`charityNameError`, `amountError`, `dateError`) and a `successMessage` element.

- Implemented client-side logic (`JS/donation-tracker.js`):
	- Form validation (`validateForm`) for required fields and numeric/positive donation amounts.
	- Error handling utilities: `showError(fieldId, message)` and `clearErrors()` which update the DOM and styling.
	- Data collection (`collectFormData`) that creates a temporary in-memory object with fields: `charityName`, `donationAmount` (as Number), `donationDate`, `donorComment` (defaults to "No comment provided"), and a `timestamp`.
	- Temporary storage accessors: `getTempDonationData()` and `setTempDonationData(data)` to facilitate testing and stage-one requirements.
	- Success message display (`showSuccessMessage`) and form reset behavior after valid submissions.
	- Robust initialization to attach the form `submit` handler immediately when the module is required (handles `jsdom`/test environment timing).

- Added and/or updated styles for the Donation Tracker and general site styling (`CSS/donation-tracker.css`, `CSS/styles.css`).

- Wrote and maintained tests for the Donation Tracker (`tests/donation-tracker.test.js`):
	- Unit tests for form validation, data processing, and error handling.
	- Integration tests to assert DOM behavior on valid and invalid submissions.
	- Ensured tests pass locally (14 tests passing at time of update).

- Updated the landing page (`index.html`) content and component links to reflect the project structure and Donation Tracker entry point.

- Repository and collaboration:
	- Established the project on GitHub and worked on branch `DTC_Sharhan_P1` for donation tracker changes.

## How to run (local development)

1. Install dependencies:

```powershell
cd 'C:/front_end_development/Projects/Community Support Tracker'
npm install
```

2. Run tests:

```powershell
npm test
```

Tests use `jest` with a `jsdom` environment to validate DOM interactions for the Donation Tracker.

## Key files (quick reference)

- `donation-tracker.html` — Donation Tracker page and form
- `index.html` — Project landing page
- `JS/donation-tracker.js` — Donation Tracker logic (validation, collection, UI updates)
- `CSS/donation-tracker.css` — Styles specific to Donation Tracker
- `CSS/styles.css` — Global styles
- `tests/donation-tracker.test.js` — Jest tests covering unit and integration scenarios
