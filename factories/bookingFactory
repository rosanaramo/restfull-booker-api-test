const {faker} = require('@faker-js/faker')
const {addDaysToCurrentDate} = require('../helpers/datesHelper')

function createBooking (overrides ={}){
    const booking = {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        totalprice: faker.number.int({min:100, max: 1000}),
        depositpaid: faker.datatype.boolean(),
        bookingdates:{
            checkin: addDaysToCurrentDate(1),
            checkout: addDaysToCurrentDate(5)
        },
        additionalneeds: faker.helpers.arrayElement([
            'Breakfast',
            'Lunch',
            'Dinner',
            'None'
        ])
    };

    return{
        ...booking,
        ...overrides,
        bookingdates:{
            ...booking.bookingdates,
            ...overrides.bookingdates
        }
    };
}

module.exports ={
    createBooking
};