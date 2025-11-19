# EduSolve - Teacher Support Hub

A full-stack web application for teachers to access support videos and resources.

## Features

- Video library with categories and subcategories
- Upload, edit, and delete videos
- Analytics dashboard
- Responsive design
- Secure API with authentication

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Cloud Storage**: Cloudinary
- **Deployment**: Ready for Heroku/Vercel/etc.

## Setup

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your actual values:
   - MONGODB_URI: Your MongoDB connection string
   - CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET: From Cloudinary
   - JWT_SECRET: A secure random string

### Development

1. Start backend:
   ```bash
   cd backend
   npm run dev
   ```
2. Start frontend:
   ```bash
   cd frontend
   npm start
   ```

### Production Build

1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Start production server:
   ```bash
   cd backend
   npm start
   ```

## Deployment

The application is configured for production deployment:

- Backend serves the built frontend statically
- API routes are prefixed with `/api`
- Environment variables are used for configuration
- Security middleware (Helmet, CORS, Rate Limiting) enabled

### Heroku Deployment

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy the code (backend folder or root with Procfile)

### Vercel/Netlify Deployment

- Deploy frontend to Vercel/Netlify
- Deploy backend to Heroku/Railway
- Update API_BASE_URL in frontend accordingly

## Security Notes

- Never commit `.env` files
- Use strong JWT secrets
- Keep dependencies updated
- Monitor for vulnerabilities

## License

MIT