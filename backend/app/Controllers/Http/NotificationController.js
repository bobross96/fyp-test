'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const Notification = use('App/Models/Notification');


/**
 * Resourceful controller for interacting with notifications
 */
class NotificationController {
  /**
   * Show a list of all notifications.
   * GET notifications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new notification.
   * GET notifications/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async createOne ({ request, response }) {
    const {
      title,
      description,
      user_id,
      source_user_id,
      is_read,
      event_id,
      event_type
    } = request.all()

    const newNotif  = new Notification();
    newNotif.title = title
    newNotif.description = description
    newNotif.user_id = user_id
    newNotif.source_user_id = source_user_id
    newNotif.is_read = is_read
    newNotif.event_id = event_id
    newNotif.event_type = event_type
    await newNotif.save();
    response.json({
      message: 'notif create success'
    })
  }

  async createMany ({request,response}){
    const {
      title,
      description,
      id_array,
      source_user_id,
      is_read,
      event_id,
      event_type
    } = request.all()

    id_array.forEach(async id => {
        const newNotif = new Notification();
        newNotif.title = title
        newNotif.description = description
        newNotif.user_id = id
        newNotif.source_user_id = source_user_id
        newNotif.is_read = is_read
        newNotif.event_id = event_id
        newNotif.event_type = event_type
        await newNotif.save()
    });

    response.json({
      message: 'many notif success'
    })



  }

  //create notif to send to prof only
  /* async createGroup ({request, response}){
    const {
      title,
      description,
      prof_id,
      source_user_id,
      is_read
    } = request.all()

    const newNotif = new Notification();



  } */



  /**
   * Create/save a new notification.
   * POST notifications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single notification.
   * GET notifications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing notification.
   * GET notifications/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update notification details.
   * PUT or PATCH notifications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a notification with id.
   * DELETE notifications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    let id = params.notificationID
    let notification = await Notification.find(id)
    await notification.delete()

    response.json({
      message : "notification deleted"
    })




  }
}

module.exports = NotificationController
