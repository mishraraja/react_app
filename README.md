# School Timetable Generator

React single-page app for generating and managing school timetables from teacher-subject allotment data.

## Features

- Class-section timetable view
- Monday to Saturday schedule
- 8 periods per day
- Subject management
- Teacher management
- Teacher allotment
- Manual timetable editing
- Automatic timetable generation
- Teacher conflict prevention
- Admin verification for rows marked `Needs verification`
- PDF and Excel timetable download
- LocalStorage-based data persistence

## Requirements

- Node.js 20.5 or newer
- npm

This project uses Vite `5.4.11`, which works with the Node version currently used on this machine.

## Install Dependencies

Open a terminal in the project folder:

```bash
cd C:\react_app
npm install
```

## Run The App

Start the development server:

```bash
npm run dev
```

Vite will show a local URL in the terminal, usually:

```text
http://localhost:5173
```

If port `5173` is already in use, run:

```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

Then open:

```text
http://127.0.0.1:5174
```

## Build For Production

```bash
npm run build
```

The production files will be created in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## How To Use

1. Open the app in the browser.
2. Go to `Automatic Timetable Generation`.
3. Review rows marked `Needs verification`.
4. Correct data in `Subjects` if needed.
5. Mark verified rows as verified.
6. Click `Generate Timetable`.
7. Use `Manual Timetable Generation` to edit any slot.
8. Use `Download Timetable` to export PDF or Excel.

## Important Notes

- Data is stored in browser `localStorage`.
- There is no backend or database yet.
- To reset app data, clear the browser site data/localStorage for the app URL.
- The timetable generator blocks final generation if any source row still needs verification or has conflicting rules.

## Project Structure

```text
src/
  components/   Reusable UI components
  data/         Constants, seed data, and app context
  pages/        App screens
  utils/        Timetable generation, export, storage, and validation helpers
  App.jsx       Routes
  main.jsx      React entry point
```

## Troubleshooting

If you see a white page:

1. Stop the running dev server.
2. Make sure `vite.config.js` exists.
3. Run the app again:

```bash
npm run dev
```

If the browser still shows old data, clear localStorage and refresh the page.
