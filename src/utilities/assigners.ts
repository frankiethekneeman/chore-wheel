//TODO: This ought not be a utility - it's core to the project
export type Assigner = (tasks: number, executors: number, period: number) => number[];

export interface AssignerLibrary {
    [key: string]: Assigner
}

let Assigners: AssignerLibrary = {
    dealerChip: (tasks, executors, period) => {
        validate(positive, integer)(tasks);
        validate(positive, integer)(executors);
        validate(integer)(period);
        return [...Array(tasks)]
            .map((value, index) => (((index - period) % executors) + executors) % executors);
    }
}

//TODO: Move these validatos to their own library.
type Validator<T> = (input: T) => void;

let positive: Validator<number> = (input) => {
    if (input <= 0) throw `Expected a postitive number but found: ${input}`;
};

let integer: Validator<number> = (input) => {
    if (!Number.isInteger(input)) throw `Expected an integer but found: ${input}`;
}

function validate<T>(...validators: Validator<T>[]): Validator<T> {
    return (input) => {
        validators.forEach((v) => v(input));
    }
}

export { Assigners };
