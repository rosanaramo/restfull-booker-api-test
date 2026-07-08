
require('dotenv').config()
const request = require('supertest');
const {expect} = require ('chai')
const {getToken} = require('../helpers/authentication')


describe('Login',() =>{
    describe('Post /auth',()=>{
        it('Should create a token',async ()=>{
                const response = await getToken("admin","password123")
                console.log("Token:",response)
        })
    })
})