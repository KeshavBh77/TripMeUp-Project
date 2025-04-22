# TripMeUp

TripMeUp is a full‑stack travel application built with **React** on the frontend and **Django REST** on the backend. Users can browse cities, view top restaurants and accommodations, make bookings, and manage their profile.

## 🌟 Features

- **Authentication**: Register, login, and persistent sessions via `AuthContext` and localStorage  
- **City Listings**: Explore world cities, search & autocomplete, smooth scrolling and highlights  
- **City Details**: View in‑depth info, interesting facts, restaurants and accommodations per city  
- **Featured Places**: Top‑rated restaurants & hotels with ratings, descriptions, amenities  
- **Booking Modal**: Select dates, guest count, and submit bookings  
- **Profile Page**: View and manage your user details, logout functionality  

## 💻 Tech Stack

- **Frontend**: React, React Router, Context API, CSS Modules, `fetch` API  
- **Backend**: Django REST Framework (DRF), SQLite (development)  
- **Styling**: Neomorphic UI with CSS variables for shadows and colors  

## 🚀 Getting Started

### Prerequisites

- Node.js v16+ & npm  
- Python 3.10+ & pip  

### Backend Setup (Django)

1. Navigate to the Django project:
   ```bash
   cd TripMeUp
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python3 -m venv venv  
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply migrations:
   ```bash
   python manage.py makemigrations  
   python manage.py migrate
   ```
5. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```
6. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)

1. In a separate terminal, navigate to the React app:
   ```bash
   cd cpsc-471-project  # or your React folder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂 Project Structure

```
TripMeUp/            # Django backend
  ├─ TripMeUpApp/    # Django app with models, views, serializers
  ├─ staticfiles/    # Compiled frontend assets (for production)
  └─ ...

cpsc-471-project/    # React frontend
  ├─ src/
  │   ├─ components/ # Reusable UI components (PlaceCard, CityCard, Navbar, etc.)
  │   ├─ context/    # AuthContext for user state
  │   ├─ pages/      # Route views (Home, Cities, CityDetail, Accommodations, Profile, AllReviews)
  │   ├─ App.jsx     # Main router & layout
  │   └─ index.js    # React entry point
  ├─ public/         # Static HTML
  └─ package.json    # Frontend dependencies & scripts
```

## 📡 API Endpoints

- **Cities**: `GET /TripMeUpApp/city/`  
- **Restaurants**: `GET /TripMeUpApp/restaurants/`  
- **Accommodations**: `GET /TripMeUpApp/accommodation/`  
- **Reviews**: `GET /TripMeUpApp/reviews/`  
- **User Profile**: `GET /TripMeUpApp/users/{user_id}/`  
- **Bookings**: `GET/POST /TripMeUpApp/booking/?user_id={user_id}`  

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -am 'Add new feature'`)  
4. Push to the branch (`git push origin feature/my-feature`)  
5. Open a Pull Request  

## 📄 License

This project is MIT licensed. See the [LICENSE](LICENSE) file for details.

---

> **Note:** The frontend uses various npm packages beyond the core Create React App setup (e.g. `react-router-dom`, `react-icons`, `react-datepicker`, `axios`, etc.). If you encounter missing modules, install them via:
>
> ```bash
> npm install react-router-dom react-icons react-datepicker axios
> ```
>
> Similarly, the backend may require additional Python packages like `djangorestframework` or `django-cors-headers`. Always run:
>
> ```bash
> pip install -r requirements.txt
> ```

Happy travels with TripMeUp! 🚀
