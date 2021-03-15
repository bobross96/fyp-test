'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Job extends Model {

    user(){
        return this.belongsTo('App/Models/User')
    }

    project(){
        return this.belongsTo('App/Models/Project')
    }
}

module.exports = Job
