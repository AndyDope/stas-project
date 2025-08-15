# Skill-based Task Allocation System (STAS)

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Amazon%20AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=FF9900" alt="AWS">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT">
</p>

> An intelligent, full-stack project management platform designed to assign tasks based on developer skills and workload, not just availability.

<p align="center">
  <img src="https://i.ibb.co/bMPxFGzZ/Figure-7-3-Client-Dashboard.png" alt="STAS Dashboard Preview" width="800"/>
</p>

---

## ✨ Key Features

-   **Role-Based Dashboards:** Secure, tailored interfaces for Admins, Managers, Clients, and Developers.
-   **Intelligent Manager Selection:** A unique UI that helps clients choose a manager based on their current project workload.
-   **Interactive Kanban Boards:** Dynamic task boards with a custom-built, smooth drag-to-scroll hook.
-   **Dynamic Skill Management:** Developers can manage their professional skill sets with add/remove functionality.
-   **Unified Feedback System:** A flexible, centralized feedback entity for both project-level and task-level reviews.
-   **Secure JWT Authentication:** Stateless, backend-enforced security using Spring Security and `@PreAuthorize` annotations.
-   **Cloud-Native on AWS:** Deployed on AWS with a managed Amazon RDS database for high availability and scalability.

---

## 🛠️ Tech Stack

| Backend                               | Frontend & Cloud                     |
| ------------------------------------- | ------------------------------------ |
| • Spring Boot                         | • React (Hooks & Context API)        |
| • Spring Security (JWT)               | • Material-UI (MUI)                  |
| • Spring Data JPA & Hibernate         | • Vite                               |
| • MySQL                               | • Axios & React Router               |
| • Maven                               | • **Hosted on: Amazon AWS**          |
| • Flyway (Database Migrations)        | • **DB on: Amazon RDS**              |

---

## 🚀 Getting Started

The easiest way to get the project running locally is with Docker.

### Prerequisites
-   Git
-   Docker & Docker Compose

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AndyDope/stas-project.git
    cd stas-project
    ```

2.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    -   Frontend will be available at `http://localhost:5173`
    -   Backend will be available at `http://localhost:80`

<details>
  <summary>Click for Manual (Non-Docker) Setup</summary>
  
  #### Backend (`stas-backend`)
  1. Navigate to the backend directory: `cd stas-backend`
  2. Update `src/main/resources/application.properties` with your local MySQL credentials.
  3. Run the application: `mvn spring-boot:run`

  #### Frontend (`stas-frontend`)
  1. In a new terminal, navigate to the frontend directory: `cd stas-frontend`
  2. Install dependencies: `npm install`
  3. Run the development server: `npm run dev`
</details>
