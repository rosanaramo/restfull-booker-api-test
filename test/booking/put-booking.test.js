require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const {faker} = require('@faker-js/faker')
const {booking} = require('../../helpers/addBooking.js')
const {getToken} = require('../../helpers/authentication.js')
const {getBooking} = require('../../helpers/getBooking.js');
const {createBooking} = require('../../factories/bookingFactory.js')



describe('PUT/booking',()=>{

    let bookingBody;
    let bookingId;
    let token;
    let updatedBooking;

    beforeEach(async ()=>{
        ({bookingBody, bookingId} = await booking());
         token = await getToken();
         updatedBooking = createBooking();
    })

    describe('Happy Path',()=>{
           
        it('Should update all fields of a booking', async ()=>{
            
            const response = await request(process.env.BASE_URL)
            .put(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send(updatedBooking)
            .expect(200)

           expect(response.body).to.be.deep.equal(updatedBooking)
        });

         it('Should update booking with empty fields', async ()=>{
            // BUG: API accepts empty dates and converts them to "0NaN-aN-aN" instead of returning HTTP 400.
            const updatedBooking = {
                firstname : "",
                lastname : "",
                totalprice : 0,
                depositpaid : false,
                    bookingdates : 
                    {
                        checkin : "",
                        checkout : ""
                    },
                 additionalneeds : ""
            };
            
            const response = await request(process.env.BASE_URL)
            .put(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send(updatedBooking)
            .expect(200)

           expect(response.body).to.be.deep.equal(updatedBooking)
        });
    });

    describe('Headers Validation', ()=> {

        it('Should return header application/json; charset=utf-8', async ()=>{
            const response = await request(process.env.BASE_URL)
            .put(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send(updatedBooking)
            .expect(200)

            expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');

        });
    });
    
    describe ('Invalid Booking ID', ()=>{

        it('Should return 405 when trying to update a nonexistent booking', async ()=>{

            const response = await request(process.env.BASE_URL)
            .put('/booking/897089098088')
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send(updatedBooking)
            .expect(405)

            console.log(response.text)
            expect(response.text).to.be.equal('Method Not Allowed')
            
        });
    });

    describe('Special Characters', ()=>{

         it('Should allow to update bookings with special characters in string fields',async()=>{
            
             const updatedBooking = {
                firstname : "teste",
                lastname : "_&&&&مرح˜˜˜با",
                totalprice : 0,
                depositpaid : false,
                    bookingdates : 
                    {
                        checkin : "%%",
                        checkout : "%%"
                    },
                 additionalneeds : "くるま"
            };

            const response = await request(process.env.BASE_URL)
            .put(`/booking/${bookingId}`)
            .set('Accept','application/json')
            .set('Cookie', `token=${token}`)
            .send(updatedBooking)
            .expect(200)

            console.log(response.body)
            console.log(updatedBooking)
            expect(response.body).to.be.deep.equal(updatedBooking)

        });

    });

    describe('Security Tests', ()=> {
        it('Should reject HTML script',async ()=>{
                    //BUG: API accepts html scripts and returns 200 instead of return 400
                    updatedBooking.firstname = "<script>alert(1)</script>"
        
                    const response = await request(process.env.BASE_URL)
                    .put(`/booking/${bookingId}`)
                    .set('Cookie',`token=${token}`)
                    .set('Accept', 'application/json')
                    .send(updatedBooking)
                    .expect(400)
                });
        
                it('Should reject sql injection', async ()=>{
                    // BUG: API accepts sql injection and returns 200 instead reject and return 400
                    updatedBooking.firstname = "'; DROP TABLE booking; --";
                    const response = await request(process.env.BASE_URL)
                    .put(`/booking/${bookingId}`)
                    .set('Cookie', `token=${token}`)
                    .set('Accept', 'application/json')
                    .send(updatedBooking)
                    
                    expect(response.status).to.equal(400)
                })
    })

    describe('Idempotency', ()=>{

           it('Should be idempotent when updating a booking', async ()=>{
            let requestResponse;
                for(let i =0; i<2; i++ ){
                    
                    requestResponse = await request(process.env.BASE_URL)
                    .put(`/booking/${bookingId}`)
                    .set('Accept', 'application/json')
                    .set('Cookie', `token=${token}`)
                    .send(updatedBooking)
                    .expect(200)
                }

            const {response} = await getBooking(bookingId);                
            expect(response).to.be.deep.equal(updatedBooking)
        });
    });

});



// testar idempotencia
