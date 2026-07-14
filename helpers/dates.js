const {addDays, format} = require('date-fns')

    function setDaysToCurrentDate(days){
    const date = addDays(new Date(), days);
    return format(date, 'yyyy-MM-dd')
}
module.exports={setDaysToCurrentDate}