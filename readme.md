# 📸 Instagram Clone (MERN Stack)

A full-featured social media application inspired by Instagram. Built with the MERN stack (MongoDB, Express, React, Node.js). Users can sign up, post photos, like posts, comment, and follow others.

## 🚀 Features

- 🔐 User authentication (JWT-based)
- 📝 Post creation with image uploads
- ❤️ Like and comment functionality
- 🧑‍🤝‍🧑 Follow / Unfollow users
- 📱 Responsive UI with React
- 🧾 User profiles and feeds
- 🔎 Search functionality

## 🛠️ Tech Stack

### Frontend:
- React
- React Router
- Context API or Redux (optional)
- CSS / Tailwind / Material-UI (based on your project)

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- Multer (for image uploads)
- Cloudinary / Local storage (image hosting)

## 📁 Project Structure

    /backend
    ├── controllers
    ├── models
    ├── routes
    ├── middleware
    └── server.js
    /frontend
    ├── src
    ├── components
    ├── pages
    ├── context
    └── App.js


## ⚙️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/DevPatel1023/social_media_clone.git
cd social_media_clone

2. **Install backend dependencies:**
```bash
cd backend
npm install

3. **Install frontend dependencies:**
```bash
cd frontend
npm install

4. **configure Enviorement variables in backend .env file :**
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name

5. **Run the developement server:**
```bash
# In backend/
npm run dev

# In frontend/
npm start

📷 Screenshots

🧑‍💻 Author
Dev Patel

📄 License
This project is licensed under the MIT License.