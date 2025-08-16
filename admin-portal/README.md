# Admin Portal (Static Version)

This directory contains a standalone, static HTML/JavaScript application that provides a web interface for configuring Activity Lifecycles.

**This is a serverless application. It runs entirely in your web browser.**

## How to Use

1.  **Open the `index.html` file:**
    Simply open the `admin-portal/index.html` file in a modern web browser (like Chrome, Firefox, or Safari).

2.  **Configure the Lifecycle:**
    Use the web interface to build your activity lifecycle. You can add phases, survey groups, select available surveys, and add moderators.

3.  **Auto-Saving:**
    Your work is automatically saved to your browser's local storage as you make changes. If you close the tab and re-open it, your work-in-progress will be reloaded.

4.  **Publishing the Configuration:**
    When you are finished, click the "Generate Publishable JSON" button. This will generate the final JSON configuration and display it in a text box at the bottom of the page.

5.  **Save the Configuration:**
    -   Copy the entire contents of the text box.
    -   Create a new file in the `data` directory of this project.
    -   Name the file using a versioning scheme, for example: `survey-v1.json`, `survey-v2.json`, etc.
    -   Paste the copied JSON into this new file and save it.

The configuration is now "published" and can be used by the main application.
