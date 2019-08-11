import {Assigner} from "./assignment.d";
import validate from "../utilities/validation";
import {positive, integer} from "../utilities/validation/validators";

let dealerChip: Assigner = (tasks, executors, period): number[] => {
    validate(positive, integer)(tasks);
    validate(positive, integer)(executors);
    validate(integer)(period);
    return [...Array(tasks)]
        .map((value: number, index: number): number =>
            (((index - period) % executors) + executors) % executors
        );
};

export default dealerChip;
