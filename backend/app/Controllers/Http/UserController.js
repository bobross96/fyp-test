"use strict";

const User = use("App/Models/User");
const Student = use("App/Models/Student");
const Staff = use("App/Models/Staff");
const Project = use("App/Models/Project");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  async login({ auth, request, response }) {
    console.log("poop");
    const { email, password } = request.post();

    if (await auth.attempt(email, password)) {
      //will query and return user object based on email
      let user = await User.findBy("email", email);
      // generate jwt token based on user
      let token = await auth.generate(user, true);

      if (await user.student().fetch()) {
        const student = await user.student().fetch();
        let project = await student.project().fetch()
        student.type = 'student'
        student.project = project
        return response.json({
          message: "loggin in",
          token: token,
          loginSuccess: true,
          user: user,
          userType: student,
        });
      } else if (await user.staff().fetch()) {
        const staff = await user.staff().fetch();
        let projects = await staff.project().fetch()
        
        staff.projects = projects.rows
        console.log(staff.projects);
        staff.type = 'staff'
        return response.json({
          message: "loggin in",
          token: token,
          loginSuccess: true,
          user: user,
          userType: staff,
        });
      } else {
        return response.json({
          message: "neither student nor staff wtf?",
        });
      }
    } else {
      return response.json({
        message: "error bro",
      });
    }
  }

  async register({ auth, request, response }) {
    console.log("inside register");
    const {
      email,
      password,
      first_name,
      last_name,
      username,
      userType,
      is_active,
    } = request.post();
    const user = new User();
    user.username = username;
    user.email = email;
    user.first_name = first_name;
    user.last_name = last_name;
    user.password = password;
    user.is_active = is_active;
    if (userType == "student") {
      const student = new Student();
      //for now just using one project only
      await user.save();
      // save student type to user model
      await user.student().save(student);
      // save project id one to student model
      let token = await auth.generate(user, true);
      return response.json({
        message: "registering",
        token: token,
        registerSuccess: true,
        user: user,
        userType: student,
      });
    } else if (userType == "staff") {
      const staff = new Staff();
      await user.save();
      await user.staff().save(staff);
      let token = await auth.generate(user, true);
      return response.json({
        message: "staff selected still workin on it",
        token: token,
        registerSuccess: true,
        user: user,
        userType: staff,
      });
    }

    //add project id to user body for easy query
  }
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const users = await User.all();

    response.json({
      message: "here are users",
      data: users,
    });
  }

  // making easy way to create multiple for db testing purposes
  async storeMany({ request, response, view }) {
    const userBody = request.post().users;
    userBody.forEach((user) => {
      console.log(user);
      const { username, email, password, is_active } = user;
      console.log(username);
      let newUser = new User();
      newUser.username = username;
      newUser.password = password;
      newUser.email = email;
      newUser.is_active = is_active;
      newUser.save();
    });

    response.json({
      message: "here are users",
    });
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      is_active,
    } = request.post();
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    user.first_name = first_name;
    user.last_name = last_name;
    user.is_active = is_active;
    console.log(user);
    await user.save();

    response.json({
      message: `User ${user.first_name} saved`,
    });
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async showByProject({ params, request, response, view }) {
    console.log('inside');
    const projectID = params.projectID
    const project = await Project.find(projectID)
    const students = await project.students().fetch()
    const users = []

    for (let student of students.rows){
      const user = await student.user().fetch()
      users.push(user)
    }


    response.json({
      message: users,
    });

  }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    let userID = params.id
    let user = await User.find(userID)
    const {
      email,
      first_name,
      last_name,
      username,
      is_active,
    } = request.post();

    user.username = username;
    user.email = email;
    user.first_name = first_name;
    user.last_name = last_name;
    user.is_active = is_active;

    await user.save()

    return response.json({
      message : 'update success'
    })

  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    console.log('inside');
    let userID = params.id
    let userFromDB = await User.find(userID)
    console.log(userFromDB);
    
    try {
      await userFromDB.delete()  
    } catch (error) {
      console.log(error);
    }
    

    return response.json({
      message : "delete success"
    })
  }


  async adminLogin({auth,request,response}){
      const {email,password} = request.post()
      if (await auth.attempt(email,password)){
        //will query and return user object based on email
      let user = await User.findBy("email", email);
      // generate jwt token based on user
      let token = await auth.generate(user, true);
        
     
      if (await user.staff().fetch()){
        const staff = await user.staff().fetch();
        return response.json({
          message: "loggin in",
          token: token,
          loginSuccess: true,
          user: user,
          userType: staff,
        });

      }

      else {
        return response.json({
          message: "not admin/staff",
        });
      }
    }
      else {
        return response.json({
          message: "not reigsterd at all",
        });
      }
  }
}

module.exports = UserController;
