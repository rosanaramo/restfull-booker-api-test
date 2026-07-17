const request = require('supertest')
const {expect} = require ('chai')
const {booking} = require('../../helpers/addBooking.js')

require('dotenv').config()

describe('Booking search',()=> {
    describe('GET/ booking',()=>{
        it('Should return a list of bookings', async ()=>{
            const {bookingId, bookingBody} = booking()
             response = await request(process.env.BASE_URL)
                .get("/booking")
                .expect(200)
                .expect('Content-Type',/json/) 
                
                //chai assertions
                expect(response.body).to.not.be.empty;
                expect(response.body).to.be.an('array')
        });

        it('Should return a book by ID', async ()=>{
            const bookingBody = await createBooking();

            const response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingBody.bookingId}`)
            .set('Accept', 'application/json')
            .expect(200)     
            
            expect(response.body.booking).to.deep.equal(bookingBody)
        })
    })
})
