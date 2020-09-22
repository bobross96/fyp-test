'use strict'
const Project = use('App/Models/Project')
const User = use('App/Models/User')
const Staff = use('App/Models/Staff')

class ProjectController {
    async index({request,response}){
        console.log('poop');
        // eager loading example 
        // add logic to check if student or staff?
        
        const projects = await Project.query().with('students').fetch()
        await projects.toJSON()

        response.status(200).json({
            message : 'here are the projects',
            data : projects
        })
    }

    async store({request,response}){
        //const project = new Project()
        const newProject = Project.create(request.only(['project_name','project_description']))
        console.log(newProject);

        response.json({
            message : 'project successfully created'
        })
    }

    async linkStaffToProject({ request,response}){
        const data = request.post()
        const user = await User.findBy('email',data.email)
        const staff = await user.staff().fetch()
        await staff.project().attach(data.project_id)


        response.json({
            message : 'linkstaff works',
            email : user
        })
    }
}

module.exports = ProjectController
