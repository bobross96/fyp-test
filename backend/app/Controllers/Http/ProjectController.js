'use strict'
const Project = use('App/Models/Project')

class ProjectController {
    async index({request,response}){
        console.log('poop');
        // eager loading example 
        // add logic to check if student or staff?
        
        const projects = await Project.query().with('students').fetch()
        await projects.toJSON()

        response.status(200).json({
            message : 'here are the tasks',
            data : projects
        })
    }
}

module.exports = ProjectController
