const test = require('node:test');
const assert = require('node:assert/strict');
const { getBookingDates } = require('../utils/bookingDates');
const BookedNight = require('../models/bookedNight');

const fixedNow = new Date('2026-01-10T12:00:00.000Z');

test('creates one UTC date for each night and excludes checkout', () => {
    const result = getBookingDates('2026-01-10', '2026-01-13', fixedNow);

    assert.equal(result.error, undefined);
    assert.equal(result.nights, 3);
    assert.deepEqual(
        result.nightDates.map((date) => date.toISOString()),
        [
            '2026-01-10T00:00:00.000Z',
            '2026-01-11T00:00:00.000Z',
            '2026-01-12T00:00:00.000Z',
        ]
    );
});

test('rejects invalid calendar dates and non-positive stays', () => {
    assert.match(getBookingDates('2026-02-30', '2026-03-02', fixedNow).error, /valid/);
    assert.match(getBookingDates('2026-01-11', '2026-01-11', fixedNow).error, /after check-in/);
    assert.match(getBookingDates('2026-01-11', '2026-01-10', fixedNow).error, /after check-in/);
});

test('rejects past check-in dates and stays longer than one year', () => {
    assert.match(getBookingDates('2026-01-09', '2026-01-11', fixedNow).error, /past/);
    assert.match(getBookingDates('2026-01-10', '2027-01-11', fixedNow).error, /cannot exceed/);
});

test('enforces one reservation document per listing and night', () => {
    const nightlyIndex = BookedNight.schema.indexes().find(([fields, options]) =>
        fields.listing === 1 && fields.date === 1 && options.unique
    );

    assert.ok(nightlyIndex);
});
