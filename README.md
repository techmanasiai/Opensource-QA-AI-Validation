# Opensource-QA-AI-Validation

## Project Requirements

### 1. Survey Compression and Rendering

- Surveys should be compressed and stored in a dedicated folder.
- The application must be able to un-compress these surveys and render them dynamically.

### 2. User Types and Portals

This project will support multiple user types, each with a dedicated portal and distinct functionalities.

-   **Survey Admin (`/survey-admin`)**
    -   **Portal:** `localhost:563/survey-admin`
    -   **Actions:**
        -   Create and manage survey participants.
        -   Invite participants to surveys.
        -   Assign tasks to participants.
        -   Approve or reject survey responses.
        -   Monitor survey progress.

-   **Survey Participant (`/survey-participant`)**
    -   **Portal:** `localhost:563/survey-participant`
    -   **Actions:**
        -   View and complete assigned surveys.
        -   Track their own progress.

-   **Survey Moderator (`/survey-moderator`)**
    -   **Portal:** `localhost:563/survey-moderator`
    -   **Actions:**
        -   Review and complete surveys assigned to any participant.
        -   Approve or reject participant responses.
        -   Start and manage tasks corresponding to other users.

### 3. Project Configuration

Each project will be defined by a JSON configuration file with the following structure:

```json
{
  "projectName": "string",
  "supportedUserTypes": ["SurveyAdmin", "SurveyParticipant", "SurveyModerator"],
  "participantLifecycle": {
    "initialState": "string",
    "states": {
      "stateName": {
        "onEnter": "action",
        "onExit": "action"
      }
    }
  }
}
```

-   `projectName`: The name of the project.
-   `supportedUserTypes`: An array of user types supported by the project.
-   `participantLifecycle`: Defines the different stages a survey participant goes through.

### 4. Survey Workflow

-   Each project can have a unique set of survey tasks for participants.
-   Tasks can be presented in a specific sequence.
-   The availability of some tasks may depend on the responses from previous tasks.

### 5. Iterative Implementation Plan

This project can be implemented in iterative stages. The following tasks can be picked up sequentially or in parallel.

-   **Task 1: Setup Basic Application Structure**
    -   Initialize a web server.
    -   Create the basic folder structure for `src`, `dist`, and `surveys`.

-   **Task 2: Implement User Portals**
    -   Create separate routes and basic UI for each user portal (`/survey-admin`, `/survey-participant`, `/survey-moderator`).

-   **Task 3: Implement Survey Compression/Decompression**
    -   Develop a mechanism to compress survey JSON files.
    -   Implement a service to decompress and serve surveys to the frontend.

-   **Task 4: Develop the Survey Rendering Engine**
    -   Create a dynamic form renderer that can display surveys based on the JSON format.

-   **Task 5: Implement Project Configuration**
    -   Create a service to load and manage project configurations from JSON files.

-   **Task 6: Implement Participant and Survey Management (Admin)**
    -   Develop the backend logic for admin actions (create/invite participants, assign tasks).
    -   Build the UI for the admin portal.

-   **Task 7: Implement Survey Completion (Participant)**
    -   Develop the backend logic for participants to submit survey responses.
    -   Build the UI for the participant portal to complete surveys.

-   **Task 8: Implement Moderation Features (Moderator)**
    -   Develop the backend logic for moderators to review and approve/reject responses.
    -   Build the UI for the moderator portal.

-   **Task 9: Implement Conditional Survey Logic**
    -   Enhance the survey rendering engine to handle conditional task flows based on participant responses.

-   **Task 10: Implement Participant Lifecycle Management**
    -   Develop the logic to manage the participant's state based on the project configuration.
    -   Integrate the lifecycle management with the survey workflow.