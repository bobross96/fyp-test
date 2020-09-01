'use strict'

class TestController {

    async index({request,response}){
        response.status(200).json({
            message : 'index works'
            
          })
        
    }

    async create({request,response}){
        
    }
}

module.exports = TestController
