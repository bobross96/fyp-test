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
    newTask.task_type = task_type;
    newTask.status = 'Pending';
    newTask.task_due_date = task_due_date;
    newTask.user_id = user_id;
    console.log(project_id);
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
  async show({ params,request, response, view }) {
    
    const taskID = params.id
    const task = await Task.find(taskID)

    response.json({
      message : 'query success',
      task : task
    })
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
    const id = params.id
    const task = request.only(['title','content','submission_date','task_due_date','status','hours_spent'])
    const taskFromDB = await Task.find(id)
    if (task.task_type){
      taskFromDB.task_type = task.task_type
    }
    taskFromDB.title = task.title
    taskFromDB.content = task.content
    taskFromDB.hours_spent = task.hours_spent

    await taskFromDB.save()
    
    response.json({
      task : taskFromDB
    })

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


  async submitTask({ params,request, response}){
    const task = request.only(['title','content','submission_date','task_due_date','status','hours_spent'])
    const taskID = params.id
    console.log(taskID);
    const taskFromDB = await Task.find(taskID)
    console.log(taskFromDB);
    try {
      
    const submissionTime = new Date(task.submission_date).getTime()
    const taskDueTime = taskFromDB.task_due_date.getTime()
    taskFromDB.title = task.title
    taskFromDB.content = task.content
    taskFromDB.submission_date = task.submission_date
    taskFromDB.hours_spent = task.hours_spent
    if (submissionTime > taskDueTime){
      taskFromDB.status = 'Late Submission'
    }

    else if (submissionTime <= taskDueTime){
      taskFromDB.status = 'Completed'
    }
    await taskFromDB.save()  
    } catch (error) {
      console.log(error);
    }
    

    response.json({
      message : 'task saved successfully',
      task : taskFromDB
    })
  }
}

module.exports = TaskController;
