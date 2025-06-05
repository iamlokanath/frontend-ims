# Image Management System - Client (React)

This is the frontend application for the Image Management System, built with React and Tailwind CSS. It allows users with different roles (super_admin, admin, user) to interact with images stored in the backend.

## Features

- User Authentication (Login, Register)
- Role-Based Access Control:
  - **User:** View only their own uploaded images.
  - **Admin:** View all images (uploaded by anyone).
  - **Super Admin:** View all images, delete any image, upload images.
- Image Upload functionality (for allowed roles).
- Display images in a responsive grid.
- View image details in a modal.
- Confirmation modal for image deletion (Super Admin only).
- Dark Mode toggle.

## Screenshots

Below are some screenshots showcasing different parts of the application:

### Login Page

<!-- Add Login page screenshot here -->

![Login Page Screenshot](link/to/your/login-screenshot.png)

### Register Page

<!-- Add Register page screenshot here -->

![Register Page Screenshot](link/to/your/register-screenshot.png)

### Dashboard (User View)

<!-- Add Dashboard (User) screenshot here -->

![Dashboard User View Screenshot](link/to/your/dashboard-user-screenshot.png)

### Dashboard (Admin/Super Admin View)

<!-- Add Dashboard (Admin/Super Admin) screenshot here -->

![Dashboard Admin/Super Admin View Screenshot](image.png)

### Image Detail Modal

<!-- Add Image Modal screenshot here -->

![Image Modal Screenshot](link/to/your/image-modal-screenshot.png)

### Delete Confirmation Modal

<!-- Add Confirmation Modal screenshot here -->

![Confirmation Modal Screenshot](link/to/your/confirmation-modal-screenshot.png)

## Folder Structure

The main source code for the client application is located in the `src` directory. Here's a brief overview:

```
client/
├── public/
│   ├── index.html      # Main HTML file
│   └── ...
├── src/
│   ├── components/     # Reusable React components (Navbar, Login, Register, Dashboard, Modals)
│   │   ├── Navbar.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ImageModal.tsx
│   │   └── ConfirmationModal.tsx
│   ├── context/        # React Context for Auth and Theme
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── App.tsx         # Main App component
│   ├── index.tsx       # Entry point
│   ├── index.css       # Tailwind CSS imports and global styles
│   └── ...             # Other files like assets, etc.
├── .env                # Environment variables (for local development)
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── ...
```

## Getting Started

Follow these steps to set up and run the client application locally:

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <your-repository-directory>
    ```

2.  **Navigate to the client directory:**

    ```bash
    cd client
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    # or yarn install
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the `client` directory (if it doesn't exist) and add the URL of your backend API:

    ```
    REACT_APP_API_URL=http://localhost:5000
    # If your backend is deployed, use its URL, e.g.:
    # REACT_APP_API_URL=https://your-deployed-backend.vercel.app
    ```

    _Note: The `.env` file is primarily for local development. For deployment (e.g., on Vercel), you will configure environment variables directly in the hosting platform's settings._

5.  **Ensure Backend is Running:**
    Make sure your backend server is running (either locally or deployed) and accessible at the URL specified in `REACT_APP_API_URL`.

6.  **Start the development server:**
    ```bash
    npm start
    # or yarn start
    ```

The client application should open in your browser, usually at `http://localhost:3000`.
