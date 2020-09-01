'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Staff extends Model {
    user(){
        return this.belongsTo('App/Model/User')
    }

    project(){
        return this.belongsToMany('App/Model/Project')
    }

    
}

module.exports = Staff
