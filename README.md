# adaptiveQuiz
Adaptive Quiz
QuizGenerator
QuizGenerator is a full-stack application designed to create, manage, and take quizzes. It features an adaptive quiz engine, user authentication, and a dynamic frontend interface.

Features
Adaptive Quiz Engine: Dynamically generates questions based on user performance.
User Authentication: Secure login and registration system.
Admin Dashboard: Manage quizzes, questions, and users.
Responsive Frontend: Built with React for a seamless user experience.
Backend API: Powered by Flask for efficient data handling.
Upload Support: Allows users to upload files for quiz content.
Project Structure
Backend
Framework: Flask
Key Files:
app.py: Main entry point for the backend.
routes/: Contains API routes for authentication, quizzes, and more.
services/: Includes the adaptive engine and question generator.
models/: Database models for users, quizzes, and questions.
nlp_models/: Handles natural language processing for question generation.
Frontend
Framework: React
Key Files:
src/components/: Reusable UI components.
src/pages/: Pages for different views like Dashboard, Quiz, and Profile.
src/services/api.js: Handles API calls to the backend.
Installation
Prerequisites
Python 3.8+
Node.js 16+
npm or yarn
Git
Backend Setup
Navigate to the backend directory:

cd backend
Install dependencies:

pip install -r requirements.txt
Run the backend server:

python app.py
Frontend Setup
Navigate to the frontend directory:

cd frontend
Install dependencies:

npm install
Start the development server:

npm start
Usage
Open the frontend in your browser at http://localhost:3000.
Use the admin dashboard to create quizzes and manage users.
Take quizzes and view results dynamically.
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch:

git checkout -b feature/your-feature-name
Commit your changes:

git commit -m "Add your message here"
Push to your branch:

git push origin feature/your-feature-name
Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for details.
