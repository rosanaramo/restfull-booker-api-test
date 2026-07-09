const request = require('supertest')
const {expect} = require ('chai')
require('dotenv').config()

describe('Booking search',()=> {
    describe('GET',()=>{
        it('Should return a list of bookings', async ()=>{
             response = await request("https://restful-booker.herokuapp.com")
                .get("/booking")
                .expect(200)
                .expect('Content-Type',/json/) 
                
                //chai assertions
                expect(response.body).to.not.be.empty;
                expect(response.body).to.be.an('array')
        })
    })
})
