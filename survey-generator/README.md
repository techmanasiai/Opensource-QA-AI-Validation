# Survey Generator

This is a simple web-based application to create and configure a survey. It generates a `survey.json` file that can be used by the survey viewer application.

## How to Run the Survey Generator

You can run the survey generator on your local machine in two ways.

### Method 1: Open the HTML File Directly (Simplest)

You can open the main file directly in your web browser without needing a server.

1.  Navigate to the `survey-generator` directory in your file explorer.
2.  Double-click on the `index.html` file, or right-click and choose "Open with" your favorite browser (e.g., Chrome, Firefox, Safari).

This should work for most modern browsers.

### Method 2: Use a Simple Local Web Server (Recommended)

For the best experience and to avoid any potential browser security issues with running local files, it's a good practice to use a simple local web server. If you have Python installed, you can do this in just a few steps.

1.  Open your terminal or command prompt.
2.  From the root directory of this project (the one containing the `survey-generator` folder), run one of the following commands, depending on your Python version:

    -   **For Python 3:**
        ```sh
        python -m http.server
        ```

    -   **For Python 2:**
        ```sh
        python -m SimpleHTTPServer
        ```

3.  Once the server is running (it will say something like `Serving HTTP on 0.0.0.0 port 8000 ...`), open your web browser and go to the following address:

    [http://localhost:8000/survey-generator/](http://localhost:8000/survey-generator/)

This will serve all the project files locally, and you'll be able to use the survey generator from that URL.
