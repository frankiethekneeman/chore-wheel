import {UnaryTest} from "../generation/Test";
import {integer, nonInteger} from "../generation/Input";

import {positive, integer as integerValidator}  from "../../../src/utilities/validation/validators";

const runs = 100;

describe("positive", (): void => {
    it("rejects zero", (): void => {
        expect((): void => positive(0)).toThrow();
    });

    UnaryTest([], integer(1, 1000000), (candidate): void => {
        it(`accepts positive integers (${candidate})`, (): void => {
            positive(candidate); // Throws will fail the test.
        });
    }, runs);

    UnaryTest([], nonInteger(0.01, 1000000), (candidate): void => {
        it(`accepts positive floats (${candidate})`, (): void => {
            positive(candidate); // Throws will fail the test.
        });
    }, runs);

    UnaryTest([], integer(-1000000, 0), (candidate): void => {
        it(`rejects negative integers (${candidate})`, (): void => {
            expect((): void => positive(candidate)).toThrow();
        });
    }, runs);

    UnaryTest([], nonInteger(-1000000, 0), (candidate): void => {
        it(`rejects negative floats (${candidate})`, (): void => {
            expect((): void => positive(candidate)).toThrow();
        });
    }, runs);
});

describe("integer", (): void => {
    UnaryTest([], integer(-1000000, 1000000), (candidate): void => {
        it(`accepts integers (${candidate})`, (): void => {
            integerValidator(candidate); // Throws will fail the test.
        });
    }, runs);

    UnaryTest([], nonInteger(-1000000, 1000000), (candidate): void => {
        it(`rejects floats (${candidate})`, (): void => {
            expect((): void => integerValidator(candidate)).toThrow();
        });
    }, runs);
});
