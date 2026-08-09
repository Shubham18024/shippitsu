# Shippitsu

**執筆 (Shippitsu)** means *writing* in Japanese, especially writing for publication.

Shippitsu is a lightweight blogging app built with Express and EJS. Posts are stored in the browser with `localStorage`, and the writing flow includes markdown formatting, live preview, and client-side post management.

## Tech Stack

* **Express.js** - server and routing
* **EJS** - server-side templates
* **Vanilla JavaScript** - editor, preview, and post logic
* **HTML & CSS** - structure and styling
* **localStorage** - browser-based post storage
* **Node.js** - runtime

## Features

* Home feed that renders posts saved in the browser
* Write page with markdown toolbar and live preview
* Post detail view that renders markdown formatting
* Delete action for posts from the home page
* Responsive layout for desktop and mobile
* Custom 404 page

## Project Structure

```text
shippitsu/
├── public/
│   ├── css/
│   │── favicon_io/
│   ├── js/
│   ├── fonts/
│   └── images/
│
├── views/
│   ├── partials/
│   ├── index.ejs
│   ├── post.ejs
│   ├── write.ejs
│   ├── about.ejs
│   └── 404.ejs
│
├── routes/
│   ├── index.js
│
├── app.js
├── package.json
├── package-lock.json
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

* Node.js 18 or newer
* npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Or, Production-style start command:

```bash
npm start
```

The app runs at:

```text
http://localhost:3000
```

## Notes

* Posts are stored in the browser, so they are local to each device and browser profile.
* If the browser storage is cleared, saved posts are removed.
* The app currently focuses on client-side post creation and display rather than a remote database.

## License

This project is licensed under the [MIT License](LICENSE).

---

> **Shippitsu** - a quiet corner on the internet for writing that matters.
