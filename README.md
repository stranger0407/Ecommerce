# Mahalaxmi Ecommerce Platform

A full-stack ecommerce web application for selling servers and computers, built with **Spring Boot (Java 21)** backend and **React TypeScript + Vite** frontend.

## 🚀 Features

### Backend
- **Spring Boot 3.2.1** with Java 21
- **Spring Security** with JWT authentication
- **MySQL** database with JPA/Hibernate
- RESTful API architecture
- Comprehensive product management
- Shopping cart functionality
- User authentication and authorization
- Role-based access control (Customer/Admin)
- Input validation and error handling

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive UI
- **Zustand** for state management
- **React Router** for navigation
- **React Hook Form** for form handling
- **Axios** for API communication
- **Lucide React** for beautiful icons
- JWT-based authentication

## 📋 Prerequisites

- **Java 21** or higher
- **Maven 3.6+**
- **Node.js 18+** and npm
- **MySQL 8.0+**

## 🛠️ Installation & Setup

### Database Setup

1. Install MySQL Workbench or MySQL Server
2. Create a database (will be auto-created on first run):
```sql
CREATE DATABASE IF NOT EXISTS mahalaxmi_ecommerce;
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd "d:\devlopment\mahalaxmi ecommerce\backend"
```

2. Configure database connection in `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mahalaxmi_ecommerce
    username: root
    password: root
```

3. Build and run the backend:
```bash
# Using Maven
mvn clean install
mvn spring-boot:run

# Or using Maven Wrapper (if available)
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd "d:\devlopment\mahalaxmi ecommerce\frontend"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/main/java/com/mahalaxmi/ecommerce/
│   ├── config/              # Security, JWT, App configuration
│   ├── controller/          # REST API controllers
│   ├── dto/                 # Data Transfer Objects
│   ├── entity/              # JPA entities
│   ├── repository/          # Data repositories
│   ├── service/             # Business logic
│   └── EcommerceApplication.java
├── src/main/resources/
│   └── application.yml      # Application configuration
└── pom.xml                  # Maven dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   ├── lib/                # Utility libraries
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html             # HTML template
└── package.json           # npm dependencies
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?keyword={keyword}` - Search products
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/root` - Get root categories
- `GET /api/categories/{id}` - Get category by ID

### Cart (Requires Authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{itemId}` - Update cart item quantity
- `DELETE /api/cart/items/{itemId}` - Remove item from cart
- `DELETE /api/cart` - Clear cart

## 🎨 Tech Stack

### Backend
- Spring Boot 3.2.1
- Spring Security
- Spring Data JPA
- MySQL Connector
- Lombok
- JWT (jjwt)
- ModelMapper
- Hibernate Validator

### Frontend
- React 18.2
- TypeScript 5.3
- Vite 5.0
- Tailwind CSS 3.4
- Zustand 4.4
- React Router 6.21
- React Hook Form 7.49
- Axios 1.6
- Lucide React

## 👥 Default User Roles

The application supports two user roles:
- **CUSTOMER** - Can browse products, manage cart, place orders
- **ADMIN** - Can manage products, categories, and view all orders

## 🔒 Security

- JWT-based authentication
- BCrypt password encryption
- CORS configuration for frontend
- Role-based access control
- Input validation on all endpoints

## 🚀 Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/ecommerce-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Serve the 'dist' folder using any static server
```

## 📝 Code Quality Standards

- **Clean Code**: Follows SOLID principles
- **Documentation**: Comprehensive JavaDoc and JSDoc comments
- **TypeScript**: Strict type checking enabled
- **Error Handling**: Proper error handling throughout
- **Validation**: Input validation on both frontend and backend
- **Security**: Industry-standard security practices

## 🐛 Troubleshooting

### Backend Issues
- Ensure MySQL is running on port 3306
- Verify database credentials in application.yml
- Check Java version: `java -version`

### Frontend Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node version: `node -v`
- Ensure backend is running before starting frontend

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Mahalaxmi Ecommerce Team

---

For any questions or issues, please open an issue in the repository.
