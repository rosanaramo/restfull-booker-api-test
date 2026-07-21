
require('dotenv').config()
const request = require('supertest');

const getToken = async () =>{

    const response = await request(process.env.BASE_URL)
                    .post('/auth')
                    .set('Accept','application/json')
                    .send(
                        {
                            username: process.env.USERNAME,
                            password: process.env.PASSWORD
                        }
                    )
        
    return response.body.token                      
}
 module.exports = {
        getToken
}