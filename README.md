# DSG Wholesale Management System

A full-stack wholesale management system built with React (Frontend) and Node.js/Express (Backend).

## Features

- **User Authentication**: Login/Register with JWT
- **Product Management**: CRUD operations for products
- **Order Management**: Create and track orders
- **Dashboard**: Admin dashboard with statistics
- **Responsive Design**: Modern UI with Material-UI and Tailwind CSS

## Tech Stack

### Frontend

- React 19 with TypeScript
- Vite for build tooling
- Material-UI for components
- Tailwind CSS for styling
- React Router for navigation

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd DSG
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file based on `env.example`:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/dsg_wholesale
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file based on `env.example`:

```bash
cp env.example .env
```

## Running the Application

### Development Mode

1. **Start Backend** (from Backend directory):

```bash
npm run dev
```

2. **Start Frontend** (from Frontend directory):

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Production Mode

1. **Build Frontend**:

```bash
cd Frontend
npm run build
```

2. **Start Backend**:

```bash
cd Backend
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status

### Admin

- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/stats` - Get detailed statistics

## Project Structure

```
DSG/
├── Backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB models
│   │   └── routes/         # API routes
│   └── uploads/            # File uploads directory
├── Frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── routes/         # Routing configuration
│   └── public/             # Static assets
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
