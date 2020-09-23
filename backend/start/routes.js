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

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

//admin routes 
Route.get('api/projects','ProjectController.index')
Route.post('api/projects/addProject','ProjectController.linkStaffToProject')
Route.post('api/projects','ProjectController.store')



//user routes

Route.resource('api/tasks','TaskController').middleware('auth')
Route.resource('api/users','UserController').middleware('auth')
Route.get('api','TestController.index')
Route.post('api/tasks','TaskController.create')
Route.post('api/usersMany','UserController.storeMany')


//login or register
Route.post('api/login','UserController.login')
Route.post('api/register','UserController.register')