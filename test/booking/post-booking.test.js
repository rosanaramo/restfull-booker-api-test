require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const booking = require('../../fixtures/booking.json')
const {getBooking} = require('../../helpers/addBooking')

describe('POST/ booking', ()=> {
    describe('Booking insertion', () => {
        it('Should return 200 when a booking is registered', async () => {

            const bookingBody= structuredClone(booking)
            bookingBody.firstname = "Marcio Roberto";

              const response = await request(process.env.BASE_URL)
              .post('/booking')
              .set('Accept', 'application/json')
              .send(
                    bookingBody
            ).expect(200)
            
            expect(response.body).to.have.property('bookingid')
            expect(response.body.booking).to.deep.equal(bookingBody)
           
        });

        it('Should return 400 when booking checkout date is before the checkin', async () =>{
            const bookingBody = structuredClone(booking)
            bookingBody.bookingdates.checkin = "2026-10-09";
            bookingBody.bookingdates.checkout = "2026-10-08";

            const response = await request (process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .expect(400)
            .send(bookingBody)
        });
        
    })
})