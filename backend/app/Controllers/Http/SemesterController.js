'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Semester = use('App/Models/Semester')

/**
 * Resourceful controller for interacting with semesters
 */
class SemesterController {
  /**
   * Show a list of all semesters.
   * GET semesters
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    //just get the only entry
    const semester = await Semester.all()

    response.json({
      semester : semester
    })
  }

  /**
   * Render a form to be used for creating a new semester.
   * GET semesters/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new semester.
   * POST semesters
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
      const { sem_1_start_date, sem_2_start_date} = request.all()
      console.log('inside');
      const newSem = new Semester()
      newSem.sem_1_start_date = new Date(sem_1_start_date)
      newSem.sem_2_start_date = new Date(sem_2_start_date)

      await newSem.save()

      response.json({
        message : 'stored success'
      })
      
  }

  /**
   * Display a single semester.
   * GET semesters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing semester.
   * GET semesters/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
    const {sem_1_start_date,sem_2_start_date} = request.all()  
    
    const sem = await Semester.all()
    sem.sem_1_start_date = new Date(sem_1_start_date)
    sem.sem_2_start_date = new Date(sem_2_start_date)

    await sem.save()

    response.json({
      message : 'semester updated'
    })

  }

  /**
   * Update semester details.
   * PUT or PATCH semesters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a semester with id.
   * DELETE semesters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = SemesterController
