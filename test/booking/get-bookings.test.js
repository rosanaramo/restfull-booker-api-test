const request = require('supertest')
const {expect} = require ('chai')
const {booking} = require('../../helpers/addBooking.js')

require('dotenv').config()

describe('GET/booking',()=> {
    describe('Happy Path',()=>{
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
            const {bookingBody, bookingId}  = await booking();

            const response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .expect(200)     
            
            expect(response.body).to.deep.equal(bookingBody)
            expect(response.body.firstname).to.equal(bookingBody.firstname)
            expect(response.body.lastname).to.equal(bookingBody.lastname)
            expect(response.body.depositpaid).to.equal(bookingBody.depositpaid)
            expect(response.body.bookingdates.checkin).to.equal(bookingBody.bookingdates.checkin)
            expect(response.body.bookingdates.checkout).to.equal(bookingBody.bookingdates.checkout)
        })
    });


    describe('Headers Validation', ()=>{

    });

    describe('Response Structure', ()=>{

        it('Should contain expected properties',async ()=>{
            const {bookingId}= await booking();

            const response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingId}`)
            .set('Accept','application/json')
            .expect(200)

            expect(response.body).to.have.property('firstname');
            expect(response.body).to.have.property('lastname');
            expect(response.body).to.have.property('depositpaid');
            expect(response.body.bookingdates).to.have.property('checkin');
            expect(response.body.bookingdates).to.have.property('checkout');
            expect(response.body).to.have.property('additionalneeds');
        });
    });


    describe('Query Parameters', () => {

    });

 

    describe('Data Validation', ()=>{

    });

    describe('Invalid Parameters', ()=>{

    });

    describe('Business Rules', ()=>{

    });

    describe('Security Tests', () =>{

    });

})
