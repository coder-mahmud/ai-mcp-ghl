# MCP Server + OpenAI Agent + Next.js + GoHighLevel (GHL) Integration

This project is an MVP demonstrating an end-to-end flow between:

-   **Next.js frontend**
-   **OpenAI Agent (Agent Builder)**
-   **Custom MCP server**
-   **GoHighLevel (GHL) CRM**

The system collects user details (name & email) from the frontend,
processes them through an OpenAI agent, and the MCP server automatically
creates a **new GHL contact**.

##  Overview

### Architecture Flow

1.  User interacts with the chatbot on the Next.js frontend.
2.  The OpenAI agent asks for the user's name and email.
3.  Once collected, the agent calls a custom MCP server tool.
4.  The MCP server receives the data and triggers the GHL API.
5.  A new contact is created in GoHighLevel CRM.
6.  The agent confirms the operation back to the user.

## 🧩 Tech Stack

  Component          Technology
  ------------------ ------------------------------
  Frontend           Next.js (App Router)
  AI Agent           OpenAI Agent Builder
  Backend Protocol   MCP (Model Context Protocol)
  CRM                GoHighLevel API
  Deployment         Local / Cloud

##  MCP Server Responsibilities

The MCP server exposes a **tool** to the OpenAI agent that accepts:

``` json
{
  "name": "User Name",
  "email": "user@example.com"
}
```

It then:

-   Validates parameters\
-   Calls GoHighLevel API\
-   Returns success/failure response to the agent

## ⚙️ Setup Instructions

### 1. Clone the Repository

``` bash
git clone https://github.com/coder-mahmud/ai-mcp-ghl
```

### 2. Install Dependencies (MCP Server)

``` bash
npm install
```

### 3. Environment Variables

Create a `.env` file:

    GHL_API_KEY=your_ghl_api_key
    GHL_LOCATION_ID=your_location_id

### 4. Start MCP Server

``` bash
npm start
```

## 🤖 Connecting MCP Server to OpenAI Agent

Inside the Agent Builder:

-   Add MCP server URL
-   Link the "createContact" tool
-   Map parameters:
    -   name
    -   email

## 🖥️ Frontend (Next.js)

To run:

``` bash
npm install
npm run dev
```

## 📬 GoHighLevel Integration

The MCP server uses:

    POST https://rest.gohighlevel.com/v1/contacts/
    Authorization: Bearer GHL_API_KEY

Payload example:

``` json
{
  "firstName": "Mahmud",
  "email": "mahmud@example.com",
  "locationId": "XXXX"
}
```

## 🧪 Current Features

-   ✔ Collect name & email\
-   ✔ AI agent triggers MCP tool call\
-   ✔ MCP server creates GHL contact\
-   ✔ Fully working MVP

## 🛠️ Future Enhancements

-   Pipeline automation\
-   Appointment booking\
-   Multi-field contact creation\
-   Error handling improvements\
-   Logs dashboard

## 📄 License

MIT License.

## ✨ Credits

Developed by **Mahmud**\
AI Agent by **OpenAI Agent Builder**\
CRM powered by **GoHighLevel**
