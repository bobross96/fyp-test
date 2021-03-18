# fyp-test (SHAIK)

# Using adonisjs for backend and angular for frontend

Doing a fullstack project management web application for NTU students taking DIP

What is done so far:

1) AdonisJS
- Added database tables, schema up to changes depending on use case (first time actually designing a relational db)
- Added Factory files to generate data
- Added GET,POST,DELETE routes for Task table
2) Angular
- Connected to backend with proxy to server side localhost 
- Added full calendar library for schedule, connected add events to db 
- Added mat dialog to trigger on handle date events for user to post task to db
- Added function that takes in Semester Start date to calculate NTU Calendar Week Number 
- Added Login and Register
- Added Auth guard to prevent unauthorized from accessing main application without registering/logging in
- Added JWT authentication and store on localStorage to persist login session 
- Added HTTP Interceptor to send all requests with JWT token to authenticate and make request to backend
