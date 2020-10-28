'use strict'
const Project = use('App/Models/Project')
const User = use('App/Models/User')
const Staff = use('App/Models/Staff')
const Student = use('App/Models/Student')


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

    async linkUserToProject({ params,request,response}){
        console.log('poop');
        const data = request.post()
        const user = await User.findBy('email',data.email)
        const project = await Project.find(data.project_id)
        
        if (data.userType === 'student'){
            //execute attach for type student
            const student = await user.student().fetch()
            console.log(student);
            //disociate existing project , then add new project relation
            await student.project().dissociate()
            await student.project().associate(project)
                 
        }

        else if(data.userType === 'staff') {
            const staff = await user.staff().fetch()
            await staff.project().attach(data.project_id)
        }
        response.json({
            message : 'linked worked'
        })   

        
    }

    async delinkUserToProject({request,response}){
        const data = request.post()
        console.log(data);
        const user = await User.find(data.user_id)
        console.log(user);
        if (data.userType === 'student'){
            const student = await user.student().fetch()
            console.log(student);
            await student.project().dissociate()
        }

        else if (data.userType === 'staff'){
            const staff = await user.staff().fetch()
            await staff.project().detach(data.project_id)
        } 

        response.json({
            message : 'delinked worked'
        })   

    }

    async projectDetails({params,request,response}){
        //query list of students with the project id, then add condition to get the details 
        
        const projectID = params.id
        //const students = await Student.query().where('project_id',projectID).with('user').fetch() 
        
        const projectFromDB = await Project.find(projectID)
        const staff = await projectFromDB.staff().with('user').fetch()
        const students = await projectFromDB.students().with('user').fetch()
        response.json({
            message : 'retrieved project',
            project : projectFromDB,
            students : students,
            staff : staff

        })
    }
}

module.exports = ProjectController
