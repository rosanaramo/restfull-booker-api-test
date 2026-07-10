require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const booking = require('../fixtures/booking.json')

const createBooking = async () => {
    const bookingBody = {...booking}

    const response = await request(process.env.BASE_URL)
    .post('/booking')
    .set('Accept','application/json')
    .send(booking)

    return {
        bookingId: response.body.bookingid,
        bookingBody
    } 
}
module.exports = {
    createBooking
}
