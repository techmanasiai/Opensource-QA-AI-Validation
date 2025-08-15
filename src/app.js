document.addEventListener('DOMContentLoaded', () => {
    // State management
    let surveyData = null;
    let currentStepIndex = 0;
    const userResponses = {};

    // DOM element references
    const surveyContainer = document.getElementById('survey-container');
    const surveyTitleEl = document.getElementById('survey-title');
    const surveyDescriptionEl = document.getElementById('survey-description');

    const startScreen = document.getElementById('start-screen');
    const startScreenTitleEl = document.getElementById('start-screen-title');
    const startScreenDescriptionEl = document.getElementById('start-screen-description');
    const startButton = document.getElementById('start-button');

    const surveyScreen = document.getElementById('survey-screen');
    const stepTitleEl = document.getElementById('step-title');
    const fieldsContainer = document.getElementById('fields-container');
    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');

    const endScreen = document.getElementById('end-screen');
    const endScreenTitleEl = document.getElementById('end-screen-title');
    const endScreenDescriptionEl = document.getElementById('end-screen-description');
    const summaryContainer = document.getElementById('summary-container');
    const reviewButton = document.getElementById('review-button');
    const submitButton = document.getElementById('submit-button');

    /**
     * Loads survey data from an embedded JSON script tag.
     */
    function loadSurveyFromEmbed() {
        try {
            const surveyDataEl = document.getElementById('survey-data');
            if (!surveyDataEl) {
                throw new Error('Survey data script tag not found.');
            }
            surveyData = JSON.parse(surveyDataEl.textContent);
            initializeSurvey();
        } catch (error) {
            console.error("Could not load embedded survey data:", error);
            surveyContainer.innerHTML = '<p>Error loading survey data. The file might be corrupted.</p>';
        }
    }

    /**
     * Initializes the survey by rendering the start screen.
     */
    function initializeSurvey() {
        // Populate survey header
        surveyTitleEl.textContent = surveyData.surveyTitle;
        surveyDescriptionEl.textContent = surveyData.surveyDescription;

        // Populate start screen
        const { startScreen: startScreenData } = surveyData;
        startScreenTitleEl.textContent = startScreenData.title;
        startScreenDescriptionEl.textContent = startScreenData.description;
        startButton.textContent = startScreenData.buttonText;

        // Add event listeners
        startButton.addEventListener('click', handleStart);
        nextButton.addEventListener('click', handleNext);
        backButton.addEventListener('click', handleBack);
        reviewButton.addEventListener('click', handleReview);
    }

    /**
     * Hides all screens and shows the one with the specified ID.
     * @param {string} screenId - The ID of the screen to show.
     */
    function showScreen(screenId) {
        document.querySelectorAll('.survey-screen').forEach(screen => {
            screen.style.display = 'none';
        });
        document.getElementById(screenId).style.display = 'block';
    }

    /**
     * Handles the start of the survey.
     */
    function handleStart() {
        showScreen('survey-screen');
        renderStep(currentStepIndex);
    }

    /**
     * Renders a single step of the survey.
     * @param {number} stepIndex - The index of the step to render.
     */
    function renderStep(stepIndex) {
        const stepData = surveyData.steps[stepIndex];
        stepTitleEl.textContent = stepData.title;
        fieldsContainer.innerHTML = ''; // Clear previous fields

        stepData.fields.forEach(field => {
            const fieldEl = createField(field);
            fieldsContainer.appendChild(fieldEl);
        });

        // Update navigation buttons
        backButton.style.display = stepIndex === 0 ? 'none' : 'inline-block';
        nextButton.textContent = (stepIndex === surveyData.steps.length - 1) ? 'Finish' : 'Next';
    }

    /**
     * Creates the HTML element for a single field.
     * @param {object} fieldData - The configuration for the field.
     * @returns {HTMLElement} The created field element.
     */
    function createField(fieldData) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('field-wrapper');

        const label = document.createElement('label');
        label.textContent = fieldData.label;
        label.setAttribute('for', fieldData.fieldId);
        wrapper.appendChild(label);

        let input;
        switch (fieldData.type) {
            case 'text':
                input = document.createElement('input');
                input.type = 'text';
                input.placeholder = fieldData.placeholder || '';
                break;
            case 'textarea':
                input = document.createElement('textarea');
                input.placeholder = fieldData.placeholder || '';
                break;
            case 'radio':
                // For radio, the wrapper contains multiple inputs
                fieldData.options.forEach(option => {
                    const radioWrapper = document.createElement('div');
                    const radioInput = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.name = fieldData.fieldId;
                    radioInput.id = `${fieldData.fieldId}-${option.value}`;
                    radioInput.value = option.value;

                    const radioLabel = document.createElement('label');
                    radioLabel.textContent = option.label;
                    radioLabel.setAttribute('for', radioInput.id);

                    radioWrapper.appendChild(radioInput);
                    radioWrapper.appendChild(radioLabel);
                    wrapper.appendChild(radioWrapper);
                });
                return wrapper; // Return early as the structure is different
            case 'dropdown':
                input = document.createElement('select');
                fieldData.options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option.value;
                    opt.textContent = option.label;
                    input.appendChild(opt);
                });
                break;
        }

        if (input) {
            input.id = fieldData.fieldId;
            // Add validation attributes
            if (fieldData.validation?.required) {
                input.required = true;
            }
            if (fieldData.validation?.minLength) {
                input.minLength = fieldData.validation.minLength;
            }
            if (fieldData.validation?.maxLength) {
                input.maxLength = fieldData.validation.maxLength;
            }
            if (fieldData.validation?.pattern) {
                input.pattern = fieldData.validation.pattern;
            }
            wrapper.appendChild(input);
        }

        const errorEl = document.createElement('span');
        errorEl.classList.add('error-message');
        errorEl.id = `${fieldData.fieldId}-error`;
        wrapper.appendChild(errorEl);

        return wrapper;
    }

    /**
     * Validates the current step, saves responses, and then proceeds.
     */
    function handleNext() {
        if (validateAndSaveStep()) {
            if (currentStepIndex < surveyData.steps.length - 1) {
                currentStepIndex++;
                renderStep(currentStepIndex);
            } else {
                renderEndScreen();
            }
        }
    }

    /**
     * Validates fields in the current step and saves their values.
     * @returns {boolean} - True if validation passes, false otherwise.
     */
    function validateAndSaveStep() {
        let isValid = true;
        const stepData = surveyData.steps[currentStepIndex];

        // Clear previous errors for this step
        stepData.fields.forEach(field => {
            const errorEl = document.getElementById(`${field.fieldId}-error`);
            if (errorEl) errorEl.textContent = '';
        });

        for (const field of stepData.fields) {
            const fieldEl = document.getElementById(field.fieldId);
            let value;
            let fieldIsValid = true;

            if (field.type === 'radio') {
                const checkedRadio = document.querySelector(`input[name="${field.fieldId}"]:checked`);
                value = checkedRadio ? checkedRadio.value : null;
            } else {
                value = fieldEl.value;
            }

            // Save response
            userResponses[field.fieldId] = value;

            // Perform validation
            if (field.validation?.required && !value) {
                fieldIsValid = false;
                showError(field.fieldId, 'This field is required.');
            } else if (value) {
                if (field.validation?.minLength && value.length < field.validation.minLength) {
                    fieldIsValid = false;
                    showError(field.fieldId, `Must be at least ${field.validation.minLength} characters.`);
                }
                if (field.validation?.maxLength && value.length > field.validation.maxLength) {
                    fieldIsValid = false;
                    showError(field.fieldId, `Cannot exceed ${field.validation.maxLength} characters.`);
                }
                if (field.validation?.pattern) {
                    const regex = new RegExp(field.validation.pattern);
                    if (!regex.test(value)) {
                        fieldIsValid = false;
                        showError(field.fieldId, 'Invalid format.');
                    }
                }
            }

            if (!fieldIsValid) isValid = false;
        }

        return isValid;
    }

    /**
     * Displays an error message for a specific field.
     * @param {string} fieldId - The ID of the field.
     * @param {string} message - The error message to display.
     */
    function showError(fieldId, message) {
        const errorEl = document.getElementById(`${fieldId}-error`);
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    /**
     * Handles the back button click.
     */
    function handleBack() {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderStep(currentStepIndex);
        }
    }

    /**
     * Renders the final screen of the survey.
     */
    function renderEndScreen() {
        showScreen('end-screen');
        const { endScreen: endScreenData } = surveyData;
        endScreenTitleEl.textContent = endScreenData.title;
        endScreenDescriptionEl.textContent = endScreenData.description;
        reviewButton.textContent = endScreenData.reviewButtonText;
        submitButton.textContent = endScreenData.submitButtonText;

        // Render summary
        summaryContainer.innerHTML = ''; // Clear previous summary
        const summaryList = document.createElement('ul');

        surveyData.steps.forEach(step => {
            step.fields.forEach(field => {
                const response = userResponses[field.fieldId];
                if (response) {
                    const listItem = document.createElement('li');

                    let responseText = response;
                    if (field.type === 'radio' || field.type === 'dropdown') {
                        const option = field.options.find(o => o.value === response);
                        responseText = option ? option.label : response;
                    }

                    listItem.innerHTML = `<strong>${field.label}:</strong> ${responseText}`;
                    summaryList.appendChild(listItem);
                }
            });
        });

        summaryContainer.appendChild(summaryList);

        // TODO: Implement final submission logic for the submitButton
    }

    /**
     * Handles the review button click, taking the user back to the first step.
     */
    function handleReview() {
        currentStepIndex = 0;
        showScreen('survey-screen');
        renderStep(currentStepIndex);
    }

    // Initial load
    loadSurveyFromEmbed();
});
