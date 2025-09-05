# Frontend - Calculator SPA

This is the frontend of the Calculator application, built with React.js as a **Single Page Application (SPA)**.

## What is an SPA?

An SPA loads a single HTML page and dynamically updates the content without reloading the entire page.  
**Advantages:**  
- Faster and smoother user experience.  
- Less resource consumption by avoiding full page reloads.  
- Better real-time interaction.

Technologies Used
React.js
Axios for backend calls
React Router for SPA navigation
Context API for state management

## Project Structure
┌─────────────┐     ┌───────────────┐     ┌──────────────────┐
│             │     │               │     │                  │
│   Frontend  │────>│  API Gateway  │────>│  Auth Service    │
│  (Vercel)   │     │  (Render)     │     │                  │
│             │     │               │     └──────────────────┘
└─────────────┘     └───────┬───────┘     ┌──────────────────┐
                            │             │                  │
                            │────────────>│  Balance Service │
                            │             │                  │
                            │             └──────────────────┘
                            │             ┌──────────────────┐
                            │             │                  │
                            │────────────>│ Operation Service│
                            │             │                  │
                            │             └──────────────────┘
                            │             ┌──────────────────┐
                            │             │                  │
                            └────────────>│  Record Service  │
                                          │                  │
                                          └──────────────────┘


## Production URL

The application is deployed and available at:  
https://calculator-seven-wine-91.vercel.app/

## Installation

1. Clone the repository  
   git clone https://github.com/jabrahamocampo/calculator-frontend.git
   cd calculator-frontend

Install dependencies
npm install

Run the application in development mode
npm start


