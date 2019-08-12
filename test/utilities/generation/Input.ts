import {Generator} from "./generation.d";

export function nonInteger(min: number, max: number): Generator<number> {
    return (): number => {
        let toReturn = 1;
        while(Number.isInteger(toReturn)) {
            toReturn = Math.random() * (max - min) + min;
        }
        return toReturn;
    };
}

export function integer(min: number, max: number): Generator<number> {
    return (): number => {
        return Math.floor(Math.random() * (max - min)) + min;
    };
}

export function exactString(length: number): Generator<string> {
    return (): string => {
        let toReturn = "";
        while (toReturn.length < length) {
            // Generate a random number, base36 encode it, then take everything after the decimal
            // and add it to our string
            toReturn += Math.random().toString(36).substring(2);
        }
        return toReturn.substring(0, length);
    };
}

export function randomString(min: number, max: number): Generator<string> {
    const length: Generator<number> = integer(min, max);
    const str: Generator<string> = exactString(max);
    return (): string => {
        return str().substring(0, length());
    };
}

export function oneOf<T>(options: T[]): Generator<T> {
    const idx = integer(0, options.length);
    return (): T => {
        return options[idx()];
    };
}
