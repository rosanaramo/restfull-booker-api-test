require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const {booking} = require('../../helpers/addBooking.js')
const {getToken} = require('../../helpers/authentication.js')
const {getBooking} = require('../../helpers/getBooking.js');
const {createBooking} = require('../../factories/bookingFactory.js')
const{addDaysToCurrentDate,subDaysFromCurrentDate} = require('../../helpers/datesHelper.js')


describe('DELETE/booking', ()=>{

    beforeEach( async ()=>{
        ({bookingId}= await booking());
        token = await getToken();
        bookingBody = createBooking();
    })

    describe('Authorization', () =>
    {

        it('Should return 403 when token is invalid',async ()=>{
                    
            const response = await request(process.env.BASE_URL)
            .delete(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=9888invalid`)
            .send(bookingBody)
            .expect(403)

            expect(response.text).to.be.equal('Forbidden')
        })

    })
})