import {UnaryTest, BinaryTest, TernaryTest} from '../generation/Test';
import {integer, randomString} from '../generation/Input';

import {Validator} from '../../../src/utilities/validation/validation.d';

import validate from '../../../src/utilities/validation';

const runs = 100;

describe('validate', () => {
    UnaryTest([0], integer(0,100), (passing) => {
        it(`Passes when ${passing} validators pass`, () => {
            let validators: Validator<any>[] = [...Array(passing)].map(() => (_: any) => {});
            validate(...validators)(passing);
        });
    }, runs)

    BinaryTest([[0, "no-passing"]], integer(0,100), randomString(5,10), (passing, message) => {
        it(`throws first failure ([${passing}, '${message}'])`, () => {
            let passingValidators: Validator<any>[] = [...Array(passing)].map(() => (_: any) => {});
            let failure: Validator<any> = (_: any) => { throw message };
            expect(() => validate(...passingValidators, failure)(message)).toThrow(message);
        });
    }, runs);

    TernaryTest([], integer(0,100), randomString(5,10), integer(1, 100), (passing, message, uncalled) => {
        it(`fails fast ([${passing}, '${message}', ${uncalled}])`, () => {

            let passingValidators: Validator<any>[] =
                [...Array(passing)].map(() => (_: any) => {});
            let failure: Validator<any> = (_: any) => { throw message };
            let uncalledValidators: Validator<any>[] =
                [...Array(uncalled)].map(() => jest.fn((_: any) => {}));

            expect(() => validate(...passingValidators, failure, ...uncalledValidators)(message)).toThrow(message);
            uncalledValidators.forEach(v => expect(v).not.toHaveBeenCalled());
        });
    }, runs);
})
