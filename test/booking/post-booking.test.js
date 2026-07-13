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
            expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
        });

        //bug --> returns server error instead of 400
        it('Should return 400 when the firstname is a null value', async ()=>{
            const bookingBody = structuredClone(booking)
            bookingBody.firstname = null

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(400)
        })

        it('Should allow register a booking with total price equals 0',async ()=> {
            const bookingBody = structuredClone(booking)
            bookingBody.totalprice= 0

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(200)
        })

        it('simple test', async ()=>{
            const bookingBody = structuredClone(booking)
            // bookingBody.firstname = "Lilian"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(200)
        })

        it('Should return 400 when checkout is before the checkin', async () =>{
            // bug --> should not allow to register a booking with checkout before the checkin
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