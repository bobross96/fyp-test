'use strict'
const Student = use('App/Models/Student')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Project extends Model {

    students(){
        return this.hasMany('App/Models/Student')
    }

    staff(){
        return this.belongsToMany('App/Models/Staff').pivotTable('staff_project')
    }

    task(){
        return this.hasMany('App/Models/Task')
    }
}

module.exports = Project
