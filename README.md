# STAYSPACE — Rental Listing Platform

Built a full-stack accommodation platform using Node.js, Express.js, MongoDB, EJS and Bootstrap with CRUD operations, user authentication, session management, reviews and ratings. Deployed the application using cloud hosting and migrated the database to MongoDB Atlas with environment-based configuration.

## Features
- User authentication (signup/login/logout)
- Create, edit, delete, and view rental listings
- Image upload for listings
- Review and rating system
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
