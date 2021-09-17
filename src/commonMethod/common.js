import moment from "moment";
import momentTz from "moment-timezone";

const zone = momentTz.tz.guess();

export const getDateTime = (date) => {
    return moment(date).tz(zone).format("ll hh:mm:ss A");
}

export const getFullDateTime = (date) => {
    return moment(date).tz(zone).format('YYYY-MM-DD[T]HH:mm');
    // return moment(date).tz(zone).format('lll');
}

export const getTime = (time) => {
    return moment(time).tz(zone).format("ll");
}

export const getDateColor = (date, numberOfDays) => {
    const newDate = moment(date).tz(zone);
    const currentDate = moment().tz(zone);
    return newDate.diff(currentDate, 'day') < numberOfDays
}