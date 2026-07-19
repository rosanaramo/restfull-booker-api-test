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
        const updatedBooking = createBooking();

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

        it('Should return not found when trying to update a nonexistent booking', async ()=>{

            
            const response = await request(process.env.BASE_URL)
            .put('/booking/1')
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send(updatedBooking)
            .expect(200)

        });
    });

    describe('Invalid Data Types', () =>{

    });
    describe('Special Characters', ()=>{

    });

    describe('Security Tests', ()=> {

    })

    describe('Idempotency', ()=>{

        it('Should keep data consistency after same request multiple times',()=>{

        })

    });

});



// testar idempotencia