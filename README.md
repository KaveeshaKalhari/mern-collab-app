# CollabDocs — MERN Stack Collaborative Note-Taking App

A collaborative rich-text document web app built with MongoDB, Express, React, Node.js and Tailwind CSS.

## Features
- JWT Authentication (Register/Login)
- Create, view and edit documents
- Rich text editor (Tiptap) with Bold, Italic, Headings, Lists, Code
- Full-text search across documents
- Collaborator management (add users by email)
- Protected routes

## Tech Stack
- **Frontend:** React.js, Tailwind CSS, Tiptap, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT (JSON Web Tokens)

## Project Structure
```
mern-collab-app/
├── client/         # React frontend
└── server/         # Express backend
```

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### 1. Clone the repo
```bash
git clone https://github.com/KaveeshaKalhari/mern-collab-app.git
cd mern-collab-app
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
npm start
```

### 4. Open app
```
http://localhost:3000
```

## Environment Variables

Create a `.env` file in the `server/` folder based on `.env.example`:

| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Any random secret string |
| PORT | Server port (default: 5000) |

## Assumptions Made
- Collaborators are added by their registered email address
- All users must be registered before being added as collaborators
- Documents are private by default — only owner and collaborators can view them