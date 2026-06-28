# 💰 FinPilot

FinPilot is a full-stack AI-powered personal finance management application that helps users track expenses, manage budgets, and gain intelligent financial insights. It provides secure authentication using JWT and is being developed with a scalable Spring Boot backend and a modern React frontend.

---

## 🚀 Features

### ✅ Authentication
- User Registration
- Secure Login
- JWT Authentication
- BCrypt Password Encryption
- Stateless Authentication
- Protected APIs using Spring Security

### 📊 Expense Management *(In Progress)*
- Add Expense
- Update Expense
- Delete Expense
- View All Expenses
- Expense Categories
- Monthly Expense Tracking

### 🤖 AI Features *(Planned)*
- AI Financial Assistant
- Smart Spending Analysis
- Budget Suggestions
- Personalized Financial Insights
- Expense Prediction

### 📈 Dashboard *(Planned)*
- Monthly Expense Charts
- Category-wise Analysis
- Budget Progress
- Spending Trends

---

## 🛠 Tech Stack

### Backend
- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- BCrypt Password Encoder
- Maven

### Database
- MySQL

### Frontend *(Upcoming)*
- React.js
- Tailwind CSS
- Axios
- Chart.js

### AI *(Upcoming)*
- OpenAI API / Gemini API / Openrouter

---

## 📂 Project Structure

```
backend
│
├── config
├── controller
├── dto
├── entity
├── repository
├── security
├── service
├── util
└── resources
```

---

## 🔐 Authentication Flow

```
User Login
      │
      ▼
AuthController
      │
      ▼
UserService
      │
      ▼
Verify Password (BCrypt)
      │
      ▼
Generate JWT
      │
      ▼
Return Token
      │
      ▼
Frontend Stores Token
      │
      ▼
Bearer Token
      │
      ▼
JwtFilter
      │
      ▼
Validate Token
      │
      ▼
Access Protected APIs
```

---

## 📌 REST APIs

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT Token |

---

## ▶️ Getting Started

### Clone Repository

```bash
git clone https://github.com/hrushikesh0205/FinPilot.git
```

### Navigate to Backend

```bash
cd FinPilot/backend
```

### Configure Database

Update the following properties inside:

```
src/main/resources/application.properties
```

```properties
spring.datasource.url=YOUR_DATABASE_URL
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### Run the Project

```bash
mvn spring-boot:run
```

Server starts at

```
http://localhost:8080
```

---

## 🧪 Testing APIs

Use **Postman** to test:

### Register

```
POST /auth/register
```

### Login

```
POST /auth/login
```

The login endpoint returns a JWT token which is used to access protected APIs.

---

## 📅 Development Status

- ✅ User Registration
- ✅ Password Encryption (BCrypt)
- ✅ JWT Authentication
- ✅ Spring Security Configuration
- ✅ Login API
- 🔄 Expense CRUD
- 🔄 Dashboard APIs
- 🔄 AI Integration
- 🔄 React Frontend
- 🔄 Deployment

---

## 🎯 Future Enhancements

- AI Expense Categorization
- Smart Budget Recommendations
- Email Notifications
- Export Reports (PDF/Excel)
- Multi-Currency Support
- Dark Mode
- Mobile Responsive UI

---

## 👨‍💻 Developer

**Hrushikesh Bhoir**

- GitHub: https://github.com/hrushikesh0205
- LinkedIn: *https://www.linkedin.com/in/hrushikesh-bhoir/*

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.