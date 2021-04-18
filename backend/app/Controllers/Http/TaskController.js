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
    const user = await auth.getUser();
    //fetch project first, then fetch all task related to project.
    if (await user.student().fetch()) {
      const student = await user.student().fetch();
      const project = await student.project().fetch();
      const tasks = await project.task().fetch();
      return response.json({
        message: "retrieval success",
        data: tasks,
      });
    } else if (await user.staff().fetch()) {
      const staff = await user.staff().fetch();
      const projects = await staff.project().fetch();
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
      return response.json({
        message: "retrieval success",
        data: flatTask,
      });
    }
  }


  async getByProject({request, response, params}){
      const projectID = params.projectID
      const project = await Project.find(projectID)
      const tasks = await project.task().fetch()

      return response.json({
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
  async store({ request, response }) {
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
      start_date,
      end_date,
    } = request.all();
    const newTask = new Task();
    newTask.title = title;
    newTask.task_type = task_type;
    newTask.status = "Pending";
    newTask.task_due_date = task_due_date;
    newTask.user_id = user_id;
    newTask.start_date = start_date;
    newTask.end_date = end_date;
    await newTask.save();
    const project = await Project.find(project_id);
    // project has many task, so need to use it to save task to it
    await project.task().save(newTask);
    response.json({
      message: "saved success",
      db_id: newTask.id,
      task: newTask,
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
  async show({ params, request, response, view }) {
    const taskID = params.id;
    const task = await Task.find(taskID);
    const file = await task.files().fetch();

    response.json({
      message: "query success",
      task: task,
      file: file,
    });
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
  async edit({ params, request, response, view }) {}

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const id = params.id;
    const task = request.all();
    const taskFromDB = await Task.find(id);
    if (task.task_type) {
      taskFromDB.task_type = task.task_type;
    }

    if (task.task_due_date){
      taskFromDB.task_due_date = task.task_due_date
    }
    taskFromDB.title = task.title;
    taskFromDB.content = task.content;
    taskFromDB.hours_spent = task.hours_spent;

    await taskFromDB.save();

    response.json({
      task: taskFromDB,
    });
  }

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

  async submitTask({ params, request, response }) {
    const task = request.all();
    const taskID = params.id;
    const taskFromDB = await Task.find(taskID);
    const submissionTime = new Date(task.submission_date).getTime();
    const taskDueTime = taskFromDB.task_due_date.getTime();
    taskFromDB.title = task.title;
    taskFromDB.content = task.content;
    taskFromDB.submission_date = task.submission_date;
    taskFromDB.hours_spent = task.hours_spent;
    if (submissionTime > taskDueTime) {
      taskFromDB.status = "Late Submission";
    } else if (submissionTime <= taskDueTime) {
      taskFromDB.status = "Completed";
    }
    await taskFromDB.save();

    response.json({
      message: "task saved successfully",
      task: taskFromDB,
    });
  }
}

module.exports = TaskController;
