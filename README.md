# Workspace Environment

A React-based workspace environment featuring resizable windows and data tables with infinite scrolling capabilities.

## Features

- Draggable and resizable windows
- Data tables with infinite scrolling
- Modern and responsive UI
- Code editor integration using Monaco Editor

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with:
```
SKIP_PREFLIGHT_CHECK=true
NODE_ENV=development
PORT=3000
```

## Running the Application

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

## Technologies Used

- React
- React Draggable
- React Resizable
- Monaco Editor
- Express (for backend services)
- Google APIs (for data integration)

## License

MIT 