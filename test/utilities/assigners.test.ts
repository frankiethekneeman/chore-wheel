
import {Assigner, Assigners} from '../../src/utilities/assigners'

const runs = 100;

function testAssigner(name: string, assigner: Assigner) {
    describe(`Assigner: ${name}`, () => {
        describe('Tasks argument:', () => {
            generateInputs([], nonInteger(-1000, 1000), (tasks) => {
                it(`Rejects non-integer task counts (${tasks})`, () => {
                    expect( () => assigner(tasks, 1, 0)).toThrow();
                });
            }, runs);
            generateInputs([0], integer(-1000, -1), (tasks) => {
                it(`Rejects non-positive task counts (${tasks})`, () => {
                    expect(() => assigner(tasks, 1, 0)).toThrow();
                });
            }, runs);
        });
        describe('Executors argument:', () => {
            generateInputs([], nonInteger(-1000, 1000), (executors) => {
                it(`Rejects non-integer executor counts (${executors})`, () => {
                    expect( () => assigner(1, executors, 0)).toThrow();
                });
            }, runs);
            generateInputs([0], integer(-1000, -1), (executors) => {
                it(`Rejects non-positive executor counts (${executors})`, () => {
                    expect(() => assigner(1, executors, 0)).toThrow();
                });
            }, runs);
        });
        describe('Period argument:', () => {
            generateInputs([], nonInteger(-1000, 1000), (period) => {
                it(`Rejects non-integer period indicators (${period})`, () => {
                    expect( () => assigner(1, 1, period)).toThrow();
                });
            }, runs);
        });
        generateTripleInputs([[1,1,0], [1,100,0]], integer(1, 1000), integer(1, 1000), integer(-1000, 1000), (tasks, executors, period) =>  {
            describe(`With inputs (${tasks}, ${executors}, ${period}):`, () => {
                let result: number[] = assigner(tasks, executors, period);
                it("Assigns every task", () => {
                    expect(result.length).toEqual(tasks);
                });
                it("Uses only valid executors", () => {
                    /**
                     *  Why am I not using forEach?  Because, dear reader, it is possible to create
                     *  an array of length `N` in javascript which calls the callback 0 times!
                     */
                    for (let i: number = 0; i< result.length; i++) {
                        let executor: number = result[i];
                        expect(executor).not.toBeUndefined();
                        expect(executor).toBeLessThan(executors);
                    }
                });
                it("Is Deterministic", () => {
                    for (let i: number = 0; i <= runs; i++) {
                        expect(assigner(tasks, executors, period)).toEqual(result);
                    }
                });
                if (executors > 1) {
                    it("Does not match the preceding period", () => {
                        expect(assigner(tasks, executors, period - 1)).not.toEqual(result);
                    });
                    it("Does not match the subsequent period", () => {
                        expect(assigner(tasks, executors, period + 1)).not.toEqual(result);
                    });
                }
            });
        }, runs);
        generateDoubleInputs([], integer(1, 100), integer(1,100), (tasks, executors) => {
            describe(`Is fair across the first 10k periods (${tasks}, ${executors}):`, () => {
                let assigned: number[] = Array(executors).fill(0);
                for (let period: number = 0; period < 10000; period ++) {
                    assigner(tasks, executors, period).forEach(e => assigned[e]++);
                }
                let min: number = Math.min(...assigned);
                let max: number = Math.max(...assigned);
                it("Assigns the most responsible person no more than 10% more than the least assigned.", () => {
                    expect(max/min).toBeLessThan(1.1);
                });
            });
        }, runs)
    });
}

Object.keys(Assigners).map(name => {
    testAssigner(name, Assigners[name]);
})

// TODO: Move these test utilities to their own file.
//function compareArrays<T>(left: T[], right: T[]) {
//    if (left.length != right.length) return false;
//    for (i: number = 0; i < 
//}
function generateInputs<T>(knownCases: T[], generator: () => T, test: (input: T) => void, count: number): void {
    knownCases.forEach(test);
    for (let i: number = 0; i < count; i++) {
        test(generator());
    }
}

function generateDoubleInputs<T1, T2>(known: [T1, T2][],
    g1: () => T1, g2: () => T2,
    test: (i1: T1, i2: T2) => void,
    count: number
): void {
    known.forEach(inputs => test(...inputs));
    for (let i: number = 0; i < count; i++) {
        test(g1(), g2());
    }
}

function generateTripleInputs<T1, T2, T3>(known: [T1, T2, T3][],
    g1: () => T1, g2: () => T2, g3: () => T3,
    test: (i1: T1, i2: T2, i3: T3) => void,
    count: number
): void {
    known.forEach(inputs => test(...inputs));
    for (let i: number = 0; i < count; i++) {
        test(g1(), g2(), g3());
    }
}

function nonInteger(min: number, max: number): () => number {
    return () => {
        let toReturn: number = 1;
        while(Number.isInteger(toReturn)) {
            toReturn = Math.random() * (max - min) + min;
        }
        return toReturn;
    }
}

function integer(min: number, max: number): () => number {
    return () => {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
