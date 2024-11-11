# GreenGrove Dashboard Frontend

![image](https://github.com/user-attachments/assets/fc656abc-6f49-46c8-842c-1f40ad8abd0e)

A modern, responsive dashboard for the GreenGrove sustainability platform built with React and Material-UI.

## 🌱 Project Overview

GreenGrove is a sustainability-focused platform that helps users track their eco-friendly activities, manage their green purchases, and participate in community environmental initiatives.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/downloads)

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/mcruz90/cps714.git
    ```

1. Navigate to the frontend directory and install dependencies:

    ```bash
    cd frontend
    npm install
    ```

1. If working on the backend, navigate to the `backend` directory and install dependencies:

    ```bash
    cd backend
    npm install
    ```

1. Start the development server:

    ```bash
    npm run dev
    ```

This will start the frontend development server at `http://localhost:5173`.

## Project Structure

frontend/

- `src/`: Contains the source code for the frontend application.
- `public/`: Contains static assets and the `index.html` file.
- `package.json`: Defines the project's dependencies and scripts.

backend/

- `src/`: Contains the source code for the backend application.
- `package.json`: Defines the project's dependencies and scripts.

## Common Commands

- `npm run dev`: Start the frontend development server.
- `npm run dev-backend`: Start the backend development server.
- `npm run build`: Build the frontend application for production.
- `npm run start`: Start the production server.

## Git Workflow

1. Before starting new work, ensure your local repository is up to date with the remote repository:
    - `git pull origin main`

1. Create a new branch for your changes:
    - `git checkout -b feature/<branch-name>`

1. Make your changes and commit them:
    - `git add .`
    - `git commit -m "Description of changes"`

1. Push your changes to the remote repository:
    - `git push origin feature/<branch-name>`

1. Create a pull request from your branch in the GitHub repository:
    - Go to the repository on GitHub
    - Click "Pull Requests"
    - Click "New Pull Request"
    - Select your branch
    - Add description of your changes
    - Request review from team members
