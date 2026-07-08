
require('dotenv').config()
const request = require('supertest');
const getToken = async (usuario, senha) =>{
    const response = await request(process.env.BASE_URL)
                    .post('/auth')
                    .set('Content-Type','application/json')
                    .send({
                        "username" : usuario,
                        "password" : senha
                    })
        
    return response.body.token
   
}
 module.exports = {
        getToken
    }