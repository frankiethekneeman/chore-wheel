import {Generator} from './generation.d';

export function nonInteger(min: number, max: number): Generator<number> {
    return () => {
        let toReturn: number = 1;
        while(Number.isInteger(toReturn)) {
            toReturn = Math.random() * (max - min) + min;
        }
        return toReturn;
    };
}

export function integer(min: number, max: number): Generator<number> {
    return () => {
        return Math.floor(Math.random() * (max - min)) + min;
    };
}

export function randomString(min: number, max: number): Generator<string> {
    let length: Generator<number> = integer(min, max);
    let str:Generator<string> = exactString(max);
    return () => {
        return str().substring(0, length());
    };
}

export function exactString(length: number): Generator<string> {
    return () => {
        let toReturn: string = "";
        while (toReturn.length < length) {
            // Generate a random number, base36 encode it, then take everything after the decimal
            // and add it to our string
            toReturn += Math.random().toString(36).substring(2);
        }
        return toReturn.substring(0, length);
    }
}
