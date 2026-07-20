const {addDays, subDays, format} = require('date-fns')

    
function addDaysToCurrentDate(days){

    const date = addDays(new Date(), days);
    return format(date, 'yyyy-MM-dd');
}

function subDaysFromCurrentDate(days){
    const date = subDays(new Date(),days);
    return format(date, 'yyyy-MM-dd');
}

module.exports= { addDaysToCurrentDate,
    subDaysFromCurrentDate
}