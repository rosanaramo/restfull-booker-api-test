require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const booking = require('../../fixtures/booking.json')
const {getBooking} = require('../../helpers/addBooking')
const {createBooking} = require('../factories/bookingFactory')

/* TODO:
--> create a method to dinamic dates
--> create a helper to create text with especial characters
--> use a faker or something
*/
describe('POST/ booking', ()=> {

    describe('Happy path', () => {
        it('Should return 200 when a booking is registered', async () => {

            const bookingBody= createBooking({
                firstName: 'Marcio Roberto'
            })

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
    })

    describe('Invalid data types',() => {
          //bug --> returns server error instead of 400
        it('Should return 400 when the firstname is a null value', async ()=>{
            const bookingBody = structuredClone(booking)
            bookingBody.firstname = null

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(400)
        });

        it('Should return 400 when the checkin is not a valid date format', async ()=>{
            // bug --> returns 200 to invalid date format
            const bookingBody = structuredClone(booking)
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
            const bookingBody = structuredClone(booking)
            bookingBody.checkout = "3456/00/00"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(400)

        })

        it('Should return 400 when depositpaid is not a boolean value ', async () => {
            // bug --> api accepts boolean value as string
            const bookingBody = structuredClone(booking)
            bookingBody.depositpaid = "true"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(400)
        });
    })

    describe('Business rules', ()=> {

         it('Should allow register a booking with total price equals 0',async ()=> {
            const bookingBody = structuredClone(booking)
            bookingBody.totalprice= 0

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(200)
        });

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
      
    describe('Special characters', ()=> {

        it('Should allow special characters in field firstname',async ()=> {
            const bookingBody = structuredClone(booking)
            bookingBody.firstname = "José Catalãn Vaçe"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(200)
        });

        it('Should allow special characters in field lastname', async ()=> {

            const bookingBody = structuredClone(booking)
            bookingBody.lastName = "José Catalãn Vaçe";

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(200)
        });

        it('Should accept special characters in the field additionalneeds', async()=>{
            // add helper to create special characters here

            const bookingBody = structuredClone(booking)
            bookingBody.additionalneeds = "insert here helper"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(200)
        });
    })

    describe('Security tests',()=>{
        it('Should reject HTML scprit',async ()=>{
            // bug --> it accepts html scripts
            const bookingBody = structuredClone(booking)
            bookingBody.firstname = "<script>alert(1)</script>"

            const response = await request(process.env.BASE_URL)
            .post('/booking')
            .set('Accept', 'application/json')
            .send(bookingBody)
            .expect(400)
        });
    })
})