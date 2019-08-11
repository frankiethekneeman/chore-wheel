import {UnaryTest, BinaryTest, TernaryTest} from "../generation/Test";
import {integer, randomString} from "../generation/Input";

import {Validator} from "../../../src/utilities/validation/validation.d";

import validate from "../../../src/utilities/validation";

const runs = 100;

function safeValidator<T>(): Validator<T> {
    return (): void => {};
}

function safeValidatorSpy<T>(): Validator<T> {
    return jest.fn(safeValidator());
}

function failValidator<T>(message: string): Validator<T> {
    return (): void => { throw message; };
}

describe("validate", (): void => {
    UnaryTest([0], integer(0,100), (passing): void => {
        it(`Passes when ${passing} validators pass`, (): void => {
            const validators: Validator<number>[] =
                [...Array(passing)].map(safeValidator);
            validate(...validators)(passing);
        });
    }, runs);

    BinaryTest([[0, "no-passing"]],
        integer(0,100), randomString(5,10),
        (passing, message): void => {
            it(`throws first failure ([${passing}, '${message}'])`, (): void => {
                const passingValidators: Validator<number>[] =
                    [...Array(passing)].map(safeValidator);
                const failure: Validator<number> = failValidator(message);
                expect((): void => validate(...passingValidators, failure)(passing)).toThrow(message);
            });
        },
        runs
    );

    TernaryTest([],
        integer(0,100), randomString(5,10), integer(1, 100),
        (passing, message, uncalled): void => {
            it(`fails fast ([${passing}, '${message}', ${uncalled}])`, (): void => {

                const passingValidators: Validator<number>[] =
                    [...Array(passing)].map(safeValidator);
                const failure: Validator<number> = failValidator(message); 
                const uncalledValidators: Validator<number>[] =
                    [...Array(uncalled)].map(safeValidatorSpy);

                expect( (): void => {
                    validate(...passingValidators, failure, ...uncalledValidators)(passing);
                }).toThrow(message);

                uncalledValidators.forEach((v): void => { expect(v).not.toHaveBeenCalled(); });
            });
        },
        runs
    );
});
