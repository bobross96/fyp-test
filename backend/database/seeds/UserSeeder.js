'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class UserSeeder {
  async run () {
    const users = await Factory.model('App/Models/User').createMany(10)
    
    const project = await Factory.model('App/Models/Project').make()
    // this will create FK in student table
    for await (const user of users){
      const student = await Factory.model('App/Models/Student').make()
      await user.student().save(student)
      await project.students().save(student)
    }
  
  }
}

 



module.exports = UserSeeder
