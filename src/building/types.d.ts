import {BaseRoom, ClosetType} from "./rooms";
import {Door} from "./doors";

export type FloorPlan = {
    [R in BaseRoom]: {
        [D in Door]?: BaseRoom
    }
}

export type ClosetListing = {
    [R in BaseRoom]: {
        [D in Door]?: ClosetType
    }
}

export type ClosetPlan = {
    [C in ClosetType]?: {
        [D in Door]?: ClosetType
    }
}

export type ClosetExits = {
    [C in ClosetType]?: Set<Door>
}
