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

# TODO during Recess Week
- Comments for every Task
- Add attachments to every Task
- Add notifications every time a Task is submitted(for Staff)/ Task is late (Both User and Staff)
