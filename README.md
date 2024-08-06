# ToDo-List

## Overview

This is a real-time task management application built with React for the frontend and Node.js with Socket.IO for the backend. It allows users to create, edit, delete, and mark tasks as complete, with real-time updates.

## System Design

### Frontend
- Built with React
- Uses Socket.IO client for real-time communication with the server
- Components:
  - Greetings: For greetings
  - Tasks: Main component for displaying and managing tasks
  - CreateTask: For creating and editing tasks
  - EditTask: For editing existing tasks
  - DeleteTask: For deleting tasks
  - Categories: Main Component for displaying and managing categories
  - CategoriesList: For showing all the categories
  - CreateCategory: For creating categories
  - and some other subcomponents too

### Backend
- Node.js server with Express
- Uses Socket.IO for real-time bi-directional communication
- File-based storage using JSON files for tasks and categories

## Implementation

- Real-time updates using Socket.IO events
- Task state (including checked state) is persisted on the server
- Category management with task counts
- Search and date filtering functionality
- The design is not Responsive as of now

## Setup and Running the Application

### Prerequisites
- Node.js (v14 or later recommended)
- npm (comes with Node.js)

### Frontend Setup
1. Navigate to the client directory:
   ```sh
   cd client
   ```
2. Install Dependencies:
   ```sh
   npm install
   ```
3. Start the development server
   ```sh
   npm run dev
   ```

The application will be available at http://localhost:5173

### Backend Setup
1. Navigate to the server directory:
   ```sh
   cd server
   ```
2. Install Dependencies:
   ```sh
   npm install
   ```
3. Start the server
   ```sh
   node index.js
   ```
The server will start on http://localhost:3001

## Usage
- Create a new task by clicking the "Create new task" button
- Edit a task by clicking the edit icon next to a task
- Delete a task by clicking the delete icon next to a task
- Mark a task as complete by checking the checkbox next to it
- Use the search bar to filter tasks
- Use the date filter to view tasks from today, yesterday, or last week
- Categorize tasks by selecting or creating categories
- Add notes to tasks for additional details
