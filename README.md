Chatbot Application - Backend

## Table of Contents

- [Overview](#overview)
  - [Features](#features)
- [Project Structure](#project-structure)
- [Setup and Running](#setup-and-running)
- [Contact](#contact)

## Overview

This is the backend for a chatbot application built using NestJS. It facilitates real-time communication with the frontend through WebSockets, manages user sessions, stores the chat history in MongoDB, and optionally uses OpenAI API for dynamic question generation.

## Features
- Handles real-time exchange of chat messages and questions via WebSockets (Socket.IO).
- Enables the creation and management of user sessions, each associated with a unique sessionId.
- Stores user question-answer histories in MongoDB.
- Dynamically generates questions based on previous user answers if the OpenAI API key is provided.
- Contains a fallback list of predefined questions if OpenAI is not used.
**Tech Stack**
- NestJS: Backend web framework for creating the API and WebSocket functionality.
- MongoDB: NoSQL database to store user sessions and chat histories.
- Mongoose: ODM library to interact with MongoDB.
- Socket.IO: WebSocket library for handling real-time communication between the server and the frontend.
- OpenAI API: (Optional) Used for dynamic question generation leveraging GPT models.

## Project Structure
```
├── public/
│   ├── index.html
├── src/
│   ├── chatbot/
│   │   └── chatbot.gateway.ts      # WebSocket gateway, handles real-time events for chat
|   |   ├── chatbot.module.ts
|   |   ├── chatbot.service.ts      # Main service performing business logic (session handling, question generation)
|   |   ├── openai.service.ts       # Service handling OpenAI interactions for question generation (optional)
|   |   └── schemas
│   │       └── session.schema.ts    # Session schema and MongoDB model definition
├── package.json
└── README.md
```
## Key Files
- chat.gateway.ts:
Manages WebSocket events like receiving user answers (userAnswer), registering new sessions (registerSession), and receiving chat history.
- chatbot.service.ts:
Handles all core chatbot logic, including managing sessions, storing answers in MongoDB, and fetching the next unanswered question.
If OpenAI is integrated, it leverages OpenAI to generate dynamic questions instead of predefined ones.
- openai.service.ts:
Responsible for interacting with OpenAI's API to produce dynamic, meaningful questions based on the chat context.
If no API key is provided, it falls back to a static list of questions.
- session.schema.ts:
MongoDB schema that represents the user session, including the questions asked, the answers given, and timestamps for the session start and end.
## Setup and Running

# Prerequisites
Node.js (version ≥ 14)
NPM or Yarn
**MongoDB database running locally or remotely**

Follow these steps to get the project up and running on your local machine.

Clone the Project and Install Dependencies
Start the Development Server

Create a .env file in the root of the backend directory and add the following environment variables:

```bash
OPENAI_API_KEY=your_openai_api_key  # Optional: Add your OpenAI API Key if using dynamic question generation
```

```bash
$  git clone github.com/AtillaTahak/chat-app-backend
$  cd chat-app-backend
$  npm install
$  npm run start:dev
```

The chatbot UI will be available at http://localhost:3000.

Note: Ensure that your backend (NestJS server) is running on http://localhost:3002 for the frontend to correctly establish the WebSocket connection.

## Workflow in This Project

# WebSocket Events
The backend communicates with the frontend over WebSockets using Socket.IO. Below are the key events:

- userAnswer: Triggered when the user submits an answer to a chatbot question. The backend processes the answer and sends the next question to the user.
- registerSession: Registers a session by sessionId when a user connects. It retrieves the user's chat history and the next question to ask.
- clearHistory: Clears the chat history for the current session and resets it to the beginning, with the first question being sent to the frontend.
# Event-Flow Example
- A user answers a chatbot question.
- The server processes the input and retrieves the next question.
- The new question is sent back to the frontend through the newQuestion event.
- A new session is registered.
- The backend retrieves any existing chat history from MongoDB and sends it to the client.
- It also sends the next unanswered question for the session.
- Chat history is cleared.
- All previous questions and answers are cleared for the sessionId, and the chatbot starts asking from the first question again.

# OpenAI Integration (Optional)
If you want to dynamically generate questions based on prior user input, you can integrate OpenAI by setting the OPENAI_API_KEY in the .env file.

In cases where the OpenAI key is not provided, the application will instead fall back to a predefined list of questions about cats.

# Adding OpenAI
- Dynamic Question Generation:
OpenAI's GPT-3 engine is leveraged to generate chatbot questions based on previous conversation context. The chatbot first uses the history of questions and answers to craft a question that fits the flow of the conversation.
- Fallback Behavior:
If the OPENAI_API_KEY is not set, the chatbot will use an array of predefined questions, such as:

```bash
What is your favorite breed of cat, and why?
Why do you think cats communicate with their owners?
...
```
# MongoDB Storage Structure
Each user session is stored in a MongoDB collection. The schema includes:

- sessionId: Unique identifier for each user session.
- questions: Array storing the questions asked and their corresponding answers.
- startTime: Timestamp when the session was created.
- endTime: Timestamp when the session ended (if applicable).

Example Session Document

```bash
{
  "_id": "607f1f77bcf86cd799439014",
  "sessionId": "unique_session_id_123",
  "questions": [
    {
      "question": "What do you think about cats?",
      "answer": "I love them!"
    },
    {
      "question": "Why do you think cats are independent?",
      "answer": ""
    }
  ],
  "startTime": "2023-04-10T12:26:05.209Z",
  "endTime": null
}
```


## Contact

- GitHub: [@AtillaTahak](https://github.com/AtillaTahak)
- Twitter: [@AtillaTahaa](https://twitter.com/AtillaTahaa)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/atillatahakordugum)
- Blog: [Blog](https://atillataha.blogspot.com)
- Youtube: [YouTube](https://www.youtube.com/channel/UCmoD0x4Z9vdG2PCsI5p8FYg)
- Portfolio: [Portfolio](atillataha.netlify.app)
