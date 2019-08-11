export type Assigner = (tasks: number, executors: number, period: number) => number[];

export interface AssignerLibrary {
    [key: string]: Assigner;
}
