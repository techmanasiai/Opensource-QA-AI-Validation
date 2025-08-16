# Admin Portal - Functional Requirements

This document outlines the technology-agnostic functional requirements for the Activity Lifecycle Admin Portal.

## 1. Core Lifecycle Configuration

-   The user must be able to define a new **Activity Lifecycle**.
-   Each lifecycle must have a unique **Activity Name**.
-   Each lifecycle must have a unique **Lifecycle Code**.

## 2. Phase Management

-   A lifecycle is composed of one or more **Phases**.
-   The user must be able to **add** new phases to the lifecycle.
-   The user must be able to **remove** existing phases.
-   Each phase must have a **Phase Name**.

## 3. Survey Group Management

-   A phase can contain one or more **Survey Groups**.
-   The user must be able to **add** new survey groups to a phase.
-   The user must be able to **remove** existing survey groups.
-   Each survey group must have a **Group Name**.

## 4. Survey Management

-   A survey group is a collection of one or more **Surveys**.
-   The user must be able to **add** new surveys to a group.
-   The user must be able to **remove** existing surveys from a group.
-   When adding a survey, the user must be able to select from a pre-defined list of available surveys.
-   Each survey added to a group can be marked as **repeatable** (can be taken multiple times) or non-repeatable.

## 5. Independent Surveys

-   The lifecycle can contain **Independent Surveys** that are not part of any phase.
-   The user must be able to **add** and **remove** independent surveys.
-   These surveys are also selected from the pre-defined list of available surveys and can be marked as **repeatable**.

## 6. Moderator Management

-   The lifecycle configuration must include a list of **Moderators**.
-   The user must be able to **add** and **remove** moderators from the list.
-   Each moderator is identified by a unique **Moderator ID**.

## 7. Configuration Persistence

-   The application must automatically save the user's work-in-progress to prevent data loss (e.g., on browser close or refresh).

## 8. Publishing

-   The user must be able to **Publish** a completed lifecycle configuration.
-   The output of the publishing action is a structured data file (e.g., JSON) that represents the complete configuration and can be consumed by other parts of the system.

## 9. Versioning and Editing

-   The system should allow a user to load a previously published configuration for viewing or editing.
-   Publishing an edited configuration should result in a new version, preserving the original.
