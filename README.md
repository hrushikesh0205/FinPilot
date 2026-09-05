# 💰 FinPilot — AI Personal Finance Manager

FinPilot is a **full-stack AI-powered personal finance management application** that helps users manage expenses, budgets, accounts, and financial reports from one place.

The application combines a **React.js frontend with Spring Boot REST APIs, Spring Security, JWT authentication, MySQL database, AI-powered receipt OCR, and personalized financial insights using OpenRouter and Gemini 2.5 Flash**.

---

# 🚀 Key Features

## 👤 User Authentication & Security

* User registration and login
* JWT-based authentication
* Spring Security
* BCrypt password encryption
* Protected REST APIs
* Secure user profile management

## 💸 Expense Management

* Add, edit, and delete expenses
* Expense categorization
* Monthly expense tracking
* Search and filter expenses
* Real-time dashboard updates

## 💳 Account Management

* Create multiple accounts
* Edit and delete accounts
* Default account selection
* Balance management

## 📊 Budget Management

* Create monthly budgets
* Category-wise budget monitoring
* Budget progress tracking
* Overspending alerts

## 🧾 AI Receipt Scanner

* Upload receipt images
* AI-powered receipt OCR
* Automatic extraction of merchant, date, invoice number, tax, total, and line items
* Automatic expense category detection
* Review and edit extracted information
* Save scanned receipt directly as an expense

## 🤖 AI Financial Insights

* Personalized spending analysis
* Category-wise spending insights
* Budget overrun detection
* Financial health summary
* Personalized saving recommendations
* AI-generated insights based on actual user financial data

## 📈 Reports & Analytics

* Monthly financial reports
* Category-wise spending analysis
* Interactive charts and visualizations
* PDF / Excel report export

## 🔔 Notifications

* Expense notifications
* Budget alerts
* AI insight notifications
* Financial activity updates

---

# 🏗️ System Architecture

    ┌──────────────────────┐
    │     React Frontend   │
    │      Vite + JSX      │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │    Axios REST APIs    │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │   Spring Boot API    │
    │     Controllers      │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │       Services       │
    │    Business Logic    │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │    Spring Data JPA   │
    │     Repositories     │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │        MySQL         │
    └──────────────────────┘

---

# 🤖 AI Architecture

## 🧾 Receipt OCR

    React Scanner
          │
          ▼
    Spring Boot API
          │
          ▼
    ReceiptScanService
          │
          ▼
    OpenRouterService
          │
          ▼
    Gemini 2.5 Flash
          │
          ▼
    Structured Receipt Data
          │
          ▼
    React Frontend

## 💡 Financial Insights

    React Insights Page
          │
          ▼
    Spring Boot API
          │
          ▼
    FinancialInsightService
          │
          ▼
    Expense + Budget Data
          │
          ▼
    MySQL
          │
          ▼
    OpenRouter / Gemini
          │
          ▼
    AI Financial Insights

The OpenRouter API key is stored only on the backend and is never exposed to the frontend.

---

# 🧩 Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Backend | Java, Spring Boot 3 |
| Security | Spring Security, JWT, BCrypt |
| Database | MySQL |
| ORM | Spring Data JPA, Hibernate |
| API Communication | REST APIs, Axios |
| HTTP Client | Spring RestClient |
| AI | OpenRouter, Gemini 2.5 Flash |
| Charts | Chart.js |
| Build Tool | Maven |
| Version Control | Git, GitHub |

---

# 📁 Project Structure

    FinPilot/
    │
    ├── backend/
    │   ├── src/main/java/com/hrushi/finpilot/
    │   │
    │   ├── ai/
    │   │   ├── AiController.java
    │   │   ├── OpenRouterService.java
    │   │   ├── ReceiptScanService.java
    │   │   └── FinancialInsightService.java
    │   │
    │   ├── config/
    │   ├── controller/
    │   ├── dto/
    │   ├── entity/
    │   ├── exception/
    │   ├── repository/
    │   ├── security/
    │   ├── service/
    │   └── util/
    │
    │   └── src/main/resources/
    │       ├── application.properties
    │       └── application.properties.example
    │
    │   └── pom.xml
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── context/
    │   │   ├── hooks/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   ├── constants/
    │   │   ├── utils/
    │   │   └── styles/
    │   │
    │   ├── package.json
    │   └── vite.config.js
    │
    ├── .gitignore
    └── README.md

---

# 🔄 Application Flow

## 1. Authentication Flow

    User
     │
     ▼
    Register / Login
     │
     ▼
    AuthController
     │
     ▼
    Spring Security
     │
     ▼
    BCrypt Password Verification
     │
     ▼
    JWT Generation
     │
     ▼
    Authenticated User

## 2. Expense Flow

    React Frontend
          │
          ▼
    Expense API
          │
          ▼
    ExpenseController
          │
          ▼
    ExpenseService
          │
          ▼
    ExpenseRepository
          │
          ▼
    MySQL

## 3. AI Receipt Flow

    Receipt Image
          │
          ▼
    React Scanner
          │
          ▼
    Spring Boot
          │
          ▼
    Gemini Vision Model
          │
          ▼
    Receipt Information
          │
          ▼
    Save Expense

---

# 📌 REST APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login and generate JWT |
| GET | `/expenses` | Get user expenses |
| POST | `/expenses` | Create expense |
| PUT | `/expenses/{id}` | Update expense |
| DELETE | `/expenses/{id}` | Delete expense |
| GET | `/accounts` | Get accounts |
| POST | `/accounts` | Create account |
| GET | `/budgets` | Get budgets |
| POST | `/budgets` | Create budget |
| GET | `/categories` | Get categories |
| POST | `/categories` | Create category |
| POST | `/api/ai/receipt/scan` | AI receipt OCR |
| GET | `/api/ai/insights` | AI financial insights |

---

# 🔐 Security

FinPilot uses multiple security mechanisms:

* JWT-based authentication
* Spring Security
* BCrypt password hashing
* Protected REST APIs
* JWT request filtering using `JwtFilter`
* User-specific financial data access
* Authenticated AI endpoints
* Backend-only OpenRouter API communication

Sensitive configuration such as database credentials, JWT secrets, and OpenRouter API keys are kept in the local `application.properties` file and excluded from Git.

---

# 💾 Database

FinPilot uses **MySQL** as its relational database.

Main entities include:

    User
     │
     ├── Expenses
     ├── Budgets
     ├── Accounts
     ├── Categories
     └── Notifications

Create the database using:

    CREATE DATABASE finpilot;

Hibernate / JPA is used for object-relational mapping between Java entities and MySQL tables.

---

# ⚙️ Local Setup

## 1. Clone Repository

    git clone https://github.com/hrushikesh0205/FinPilot.git
    cd FinPilot

## 2. Database Setup

Create the MySQL database:

    CREATE DATABASE finpilot;

Configure database credentials in:

    backend/src/main/resources/application.properties

## 3. OpenRouter Configuration

Add the OpenRouter API key to the local `application.properties`:

    openrouter.api.key=YOUR_OPENROUTER_API_KEY
    openrouter.base-url=https://openrouter.ai/api/v1
    openrouter.model=google/gemini-2.5-flash

Never commit real credentials or API keys to GitHub.

## 4. Start Backend

    cd backend
    mvn spring-boot:run

Backend:

    http://localhost:8080

## 5. Start Frontend

    cd frontend
    npm install
    npm run dev

Frontend:

    http://localhost:5173

---


---

# 🚀 Future Improvements

* AI Financial Chat Assistant
* AI-based Expense Prediction
* Voice-based Expense Entry
* Smart Saving Goals
* Bank API Integration
* Mobile Application

---

# 🧠 Engineering Highlights

* Full-stack application using React.js and Spring Boot
* Layered backend architecture
* Secure JWT authentication with Spring Security
* RESTful API design
* MySQL database integration using JPA/Hibernate
* Multimodal AI integration for receipt OCR
* AI-powered financial analysis using real user data
* Secure backend-to-AI API communication
* Interactive financial dashboards and reports

---

# 👨‍💻 Developer

**Hrushikesh Bhoir**

GitHub: https://github.com/hrushikesh0205/FinPilot

LinkedIn: https://www.linkedin.com/in/hrushikesh-bhoir/

---

⭐ If you found this project useful, consider giving the repository a star.
