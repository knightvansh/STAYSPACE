const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MAX_STAY_NIGHTS = 365;

function parseCalendarDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
        return null;
    }

    return date;
}

function getBookingDates(checkInValue, checkOutValue, now = new Date()) {
    const checkIn = parseCalendarDate(checkInValue);
    const checkOut = parseCalendarDate(checkOutValue);

    if (!checkIn || !checkOut) {
        return { error: 'Enter valid check-in and check-out dates' };
    }

    const today = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ));
    if (checkIn < today) {
        return { error: 'Check-in cannot be in the past' };
    }

    const nights = (checkOut.getTime() - checkIn.getTime()) / DAY_IN_MS;
    if (!Number.isInteger(nights) || nights < 1) {
        return { error: 'Check-out must be after check-in' };
    }
    if (nights > MAX_STAY_NIGHTS) {
        return { error: `A stay cannot exceed ${MAX_STAY_NIGHTS} nights` };
    }

    const nightDates = Array.from(
        { length: nights },
        (_, index) => new Date(checkIn.getTime() + index * DAY_IN_MS)
    );

    return { checkIn, checkOut, nights, nightDates };
}

module.exports = { getBookingDates };
