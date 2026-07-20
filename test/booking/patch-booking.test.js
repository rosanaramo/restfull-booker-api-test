require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const {booking} = require('../../helpers/addBooking.js')
const {getToken} = require('../../helpers/authentication.js')
const {getBooking} = require('../../helpers/getBooking.js');
const {createBooking} = require('../../factories/bookingFactory.js')

describe('Patch/booking/',()=>{

    let bookingId;
    let bookingBody;
    let token;

    beforeEach(async ()=>{
        
        ({bookingId}= await booking());
        token = await getToken();
        bookingBody = createBooking();
    });

    describe('Happy Path', ()=>{
     
        it('Should update all fields of a booking', async ()=>{
                
                await request(process.env.BASE_URL)
                .patch(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .send(bookingBody)
                .expect(200)
    
               const response = await getBooking(bookingId);                
               expect(response.body).to.be.deep.equal(bookingBody)
            });
    });

    describe('Headers Validation',()=>{
         it('Should not accept  application/html', async ()=>{
                     // BUG: Returns 500 instead of 400
                    const response = await request(process.env.BASE_URL)
                    .patch(`/booking/${bookingId}`)
                    .set('Accept', 'application/html')
                    .set('Cookie', `token=${token}`)
                    .send(bookingBody)
                            
                    expect(response.status).to.equal(418);
                    expect(response.text).to.be.equal("I'm a Teapot");
                });
        
                it('Should return header application/json; charset=utf-8', async ()=>{
                    const response = await request(process.env.BASE_URL)
                    .put(`/booking/${bookingId}`)
                    .set('Accept', 'application/json')
                    .set('Cookie', `token=${token}`)
                    .send(bookingBody)
                    .expect(200)
        
                    expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        
                });
    });

    describe('Partially Updating',async ()=>
    {

                it('Should update only booking dates', async()=>{
                    const bookingBody = {
                    
                    bookingdates:{
                        checkin: "2014-10-10",
                        checkout: "2014-10-12"
                    }
                    
                }
                        await request(process.env.BASE_URL)
                        .patch(`/booking/${bookingId}`)
                        .set('Accept', 'application/json')
                        .set('Cookie', `token=${token}`)
                        .send(bookingBody)
                        .expect(200)
                
                        
                    const response = await getBooking(bookingId);                
                    expect(response.body.bookingdates).to.be.deep.equal(bookingBody.bookingdates)
                })
    })

    describe('Invalid Data Types', ()=>{

    });

    describe('Business Rules', ()=>{

    });

    describe('Invalid Booking ID', ()=>{

    });

    describe('Special Characters', ()=>{

    });

    describe('Security Tests', ()=>{

    });
    
    describe('Idempotency',()=>{

    })
    
})