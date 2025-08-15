# Opensource-QA-AI-Validation

## Application Overview

This document outlines the requirements for a configurable, activity-based survey application. The system is designed to manage complex workflows involving multiple user roles and dynamic task assignments, all driven by a central, configurable "Activity Lifecycle". The design should remain agnostic to any specific use case (e.g., product launch, research study, etc.).

### Core Concepts

The application is built around the concept of an **Activity Lifecycle**. This represents a larger project or process that has a defined start and end, and consists of multiple phases. Participants are guided through this lifecycle by Moderators, and the entire structure is configured by an Admin.

-   **Activity Lifecycle:** The top-level container for a project. It defines the phases, survey groups, and user roles.
-   **Phases:** An activity is composed of several phases (e.g., "Pre-Launch", "Post-Launch"). These are containers for groups of surveys.
-   **Survey Groups:** A collection of related surveys that are assigned to a participant as a single unit. The availability of these groups is controlled by a Moderator.
-   **Independent Surveys:** Standalone surveys that are not part of a group and can be made available to participants at any time for tasks like collecting feedback.

### User Types and Portals

The application supports three main user roles, each with a dedicated portal.

-   **Admin (`/admin`)**
    -   **Portal:** `localhost:563/admin`
    -   **Responsibilities:**
        -   Configures the entire Activity Lifecycle, including its phases and survey groups.
        -   Assigns Moderators to manage specific groups of participants within an activity.
        -   **Reporting and Monitoring:** Generates reports to monitor the overall progress of surveys and the progress of individual participants within a lifecycle.
        -   Has a high-level view of all ongoing activities.

-   **Moderator (`/moderator`)**
    -   **Portal:** `localhost:563/moderator`
    -   **Responsibilities:**
        -   Manages a group of participants assigned to them by an Admin.
        -   **Generates and sends user-specific invitation codes** to invite participants to join an activity.
        -   Monitors participant progress and reviews survey responses.
        -   Based on participant progress or other criteria, makes new groups of surveys available to them, thereby advancing them through the lifecycle.

-   **Participant (`/participant`)**
    -   **Portal:** `localhost:563/participant`
    -   **Responsibilities:**
        -   **Signs up for an activity using a general `lifecycleCode` and their personal `invitationCode`**.
        -   Views and completes currently available surveys (both grouped and independent).
        -   Completes surveys that may be presented in a specific sequence within a group.
        -   Awaits the Moderator to unlock the next group of surveys.

### Activity Lifecycle Configuration

Each activity is defined by a JSON configuration file. This file specifies the structure of the lifecycle, the roles, and the content.

```json
{
  "activityName": "string",
  "lifecycleCode": "string",
  "phases": [
    {
      "phaseName": "string",
      "surveyGroups": [
        {
          "groupName": "string",
          "surveys": [
            { "id": "survey_id_1", "repeatable": false },
            { "id": "survey_id_2", "repeatable": true }
          ],
          "sequence": "ordered"
        }
      ]
    }
  ],
  "independentSurveys": [
    { "id": "feedback_survey_id", "repeatable": true }
  ],
  "moderators": [
    {
      "moderatorId": "string",
      "assignedParticipantIds": ["string"]
    }
  ]
}
```

### High-Level Workflow

1.  **Configuration:** An **Admin** defines an `Activity Lifecycle` in a JSON file, specifying a `lifecycleCode`, phases, survey groups, and assigning **Moderators**.
2.  **Invitation:** A **Moderator** generates a unique `invitationCode` for a **Participant** and sends it to them, along with the general `lifecycleCode` for the activity.
3.  **Onboarding:** The **Participant** uses the `lifecycleCode` and their `invitationCode` to sign up and join the activity. Once authenticated, they can see and complete any initially available surveys.
4.  **Progression:** The **Participant** completes their assigned surveys. Some surveys may only be completed once, while others may be repeatable.
5.  **Moderation and Gating:** The **Moderator** reviews the **Participant's** responses and progress. When appropriate, the **Moderator** makes the next group of surveys available to the **Participant**.
6.  **Feedback:** At any point, the **Participant** may be able to complete independent surveys (e.g., for feedback).
7.  **Completion:** The lifecycle continues until the **Participant** has completed all phases, or the activity is concluded by the **Moderator** or **Admin**.

### Survey Format and Rendering

-   Individual surveys (referenced by ID in the configuration) should be stored in a compressed format.
-   The application must be able to decompress and render these surveys dynamically for the participants.