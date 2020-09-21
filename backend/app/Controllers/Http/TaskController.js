"use strict";

const auth = require("../../../config/auth");

const Task = use("App/Models/Task");
const Project = use("App/Models/Project");

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
  async index({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      console.log(user);
      //fetch project first, then fetch all task related to project.
      if (await user.student().fetch()) {
        const student = await user.student().fetch();
        console.log(student);
        const project = await student.project().fetch();
        const tasks = await project.task().fetch();
        console.log(tasks);
        return response.json({
          message: "retrieval success",
          data: tasks,
        });
      } else if (await user.staff().fetch()) {
        const staff = await user.staff().fetch();
        const projects = await staff.project().fetch();
        console.log(projects);
        //mutliple project have multiple tasks
        const tasks = await Promise.all(
          projects.rows.map(async (project) => {
            // will fetch all tasks related to each project
            let tasks = await project.task().fetch();
            // fuck this please read documentation to find a better soln
            return tasks.rows;
          })
        );
        let flatTask = await tasks.flat();
        console.log(flatTask);
        return response.json({
          message: "retrieval success",
          data: flatTask,
        });
      }
    } catch (error) {
      console.log(error);
      return response.json({
        message: "error user not retrieved",
      });
    }
    //const tasks = await Task.all()
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    console.log("asd");
    const {
      title,
      content,
      task_type,
      status,
      task_due_date,
      submission_date,
      hours_spent,
      user_id,
      project_id,
    } = request.all();
    const newTask = new Task();
    newTask.title = title;
    console.log(request.all());
    newTask.content = content;
    newTask.task_type = task_type;
    newTask.status = status;
    newTask.task_due_date = task_due_date;
    newTask.submission_date = submission_date;
    newTask.hours_spent = hours_spent;
    newTask.user_id = user_id;

    await newTask.save();
    const project = await Project.find(project_id);
    // project has many task, so need to use it to save task to it
    await project.task().save(newTask);
    response.json({
      message: "saved success",
      db_id: newTask.id,
    });
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
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing task.
   * GET tasks/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    console.log(params);
    const { id } = params;
    const task = await Task.find(id);
    await task.delete();
    response.json({
      message: "task deleted",
    });
  }
}

module.exports = TaskController;
