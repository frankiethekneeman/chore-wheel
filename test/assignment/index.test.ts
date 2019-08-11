import {UnaryTest, BinaryTest, TernaryTest} from "../utilities/generation/Test";
import {integer, nonInteger} from "../utilities/generation/Input";

import {Assigners} from "../../src/assignment";
import {Assigner} from "../../src/assignment/assignment.d";

const runs = 100;

function testAssigner(name: string, assigner: Assigner): void {
    describe(`Assigner: ${name}`, (): void => {
        describe("Tasks argument:", (): void => {
            UnaryTest([], nonInteger(-1000, 1000), (tasks): void => {
                it(`Rejects non-integer task counts (${tasks})`, (): void => {
                    expect((): void => { assigner(tasks, 1, 0); }).toThrow();
                });
            }, runs);
            UnaryTest([0], integer(-1000, -1), (tasks): void => {
                it(`Rejects non-positive task counts (${tasks})`, (): void => {
                    expect((): void => { assigner(tasks, 1, 0); }).toThrow();
                });
            }, runs);
        });

        describe("Executors argument:", (): void => {
            UnaryTest([], nonInteger(-1000, 1000), (executors): void => {
                it(`Rejects non-integer executor counts (${executors})`, (): void => {
                    expect((): void => { assigner(1, executors, 0); }).toThrow();
                });
            }, runs);
            UnaryTest([0], integer(-1000, -1), (executors): void => {
                it(`Rejects non-positive executor counts (${executors})`, (): void => {
                    expect((): void => { assigner(1, executors, 0); }).toThrow();
                });
            }, runs);
        });

        describe("Period argument:", (): void => {
            UnaryTest([], nonInteger(-1000, 1000), (period): void => {
                it(`Rejects non-integer period indicators (${period})`, (): void => {
                    expect((): void => { assigner(1, 1, period); }).toThrow();
                });
            }, runs);
        });

        TernaryTest([[1,1,0], [1,100,0]], integer(1, 1000), integer(1, 1000), integer(-1000, 1000), (tasks, executors, period): void =>  {
            describe(`With inputs (${tasks}, ${executors}, ${period}):`, (): void => {
                let result: number[] = assigner(tasks, executors, period);
                it("Assigns every task", (): void => {
                    expect(result.length).toEqual(tasks);
                });
                it("Uses only valid executors", (): void => {
                    /**
                     *  Why am I not using forEach?  Because, dear reader, it is possible to create
                     *  an array of length `N` in javascript which calls the callback 0 times!
                     */
                    for (let i = 0; i< result.length; i++) {
                        let executor: number = result[i];
                        expect(executor).not.toBeUndefined();
                        expect(executor).toBeLessThan(executors);
                    }
                });
                it("Is Deterministic", (): void => {
                    for (let i = 0; i <= runs; i++) {
                        expect(assigner(tasks, executors, period)).toEqual(result);
                    }
                });
                if (executors > 1) {
                    it("Does not match the preceding period", (): void => {
                        expect(assigner(tasks, executors, period - 1)).not.toEqual(result);
                    });
                    it("Does not match the subsequent period", (): void => {
                        expect(assigner(tasks, executors, period + 1)).not.toEqual(result);
                    });
                }
            });
        }, runs);

        BinaryTest([], integer(1, 100), integer(1,100), (tasks, executors): void => {
            describe(`Is fair across the first 10k periods (${tasks}, ${executors}):`, (): void => {
                let assigned: number[] = Array(executors).fill(0);
                for (let period = 0; period < 10000; period ++) {
                    assigner(tasks, executors, period).forEach((e): void => { assigned[e]++; });
                }
                let min: number = Math.min(...assigned);
                let max: number = Math.max(...assigned);
                it("Assigns the most assigned executor no more than 10% more than the least assigned.", (): void => {
                    expect(max/min).toBeLessThan(1.1);
                });
            });
        }, runs);
    });
}

Object.keys(Assigners).forEach((name): void => {
    testAssigner(name, Assigners[name]);
});
