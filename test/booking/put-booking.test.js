require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const {faker} = require('@faker-js/faker')
const {booking} = require('../../helpers/addBooking.js')


describe('PUT/booking',()=>{

    let bookingBody;
    let bookingId;

    beforeEach(async ()=>{
        ({bookingBody, bookingId} = await booking())
    })

    describe('Happy Path',()=>{
           
        it('Should update a booking', async ()=>{
            
            const response = await request(process.env.BASE_URL)
            .put(`/booking/${bookingId}`)
            .send(bookingBody);


        });
    });

    describe('Headers Validation', ()=> {

    });
    
    describe ('Invalid Booking ID', ()=>{

    });

    describe('Invalid Data Types', () =>{

    });

    describe('Business Rules', () =>{

    });

    describe('Special Characters', ()=>{

    });

    describe('Security Tests', ()=> {

    })

    describe('Idempotency', ()=>{

        it('Should keep data consistency after same request multiple times',(){

        })

    });

});



// testar idempotencia