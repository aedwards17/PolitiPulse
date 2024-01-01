# PolitiPulse
## https://politipulse.austinedwards5.repl.co/

## Overview

PolitiPulse is an online platform aimed at enhancing political awareness by providing comprehensive information on current and prospective members of Congress. Its standout feature is the 'Bill Transformer,' which simplifies the language of congressional bills for better voter understanding.

## Technology Stack

- **Frontend**: React
- **Backend**: Node.js, Firestore
- **Authentication**: Firebase Authentication
- **Other Tools**: Replit, various APIs

## Repository Structure
- **src/**: Source files for the application. Also contains static assets for the frontend (App.jsx, firebase.jsx, index.jsx)

### frontend
- **src/frontend/components/**: React components (e.g., NavBar, BillDetails).
- **src/frontend/contexts/**: React contexts for global state (e.g., AuthContext). Also contains the array of objects for states.
- **src/frontend/pages/**: Individual pages (e.g., Home, SenateMembers).

### backend
- **src/backend/**: Backend scripts for data fetching and processing.

## How to Build and Deploy

### Downloading the Code from GitHub
- Visit the GitHub repository URL: https://github.com/aedwards17/PolitiPulse.
- Click on the 'Code' button and choose 'Download ZIP,' or use Git to clone the repository using the command: git clone https://github.com/aedwards17/PolitiPulse.git.

## Setting up the Project on Replit
- Log in to your Replit account. If you don’t have one, create a new account at Replit.
- Click on the '+' button to create a new repl.
- Select 'Import from GitHub.' Paste the URL of your GitHub repository and import the project.

## Setting up the Server
- Replit provides a simple web server environment. Configure your app’s entry point (like index.js or app.py) correctly.
- The front end will require a key for Firebase. Environment variables are not available on the front end, so it is necessary - to add ‘firebase.jsx’ to your .gitignore file for security purposes.

## Creating and Integrating Firebase Database
- Go to the Firebase Console.
- Create a new project or select an existing one.
- Navigate to the 'Firestore Database' section and create a new database.
- Create an individual Replit for each backend script, selecting Node.js as the environment for each repl.
- Store API keys for ProPublica, Firebase, Firestore, Congress.gov, and Top Congress News in Replit's 'Secrets (Environment Variables).'
- Run each backend script at least once to ensure proper setup.

## Running the Application
- Back in the main repl, hosting our cloned files, use the 'Run' button on Replit to start your application.
- Test the application to ensure it connects to Firebase and operates as expected.
- 
## Deploying the Application

### Setting Up Your Repl:
- First, ensure your Repl is working correctly using the "Run" button.
- If your project requires building into static files (like for a web project), execute the necessary build command (e.g., npm run build) and ensure the output directory (like dist) is correct.

### Creating a Deployment:
- Open the Deployments tab either by clicking the "Deploy" button at the top right of the workspace or by opening a new pane and typing "Deployments".

### Configuring Your Deployment:
- Configure the build command and specify the public directory. This is where your static files are built to. For example, if your static files are in the dist directory, specify that.
- Set up 'Index' and 'Not Found' pages. Your index.html in the public directory will serve as the home page. You can also provide a custom 'Not Found' page with a 404.html file in the same directory.

### Starting Your Deployment:
- After configuration, click "Deploy" to start the deployment process. Once complete, you will get details like the URL and build logs.

### Billing Considerations:
- For Replit Core (previously Hacker or Pro) subscribers, static deployments are free with up to 100 static deployments included.
- Users on the free plan need to add a credit card for creating a Static Deployment. There's a 10 GiB limit on outbound storage transfer, with charges applicable for additional usage.

## Additional Notes
- Always ensure your Firebase rules are set correctly to prevent unauthorized access.
- Contact the authors of this repository for any assistance.
