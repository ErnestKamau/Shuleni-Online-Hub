### CONTRIBUTORS
1. [Samuel S. Simon](https://github.com/Samsimion)
2. [Ernest  M. Kamau](https://github.com/ErnestKamau)
3. [Deborah Chepkoech](https://github.com/DeborahChepkoech)
4. [Natasha ](https://github.com/nashyylyn)
5. [Ruth Kiptoo](https://github.com/Jemeli-prog)

---
### Project Summary

Shuleni is a full-stack school management platform that brings the entire physical school experience online. It enables school owners to create and manage schools, assign students and educators to classes, upload resources, conduct assessments, and track attendance—all through a secure, role-based web interface.

This project demonstrates modern web application architecture using Flask for the backend and React for the frontend. Key concepts include RESTful API design, JWT-based token authentication, CORS configuration for cross-origin requests, ORM-based data modeling with SQLAlchemy, secure password management with Bcrypt, and robust data serialization and validation with Marshmallow. The system also features file upload and static file serving, role-based access control, and database migration management, providing a scalable and maintainable foundation for digital education management.

---

This project exemplifies a robust, modern web application architecture by leveraging **Flask** as the backend framework and **React** for the frontend interface. The backend exposes a well-structured **RESTful API**, where each resource (such as schools, classes, users, assessments, and submissions) is mapped to a dedicated endpoint, supporting standard HTTP methods for CRUD operations. This design ensures modularity, scalability, and ease of integration with various clients.

**Authentication and authorization** are enforced using **JWT (JSON Web Tokens)**, implemented via the `flask_jwt_extended` library. Each user receives a signed token upon login, which must be included in subsequent requests to access protected endpoints. This stateless authentication mechanism enhances security and simplifies session management across distributed systems.

To enable seamless communication between the React frontend (often running on a different port during development) and the Flask backend, **CORS (Cross-Origin Resource Sharing)** is configured using the `flask_cors` extension. This setup allows the frontend to securely make API requests without browser-imposed cross-origin restrictions.

**Data modeling** is handled using **SQLAlchemy ORM**, which maps Python classes to relational database tables. Complex relationships—such as many-to-many associations between students, educators, and classes—are explicitly defined, reflecting real-world school structures. This abstraction simplifies database operations and ensures data integrity.

**Password security** is a priority, with all user passwords hashed using **Bcrypt** before storage. The `flask_bcrypt` extension provides strong, industry-standard hashing, protecting user credentials even in the event of a data breach.

**Data serialization and validation** are managed by **Marshmallow** and `marshmallow_sqlalchemy`. Custom schemas serialize ORM model instances into JSON for API responses and validate incoming data for correctness and completeness, reducing the risk of invalid or malicious input.

The system supports **file uploads** (such as class resources and assignments), storing them on the server and serving them via a dedicated static route. This allows students and educators to share and access documents securely and efficiently.

**Role-based access control** is implemented throughout the API, ensuring that only users with appropriate roles (e.g., owner, educator, student) can perform certain actions, such as grading assessments or managing class memberships.

**Database migrations** are managed with **Flask-Migrate**, enabling the team to evolve the database schema safely and incrementally as the application grows.

Together, these technologies and design patterns provide a secure, maintainable, and scalable foundation for digital education management, supporting real-world workflows such as onboarding, resource sharing, assessment, grading, and analytics within a modern web environment.



#LOGIN Credentials
1. ## mwalimu logins credentials - mwalimu = samuelsimion1990@gmail.com   password=123456
2. ## studentlogins credentials - std admno= 5555         pass=123456
3. ## logins credentials - mwalimu =will@gmail.com      pass=abcd



#  Shuleni – Kenya High School Management System (KHSMS)

A full-stack school management platform built with **React**, **Flask**, **TailwindCSS**, and **PostgreSQL**. Shuleni empowers Kenyan secondary schools to manage students, educators, attendance, communication, and more — with future CBC-readiness in mind.

>  Live Demo: [https://shuleni-zt8u.onrender.com](https://shuleni-zt8u.onrender.com)

---

##  Features

###  For Educators
- View and manage assigned classes
- Record daily student attendance
- Chat with students and parents in real time
- View student profiles and performance

### For Students
- View registered subjects and class info
- Join class chatrooms
- Track attendance records

###  For Parents
- Monitor child attendance
- Receive updates from educators

###  For Admin/School Owner
- Register educators and students
- Assign students to classes
- Manage users and permissions

---

## 🛠Tech Stack

### Frontend
- **React.js** (with Hooks & Router)
- **TailwindCSS** for UI styling
- **Axios** for API calls

### Backend
- **Python Flask**
- **Flask-Restful** for REST APIs
- **Flask-JWT-Extended** for authentication
- **SQLAlchemy + Marshmallow** for ORM and serialization
- **Socket.IO** for real-time chat

### Database
- **PostgreSQL** hosted on Render

---

## ⚙ Setup Instructions

### 1. Clone the repo

bash
git clone https://github.com/Samsimion/Shuleni.git
cd Shuleni



### 2. Backend Setup (Flask)

bash
cd server
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

# Set up your .env file (copy .env.example)
flask db upgrade  # run migrations
flask run         # start server on http://localhost:5000


### 3. Frontend Setup (React + Vite)

bash
cd client
npm install
npm run dev   # runs at http://localhost:5173


> Make sure the backend is running for frontend API calls.

---

### 4. Deployment

* Backend: Deployed on [Render](https://render.com/)
* Frontend: Bundled with Vite and served via Flask

---

---

## Contributing

Pull requests are not welcome! For major changes, open an issue first to discuss what you’d like to change or build.



---

##  License

MIT © [Samuel S. Simon](https://github.com/Samsimion)

---

## Contact

* GitHub: [@Samsimion](https://github.com/Samsimion)


---

##  Live App

 **[Visit Live Site](https://shuleni-zt8u.onrender.com)**

