# 💰 FinPilot – AI Personal Finance Manager

FinPilot is a full-stack AI-powered Personal Finance Management application that helps users manage expenses, budgets, accounts, and financial reports from one place. It includes AI-powered receipt scanning, intelligent spending insights, secure JWT authentication, and an intuitive dashboard for tracking personal finances.

---

## 🚀 Features

### 🔐 Secure Authentication
- User Registration & Login
- JWT-based Authentication
- Spring Security
- BCrypt Password Encryption
- Protected REST APIs
- User Profile Management

### 💸 Expense Management
- Add, Edit & Delete Expenses
- Expense Categorization
- Monthly Expense Tracking
- Filter & Search Expenses
- Real-time Dashboard Updates

### 💳 Account Management
- Create Multiple Accounts
- Edit & Delete Accounts
- Default Account Selection
- Balance Management

### 📊 Budget Management
- Create Monthly Budgets
- Budget Progress Tracking
- Overspending Alerts
- Category-wise Budget Monitoring

### 🧾 AI Receipt Scanner
- Upload Receipt Images
- AI-powered OCR Data Extraction
- Auto-fill Expense Details
- Save Scanned Expenses Directly

### 🤖 AI Financial Insights
- Spending Pattern Analysis
- Personalized Financial Suggestions
- Budget Recommendations
- Smart Expense Insights

### 📈 Reports & Analytics
- Monthly Financial Reports
- Income vs Expense Analysis
- Category-wise Charts
- Export Reports (PDF / Excel)

### 🔔 Smart Notifications
- Expense Notifications
- Budget Alerts
- AI Insight Notifications
- Financial Activity Updates

### 👤 User Profile
- Edit Profile
- Upload Profile Picture
- Change Password
- Secure Account Management

---

# 🛠 Tech Stack

## Backend
- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Maven

## Frontend
- React.js
- JavaScript (JSX)
- Tailwind CSS
- Axios
- React Router
- Chart.js

## Database
- MySQL

## AI Integration
- OCR-based Receipt Scanner
- AI Financial Insights
- AI-powered Spending Analysis

---

# 📂 Project Structure

```
FinPilot/
│
├── backend/                            # Spring Boot REST API
│   ├── src/main/java/com/hrushi/finpilot/
│   │   ├── config/                     # CorsConfig, SwaggerConfig, WebMvcConfig
│   │   ├── controller/                 # REST controllers (8 controllers)
│   │   ├── dto/                        # Request/Response DTOs
│   │   ├── entity/                     # JPA entities (User, Expense, Budget, …)
│   │   ├── exception/                  # GlobalExceptionHandler, ErrorResponse
│   │   ├── repository/                 # Spring Data JPA repositories
│   │   ├── security/                   # SecurityConfig, JwtFilter
│   │   ├── service/                    # Business logic services (8 services)
│   │   └── util/                       # JwtUtil
│   ├── src/main/resources/
│   │   ├── application.properties      # Local config (gitignored — not committed)
│   │   └── application.properties.example  # Safe template for developers
│   └── pom.xml
│
├── frontend/                           # React.js + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                     # shadcn/ui components (19 components)
│   │   │   ├── layout/                 # AppLayout, Navbar, Sidebar, SiteFooter
│   │   │   └── common/                 # FinPilotLogo
│   │   ├── context/                    # AuthContext, CurrencyContext, ThemeContext
│   │   ├── hooks/                      # use-toast
│   │   ├── pages/                      # 13 page components
│   │   ├── services/                   # Axios API service files (9 files)
│   │   ├── constants/                  # appData, landingData
│   │   ├── utils/                      # utils.js (cn helper)
│   │   └── styles/                     # index.css (Tailwind base)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── uploads/                            # Runtime: user profile images (gitignored)
├── .gitignore
└── README.md
```

---

# 📌 REST APIs

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/register |
| POST | /auth/login |

## Expenses

| Method | Endpoint |
|---------|----------|
| GET | /expenses |
| POST | /expenses |
| PUT | /expenses/{id} |
| DELETE | /expenses/{id} |

## Categories

| Method | Endpoint |
|---------|----------|
| GET | /categories |
| POST | /categories |

## Accounts

| Method | Endpoint |
|---------|----------|
| GET | /accounts |
| POST | /accounts |

## Budgets

| Method | Endpoint |
|---------|----------|
| GET | /budgets |
| POST | /budgets |

---

# ▶️ Getting Started

## Clone Repository

```bash
git clone https://github.com/hrushikesh0205/FinPilot.git
```

## Backend

```bash
cd backend
mvn spring-boot:run
```

Runs on:

```
http://localhost:8080
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# 🗄 Database Configuration

Configure your MySQL database in:

```
backend/src/main/resources/application.properties
```

```properties
spring.datasource.url=YOUR_DATABASE_URL
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

---

# 📸 Screenshots

Add screenshots here:

- Landing Page
- Dashboard
- Expense Management
- AI Receipt Scanner
- Reports
- AI Insights

---

# 🚀 Future Enhancements

- Voice-based Expense Entry
- AI Chat Financial Assistant
- Expense Prediction using AI
- Smart Saving Goals
- Bank API Integration
- Mobile Application

---

# 👨‍💻 Developer

**Hrushikesh Bhoir**

GitHub:
https://github.com/hrushikesh0205

LinkedIn:
https://www.linkedin.com/in/hrushikesh-bhoir/

---

# ⭐ Show Your Support

If you found this project useful, don't forget to ⭐ the repository.
