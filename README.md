# Remix Chinese Bible

This project is a web application for accessing and reading the Chinese Bible. It is built using [Remix](https://remix.run/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/).

## Table of Contents

- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Building and Running in Production](#building-and-running-in-production)
- [Notes](#notes)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (for version control)

## Local Development

1. **Clone the Repository**

   ```bash
   git clone https://github.com/viviOu/remix-chinese-bible.git
   cd remix-chinese-bible
   ```

2. **Install Dependencies**

   Run the following command to install the required dependencies:

   ```bash
   npm install
   ```

3. **Start the Development Server**

   To start the development server, run:

   ```bash
   npm run dev
   ```

   This will start the application in development mode, and you can access it at `http://localhost:5173`.

4. **Hot Reloading**

   The development server supports hot reloading, so any changes you make to the code will automatically refresh the browser.

5. **Managing the Development Server**:
   - If you need to check which process is using a specific port (e.g., 5173), you can use:
     ```bash
     lsof -i :5173
     ```
   - To kill a process using that port, use:
     ```bash
     kill -9 <PID>
     ```
   - Replace `<PID>` with the actual process ID obtained from the previous command.

## Building and Running in Production

1. **Install Dependencies**

   To install the required dependencies for the application, run:

   ```bash
   npm install
   ```

2. **Build the Application**

   To create a production build of the application, run:

   ```bash
   npm run build
   ```

   This command compiles the application and prepares it for deployment.

3. **Start the Production Server**

   After building the application, you can run it in production mode with:

   ```bash
   npm run start
   ```

   The application will be accessible at `http://localhost:3000`.

## Notes

This application was developed and built in a rapid timeframe, so there are opportunities for optimization in the future. While the user experience can be enhanced later, the performance and all features have been tested and are functioning correctly.

## License

© Copyright 2025 ChineseForChristChurch.org
(510) 581-1630
中華歸主海沃教會
157 Smalley Ave.
Hayward, CA 94541

All rights reserved. For more information, please contact us at the above phone number or visit our website.
