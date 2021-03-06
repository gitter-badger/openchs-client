import {assert} from 'chai';
import Duration from "../src/Duration";

describe('DurationTest', () => {
    it('Duration Value', () => {
        assert.equal(new Duration(null, Duration.Year).durationValueAsString, '');
        assert.equal(new Duration('1', Duration.Year).durationValueAsString, '1');
    });

    it('toString', () => {
        assert.equal(new Duration(2, Duration.Year).toString(), '2 years');
        assert.equal(new Duration(3, Duration.Month).toString(), '3 months');
    });

    it('In Years', () => {
        assert.equal(new Duration(2, Duration.Year).inYears, 2);
        assert.equal(new Duration(3, Duration.Month).inYears, 0.25);
    });

    it('fromToday', () => {
        assert.equal(Duration.fromToday(Duration.Month, new Date(2017, 3, 1), new Date(2017, 5, 7)).durationValue, 2);
        assert.equal(Duration.fromToday(Duration.Week, new Date(2017, 3, 1), new Date(2017, 5, 7)).durationValue, 9);
    });

    it('basedOnToday', () => {
        const duration = Duration.basedOnToday(new Date(2017, 5, 10), Duration.Day, new Date(2017, 5, 13));
        assert.equal(duration.durationValue, 3);
    });
});