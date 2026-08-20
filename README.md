# STAYSPACE — Rental Listing Platform

A full-stack rental listing web application inspired by Airbnb, built to practice CRUD operations, authentication, and MVC architecture.

## Features
- User authentication (signup/login/logout)
- Create, edit, delete, and view rental listings
- Image upload for listings
- Review and rating system
- Payment integration
- Category-based filtering (Beach, Mountain, Trending, etc.)
- Responsive UI with Bootstrap

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend/Templating:** EJS, Bootstrap
- **Auth:** Passport.js
- **Other:** Cloudinary (image storage), Multer

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

Create a \`.env\` file with:
\`\`\`
MONGO_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
SECRET=your_session_secret
\`\`\`

## Author
Vansh — [GitHub](https://github.com/knightvansh)