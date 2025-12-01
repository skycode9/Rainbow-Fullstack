# Rainbow Films - Backend API

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/rainbow-films
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

**Important for Production Deployment:**

- Set `BACKEND_URL` to your production backend URL (e.g., `https://your-backend.onrender.com`)
- This ensures uploaded images have the correct full URL path

### 3. MongoDB Setup

Make sure MongoDB is running on your system:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod
```

### 4. Create Super Admin

Run the script to create the initial admin user:

```bash
node scripts/createAdmin.js
```

**Default Admin Credentials:**

- Username: `admin`
- Password: `admin123`
- ⚠️ **Change the password immediately after first login!**

### 5. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/register` - Create new admin (superadmin only)

### Films

- `GET /api/films` - Get all films (public)
- `GET /api/films/:id` - Get single film (public)
- `POST /api/films` - Create film (auth required)
- `PUT /api/films/:id` - Update film (auth required)
- `DELETE /api/films/:id` - Delete film (auth required)

### Team Members

- `GET /api/team` - Get all team members (public)
- `GET /api/team/:id` - Get single team member (public)
- `POST /api/team` - Create team member (auth required)
- `PUT /api/team/:id` - Update team member (auth required)
- `DELETE /api/team/:id` - Delete team member (auth required)

### Clients

- `GET /api/clients` - Get all clients (public)
- `GET /api/clients/:id` - Get single client (public)
- `POST /api/clients` - Create client (auth required)
- `PUT /api/clients/:id` - Update client (auth required)
- `DELETE /api/clients/:id` - Delete client (auth required)

### Contact

- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact` - Get all contacts (auth required)
- `GET /api/contact/:id` - Get single contact (auth required)
- `PUT /api/contact/:id` - Update contact status (auth required)
- `DELETE /api/contact/:id` - Delete contact (auth required)

## Models

### Admin

- username (String, unique)
- email (String, unique)
- password (String, hashed)
- role (enum: 'admin', 'superadmin')

### Film

- title, category, description, thumbnail, videoUrl
- featured (Boolean), order (Number)

### TeamMember

- name, role, tagline, image
- accentColor, order, active

### Client

- name, logo, order, active

### Contact

- name, email, subject, message
- status (enum: 'new', 'read', 'replied', 'archived')

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Testing

Test the API:

```bash
# Health check
curl http://localhost:5000

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
