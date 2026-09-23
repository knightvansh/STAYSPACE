# STAYSPACE — Rental Listing Platform

**StaySpace** is a full-stack web application built as a modern property-rental platform inspired by Airbnb. Developed as a milestone project, it features secure user authentication, strict role-based authorization, complete CRUD capabilities, and cloud image hosting.

## 🚀 Live Demo & Testing

Explore the live application deployed on Render:
👉 **[View StaySpace Live](https://stayspace-vre0.onrender.com)**

### 🧪 Pre-Configured Demo Credentials
To test authentication, authorization, and CRUD features without creating a new account, you can use the test account:
  
Login with:
* **/ Username:** `demo3`
* **Password:** `demo3@123`

*(Note: Visitors using this account can create and manage their own test listings, while protected authorization rules safeguard showcase data).*

## ✨ Key Features

* **🔐 Secure Authentication:** Powered by **Passport.js** and `passport-local-mongoose` with salted password hashing and session management.
* **🛡️ Strict Authorization:** Custom middleware ensures that only verified property owners can edit or delete listings.
* **📂 Full CRUD Operations:** Users can create, view, update, and delete property listings and reviews seamlessly.
* **☁️ Cloud Image Uploads:** Integrated with **Cloudinary** and `multer` for optimized image handling and cloud storage streaming.
* **⚡ Dynamic User Interface:** Built using **EJS** templates, **Bootstrap 5**, and real-time flash messaging for user feedback.

---

## 🏗️ Project Architecture (MVC Pattern)

StaySpace follows a strict **Model-View-Controller (MVC)** design pattern to ensure clean separation of concerns and maintainability:

```text
STAYSPACE/
├── controllers/     # Business logic handlers (listings, reviews, users)
├── init/            # Database seeding scripts and initial mock data
├── models/          # Mongoose schemas (Listing, User, Review)
├── routes/          # Express route definitions (including review.routes.js)
├── utils/           # Custom error handlers, Cloudinary config, and auth middleware
├── views/           # Frontend EJS templates (layout, listings, users)
└── app.js           # Express server entry point and global middleware setup



🛠️ Tech Stack
Frontend: EJS, HTML5, CSS3, Bootstrap 5, JavaScript

Backend: Node.js, Express.js

Database: MongoDB Atlas, Mongoose ODM

Authentication: Passport.js, Express-Session, Connect-Flash

File Storage: Cloudinary, Multer, Streamifier

Deployment: Render


🚀 Getting Started & Local Installation
To run this project locally on your machine, follow these steps:

1. Clone the repository

git clone [https://github.com/your-username/stayspace.git](https://github.com/your-username/stayspace.git)
cd STAYSPACE

2. Install dependencies

npm install

3. Configure Environment Variables
Create a .env file in the root directory and add your credentials:

ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_express_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

4. Seed the Database
To populate the database with initial sample listings:
node init/index.js

5. Run the Application
node app.js
Open your browser and navigate to http://localhost:8080.

🔮 Future Enhancements
Implementing full Role-Based Access Control (RBAC) schemas for dynamic multi-admin management.

Integrating advanced filtering options (price range, property type, and amenities).

Developed with ❤️ by Vansh Agarwal