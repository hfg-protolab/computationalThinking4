# Context

## Project

A collaborative whiteboard platform (similar to Miro). Users can create, edit and arrange sticky notes on a shared board and collaborate with others in real time.

The software is built up step by step. Each step introduces a clearly named architectural pattern, so the structure of the code stays easy to follow.

## Technical Setup

- **Monorepo** based on **npm workspaces**
- **Nuxt** as the framework for the web application (`frontend/`)
- **Tailwind CSS** with **shadcn-vue** for styling and UI components
- **Hono** on Node.js as the backend API (`backend/`)
- **Bruno** for testing the API, usable directly in VS Code (`bruno/`)
