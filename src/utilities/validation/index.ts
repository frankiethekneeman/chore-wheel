import { Validator } from "./validation.d";

export default function validate<T>(...validators: Validator<T>[]): Validator<T> {
    return (input: T): void => {
        validators.forEach((v: Validator<T>): void => v(input));
    };
}
