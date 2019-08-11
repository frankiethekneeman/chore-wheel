import {Generator} from "./generation.d";

export function UnaryTest<T>(known: T[],
    generator: Generator<T>,
    test: (input: T) => void,
    count: number
): void {
    known.forEach(test);
    for (let i = 0; i < count; i++) {
        test(generator());
    }
}

export function BinaryTest<T1, T2>(known: [T1, T2][],
    g1: Generator<T1>, g2: Generator<T2>,
    test: (i1: T1, i2: T2) => void,
    count: number
): void {
    known.forEach((inputs): void => test(...inputs));
    for (let i = 0; i < count; i++) {
        test(g1(), g2());
    }
}

export function TernaryTest<T1, T2, T3>(known: [T1, T2, T3][],
    g1: Generator<T1>, g2: Generator<T2>, g3: Generator<T3>,
    test: (i1: T1, i2: T2, i3: T3) => void,
    count: number
): void {
    known.forEach((inputs): void => test(...inputs));
    for (let i = 0; i < count; i++) {
        test(g1(), g2(), g3());
    }
}
