document.addEventListener('DOMContentLoaded', () => {
    const surveyForm = document.getElementById('survey-form');
    const stepsContainer = document.getElementById('steps-container');
    const addStepBtn = document.getElementById('add-step-btn');

    let stepCounter = 0;

    addStepBtn.addEventListener('click', () => {
        stepCounter++;
        const stepId = `step${stepCounter}`;

        const stepFieldset = document.createElement('fieldset');
        stepFieldset.innerHTML = `
            <legend>Step ${stepCounter}</legend>
            <label for="${stepId}-title">Step Title:</label>
            <input type="text" id="${stepId}-title" class="step-title" required>
            <div class="fields-container">
                <!-- Fields will be dynamically added here -->
            </div>
            <button type="button" class="add-field-btn">Add Field</button>
            <button type="button" class="remove-step-btn">Remove Step</button>
        `;

        stepsContainer.appendChild(stepFieldset);

        // Add event listener for the new "Add Field" button
        stepFieldset.querySelector('.add-field-btn').addEventListener('click', () => {
            addField(stepFieldset.querySelector('.fields-container'), stepId);
        });

        // Add event listener for the new "Remove Step" button
        stepFieldset.querySelector('.remove-step-btn').addEventListener('click', () => {
            stepFieldset.remove();
        });
    });

    function addField(container, stepId) {
        const fieldCounter = container.children.length + 1;
        const fieldId = `${stepId}-field${fieldCounter}`;

        const fieldWrapper = document.createElement('div');
        fieldWrapper.classList.add('field-wrapper');
        fieldWrapper.innerHTML = `
            <hr>
            <strong>Field ${fieldCounter}</strong><br>
            <label for="${fieldId}-label">Label:</label>
            <input type="text" id="${fieldId}-label" class="field-label" required>

            <label for="${fieldId}-type">Type:</label>
            <select id="${fieldId}-type" class="field-type">
                <option value="text">Text</option>
                <option value="textarea">Textarea</option>
                <option value="radio">Radio</option>
                <option value="dropdown">Dropdown</option>
            </select>

            <div class="options-container" style="display: none;">
                <label>Options (label:value):</label>
                <textarea class="field-options" placeholder="e.g., Yes:true\nNo:false"></textarea>
            </div>

            <button type="button" class="remove-field-btn">Remove Field</button>
        `;

        container.appendChild(fieldWrapper);

        const fieldTypeSelect = fieldWrapper.querySelector('.field-type');
        const optionsContainer = fieldWrapper.querySelector('.options-container');

        fieldTypeSelect.addEventListener('change', () => {
            if (['radio', 'dropdown'].includes(fieldTypeSelect.value)) {
                optionsContainer.style.display = 'block';
            } else {
                optionsContainer.style.display = 'none';
            }
        });

        fieldWrapper.querySelector('.remove-field-btn').addEventListener('click', () => {
            fieldWrapper.remove();
        });
    }

    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        generateJson();
    });

    function generateJson() {
        const surveyData = {
            surveyTitle: document.getElementById('survey-title').value,
            surveyDescription: document.getElementById('survey-description').value,
            startScreen: {
                title: document.getElementById('start-screen-title').value,
                description: document.getElementById('start-screen-description').value,
                buttonText: document.getElementById('start-button-text').value,
            },
            steps: [],
            endScreen: {
                title: document.getElementById('end-screen-title').value,
                description: document.getElementById('end-screen-description').value,
                reviewButtonText: document.getElementById('review-button-text').value,
                submitButtonText: document.getElementById('submit-button-text').value,
            },
        };

        stepsContainer.querySelectorAll('fieldset').forEach((stepFieldset, stepIndex) => {
            const stepId = `step${stepIndex + 1}`;
            const stepData = {
                stepId: stepId,
                title: stepFieldset.querySelector('.step-title').value,
                fields: [],
            };

            stepFieldset.querySelectorAll('.field-wrapper').forEach((fieldWrapper, fieldIndex) => {
                const fieldId = `${stepId}-field${fieldIndex + 1}`;
                const fieldType = fieldWrapper.querySelector('.field-type').value;
                const fieldData = {
                    fieldId: fieldId,
                    type: fieldType,
                    label: fieldWrapper.querySelector('.field-label').value,
                    options: [],
                };

                if (['radio', 'dropdown'].includes(fieldType)) {
                    const optionsText = fieldWrapper.querySelector('.field-options').value;
                    fieldData.options = optionsText.split('\n').map(line => {
                        const [label, value] = line.split(':');
                        return { label, value };
                    });
                }

                stepData.fields.push(fieldData);
            });

            surveyData.steps.push(stepData);
        });

        const jsonString = JSON.stringify(surveyData, null, 2);

        // Create a downloadable blob
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'survey.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
