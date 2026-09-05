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
- AI-powered OCR using a vision-capable AI model
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
- AI-generated insights based on the user's actual financial data

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

The application uses a dynamic initials-based avatar instead of storing profile images.

Example:

    Hrushikesh Bhoir → HB

---

## 🤖 AI Integration

FinPilot integrates AI through the Spring Boot backend using the OpenRouter API.

The AI API key is never exposed to the React frontend.

### 🧾 AI Receipt OCR

The receipt scanning process follows this flow:

    React Scanner
          ↓
    aiApi.js
          ↓
    POST /api/ai/receipt/scan
          ↓
    AiController
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
          ↓
    Review & Save Expense

The backend accepts the uploaded receipt image, converts it into a format suitable for the multimodal AI request, sends it to the configured AI model, and converts the AI response into structured receipt data.

### 🤖 AI Financial Insights

The financial insights process follows this flow:

    React Insights Page
          ↓
    aiApi.js
          ↓
    GET /api/ai/insights
          ↓
    AiController
          ↓
    FinancialInsightService
          ↓
    ExpenseRepository + BudgetRepository
          ↓
    MySQL Financial Data
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

The AI analysis uses the authenticated user's actual expense and budget data to generate personalized financial insights and recommendations.

### 🔒 AI Security

- OpenRouter API calls are handled only by the Spring Boot backend.
- The OpenRouter API key is never exposed to the frontend.
- AI endpoints are protected using JWT authentication.
- AI configuration is stored in the local `application.properties` file.
- `application.properties` is excluded from Git using `.gitignore`.

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
- JavaScript
- JSX
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

## 🏗️ Architecture

FinPilot follows a layered full-stack architecture.

    React.js Frontend
            ↓
        Axios API
            ↓
    Spring Boot REST API
            ↓
    ┌─────────────────────────────┐
    │       Controller Layer      │
    └─────────────────────────────┘
            ↓
    ┌─────────────────────────────┐
    │        Service Layer        │
    └─────────────────────────────┘
            ↓
    ┌─────────────────────────────┐
    │      Repository Layer       │
    └─────────────────────────────┘
            ↓
          MySQL

For authentication:

    React Login
          ↓
    AuthController
          ↓
    Spring Security
          ↓
    AuthenticationManager
          ↓
    UserDetailsService
          ↓
    JWT Generation
          ↓
    JWT returned to frontend

For protected requests:

    React Request
          ↓
    JWT Bearer Token
          ↓
    JwtFilter
          ↓
    Spring Security
          ↓
    Controller
          ↓
    Service
          ↓
    Repository
          ↓
    MySQL

---

## 📂 Project Structure

    FinPilot/
    │
    ├── backend/
    │   ├── src/
    │   │   ├── main/
    │   │   │   ├── java/
    │   │   │   │   └── com/
    │   │   │   │       └── hrushi/
    │   │   │   │           └── finpilot/
    │   │   │   │
    │   │   │   │               ├── ai/
    │   │   │   │               │   ├── AiController.java
    │   │   │   │               │   ├── OpenRouterService.java
    │   │   │   │               │   ├── ReceiptScanService.java
    │   │   │   │               │   └── FinancialInsightService.java
    │   │   │   │               │
    │   │   │   │               ├── config/
    │   │   │   │               │   ├── CorsConfig.java
    │   │   │   │               │   ├── SwaggerConfig.java
    │   │   │   │               │   └── WebMvcConfig.java
    │   │   │   │               │
    │   │   │   │               ├── controller/
    │   │   │   │               │   ├── AccountController.java
    │   │   │   │               │   ├── AuthController.java
    │   │   │   │               │   ├── BudgetController.java
    │   │   │   │               │   ├── CategoryController.java
    │   │   │   │               │   ├── DashboardController.java
    │   │   │   │               │   ├── ExpenseController.java
    │   │   │   │               │   ├── NotificationController.java
    │   │   │   │               │   └── ReportController.java
    │   │   │   │               │
    │   │   │   │               ├── dto/
    │   │   │   │               │   ├── AccountRequest.java
    │   │   │   │               │   ├── BudgetRequest.java
    │   │   │   │               │   ├── BudgetSummaryResponse.java
    │   │   │   │               │   ├── CategoryReportResponse.java
    │   │   │   │               │   ├── CategoryRequest.java
    │   │   │   │               │   ├── DashboardResponse.java
    │   │   │   │               │   ├── FinancialInsightResponse.java
    │   │   │   │               │   ├── LoginRequest.java
    │   │   │   │               │   ├── MonthlyReportResponse.java
    │   │   │   │               │   ├── ReceiptItem.java
    │   │   │   │               │   ├── ReceiptScanResponse.java
    │   │   │   │               │   └── ReportSummaryResponse.java
    │   │   │   │               │
    │   │   │   │               ├── entity/
    │   │   │   │               │   ├── Account.java
    │   │   │   │               │   ├── Budget.java
    │   │   │   │               │   ├── Category.java
    │   │   │   │               │   ├── Expense.java
    │   │   │   │               │   ├── Notification.java
    │   │   │   │               │   └── User.java
    │   │   │   │               │
    │   │   │   │               ├── exception/
    │   │   │   │               │   ├── ErrorResponse.java
    │   │   │   │               │   ├── GlobalExceptionHandler.java
    │   │   │   │               │   └── ResourceNotFoundException.java
    │   │   │   │               │
    │   │   │   │               ├── repository/
    │   │   │   │               │   ├── AccountRepository.java
    │   │   │   │               │   ├── BudgetRepository.java
    │   │   │   │               │   ├── CategoryRepository.java
    │   │   │   │               │   ├── ExpenseRepository.java
    │   │   │   │               │   ├── NotificationRepository.java
    │   │   │   │               │   └── UserRepository.java
    │   │   │   │               │
    │   │   │   │               ├── security/
    │   │   │   │               │   ├── JwtFilter.java
    │   │   │   │               │   └── SecurityConfig.java
    │   │   │   │               │
    │   │   │   │               ├── service/
    │   │   │   │               │   ├── AccountService.java
    │   │   │   │               │   ├── BudgetService.java
    │   │   │   │               │   ├── CategoryService.java
    │   │   │   │               │   ├── CustomUserDetailsService.java
    │   │   │   │               │   ├── ExpenseService.java
    │   │   │   │               │   ├── NotificationService.java
    │   │   │   │               │   ├── ReportService.java
    │   │   │   │               │   └── UserService.java
    │   │   │   │               │
    │   │   │   │               └── util/
    │   │   │   │                   └── JwtUtil.java
    │   │   │   │
    │   │   │   └── resources/
    │   │   │       ├── application.properties
    │   │   │       └── application.properties.example
    │   │   │
    │   │   └── test/
    │   │       └── java/
    │   │
    │   ├── pom.xml
    │   ├── mvnw
    │   └── mvnw.cmd
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── charts/
    │   │   │   ├── common/
    │   │   │   │   └── FinPilotLogo.jsx
    │   │   │   ├── dashboard/
    │   │   │   ├── layout/
    │   │   │   │   ├── AppLayout.jsx
    │   │   │   │   ├── Navbar.jsx
    │   │   │   │   ├── Sidebar.jsx
    │   │   │   │   └── SiteFooter.jsx
    │   │   │   ├── receipt/
    │   │   │   └── ui/
    │   │   │
    │   │   ├── constants/
    │   │   │   ├── appData.jsx
    │   │   │   └── landingData.jsx
    │   │   │
    │   │   ├── context/
    │   │   │   ├── AuthContext.jsx
    │   │   │   ├── CurrencyContext.jsx
    │   │   │   └── ThemeContext.jsx
    │   │   │
    │   │   ├── hooks/
    │   │   │   └── use-toast.js
    │   │   │
    │   │   ├── pages/
    │   │   │   ├── AccountsPage.jsx
    │   │   │   ├── BudgetsPage.jsx
    │   │   │   ├── CategoriesPage.jsx
    │   │   │   ├── DashboardPage.jsx
    │   │   │   ├── ExpensesPage.jsx
    │   │   │   ├── HelpPage.jsx
    │   │   │   ├── InsightsPage.jsx
    │   │   │   ├── LandingPage.jsx
    │   │   │   ├── LoginPage.jsx
    │   │   │   ├── NotFoundPage.jsx
    │   │   │   ├── NotificationsPage.jsx
    │   │   │   ├── ProfilePage.jsx
    │   │   │   ├── RegisterPage.jsx
    │   │   │   ├── ReportsPage.jsx
    │   │   │   ├── ScannerPage.jsx
    │   │   │   └── SettingsPage.jsx
    │   │   │
    │   │   ├── services/
    │   │   │   ├── accountApi.js
    │   │   │   ├── aiApi.js
    │   │   │   ├── authApi.js
    │   │   │   ├── axiosInstance.js
    │   │   │   ├── budgetApi.js
    │   │   │   ├── categoryApi.js
    │   │   │   ├── dashboardApi.js
    │   │   │   ├── expenseApi.js
    │   │   │   ├── notificationApi.js
    │   │   │   └── reportApi.js
    │   │   │
    │   │   ├── styles/
    │   │   │   └── index.css
    │   │   │
    │   │   ├── utils/
    │   │   │
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   │
    │   ├── .env.example
    │   ├── index.html
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── tailwind.config.js
    │   └── vite.config.js
    │
    ├── .gitignore
    └── README.md

---

## 📌 REST APIs

### 🔐 Authentication APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate user and generate JWT |

### 💸 Expense APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/expenses` | Get user expenses |
| POST | `/expenses` | Create an expense |
| PUT | `/expenses/{id}` | Update an expense |
| DELETE | `/expenses/{id}` | Delete an expense |

### 🏷️ Category APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/categories` | Get categories |
| POST | `/categories` | Create a category |

### 💳 Account APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/accounts` | Get user accounts |
| POST | `/accounts` | Create an account |

### 📊 Budget APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/budgets` | Get user budgets |
| POST | `/budgets` | Create a budget |

### 🤖 AI APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/ai/receipt/scan` | Scan receipt image and extract structured data |
| GET | `/api/ai/insights` | Generate personalized financial insights |

All AI endpoints require a valid JWT authentication token.

---

## 🔒 Security

FinPilot uses Spring Security and JWT-based authentication to secure application resources.

### Authentication Flow

    User Login
        ↓
    AuthController
        ↓
    AuthenticationManager
        ↓
    UserDetailsService
        ↓
    BCrypt Password Verification
        ↓
    JWT Token Generation
        ↓
    Token returned to React

For every protected request:

    React Frontend
        ↓
    Authorization: Bearer <JWT>
        ↓
    JwtFilter
        ↓
    JWT Validation
        ↓
    Spring Security
        ↓
    Controller
        ↓
    Service
        ↓
    Repository
        ↓
    MySQL

### Security Features

- JWT-based authentication
- Spring Security
- BCrypt password hashing
- Protected REST APIs
- JWT request filtering using `JwtFilter`
- Authenticated AI endpoints
- User-specific financial data access
- Backend-only OpenRouter API communication

### API Key Protection

The OpenRouter API key is stored only in:

    backend/src/main/resources/application.properties

This file is excluded from Git using `.gitignore`.

A safe template is provided as:

    backend/src/main/resources/application.properties.example

Never commit:

- Database passwords
- JWT secrets
- OpenRouter API keys

---

## 🗄️ Database

FinPilot uses MySQL as its relational database.

### Create Database

    CREATE DATABASE finpilot;

Configure the database connection in:

    backend/src/main/resources/application.properties

Example:

    spring.datasource.url=jdbc:mysql://localhost:3306/finpilot
    spring.datasource.username=YOUR_USERNAME
    spring.datasource.password=YOUR_PASSWORD

Hibernate / JPA is used for object-relational mapping between Java entities and MySQL tables.

The main entities include:

- User
- Expense
- Category
- Account
- Budget
- Notification

---

## ⚙️ Configuration

Create or configure:

    backend/src/main/resources/application.properties

Example configuration:

    spring.application.name=finpilot

    spring.datasource.url=jdbc:mysql://localhost:3306/finpilot
    spring.datasource.username=YOUR_USERNAME
    spring.datasource.password=YOUR_PASSWORD

    app.jwt.secret=YOUR_STRONG_JWT_SECRET
    app.jwt.expiration-ms=3600000

    openrouter.api.key=YOUR_OPENROUTER_API_KEY
    openrouter.base-url=https://openrouter.ai/api/v1
    openrouter.model=google/gemini-2.5-flash

Do not commit the real values to GitHub.

---

## ▶️ Getting Started

### 1. Clone the Repository

    git clone https://github.com/hrushikesh0205/FinPilot.git
    cd FinPilot

### 2. Setup MySQL

Create the database:

    CREATE DATABASE finpilot;

Then configure the MySQL username and password in:

    backend/src/main/resources/application.properties

### 3. Configure OpenRouter

Add your OpenRouter API key to the local backend configuration:

    openrouter.api.key=YOUR_OPENROUTER_API_KEY

The key must remain on the backend and should never be placed inside the React frontend.

### 4. Run the Backend

Open a terminal:

    cd backend
    mvn spring-boot:run

The backend runs on:

    http://localhost:8080

### 5. Run the Frontend

Open another terminal:

    cd frontend
    npm install
    npm run dev

The frontend runs on:

    http://localhost:5173

---

## 🧪 AI Feature Testing

### Receipt Scanner

1. Login to FinPilot.
2. Open **Receipt Scanner**.
3. Upload a receipt image.
4. The image is sent to the Spring Boot backend.
5. The backend sends the receipt to the configured OpenRouter AI model.
6. The AI extracts the receipt information.
7. The extracted information is displayed in the frontend.
8. Review or edit the fields.
9. Save the expense.

### AI Financial Insights

1. Login to FinPilot.
2. Open **AI Insights**.
3. The frontend calls the secured AI insights endpoint.
4. The backend retrieves the authenticated user's expense and budget information.
5. The financial data is aggregated.
6. The backend sends the relevant data to the AI model.
7. AI-generated insights and recommendations are returned.
8. The frontend displays personalized financial insights.

---

## 📸 Screenshots

### Landing Page

_Add screenshot here._

### Dashboard

_Add screenshot here._

### Expense Management

_Add screenshot here._

### Budget Management

_Add screenshot here._

### AI Receipt Scanner

_Add screenshot here._

### AI Financial Insights

_Add screenshot here._

### Reports & Analytics

_Add screenshot here._

---

## 🚀 Future Enhancements

- Voice-based Expense Entry
- AI Financial Chat Assistant
- AI-based Expense Prediction
- Smart Saving Goals
- Bank API Integration
- Mobile Application

---

## 📚 Key Concepts Demonstrated

This project demonstrates practical implementation of:

- Full-stack application development
- REST API design
- Layered architecture
- Spring Boot
- Spring Security
- JWT authentication
- BCrypt password encryption
- Spring Data JPA
- Hibernate ORM
- MySQL database integration
- React.js
- Axios API integration
- Protected frontend routes
- AI API integration
- Multimodal AI / Vision
- OCR-based data extraction
- AI-powered financial analysis
- Backend API security
- DTO-based request and response handling
- Global exception handling

---

## 👨‍💻 Developer

**Hrushikesh Bhoir**

### GitHub

https://github.com/hrushikesh0205/FinPilot

### LinkedIn

https://www.linkedin.com/in/hrushikesh-bhoir/

---

## ⭐ Show Your Support

If you found FinPilot useful, consider giving the repository a ⭐ on GitHub.
