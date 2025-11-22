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

### Vercel Deployment (Frontend)

1. **Connect Repository:**
   - Go to [Vercel](https://vercel.com)
   - Import your Git repository
   - Vercel will automatically detect it as a React app

2. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Add environment variable: `CI=false`
   - Add `REACT_APP_API_URL` with your backend URL

3. **Deploy:**
   - Vercel will build and deploy automatically
   - Your app will be available at a `.vercel.app` URL

### Netlify Deployment (Frontend)

1. **Manual Deployment:**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `frontend/build` folder to deploy instantly
   - Or connect your Git repository and set build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
     - Add environment variable: `CI=false`

2. **Update API URL:**
   - After deploying backend, update `frontend/.env`:
     ```
     REACT_APP_API_URL=https://your-backend-app.herokuapp.com/api
     ```
   - Rebuild and redeploy frontend

### Backend Deployment

Deploy backend to Heroku/Railway with the provided Procfile and environment variables.

## Security Notes

- Never commit `.env` files
- Use strong JWT secrets
- Keep dependencies updated
- Monitor for vulnerabilities

## License

MIT