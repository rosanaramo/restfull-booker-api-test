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

    describe('Authorization', ()=>{
        it('Should return 403 when token is invalid',async ()=>{
            
                const response = await request(process.env.BASE_URL)
                .patch(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=9888invalid`)
                .send(bookingBody)
                .expect(403)

                expect(response.text).to.be.equal('Forbidden')
        })

    })

    describe('Partial updating', ()=>{
     
        it('Should update only the first name of a booking', async ()=>{
                
            const bookingBody ={
                firstname: "Lilian Belle"
            }
                await request(process.env.BASE_URL)
                .patch(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .send(bookingBody)
                .expect(200)
    
               const persistedBooking = await getBooking(bookingId);                
               expect(persistedBooking.body.firstname).to.be.equal(bookingBody.firstname)
            });

        it('Should update only the last name of a booking', async ()=>{
                
            const bookingBody ={
                lastname: "Laís Campos"
            }
                await request(process.env.BASE_URL)
                .patch(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .send(bookingBody)
                .expect(200)
    
               const persistedBooking = await getBooking(bookingId);                
               expect(persistedBooking.body.lastname).to.be.equal(bookingBody.lastname)
            });

        it('Should update only the totalprice of a booking', async ()=>{
                
            const bookingBody ={
                totalprice: 1400
            }
                await request(process.env.BASE_URL)
                .patch(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .send(bookingBody)
                .expect(200)
    
               const persistedBooking = await getBooking(bookingId);                
               expect(persistedBooking.body.totalprice).to.be.equal(bookingBody.totalprice)
            });

        it('Should update only the depositpaid of a booking', async ()=>{
                
            const bookingBody ={
                lastname: "Lilian Belle"
            }
                await request(process.env.BASE_URL)
                .patch(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .send(bookingBody)
                .expect(200)
    
               const persistedBooking = await getBooking(bookingId);                
               expect(persistedBooking.body.lastname).to.be.equal(bookingBody.lastname)
            });

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
                });

        it('Should update only the additionalneeds  of a booking', async ()=>{
                
            const bookingBody ={
                additionalneeds: "Breakfast and A/C"
            }
                await request(process.env.BASE_URL)
                .patch(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .send(bookingBody)
                .expect(200)
    
               const persistedBooking = await getBooking(bookingId);                
               expect(persistedBooking.body.additionalneeds).to.be.equal(bookingBody.additionalneeds)
            });

        it('Should update multiple fields', async ()=>{
                
            const bookingBody ={
                additionalneeds: "Breakfast and A/C",
                firstname: 'Loren',
                totalprice: 909
            }
                await request(process.env.BASE_URL)
                .patch(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .send(bookingBody)
                .expect(200)
    
               const persistedBooking = await getBooking(bookingId);                
               expect(persistedBooking.body.additionalneeds).to.be.equal(bookingBody.additionalneeds)
               expect(persistedBooking.body.firstname).to.be.equal(bookingBody.firstname)
               expect(persistedBooking.body.totalprice).to.be.equal(bookingBody.totalprice)
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
                    .patch(`/booking/${bookingId}`)
                    .set('Accept', 'application/json')
                    .set('Cookie', `token=${token}`)
                    .send(bookingBody)
                    .expect(200)
        
                    expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        
                });
    });

    describe('Invalid Data Types', ()=>
    {
     //BUG: API returns 200 server error instead of 400
        it('Should return 400 when update the firstname with null value', async ()=>{
           
           const bookingBody ={
                firstname: null
            }
            
            const response = await request(process.env.BASE_URL)
            .patch(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send(bookingBody)
            .expect(400)
        
        });
    
        it('Should return 400 when updating checkin with null value', async ()=>{
              //BUG: API returns 200 server error instead of 400
            const bookingBody ={
                            bookingdates:{
                                   checkin:null,
                            }
                        }
    
            const response = await request
            (process.env.BASE_URL)
            .patch(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send(bookingBody)
            .expect(400)
        });
    
        it('Should return 400 when updating checkout with null value',  async () =>{

            // Bug: Returns 200 instead of 400
             const bookingBody ={
                            bookingdates:{
                                  
                                   checkout: null 
                            }
                        }
            
            const response = await request(process.env.BASE_URL)
            .patch(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send(bookingBody)
            .expect(400)
    
        })
    
        it('Should return 400 when update the depositpaid with a non-boolean value ', async () => {
          // Bug: returns 200 instead of 400
            const bookingBody ={
                depositpaid: "123"
            }
    
            const response = await request(process.env.BASE_URL)
            .patch(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send(bookingBody)
            .expect(400)
            });
                            
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
                        expect(persistedBooking.body.totalprice).to.be.deep.equal(bookingBody.totalprice);
                    });
            
                    it('Should return 400 when updating checkout before the checkin', async () =>{
                        // BUG: API allows registering a booking with checkout before the checkin
                        
                        let checkout =subDaysFromCurrentDate(7)
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

                it('Should return 405 when trying to update a nonexistent booking', async ()=>{
        
                    const response = await request(process.env.BASE_URL)
                    .patch('/booking/897089098088')
                    .set('Accept', 'application/json')
                    .set('Cookie', `token=${token}`)
                    .send(bookingBody)
                    .expect(405)
        
                    expect(response.text).to.be.equal('Method Not Allowed')
                    
                });

    });

    describe('Special Characters', ()=>{


        it('Should allow to update bookings with special characters in string fields',async()=>{
                    //Bug: it allows to send checkin and checkout with special characteres and persist 0NaN-aN-aN 
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
                    .patch(`/booking/${bookingId}`)
                    .set('Accept','application/json')
                    .set('Cookie', `token=${token}`)
                    .send(updatedBooking)
                    // .expect(200)
        
                     const persistedBooking = await getBooking(bookingId);                
                     expect(persistedBooking.body).to.be.deep.equal(updatedBooking)
        
                });

    });

    describe('Security Tests', ()=>{

        it('Should reject HTML script',async ()=>{
                            //BUG: API accepts html scripts and returns 200 instead of return 400
                            bookingBody.firstname = "<script>alert(1)</script>"
                
                            const response = await request(process.env.BASE_URL)
                            .patch(`/booking/${bookingId}`)
                            .set('Cookie',`token=${token}`)
                            .set('Accept', 'application/json')
                            .send(bookingBody)
                            .expect(400)
                        });
                
                        it('Should reject sql injection', async ()=>{
                            // BUG: API accepts sql injection and returns 200 instead reject and return 400
                            bookingBody.firstname = "'; DROP TABLE booking; --";
                            const response = await request(process.env.BASE_URL)
                            .patch(`/booking/${bookingId}`)
                            .set('Cookie', `token=${token}`)
                            .set('Accept', 'application/json')
                            .send(bookingBody)
                            .expect(400)
                            
                        })

    });

    describe('Idempotency',()=>{

        it('Should be idempotent when updating a booking', async ()=>{
                    
                        for(let i =0; i<2; i++ ){
                            
                            await request(process.env.BASE_URL)
                            .patch(`/booking/${bookingId}`)
                            .set('Accept', 'application/json')
                            .set('Cookie', `token=${token}`)
                            .send(bookingBody)
                            .expect(200)
                        }
        
                    const response = await getBooking(bookingId);                
                    expect(response.body).to.be.deep.equal(bookingBody)
                });

    })
    
})