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
    });

    describe('Happy Path', ()=>
    {
        it('Should delete a booking successfully', async()=>{

                await request(process.env.BASE_URL)
                .delete(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .expect(201)
    
                const persistedBooking = await getBooking(bookingId);                
                expect(persistedBooking.status).to.be.equal(404)
                expect(persistedBooking.text).to.be.equal('Not Found')

            // Note:
            // According to the current Restful Booker API behavior,
            // DELETE returns HTTP 201 Created instead of the more common
            // 200 OK or 204 No Content.
        })
    });

    describe('Invalid Bookind ID', ()=>
    {

    });

    describe('Security', ()=>{

    });

    describe('Idempotency', ()=>{

    });
})