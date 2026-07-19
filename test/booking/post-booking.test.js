require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const {createBooking} = require('../../factories/bookingFactory')

describe('POST/booking', ()=> {

    let bookingBody;
    beforeEach(()=>{

        bookingBody= createBooking();
    });

    describe('Happy Path', () => {
        it('Should return 200 when a booking is registered', async () => {

            const bookingBody= createBooking();

              const response = await request(process.env.BASE_URL)
              .post('/booking')
              .set('Accept', 'application/json')
              .send(
                    bookingBody
            ).expect(200)
            
            expect(response.body).to.have.property('bookingid')
            expect(response.body.booking).to.deep.equal(bookingBody) 
        });
    })

    describe('Headers Validation', ()=>{

        it('Should not accept  application/html', async ()=>{

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/html')
            .send(bookingBody)
            
            expect(response.status).to.equal(418);
            expect(response.text).to.be.equal("I'm a Teapot");
        })

        it('Should return header content-type application/json; charset=utf-8',async()=>{

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            
            expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
        })
    })

    describe('Invalid Data Types',() => {
          //BUG: API returns 500 server error instead of 400
        it('Should return 400 when the firstname is a null value', async ()=>{
            bookingBody.firstname = null;

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(400)
        });

        it('Should return 400 when the checkin is not a valid date format', async ()=>{
            // bug --> returns 200 to invalid date format
            bookingBody.bookingdates.checkin = "33/098/99"

            const response = await request
            (process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(400)
        });

        it('Should return 400 when the checkout is not a valid date format',  async () =>{
            // bug --> returns 200 instead of 400
            bookingBody.bookingdates.checkout = "3456/00/00"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(400)

        })

        it('Should return 400 when depositpaid is not a boolean value ', async () => {
            // BUG: API accepts boolean value as string
            bookingBody.depositpaid = "true"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(400)
        });
    })

    describe('Business Rules', ()=> {

         it('Should allow registering a booking with total price equals 0',async ()=> {
            bookingBody.totalprice= 0

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(200)
        });

        it('Should return 400 when checkout is before the checkin', async () =>{
            // BUG: API allows registering a booking with checkout before the checkin
            bookingBody.bookingdates.checkin = "2026-10-09";
            bookingBody.bookingdates.checkout = "2026-10-08";

            const response = await request (process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .expect(400)
            .send(bookingBody)
        });
    })
      
    describe('Special Characters', ()=> {

        it('Should allow special characters in field firstname',async ()=> {
            bookingBody.firstname = "José Catalãn Vaçe"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(200)

            expect(response.body.booking.firstname).to.equal(bookingBody.firstname);
        });

        it('Should allow special characters in field lastname', async ()=> {

            bookingBody.lastname = "José Catalãn Vaçe";

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(200)

            expect(response.body.booking.lastname).to.equal(bookingBody.lastname);
        });

        it('Should accept special characters in the field additionalneeds', async()=>{
            // add helper to create special characters here

            bookingBody.additionalneeds = "!@#$%^&*()"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(200)

            expect(response.body.booking.additionalneeds).to.equal(bookingBody.additionalneeds)
        });
    })

    describe('Security Tests',()=>{
        it('Should reject HTML script',async ()=>{
            //BUG: API accepts html scripts and returns 200 instead of return 400
            bookingBody.firstname = "<script>alert(1)</script>"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(400)
        });

        it('Should reject sql injection', async ()=>{
            // BUG: API accepts sql injection and returns 200 instead reject and return 400
            bookingBody.firstname = "'; DROP TABLE booking; --";
            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            
            expect(response.status).to.equal(400)
        })
    })
})