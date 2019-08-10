import {UnaryTest, BinaryTest, TernaryTest} from '../utilities/generation/Test';
import {integer, nonInteger} from '../utilities/generation/Input';

import {Assigners} from '../../src/assignment'
import {Assigner} from '../../src/assignment/assignment.d'

const runs = 100;

function testAssigner(name: string, assigner: Assigner) {
    describe(`Assigner: ${name}`, () => {
        describe('Tasks argument:', () => {
            UnaryTest([], nonInteger(-1000, 1000), (tasks) => {
                it(`Rejects non-integer task counts (${tasks})`, () => {
                    expect( () => assigner(tasks, 1, 0)).toThrow();
                });
            }, runs);
            UnaryTest([0], integer(-1000, -1), (tasks) => {
                it(`Rejects non-positive task counts (${tasks})`, () => {
                    expect(() => assigner(tasks, 1, 0)).toThrow();
                });
            }, runs);
        });

        describe('Executors argument:', () => {
            UnaryTest([], nonInteger(-1000, 1000), (executors) => {
                it(`Rejects non-integer executor counts (${executors})`, () => {
                    expect( () => assigner(1, executors, 0)).toThrow();
                });
            }, runs);
            UnaryTest([0], integer(-1000, -1), (executors) => {
                it(`Rejects non-positive executor counts (${executors})`, () => {
                    expect(() => assigner(1, executors, 0)).toThrow();
                });
            }, runs);
        });

        describe('Period argument:', () => {
            UnaryTest([], nonInteger(-1000, 1000), (period) => {
                it(`Rejects non-integer period indicators (${period})`, () => {
                    expect( () => assigner(1, 1, period)).toThrow();
                });
            }, runs);
        });

        TernaryTest([[1,1,0], [1,100,0]], integer(1, 1000), integer(1, 1000), integer(-1000, 1000), (tasks, executors, period) =>  {
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

        BinaryTest([], integer(1, 100), integer(1,100), (tasks, executors) => {
            describe(`Is fair across the first 10k periods (${tasks}, ${executors}):`, () => {
                let assigned: number[] = Array(executors).fill(0);
                for (let period: number = 0; period < 10000; period ++) {
                    assigner(tasks, executors, period).forEach(e => assigned[e]++);
                }
                let min: number = Math.min(...assigned);
                let max: number = Math.max(...assigned);
                it("Assigns the most assigned executor no more than 10% more than the least assigned.", () => {
                    expect(max/min).toBeLessThan(1.1);
                });
            });
        }, runs)
    });
}

Object.keys(Assigners).map(name => {
    testAssigner(name, Assigners[name]);
})
