'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Staff extends Model {
    user(){
        return this.belongsTo('App/Models/User')
    }

    project(){
        return this
            .belongsToMany('App/Models/Project')
            .pivotTable('staff_project')
    }

    
}

module.exports = Staff
    