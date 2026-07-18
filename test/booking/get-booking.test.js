const request = require('supertest')
const {expect} = require ('chai')
const {booking} = require('../../helpers/addBooking.js')

require('dotenv').config()

describe('GET/booking',()=> {

    let bookingId;
    let bookingBody;

    beforeEach(async()=>{
        ({bookingId, bookingBody} = await booking());
    })
    
    describe('Happy Path',()=>{
        it('Should return a list of bookings', async ()=>{
            const response = await request(process.env.BASE_URL)
                .get("/booking")
                .expect(200)
                .expect('Content-Type',/json/) 
                
                //chai assertions
                expect(response.body).to.be.an('array')
                expect(response.body).to.not.be.empty;
                
        });

        it('Should return a booking by ID', async ()=>{

            const response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .expect(200)     
            
            expect(response.body).to.deep.equal(bookingBody)
        });
    });

    describe('Headers Validation', ()=>{

        it('Should return header application/json; charset=utf-8',async()=>{
            const response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .expect(200)
            
            expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
        });

        it('Should return 418 for invalid Accept header',async ()=>{
        
            const response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingId}`)
            .set('Accept', 'application/html')
            
            expect(response.status, 'Status code should be 418').to.be.equal(418);
            expect(response.text).to.be.equal("I'm a Teapot");
        });
    });

    describe('Response Structure', ()=>{

        it('Should contain expected properties',async ()=>{

            const response = await request(process.env.BASE_URL)
            .get(`/booking/${bookingId}`)
            .set('Accept','application/json')
            .expect(200)

            expect(response.body).to.have.property('firstname');
            expect(response.body).to.have.property('lastname');
            expect(response.body).to.have.property('depositpaid');
            expect(response.body).to.have.property('bookingdates');
            expect(response.body.bookingdates).to.have.property('checkin');
            expect(response.body.bookingdates).to.have.property('checkout');
            expect(response.body).to.have.property('additionalneeds');
            expect(response.body).to.have.property('totalprice');
        });
    });

    describe('Response Data Validation', ()=>{

        it('Should validate data types', async()=>{

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

    describe('Invalid Path Parameters', ()=>{

        it('Should return 404 for nonexisting booking', async()=>{
        
            const response = await request(process.env.BASE_URL)
            .get('/booking/9999')
            .set('Accept', 'application/json')
            .expect(404)   
            
            expect(response.text).to.be.equal('Not Found');
        });

        it("Should return 404 for special characters in booking ID", async()=>{

            const response = await request(process.env.BASE_URL)
            .get('/booking/@@@')
            .set('Accept', 'application/json')
            .expect(404)   
            
            expect(response.text).to.be.equal('Not Found');
        });

         it("Should return 404 for booking ID 0 ", async()=>{

            const response = await request(process.env.BASE_URL)
            .get('/booking/0')
            .set('Accept', 'application/json')
            .expect(404)   
            
            expect(response.text).to.be.equal('Not Found');
        });
    });
})
