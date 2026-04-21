# RADIX - API Monitoring Platform

**RADIX** is a comprehensive full-stack application for testing, analyzing, and monitoring APIs. It provides real-time analytics, API testing consoles, background job processing, and AI-driven insights to help developers manage and understand their API endpoints efficiently.

### 🌐 Live Demo
- **Frontend (Render)**: [https://radixmonitor.onrender.com](https://radixmonitor.onrender.com)
- **Backend API (Render)**: [https://radix-api-backend.onrender.com](https://radix-api-backend.onrender.com)
- **EC2 Deployment**: [http://13.206.50.255](http://13.206.50.255)

### 📺 Video Demo
[Watch the demo video](#) - Coming soon

---

## 🛠️ Tech Stack & Tools

### Frontend (`/client`)
- **Core**: React 19, TypeScript, Vite
- **State Management**: Redux Toolkit, React Redux
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4, Framer Motion (Animations), Class Variance Authority (CVA), Lucide React (Icons)
- **Data Visualization**: Recharts
- **Authentication**: Firebase Authentication
- **HTTP Client**: Axios

### Backend (`/server`)
- **Core**: Node.js, Express.js, TypeScript
- **Database (Relational)**: PostgreSQL via **Prisma ORM**
- **Database (NoSQL)**: MongoDB via **Mongoose** (for document storage, if applicable)
- **Caching & Rate Limiting**: Redis
- **Message Broker**: RabbitMQ (`amqplib`) for background worker tasks
- **Real-Time Communication**: Socket.io
- **AI Integration**: OpenAI API
- **Auth & Security**: Firebase Admin, Google Auth Library, JWT, Passport.js, Helmet, Zod (Validation), bcryptjs

---

## 🚀 Features

- **API Testing Console**: Send HTTP requests directly from the app and view detailed responses.
- **Real-Time Analytics**: View usage metrics, request/response times, and error rates using interactive dashboards.
- **Authentication System**: Secure user login/registration via Firebase and Google Auth.
- **Background Processing**: Heavy tasks and queue management are processed using RabbitMQ and dedicated worker processes.
- **AI-Powered Explanations**: Leveraging OpenAI to generate insights and summaries for API performances and errors.
- **Rate Limiting**: Protect endpoints from abuse using Redis-backed rate limiting.

---

## 🏃‍♂️ How to Start the Project Locally

### Prerequisites
- **Node.js** (v20 or higher)
- **PostgreSQL** (local or cloud - AWS RDS, Supabase, Neon)
- **Redis** (local or cloud - AWS ElastiCache, Redis Cloud)
- **Git**

### Clone the Repository
```bash
git clone https://github.com/omkar0605shelar/API-Insight.git
cd API-Insight
```

---

## Backend Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory:

```env
# Database
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=no-verify

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:5173
AWS_EC2_IP=http://localhost

# Firebase Admin (get from Firebase Console)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# JWT
JWT_SECRET=your-jwt-secret-key

# Redis (optional - for rate limiting)
REDIS_URL=redis://localhost:6379

# Server
PORT=5000
NODE_ENV=development
```

### 3. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (or use migrations)
npx prisma db push
```

### 4. Run Backend
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Backend runs on: `http://localhost:5000`

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `client` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Firebase Configuration (get from Firebase Console → Project Settings)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 3. Run Frontend
```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

Frontend runs on: `http://localhost:5173`

---

## 🚀 Deployment

### Deploy to Render (Recommended)

#### Frontend Deployment
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview`
5. Add environment variables (same as local, but use Render backend URL)
6. Deploy

#### Backend Deployment
1. Go to Render → New → Web Service
2. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
3. Add all environment variables
4. Deploy

### Deploy to AWS EC2

#### 1. Launch EC2 Instance
- Ubuntu 24.04 LTS
- t2.micro or t3.micro (Free Tier eligible)
- Configure Security Groups (allow ports 22, 80, 443, 5000)

#### 2. Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 3. Setup Server
```bash
# Update system
sudo apt update
sudo apt install -y nodejs npm git nginx

# Clone repository
git clone https://github.com/omkar0605shelar/API-Insight.git
cd API-Insight

# Setup backend
cd server
npm install
npx prisma generate
npm run build

# Create .env file with your credentials
nano .env

# Start backend with PM2
sudo npm install -g pm2
pm2 start npm --name "radix-backend" -- start
pm2 save
pm2 startup
```

#### 4. Setup Frontend
```bash
cd ../client
npm run build

# Deploy to Nginx
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
```

#### 5. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Prisma Client Not Generated**
```bash
cd server
npx prisma generate
```

**2. Database Connection Failed**
- Verify DATABASE_URL is correct
- Check database is running
- Ensure SSL mode is set correctly for cloud databases

**3. CORS Errors**
- Check FRONTEND_URL in backend .env
- Verify CORS configuration in src/index.ts

**4. Firebase Auth Not Working**
- Verify Firebase config variables
- Check authorized domains in Firebase Console
- Ensure Google OAuth redirect URIs are correct

**5. Mixed Content Error (HTTPS/HTTP)**
- Ensure both frontend and backend use HTTPS
- Use Render for automatic HTTPS
- Or set up SSL certificate on EC2

---

## 📁 Project Structure

```
API-Insight/
├── client/                 # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store
│   │   ├── services/     # API services
│   │   └── config/       # Configuration files
│   ├── public/
│   └── package.json
│
├── server/                # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/       # Database, Firebase, Socket config
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── repositories/ # Data access layer
│   │   ├── workers/      # Background jobs
│   │   └── index.ts      # Server entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
│
└── README.md
```

---

## 🤝 Contributing
1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request
