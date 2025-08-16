document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let state = {
        currentConfig: null,
        availableSurveys: ["survey.html", "test-survey.json"], // Hardcoded list
    };
    const LOCAL_STORAGE_KEY = 'wip-lifecycle-config';

    // --- DOM ELEMENTS ---
    const form = document.getElementById('lifecycle-form');
    const activityNameInput = document.getElementById('activityName');
    const lifecycleCodeInput = document.getElementById('lifecycleCode');
    const phasesContainer = document.getElementById('phases-container');
    const independentSurveysContainer = document.getElementById('independent-surveys-container');
    const moderatorsContainer = document.getElementById('moderators-container');
    const addPhaseBtn = document.getElementById('add-phase-btn');
    const addIndependentSurveyBtn = document.getElementById('add-independent-survey-btn');
    const addModeratorBtn = document.getElementById('add-moderator-btn');
    const publishBtn = document.getElementById('publish-btn');
    const statusIndicator = document.getElementById('status-indicator');
    const outputSection = document.getElementById('output-section');
    const jsonOutput = document.getElementById('json-output');

    // --- TEMPLATES ---
    const phaseTemplate = document.getElementById('phase-template');
    const surveyGroupTemplate = document.getElementById('survey-group-template');
    const surveyTemplate = document.getElementById('survey-template');
    const moderatorTemplate = document.getElementById('moderator-template');

    // --- RENDER FUNCTIONS ---
    const renderFullForm = () => {
        // Clear existing form
        activityNameInput.value = '';
        lifecycleCodeInput.value = '';
        phasesContainer.innerHTML = '';
        independentSurveysContainer.innerHTML = '';
        moderatorsContainer.innerHTML = '';
        outputSection.style.display = 'none';

        if (!state.currentConfig) {
            updateStatus('Start a new configuration or load from browser storage.');
            return;
        }

        activityNameInput.value = state.currentConfig.activityName || '';
        lifecycleCodeInput.value = state.currentConfig.lifecycleCode || '';
        (state.currentConfig.phases || []).forEach(phaseData => renderPhase(phaseData));
        (state.currentConfig.independentSurveys || []).forEach(surveyData => renderIndependentSurvey(surveyData));
        (state.currentConfig.moderators || []).forEach(modData => renderModerator(modData));

        updateStatus('Configuration loaded from browser storage.');
    };

    const renderPhase = (phaseData) => {
        const phaseEl = phaseTemplate.content.cloneNode(true).firstElementChild;
        phaseEl.querySelector('.phase-name').value = phaseData.phaseName || '';

        const surveyGroupsContainer = phaseEl.querySelector('.survey-groups-container');
        (phaseData.surveyGroups || []).forEach(groupData => {
            surveyGroupsContainer.appendChild(renderSurveyGroup(groupData));
        });

        phasesContainer.appendChild(phaseEl);
    };

    const renderSurveyGroup = (groupData) => {
        const groupEl = surveyGroupTemplate.content.cloneNode(true).firstElementChild;
        groupEl.querySelector('.group-name').value = groupData.groupName || '';

        const surveysContainer = groupEl.querySelector('.surveys-container');
        (groupData.surveys || []).forEach(surveyData => {
            surveysContainer.appendChild(renderSurvey(surveyData));
        });

        return groupEl;
    };

    const renderSurvey = (surveyData) => {
        const surveyEl = surveyTemplate.content.cloneNode(true).firstElementChild;
        const selectEl = surveyEl.querySelector('.survey-id');

        state.availableSurveys.forEach(surveyFile => {
            const option = new Option(surveyFile, surveyFile);
            selectEl.add(option);
        });

        selectEl.value = surveyData.id || '';
        surveyEl.querySelector('.survey-repeatable').checked = surveyData.repeatable || false;

        return surveyEl;
    };

    const renderIndependentSurvey = (surveyData) => {
        const surveyEl = renderSurvey(surveyData);
        independentSurveysContainer.appendChild(surveyEl);
    };

    const renderModerator = (modData) => {
        const modEl = moderatorTemplate.content.cloneNode(true).firstElementChild;
        modEl.querySelector('.moderator-id').value = modData.moderatorId || '';
        moderatorsContainer.appendChild(modEl);
    };

    // --- DATA HYDRATION/SERIALIZATION ---
    const formToJSON = () => {
        const data = {
            activityName: activityNameInput.value,
            lifecycleCode: lifecycleCodeInput.value,
            phases: [],
            independentSurveys: [],
            moderators: [],
        };

        document.querySelectorAll('#phases-container .phase-item').forEach(phaseEl => {
            const phaseData = {
                phaseName: phaseEl.querySelector('.phase-name').value,
                surveyGroups: [],
            };
            phaseEl.querySelectorAll('.survey-group-item').forEach(groupEl => {
                const groupData = {
                    groupName: groupEl.querySelector('.group-name').value,
                    surveys: [],
                };
                groupEl.querySelectorAll('.survey-item').forEach(surveyEl => {
                    groupData.surveys.push({
                        id: surveyEl.querySelector('.survey-id').value,
                        repeatable: surveyEl.querySelector('.survey-repeatable').checked,
                    });
                });
                phaseData.surveyGroups.push(groupData);
            });
            data.phases.push(phaseData);
        });

        document.querySelectorAll('#independent-surveys-container .survey-item').forEach(surveyEl => {
             data.independentSurveys.push({
                id: surveyEl.querySelector('.survey-id').value,
                repeatable: surveyEl.querySelector('.survey-repeatable').checked,
            });
        });

        document.querySelectorAll('#moderators-container .moderator-item').forEach(modEl => {
            data.moderators.push({
                moderatorId: modEl.querySelector('.moderator-id').value,
            });
        });

        return data;
    };

    // --- EVENT HANDLERS ---
    const handleAddElement = (e) => {
        const target = e.target;
        if (target.id === 'add-phase-btn') renderPhase({});
        if (target.id === 'add-independent-survey-btn') renderIndependentSurvey({});
        if (target.id === 'add-moderator-btn') renderModerator({});
        if (target.classList.contains('add-survey-group-btn')) {
            target.previousElementSibling.appendChild(renderSurveyGroup({}));
        }
        if (target.classList.contains('add-survey-btn')) {
            target.previousElementSibling.appendChild(renderSurvey({}));
        }
    };

    const handleRemoveElement = (e) => {
        if (e.target.classList.contains('remove-btn')) {
            e.target.parentElement.remove();
        }
    };

    const handlePublish = () => {
        if (!form.checkValidity()) {
            alert('Please fill out all required fields.');
            return;
        }
        const configData = formToJSON();
        jsonOutput.value = JSON.stringify(configData, null, 2);
        outputSection.style.display = 'block';
        updateStatus('JSON generated. Please copy and save.');
        window.scrollTo(0, document.body.scrollHeight);
    };

    // --- LOCAL STORAGE & AUTO-SAVE ---
    const saveToLocalStorage = () => {
        if (!state.currentConfig) return;
        const data = formToJSON();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        updateStatus('Draft saved to browser.');
    };

    const loadFromLocalStorage = () => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            state.currentConfig = JSON.parse(savedData);
            return true;
        }
        return false;
    };

    // --- UTILITY FUNCTIONS ---
    const updateStatus = (message) => {
        statusIndicator.textContent = message;
    };

    // --- INITIALIZATION ---
    const initialize = () => {
        updateStatus('Initializing...');
        if (loadFromLocalStorage()) {
            renderFullForm();
        } else {
            state.currentConfig = { activityName: '', lifecycleCode: '', phases: [], independentSurveys: [], moderators: [] };
            renderFullForm();
            updateStatus('Ready to start new configuration.');
        }
    };

    // --- EVENT LISTENERS ---
    document.body.addEventListener('click', handleAddElement);
    document.body.addEventListener('click', handleRemoveElement);
    publishBtn.addEventListener('click', handlePublish);
    form.addEventListener('input', saveToLocalStorage); // Auto-save on any input

    initialize();
});
