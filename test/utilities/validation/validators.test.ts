import {UnaryTest} from '../generation/Test';
import {integer, nonInteger} from '../generation/Input';

import {positive, integer as integerValidator}  from '../../../src/utilities/validation/validators';

const runs = 100;

describe('positive', () => {
    it('rejects zero', () => {
        expect(() => positive(0)).toThrow();
    });

    UnaryTest([], integer(1, 1000000), (candidate) => {
        it(`accepts positive integers (${candidate})`, () => {
            positive(candidate); // Throws will fail the test.
        });
    }, runs)

    UnaryTest([], nonInteger(0.01, 1000000), (candidate) => {
        it(`accepts positive floats (${candidate})`, () => {
            positive(candidate); // Throws will fail the test.
        });
    }, runs)

    UnaryTest([], integer(-1000000, 0), (candidate) => {
        it(`rejects negative integers (${candidate})`, () => {
            expect(() => positive(candidate)).toThrow();
        });
    }, runs)

    UnaryTest([], nonInteger(-1000000, 0), (candidate) => {
        it(`rejects negative floats (${candidate})`, () => {
            expect(() => positive(candidate)).toThrow();
        });
    }, runs)
})

describe('integer', () => {
    UnaryTest([], integer(-1000000, 1000000), (candidate) => {
        it(`accepts integers (${candidate})`, () => {
            integerValidator(candidate); // Throws will fail the test.
        });
    }, runs)

    UnaryTest([], nonInteger(-1000000, 1000000), (candidate) => {
        it(`rejects floats (${candidate})`, () => {
            expect(() => integerValidator(candidate)).toThrow();
        });
    }, runs)
})
