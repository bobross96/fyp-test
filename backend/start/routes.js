"use strict";

const { RouteResource } = require("@adonisjs/framework/src/Route/Manager");

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
const Route = use("Route");

//admin routes
Route.get("api/projects", "ProjectController.index");
Route.post("api/projects/addProject", "ProjectController.linkStaffToProject");
Route.post("api/projects", "ProjectController.store");
Route.get("api/projects/:id", "ProjectController.projectDetails");
Route.post(
  "api/projects/linkUserToProject",
  "ProjectController.linkUserToProject"
);
Route.post(
  "api/projects/delinkUserToProject",
  "ProjectController.delinkUserToProject"
);

//UserController

//login or register
Route.post("api/login", "UserController.login");
Route.post("api/register", "UserController.register");
Route.post("api/admin-login", "UserController.adminLogin");
//user retrieval by project
Route.get("api/users/:projectID", "UserController.showByProject");
//get all users
Route.get("api/users", "UserController.index");
//store multiplie users
Route.post("api/usersMany", "UserController.storeMany");

//TaskController

Route.put("api/tasks/submit/:id", "TaskController.submitTask");
Route.resource("api/tasks", "TaskController").middleware("auth");
Route.post("api/tasks", "TaskController.create");

//Route to get all tasks belonging to a singular project
Route.get("api/tasks/project/:projectID", "TaskController.getByProject");

//CommentController
// retrieve comments
Route.post("api/comments", "CommentController.create");
Route.get("api/comments/task/:id", "CommentController.taskIndex");
Route.get("api/comments/link/:id", "CommentController.linkCommentToReply");

// doucment routes
Route.delete("api/documents/delete/:fileID", "DocumentController.destroy");
Route.post("api/documents/:taskID", "DocumentController.store");
Route.get("api/documents/:taskID", "DocumentController.show");

// submit job under board
Route.post("api/jobs/one", "JobController.storeOne");
Route.get("api/jobs/:projectID", "JobController.index");

//get jobs related to user
Route.get("api/jobs/user/:userID", "JobController.jobByUserID");

Route.post("api/jobs/many", "JobController.storeAll");

//delete jobs
Route.delete("api/jobs/:jobID", "JobController.destroy");

//create notif

//get all notifications by ID
Route.get("api/notification/:userID", "NotificationController.show");

//simple create
Route.post("api/notification/create/one", "NotificationController.createOne");
//update notification
Route.patch("api/notification/:notifID", "NotificationController.edit");
//delete notificaiton after it has been clicked

//create notif for array
Route.post("api/notification/create/many", "NotificationController.createMany");
//delete notif by ID
Route.delete(
  "api/notification/delete/:notificationID",
  "NotificationController.destroy"
);
//create notifs tagged to projectID
Route.post(
  "api/notification/createByProjectID/:projectID",
  "NotificationController.createByProjectID"
);

//sem routes
Route.get("api/semester", "SemesterController.index");
//post new sem
Route.post("api/semester", "SemesterController.store");
//update new sem
Route.patch("api/semester", "SemesterController.edit");

//token check
Route.post("api/token", "UserController.checkToken");
