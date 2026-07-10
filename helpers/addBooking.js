require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const booking = require('../fixtures/booking.json')

const getBookingId = async () => {

    const response = await request(process.env.BASE_URL)
    .post('/booking')
    .set('Accept','application/json')
    .send(booking)

    console.log('====> Booking Id ', response.body.bookingid )
    return response.body.bookingid

}
module.exports = {
    getBookingId
}
