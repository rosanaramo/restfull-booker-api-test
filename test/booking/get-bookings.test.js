const request = require('supertest')
const {expect} = require ('chai')
const {getBookingId} = require('../../helpers/addBooking.js')
require('dotenv').config()

describe('Booking search',()=> {
    describe('GET/ booking',()=>{
        // it('Should return a list of bookings', async ()=>{
        //      response = await request(process.env.BASE_URL)
        //         .get("/booking")
        //         .expect(200)
        //         .expect('Content-Type',/json/) 
                
        //         //chai assertions
        //         expect(response.body).to.not.be.empty;
        //         expect(response.body).to.be.an('array')
        // });

        it('Should return a book by ID', async ()=>{
            const bookingId = await getBookingId();
            console.log(bookingId)

            response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingId}`).
            set('Accept', 'application/json')
            .expect(200)
            
            console.log(response.text)
        })
    })
})
