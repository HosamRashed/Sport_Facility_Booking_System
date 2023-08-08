# MMU Sports Facility Booking System

Welcome to the MMU Sports Facility Booking System repository. This project aims to revolutionize the management and utilization of sports facilities at Multimedia University. The system addresses the current manual process of reserving sports facilities by automating the booking process and providing a mobile application for students to conveniently access and manage their bookings.

## Overview

Managing sports facilities and organizing their utilization at MMU is currently done manually, requiring students to fill out a Google Form for booking requests. The MMU Sports Facility Booking System aims to automate and streamline this process. The system comprises two parts:
- A web application dashboard for administrators and staff to manage facility information, time slots, and statistics.
- A mobile application for students to book facilities, receive announcements, and manage bookings.

## Objectives

- Simplify and automate the MMU sports facility booking process.
- Enhance utilization of sports facilities through an efficient mobile application.
- Implement penalties for misuse of the booking process and minimize wasted facility time.
- Provide modules for facility management and booking to administrators and students.
- Raise awareness among students about MMU's sports facilities.

## Goals

- Develop a mobile application for sports facility bookings, benefiting both students and administrators.
- Enhance the efficiency and accuracy of facility booking and utilization.

## Project Scope

The project includes the development of a mobile application compatible with iOS and Android devices. It encompasses a booking module for students to view, book, and edit sports facility bookings, and a management module for administrators to manage, update, and track facility usage.

## Technologies Used

For the **web application**, the MERN stack (MongoDB, Express.js, React.js, Node.js) was utilized to ensure a robust and dynamic interface.

For the **mobile application**, React Native was employed for front-end development, while Node.js served as the back-end runtime environment. Express.js, a minimal and flexible web application framework, was leveraged to create a structured and efficient API communication layer between the front-end and the back-end components.

## Functional Requirements

### Student Requirements

- Log in using Student ID and password.
- View available facilities and their timetables.
- Book facilities based on available time slots.
- Rate facilities after use.
- Edit or cancel bookings.
- View past bookings and personal information.
- Log out of the application.

### Administrator Requirements

- Log in using user ID and password.
- Add facilities with information and timetables.
- Post announcements with text and images.
- View student profiles.
- Manage and track facility activities.
- View and delete student bookings.

# Getting Started

Follow these steps to set up and use the MMU Sports Facility Booking System:

## 1. Clone the Repository

Begin by cloning this repository to your local machine:

git clone https://github.com/HosamRashed/Sport_Facility_Booking_System.git

## 2. Install Ngrok
Install ngrok to create a secure tunnel to your local server:

## On Linux or macOS
```sh brew install ngrok
```
## On Windows
choco install ngrok

## 3. Start the Backend Server
Navigate to the backend folder and start the backend server:

sh
Copy code
cd mmu-sports-booking/backend
npm install
npm start
## 4. Create Ngrok Tunnel
In a new terminal window, navigate to the location where ngrok is installed and run the following command to create a tunnel:

sh
Copy code
ngrok http 3000
Copy the generated URL (e.g., http://your-ngrok-url) from the terminal.

## 5. Configure Mobile App
Go to the mobile-app/main_container/store.js file and replace the API URL with the ngrok URL from the previous step:

javascript
Copy code
const API_URL = 'http://your-ngrok-url';
## 6. Start Web App and Mobile App
To start the web application and mobile application, navigate to their respective folders and run the following command:

For Web App:

```sh
cd mmu-sports-booking/web-app
```
```sh
npm install
npm start
For Mobile App:

```
sh
Copy code
cd mmu-sports-booking/mobile-app
npm install
npm start
## 7. Access the Application
Once the web application and mobile application are running, you can access them by opening your web browser for the web app and using an iOS/Android emulator or a physical device for the mobile app.

Feel free to explore and enjoy the MMU Sports Facility Booking System!

