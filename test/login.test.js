const request = require('supertest');
const {expect} = require ('chai')
const {getToken} = require('../helpers/authentication')


describe('Login',() =>{
    describe('Post /auth',()=>{
        let token
        beforeEach( () =>{
        token = getToken("admin","password123")
    })
        it('Should create a token',async ()=>{
                
                console.log("Token:",token)
        })
    })
})