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
        });
    });

    describe('Headers Validation', ()=>{

        it('Should return header application/json; charset=utf-8',async()=>{
            
            const {bookingId} = await booking();
            const response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .expect(200)
            
            expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
        });

        it('Should return 418 for invalid Accept header',async ()=>{
            
            const {bookingId} = await booking();
            const response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingId}`)
            .set('Accept', 'application/html')
            
            expect(response.status, 'Status code should be 418').to.be.equal(418);
            expect(response.text).to.be.equal("I'm a Teapot");
        });
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

        it('Should validate data types', async()=>{

            const {bookingBody, bookingId}  = await booking();

            const response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .expect(200)     
            
            expect(response.body.firstname).to.be.a('string');
            expect(response.body.lastname).to.be.a('string');
            expect(response.body.depositpaid).to.be.a('boolean');
            expect(response.body.bookingdates).to.be.a('object');
            expect(response.body.bookingdates.checkin).to.be.a('string');
            expect(response.body.bookingdates.checkin).to.match(/^\d{4}-\d{2}-\d{2}$/);
            expect(response.body.bookingdates.checkout).to.be.a('string');
            expect(response.body.bookingdates.checkout).to.match(/^\d{4}-\d{2}-\d{2}$/);
            expect(response.body.additionalneeds).to.be.a('string');
            expect(response.body.totalprice).to.be.a('number');
        });
    });

    describe('Invalid Parameters', ()=>{

    });

    describe('Business Rules', ()=>{

    });

    describe('Security Tests', () =>{

    });

})
