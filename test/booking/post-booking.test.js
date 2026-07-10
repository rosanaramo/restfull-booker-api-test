require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const booking = require('../../fixtures/booking.json')
const {getBooking} = require('../../helpers/addBooking')


describe('POST', ()=> {
    describe('Booking insertion', () => {
        it('Should return 200 when a booking is registered', async () => {

            bookingBody= {...booking}
            bookingBody.firstname = "Pedro Sampaio";

              response = await request(process.env.BASE_URL)
              .post('/booking')
              .set('Accept', 'application/json')
              .send(
                    bookingBody
            ).expect(200)
            console.log(response.body)
        })
    })
})