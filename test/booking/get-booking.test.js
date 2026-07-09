const request = require('supertest')
const {expect} = require ('chai')

describe('Booking search',()=> {
    let response;
    beforeEach(()=>{
        
    })
    describe('GET',()=>{
        it('Should return a list of bookings', async ()=>{
                response= await request("https://restful-booker.herokuapp.com")
                .get("/booking")
                .expect(200)
                .expect('Content-Type',/json/)
                console.log(response.body)          
        })
    })
})
