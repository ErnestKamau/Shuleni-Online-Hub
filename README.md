### CONTRIBUTORS
1. [Samuel S. Simon](https://github.com/Samsimion)
2. [Ernest  M. Kamau](https://github.com/ErnestKamau)
3. [Deborah Chepkoech](https://github.com/DeborahChepkoech)
4. [Natasha ](https://github.com/nashyylyn)
5. [Ruth Kiptoo](https://github.com/Jemeli-prog)



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

