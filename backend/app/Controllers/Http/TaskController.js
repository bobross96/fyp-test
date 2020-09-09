'use strict'
const Task = use('App/Models/Task')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {

    const tasks = await Task.all()

    response.json({
      message : 'hey resourcce works',
      data : tasks
    })
  }

  

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {

    console.log('asd');
     const {title, content, task_type, status, task_due_date, submission_date,hours_spent,user_id} = request.all()
     const newTask = new Task()
     newTask.title = title
     console.log(title);
     newTask.content = content
     newTask.task_type = task_type
     newTask.status = status
     newTask.task_due_date = task_due_date
     newTask.submission_date = submission_date
     newTask.hours_spent = hours_spent
     newTask.user_id = user_id

     await newTask.save()
     response.json({
       message : 'saved success'
     })

  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing task.
   * GET tasks/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
      console.log(params);
      const { id } = params
      const task = await Task.find(id)
      await task.delete()
      response.json({
        message : "task deleted"
      })
  }
}

module.exports = TaskController
