
const request = require('supertest');
const {expect} = require ('chai')
describe('Login',() =>{
    describe('Post /login',()=>{
        it('Should return 200 when logging in with valid credentials',async ()=>{
                const response = await request('//restful-booker.herokuapp.com')
                .post('/auth')
                .set('Content-Type','application/json')
                .send({
                    "username" : "admin",
                    "password" : "password123"
                })
                console.log(response.body)
                console.log(response.status)
                expect(response.status).to.equal(200)
                expect(response.body.token).to.be.a('string')
        })
    })
})