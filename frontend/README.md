<div align="center">

<img src=".\src\assets\favicon.png" alt="MohitX AI — Your Smart AI Assistant" width="100%" />

# ✨ MohitX AI

### Your Smart AI Assistant

**Ask · Learn · Explore · Create · Grow**

A modern, full-stack AI chat application powered by **Google Gemini**, built with React and Spring Boot.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-mohit--x--ai.vercel.app-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white)](https://mohit-x-ai.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://mohitx-ai.onrender.com)
[![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/mohitkpani/MohitX-AI)

</div>

---

## 🚀 About

MohitX AI is an AI-powered chat application designed to provide helpful, conversational responses through a clean and responsive interface. It connects a React frontend to a Spring Boot backend, which communicates with the Google Gemini API.

## ✨ Features

- **AI-powered chat** — Get responses from Google Gemini.
- **Conversation history** — Keep and revisit previous chats.
- **Markdown rendering** — Display formatted answers, lists, and code.
- **Responsive interface** — Designed for desktop and mobile screens.
- **Copy responses** — Copy assistant messages easily.
- **Dark futuristic UI** — A neon-inspired interface with a modern chat layout.

## 🧰 Tech Stack

| Layer           | Technologies                        |
| --------------- | ----------------------------------- |
| Frontend        | React, Vite, JavaScript, CSS        |
| Backend         | Java 21, Spring Boot, Maven         |
| AI              | Google Gemini API                   |
| Deployment      | Vercel (frontend), Render (backend) |
| Version control | Git, GitHub                         |

## 🔗 Live Links

| Resource          | URL                                     |
| ----------------- | --------------------------------------- |
| Live application  | https://mohit-x-ai.vercel.app/          |
| Backend service   | https://mohitx-ai.onrender.com          |
| GitHub repository | https://github.com/mohitkpani/MohitX-AI |

> The backend base URL is provided for service access. The chat endpoint is `POST /api/chat`.

## 🗂️ Project Structure

```text
MohitX-AI/
├── backend/
│   ├── src/
│   │   └── main/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## ⚙️ Run Locally

### Prerequisites

- Java 21 or later
- Node.js and npm
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/mohitkpani/MohitX-AI.git
cd MohitX-AI
```

### 2. Configure the backend

Set your Gemini key as an environment variable. Do not put the real key in source code or commit it to Git.

**Windows PowerShell:**

```powershell
$env:GEMINI_API_KEY="your_gemini_api_key"
```

**macOS / Linux:**

```bash
export GEMINI_API_KEY="your_gemini_api_key"
```

Make sure `backend/src/main/resources/application.properties` contains:

```properties
gemini.api.key=${GEMINI_API_KEY}
gemini.model=gemini-flash-latest
```

Start the backend:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows PowerShell, use:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs locally at `http://localhost:8080`.

### 3. Configure and run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite runs locally at `http://localhost:5173`.

## 🔌 API

### Chat endpoint

```http
POST /api/chat
Content-Type: application/json
```

Request:

```json
{
  "message": "Explain Java in simple terms"
}
```

Response:

```json
{
  "reply": "Java is a general-purpose programming language..."
}
```

## 🌐 Deployment

- **Frontend:** Deployed on Vercel from the `frontend` directory.
- **Backend:** Deployed on Render using the Dockerfile in `backend`.
- **Secret configuration:** Set `GEMINI_API_KEY` in the Render service's environment variables. Never add the actual key to GitHub or the frontend.

For production, configure Spring Boot CORS to allow the deployed Vercel origin.

## 🔐 Security Notes

- Keep API keys out of Git.
- Use environment variables for secrets.
- If a key is accidentally committed or exposed, revoke it and create a replacement.
- Do not expose the Gemini API key in React code or Vercel frontend variables.

## 👨‍💻 Author

**Mohit Kumar Pani**  
Full Stack Developer

- GitHub: [@mohitkpani](https://github.com/mohitkpani)
- Project: [MohitX-AI](https://github.com/mohitkpani/MohitX-AI)

---

<div align="center">

**Built with curiosity, code, and AI. 💜**

⭐ If you like MohitX AI, consider giving the repository a star!

</div>
