const request = require('supertest')
require('dotenv').config()


const getBooking = async(bookingInd) =>{

    const response = await request(process.env.BASE_URL)
    .get(`/booking/${bookingInd}`)
    .set('Accept', 'application/json')
    .expect(200)
}