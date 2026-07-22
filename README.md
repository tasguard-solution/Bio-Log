# Bio Log

Bio Log is an immersive digital platform that transforms plant and animal biology into a visually stunning experience. Built primarily for Nigerian secondary school students, it combines interactive 3D models, comprehensive encyclopedia articles, and WAEC past questions into a modern, installable Progressive Web App (PWA).

## Features

* **3D Visualization Hub:** Interactive 3D models of biological structures. Students can rotate, zoom, and explore models directly in the browser.
* **WAEC Practice System:** Integrated past questions to help students prepare for their exams, complete with topic filtering.
* **Biological Encyclopedia:** Detailed articles on various organisms, categorized and easily searchable.
* **School Administration Dashboard:** Schools can register, manage student rosters, and handle subscription renewals via an inline Monnify payment integration.
* **Custom 3D Overrides:** School administrators have the power to override global 3D models with their own custom Sketchfab uploads.
* **Global Search Palette:** A lightning fast, client-side search overlay accessible by pressing the `/` key, allowing quick access to organisms, topics, and past questions.
* **Progressive Web App (PWA):** Fully installable on Android and Desktop environments.

## Tech Stack

* **Frontend Framework:** React 19 with Vite
* **Styling:** Tailwind CSS 4
* **Backend and Database:** Supabase (PostgreSQL, Authentication, Row Level Security)
* **Payments:** Monnify
* **Icons:** Lucide React
* **3D Rendering:** Google Model Viewer and Sketchfab
* **Animations:** Motion

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the required environment variables.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the local development URL provided by Vite (typically http://localhost:3000).

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

### Supabase
* `VITE_SUPABASE_URL`: Your Supabase project URL.
* `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous API key.

### Monnify
* `VITE_API_Key`: Your Monnify API key.
* `VITE_Secret_Key`: Your Monnify secret key.
* `VITE_Contract_Code`: Your Monnify contract code.
* `VITE_Base_URL`: The Monnify API base URL (e.g., https://sandbox.monnify.com for testing).
