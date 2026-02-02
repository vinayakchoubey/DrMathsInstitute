# Dr Maths Institute LMS - Implementation Plan

## 1. Project Structure
The project will be divided into two main directories:
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB + Cloudinary

## 2. Database Design (MongoDB)
### Users Collection
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: String ('admin' | 'client')
- `purchasedCourses`: Array of Course IDs (for Clients)

### Courses Collection
- `title`: String
- `description`: String
- `thumbnail`: String (Cloudinary URL)
- `teacherName`: String
- `teacherBio`: String
- `price`: Number
- `content`: Array of Objects
    - `title`: String
    - `type`: String ('pdf' | 'video')
    - `url`: String (Cloudinary URL)
- `isAvailable`: Boolean

### About Collection
- `instituteOverview`: String
- `ceoProfile`: String
- `ceoImage`: String

## 3. Backend API Routes
- **Auth**:
    - `POST /api/auth/signup`
    - `POST /api/auth/login`
- **Courses**:
    - `GET /api/courses` (Public - Basic info)
    - `GET /api/courses/:id` (Protected - Full content if purchased)
    - `POST /api/courses` (Admin only - Create)
    - `PUT /api/courses/:id` (Admin only - Update)
    - `DELETE /api/courses/:id` (Admin only)
- **Upload**:
    - `POST /api/upload` (Admin only - Upload to Cloudinary)
- **Payment (Mock)**:
    - `POST /api/payment/verify`

## 4. Frontend Architecture (Next.js App Router)
### Pages (Routes)
- `/`: Landing Page (Institute info, Highlighted courses).
- `/courses`: Course Catalog.
- `/courses/[id]`: Course Details (Purchase view or Content view).
- `/login`: Auth Login.
- `/signup`: Auth Signup.
- `/admin/dashboard`: Admin control panel (Manage courses, About).
- `/dashboard`: Student Dashboard (My Courses).

### Key Components
- `Navbar`: Responsive, Role-aware.
- `CourseCard`: Display course thumbnail, title, price.
- `Footer`: Links, Info.
- `PDFViewer` / `VideoPlayer`: For course content.
- `AdminSidebar`: Navigation for admin.

## 5. Styling & UX
- **Theme**: Dark/Light mode using Tailwind's `dark:` classes.
- **Colors**: Premium palette (e.g., Deep Blue/Purple for academic/tech feel).
- **Animations**: `framer-motion` for page transitions and hover effects.
- **Responsiveness**: Mobile-first grid/flex layouts.

## 6. Implementation Steps
1.  **Backend Setup**: Initialize Express, Connect MongoDB, Configure Cloudinary.
2.  **Auth Implementation**: JWT based auth.
3.  **Course APIs**: CRUD operations.
4.  **Frontend Setup**: Next.js init, Tailwind config.
5.  **UI Components**: Build reusable UI kit.
6.  **Pages Integration**: Connect Frontend to Backend APIs.
7.  **Refinement**: Animations, Loading states, Error handling.
