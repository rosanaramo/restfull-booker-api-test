require('dotenv').config()
const request = require('supertest')
const {expect} = require('chai')
const {getToken} = require('../../helpers/authentication.js')
const {getBooking} = require('../../helpers/getBooking.js');
const {booking} = require('../../helpers/addBooking.js')

describe('DELETE /booking', ()=>{
let bookingId;
let token; 
    beforeEach( async ()=>{
        ({bookingId}= await booking());
        token = await getToken();
    })

    describe('Authorization', () =>
    {
        it('Should return 403 when token is invalid',async ()=>{
                    
            const response = await request(process.env.BASE_URL)
            .delete(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=9888invalid`)
            .expect(403)

            expect(response.text).to.be.equal('Forbidden')
        })

        it('Should return 403 when token is missing',async ()=>{
                    
            const response = await request(process.env.BASE_URL)
            .delete(`/booking/${bookingId}`)
            .set('Accept', 'application/json')
            .expect(403)

            expect(response.text).to.be.equal('Forbidden')
        })
    });

    describe('Happy Path', ()=>
    {
        it('Should delete a booking successfully', async()=>{

            // Note:
            // According to the current Restful Booker API behavior,
            // DELETE returns HTTP 201 Created instead of the more common
            // 200 OK or 204 No Content.

                await request(process.env.BASE_URL)
                .delete(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .expect(201)
    
                const persistedBooking = await getBooking(bookingId);                
                expect(persistedBooking.status).to.be.equal(404)
                expect(persistedBooking.text).to.be.equal('Not Found')
        })
    });

    describe('Invalid Booking ID', ()=>
    {
        it('Should return 405 when trying to delete a booking with invalid id', async()=>{

            const response = await request(process.env.BASE_URL)
            .delete(`/booking/87667899`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .expect(405)
            
            expect(response.text).to.be.equal('Method Not Allowed')
        })

        it('Should return 405 when trying to delete a booking with id equal to 0', async()=>{

            const response = await request(process.env.BASE_URL)
            .delete(`/booking/0`)
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .expect(405)
            
            expect(response.text).to.be.equal('Method Not Allowed')
        })
    });

    describe('Idempotency', ()=>
    {
        it('Should be idempotent when deleting a booking', async  ()=>{

            await request(process.env.BASE_URL)
                .delete(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .expect(201)
            
            const response = await request(process.env.BASE_URL)
                .delete(`/booking/${bookingId}`)
                .set('Accept', 'application/json')
                .set('Cookie', `token=${token}`)
                .expect(405)
            expect(response.text).to.be.equal('Method Not Allowed')
           
            const persistedBooking = await getBooking(bookingId);                
            expect(persistedBooking.status).to.be.equal(404)
            expect(persistedBooking.text).to.be.equal('Not Found')
         })
    });
})