'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Student extends Model {
    user(){
        return this.belongsTo('App/Models/User')
    }

    project(){
        return this.belongsTo('App/Models/Project')
    }
}

module.exports = Student
