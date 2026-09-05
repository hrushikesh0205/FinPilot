हो, समजलं 😄 तुला **एकच continuous Markdown code box** पाहिजे — सुरुवातीच्या ` ```markdown ` पासून शेवटच्या ` ``` ` पर्यंत सगळं एकाच box मध्ये. मध्ये कुठेही वेगळे boxes नकोत.

```markdown
# 💰 FinPilot – AI Personal Finance Manager

FinPilot is a full-stack AI-powered Personal Finance Management application built to help users manage expenses, budgets, accounts, and financial reports from one place.

The application combines secure JWT authentication, real-time financial tracking, interactive dashboards, AI-powered receipt OCR, and personalized financial insights to provide a smarter and more convenient way to manage personal finances.

---

## 🚀 Features

### 🔐 Secure Authentication
- User Registration & Login
- JWT-based Authentication
- Spring Security
- BCrypt Password Encryption
- Protected REST APIs
- Secure User Profile Management

### 💸 Expense Management
- Add, Edit & Delete Expenses
- Expense Categorization
- Monthly Expense Tracking
- Search & Filter Expenses
- Real-time Dashboard Updates

### 💳 Account Management
- Create Multiple Accounts
- Edit & Delete Accounts
- Default Account Selection
- Balance Management

### 📊 Budget Management
- Create Monthly Budgets
- Budget Progress Tracking
- Category-wise Budget Monitoring
- Overspending Alerts

### 🧾 AI Receipt Scanner
- Upload Receipt Images
- AI-powered OCR using a Vision-capable AI model
- Automatic extraction of:
  - Merchant Name
  - Invoice / Receipt Number
  - Date
  - Subtotal
  - Tax / GST
  - Grand Total
  - Currency
  - Payment Method
  - Line Items
- Automatic Expense Category Detection
- Review and edit extracted information
- Save scanned receipt data directly as an expense

### 🤖 AI Financial Insights
- Personalized spending analysis
- Category-wise spending insights
- Budget overrun detection
- Financial health summary
- Actionable saving recommendations
- AI-generated insights based on the user's real financial data

### 📈 Reports & Analytics
- Monthly Financial Reports
- Category-wise Spending Analysis
- Interactive Charts & Visualizations
- Expense & Budget Analytics
- PDF / Excel Report Export

### 🔔 Smart Notifications
- Expense Notifications
- Budget Alerts
- AI Insight Notifications
- Financial Activity Updates

### 👤 User Profile
- Edit Profile Information
- Dynamic Initials-based Avatar
- Change Password
- Secure Account Management

---

## 🤖 AI Architecture

FinPilot uses a backend-based AI architecture to keep API credentials secure.

### AI Receipt OCR

React Scanner
      ↓
Spring Boot REST API
      ↓
ReceiptScanService
      ↓
OpenRouterService
      ↓
Gemini 2.5 Flash
      ↓
Structured Receipt JSON
      ↓
React Frontend

### AI Financial Insights

React Insights Page
      ↓
Spring Boot REST API
      ↓
FinancialInsightService
      ↓
Expense & Budget Data from MySQL
      ↓
Financial Data Aggregation
      ↓
OpenRouterService
      ↓
Gemini 2.5 Flash
      ↓
AI-generated Financial Insights
      ↓
React Frontend

The OpenRouter API key is stored only on the backend and is never exposed to the frontend.

---

## 🛠 Tech Stack

### Backend
- Java
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Maven
- REST APIs
- Spring RestClient

### Frontend
- React.js
- JavaScript (JSX)
- Vite
- Tailwind CSS
- Axios
- React Router
- Chart.js

### Database
- MySQL

### AI Integration
- OpenRouter API
- Gemini 2.5 Flash
- Multimodal AI / Vision
- AI-powered Receipt OCR
- AI Financial Insights

---

## 📂 Project Structure

FinPilot/
│
├── backend/
│   ├── src/main/java/com/hrushi/finpilot/
│   │   │
│   │   ├── ai/
│   │   │   ├── AiController.java
│   │   │   ├── OpenRouterService.java
│   │   │   ├── ReceiptScanService.java
│   │   │   └── FinancialInsightService.java
│   │   │
│   │   ├── config/
│   │   │   ├── CorsConfig.java
│   │   │   ├── SwaggerConfig.java
│   │   │   └── WebMvcConfig.java
│   │   │
│   │   ├── controller/
│   │   │   ├── AccountController.java
│   │   │   ├── AuthController.java
│   │   │   ├── BudgetController.java
│   │   │   ├── CategoryController.java
│   │   │   ├── DashboardController.java
│   │   │   ├── ExpenseController.java
│   │   │   ├── NotificationController.java
│   │   │   └── ReportController.java
│   │   │
│   │   ├── dto/
│   │   │   ├── AccountRequest.java
│   │   │   ├── BudgetRequest.java
│   │   │   ├── BudgetSummaryResponse.java
│   │   │   ├── CategoryReportResponse.java
│   │   │   ├── CategoryRequest.java
│   │   │   ├── DashboardResponse.java
│   │   │   ├── FinancialInsightResponse.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── MonthlyReportResponse.java
│   │   │   ├── ReceiptItem.java
│   │   │   ├── ReceiptScanResponse.java
│   │   │   └── ReportSummaryResponse.java
│   │   │
│   │   ├── entity/
│   │   │   ├── Account.java
│   │   │   ├── Budget.java
│   │   │   ├── Category.java
│   │   │   ├── Expense.java
│   │   │   ├── Notification.java
│   │   │   └── User.java
│   │   │
│   │   ├── exception/
│   │   │   ├── ErrorResponse.java
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   └── ResourceNotFoundException.java
│   │   │
│   │   ├── repository/
│   │   │   ├── AccountRepository.java
│   │   │   ├── BudgetRepository.java
│   │   │   ├── CategoryRepository.java
│   │   │   ├── ExpenseRepository.java
│   │   │   ├── NotificationRepository.java
│   │   │   └── UserRepository.java
│   │   │
│   │   ├── security/
│   │   │   ├── JwtFilter.java
│   │   │   └── SecurityConfig.java
│   │   │
│   │   ├── service/
│   │   │   ├── AccountService.java
│   │   │   ├── BudgetService.java
│   │   │   ├── CategoryService.java
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── ExpenseService.java
│   │   │   ├── NotificationService.java
│   │   │   ├── ReportService.java
│   │   │   └── UserService.java
│   │   │
│   │   └── util/
│   │       └── JwtUtil.java
│   │
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application.properties.example
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── layout/
│   │   │   └── common/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── constants/
│   │   ├── utils/
│   │   └── styles/
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md

---

## 📌 REST APIs

### Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/auth/register` |
| POST | `/auth/login` |

### Expenses

| Method | Endpoint |
|--------|----------|
| GET | `/expenses` |
| POST | `/expenses` |
| PUT | `/expenses/{id}` |
| DELETE | `/expenses/{id}` |

### Categories

| Method | Endpoint |
|--------|----------|
| GET | `/categories` |
| POST | `/categories` |

### Accounts

| Method | Endpoint |
|--------|----------|
| GET | `/accounts` |
| POST | `/accounts` |

### Budgets

| Method | Endpoint |
|--------|----------|
| GET | `/budgets` |
| POST | `/budgets` |

### AI Features

| Method | Endpoint |
|--------|----------|
| POST | `/api/ai/receipt/scan` |
| GET | `/api/ai/insights` |

All AI endpoints are protected using JWT authentication.

---

## 🔒 Security

FinPilot follows a secure backend architecture:

React Frontend
      ↓
JWT Authentication
      ↓
Spring Security
      ↓
Spring Boot REST API
      ↓
Business Logic
      ↓
MySQL / OpenRouter

### API Key Security

The OpenRouter API key is never stored in the frontend.

Local configuration is maintained in:

backend/src/main/resources/application.properties

The file is excluded from Git using `.gitignore`.

A safe configuration template is provided through:

application.properties.example

Example configuration:

spring.datasource.url=YOUR_DATABASE_URL
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

app.jwt.secret=YOUR_STRONG_JWT_SECRET

openrouter.api.key=${OPENROUTER_API_KEY}
openrouter.base-url=https://openrouter.ai/api/v1
openrouter.model=google/gemini-2.5-flash

Never commit real database passwords, JWT secrets, or OpenRouter API keys.

---

## ▶️ Getting Started

### 1. Clone Repository

git clone https://github.com/hrushikesh0205/FinPilot.git
cd FinPilot

### 2. Database Setup

Create a MySQL database:

CREATE DATABASE finpilot;

Configure the database credentials in:

backend/src/main/resources/application.properties

Example:

spring.datasource.url=jdbc:mysql://localhost:3306/finpilot
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

Hibernate/JPA will create/update the required tables based on the configured entities.

### 3. OpenRouter Configuration

Add your OpenRouter API key to the local `application.properties`:

openrouter.api.key=YOUR_OPENROUTER_API_KEY
openrouter.base-url=https://openrouter.ai/api/v1
openrouter.model=google/gemini-2.5-flash

Do not add the real API key to GitHub.

### 4. Run Backend

cd backend
mvn spring-boot:run

Backend runs on:

http://localhost:8080

### 5. Run Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173

---

## 📸 Screenshots

Add application screenshots here:

- Landing Page
- Dashboard
- Expense Management
- Budget Management
- AI Receipt Scanner
- AI Financial Insights
- Reports & Analytics

---

## 🚀 Future Enhancements

- Voice-based Expense Entry
- AI Financial Chat Assistant
- AI-based Expense Prediction
- Smart Saving Goals
- Bank API Integration
- Mobile Application

---

## 👨‍💻 Developer

**Hrushikesh Bhoir**

GitHub:
https://github.com/hrushikesh0205/FinPilot

LinkedIn:
https://www.linkedin.com/in/hrushikesh-bhoir/

---

## ⭐ Show Your Support

If you found FinPilot useful, consider giving the repository a ⭐ on GitHub.
```
