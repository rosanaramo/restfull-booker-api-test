
require('dotenv').config()
const request = require('supertest');
const credentials = require('../fixtures/credentials.json')

const getToken = async (usuario, senha) =>{
    const bodyCredentials= {...credentials}
    const response = await request(process.env.BASE_URL)
                    .post('/auth')
                    .set('Accept','application/json')
                    .send(
                        bodyCredentials
                    )
        
    return response.body.token
   
}
 module.exports = {
        getToken
    }