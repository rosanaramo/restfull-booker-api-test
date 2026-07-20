require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const {booking} = require('../../helpers/addBooking.js')
const {getToken} = require('../../helpers/authentication.js')
const {getBooking} = require('../../helpers/getBooking.js');
const {createBooking} = require('../../factories/bookingFactory.js')
const{addDaysToCurrentDate,subDaysFromCurrentDate} = require('../../helpers/datesHelper.js')

describe('Patch/booking/',()=>{

    let bookingId;
    let bookingBody;
    let token;
    let persistedBooking;

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
                        const response = await request(process.env.BASE_URL)
                        .patch(`/booking/${bookingId}`)
                        .set('Accept', 'application/json')
                        .set('Cookie', `token=${token}`)
                        .send(bookingBody)
                        .expect(200)
                
                        
                    const persistedBooking = await getBooking(bookingId);                
                    expect(persistedBooking.body.bookingdates).to.be.deep.equal(response.body.bookingdates)
                })
    })

    describe('Invalid Data Types', ()=>
        {

                            
        });

    describe('Business Rules', ()=>
        {

                 it('Should allow update a booking with total price equals 0',async ()=> {
                        const bookingBody ={
                            totalprice:0
                        }
            
                        const response = await request(process.env.BASE_URL)
                        .patch(`/booking/${bookingId}`)
                        .set('Accept', 'application/json')
                        .set('Cookie', `token=${token}`)
                        .send(bookingBody)
                        .expect(200)
        
                        const persistedBooking = await getBooking(bookingId);                
                        expect(response.totalprice).to.be.deep.equal(persistedBooking.totalprice);
                    });
            
                    it('Should return 400 when updpating checkout before the checkin', async () =>{
                        // BUG: API allows registering a booking with checkout before the checkin
                        
                        let checkout =subDaysFromCurrentDate(0)
                        let checkin= addDaysToCurrentDate(14);
                        
                        const bookingBody ={
                            bookingdates:{
                                   checkin:`${checkin}`,
                                   checkout: `${checkout}` 
                            }
                        }
            
                        const response = await request (process.env.BASE_URL)
                        .patch(`/booking/${bookingId}`)
                        .set('Accept', 'application/json')
                        .set('Cookie', `token=${token}`)
                        .send(bookingBody)
                        .expect(400)
                    });       

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