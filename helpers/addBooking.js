require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const {createBooking} = require('../factories/bookingFactory.js')

const booking = async () => {
    const bookingBody = createBooking()

    const response = await request(process.env.BASE_URL)
    .post('/booking')
    .set('Accept','application/json')
    .send(bookingBody)

    return {
        bookingId: response.body.bookingid,
        bookingBody
    } 
}
module.exports = {
    booking
}
