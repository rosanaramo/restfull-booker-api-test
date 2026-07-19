const request = require('supertest')
require('dotenv').config()


const getBooking = async(bookingId) =>{

    const response = await request(process.env.BASE_URL)
    .get(`/booking/${bookingId}`)
    .set('Accept', 'application/json')

    return response;
}

module.exports = {
    getBooking
}