'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Task extends Model {
    user(){
        return this.belongsTo('App/Models/User')
    }
    /* student(){
        return this.belongsTo('App/Models/Student')
    }

    staff(){
        return this.belongsTo('App/Models/Staff')
    } */

    project(){
        return this.belongsTo('App/Models/Project')
    }

    comment(){
        return this.hasMany('App/Models/Comment')
    }
}

module.exports = Task
