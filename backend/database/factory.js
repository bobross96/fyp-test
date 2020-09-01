'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
 const Factory = use('Factory')

 Factory.blueprint('App/Models/User', (faker) => {
   return {
     username: faker.username(),
     password: faker.password(),
     email: faker.email(),
     first_name: faker.name(),
     last_name : faker.name(),
     is_active : faker.bool()

   }
 })

 Factory.blueprint('App/Models/Student', (faker) => {
     return {
         group_name : faker.name()
     }
 })

 Factory.blueprint('App/Models/Project',(faker)=> {
     return {
        project_name : faker.name(),
        project_description : faker.sentence()
     }
 })
