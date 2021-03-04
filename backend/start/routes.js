'use strict'

const { RouteResource } = require('@adonisjs/framework/src/Route/Manager')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//admin routes 
Route.get('api/projects','ProjectController.index')
Route.post('api/projects/addProject','ProjectController.linkStaffToProject')
Route.post('api/projects','ProjectController.store')
Route.get('api/projects/:id','ProjectController.projectDetails')
Route.post('api/projects/linkUserToProject','ProjectController.linkUserToProject')
Route.post('api/projects/delinkUserToProject','ProjectController.delinkUserToProject')

//crud for user 
//create user
//get user
//update user
//delete user






//UserController

//login or register
Route.post('api/login','UserController.login')
Route.post('api/register','UserController.register')
Route.post('api/admin-login','UserController.adminLogin')
//user retrieval by project
Route.get('api/users/:projectID','UserController.showByProject')
//get all users 
Route.get('api/users','UserController.index')
//store multiplie users 
Route.post('api/usersMany','UserController.storeMany')


//TaskController

Route.put('api/tasks/submit/:id','TaskController.submitTask')
Route.resource('api/tasks','TaskController').middleware('auth')
Route.post('api/tasks','TaskController.create')


//CommentController
// retrieve comments
Route.post('api/comments','CommentController.create')
Route.get('api/comments/task/:id','CommentController.taskIndex')
Route.get('api/comments/link/:id','CommentController.linkCommentToReply')



// doucment routes
Route.delete('api/documents/delete/:fileID','DocumentController.destroy')
Route.post('api/documents/:taskID','DocumentController.store')
Route.get('api/documents/:taskID','DocumentController.show')



// submit job under board
Route.get('api/jobs/:projectID','JobController.index')
Route.post('api/jobs','JobController.storeAll')
Route.delete('api/jobs/:jobID','JobController.destroy')




//create notif

//get all notifications by ID
Route.get('api/notification/:userID','NotificationController.show')

//simple create
Route.post('api/notification/create/one','NotificationController.createOne')
//create notif for groupmates 
Route.post('api/notification/create/many','NotificationController.createMany')
//delete notif by ID
Route.delete('api/notification/delete/:notificationID','NotificationController.destroy')



//token check
Route.post('api/token','UserController.checkToken')





