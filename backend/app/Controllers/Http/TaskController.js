'use strict'

const Task = use('App/Models/Task')

class TaskController {


    async index({request,response}){
        
        const tasksDB = await Task.all()
        const tasks = await tasksDB.toJSON()
        response.status(200).json({
            message : 'here are the tasks',
            data : tasks
        })
    }

    async create({request,response}){
        const {title,description} = request.all()
        const task = new Task()
        task.title = title
        task.description = description
        await task.save()

        response.json({
            message: "db save success"
        })
    }
    
    async show({request,response, params : {id}}){
        const task = await Task.find(id)
        const taskData = task.toJSON()

        response.json({
            message : 'show book by id',
            data : taskData
        })
    }
}

module.exports = TaskController
