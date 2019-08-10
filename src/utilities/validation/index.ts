import { Validator } from './validation.d';

export default function validate<T>(...validators: Validator<T>[]): Validator<T> {
    return (input) => {
        validators.forEach((v) => v(input));
    }
}
