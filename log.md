# Daily updates (transferred over from hardcopy in notebook) 
(Shaik Zhafir)

# 1/9/2020 
- Read up on relational database design, designed rough working database schema using postgresql db (User, Student, Staff, Task, Project tables)
- Used adonisjs conventions for relations
- Used Chance.js to generate randomised data to seed DB
- Configured GET route using postman to test backend 

# 2/9/2020
- Started working on Angular for frontend
- Tried using Angular Calendar, tested default example

# 6/9/2020
- Created Routes to post Task object to backend
- Added other styling to Angular Calendar

# 8/9/2020
- Managed to make POST task work

# 9/9/2020
- Changed calendar library used to Fullcalendar, due to usability issue with Angular-Calendar library
- Implemented GET,POST and DELETE for tasks on calendar
- Added Dialogue when creating Task

# ---Progress Meeting 1---

# 15/9/2020
- Added function to calculate NTU week to add to calendar
- Added login component 

# 17/9/2020
- Added register componenet

# 18/9/2020
- Added Angular Route Guard to prevent unauthorised users from accessing logged in user routes. Will require JWT token that is in response sent by backend 
- Added middleware to the Task routes in backend to prevent unauthorised access
- Added HTTP interceptor that includes the JWT token everytime the user makes an API call, to get access to protected API

# 21/9/2020
- Added registration for User ( defaulted to only project id: 1) 
- User shown only tasks that is belonging to the project with id=1
- Tasks will be saved with project id-1 as FK
- User information saved inside localStorage
- Only admin (no view yet) can change project

# 22/9/2020
- Staff usertype able to select project to work on from Calendar View

# 23/9/2020
- Added Task Detail view
- Added All Tasks view to show a summary of all the tasks relevant to the project

# 24/9/2020
- Edited form at the calendar
- Added edit Task from the Task Detail View
- Added submit Task from Task Detail View

# ---Progress Meeting 2--- 

# TODO during Recess Week
- Comments for every Task
- Add attachments to every Task
- Add notifications every time a Task is submitted(for Staff)/ Task is late (Both User and Staff)

# 30/9/2020
- Added comments section to every Task
- User can reply to parent comment only
- Use junction table to link parent and child comment

# 2/10/2020
- Added PDF upload functionality
- User can upload and preview uploaded file
- User can save file to the task
- User can view or delete saved files 

# 6/10/2020
- Added docx upload functionality 
- Rendered using mammoth.js library as HTML file
- Added timings on events (primarily for meetings)
- Changed view for timed VS non-timed events

# ---Progress Meeting 3--- 

# 8/10/2020
- Added query parameter based routing for different task types
 
 
# 26/10/2020
- Added admin-app to existing workspace
- Added routes in frontend app to access admin-app

# 27/10/2020
- Added backend routes to link staff and students to projects
- Reworked backend routes for registration

# 28/10/2020
- Added frontend view for admin-users and admin-projects component 
- Used mat-table to display data 
- Added link user to project on frontend 


# ---Progress Meeting 4--- 

# 16/12/2020
- Broke up the services file into separate files
- Fixed login not showing alert with wrong login information

# 23/12/2020
- Added teamboard component (todo list for groupwork)

# 24/12/2020
- Added basic CRUD functionalities to the board. Further development done on separate repo and will be integrated once completed 


