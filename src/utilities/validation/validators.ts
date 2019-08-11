import { Validator } from "./validation.d";

let positive: Validator<number> = (input): void => {
    if (input <= 0) throw `Expected a postitive number but found: ${input}`;
};

let integer: Validator<number> = (input): void => {
    if (!Number.isInteger(input)) throw `Expected an integer but found: ${input}`;
};

export {
    positive,
    integer,
};
