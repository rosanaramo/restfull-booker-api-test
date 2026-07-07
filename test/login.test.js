
const request = require('supertest');
const {expect} = require ('chai')
describe('Login',() =>{
    describe('Post /auth',()=>{
        it('Should create a token',async ()=>{
                const response = await request('//restful-booker.herokuapp.com')
                .post('/auth')
                .set('Content-Type','application/json')
                .send({
                    "username" : "admin",
                    "password" : "password123"
                })

                const token = response.body.token
                console.log("Token:",token)
                console.log(response.status)
                expect(response.status).to.equal(200)
                expect(response.body.token).to.be.a('string')
        })
    })
})