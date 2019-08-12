import {Room, Closet, BaseRoom, ClosetType} from "./rooms";
import {Door} from "./doors";

import {FloorPlan, ClosetPlan, ClosetExits, ClosetListing} from "./types.d";

export const BASE_ROOM_PLAN: FloorPlan = {
    [BaseRoom.CONFIGURE_EXECUTORS]: {
        [Door.TO_EXECUTORS]: BaseRoom.CONFIGURE_EXECUTORS,
        [Door.TO_TASKS]: BaseRoom.CONFIGURE_TASKS,
        [Door.TO_BEHAVIOUR]: BaseRoom.CONFIGURE_BEHAVIOUR,
        [Door.TO_CALENDAR]: BaseRoom.SEE_CALENDAR,
        [Door.ADD_EXECUTOR]: BaseRoom.CONFIGURE_EXECUTORS,
        [Door.REMOVE_EXECUTOR]: BaseRoom.CONFIGURE_EXECUTORS,
    },
    [BaseRoom.CONFIGURE_TASKS]: {
        [Door.TO_EXECUTORS]: BaseRoom.CONFIGURE_EXECUTORS,
        [Door.TO_TASKS]: BaseRoom.CONFIGURE_TASKS,
        [Door.TO_BEHAVIOUR]: BaseRoom.CONFIGURE_BEHAVIOUR,
        [Door.TO_CALENDAR]: BaseRoom.SEE_CALENDAR,
        [Door.ADD_TASK]: BaseRoom.CONFIGURE_TASKS,
        [Door.REMOVE_TASK]: BaseRoom.CONFIGURE_TASKS,
    },
    [BaseRoom.CONFIGURE_BEHAVIOUR]: {
        [Door.TO_EXECUTORS]: BaseRoom.CONFIGURE_EXECUTORS,
        [Door.TO_TASKS]: BaseRoom.CONFIGURE_TASKS,
        [Door.TO_BEHAVIOUR]: BaseRoom.CONFIGURE_BEHAVIOUR,
        [Door.TO_CALENDAR]: BaseRoom.SEE_CALENDAR,
    },
    [BaseRoom.SEE_CALENDAR]: {
        [Door.TO_EXECUTORS]: BaseRoom.CONFIGURE_EXECUTORS,
        [Door.TO_TASKS]: BaseRoom.CONFIGURE_TASKS,
        [Door.TO_BEHAVIOUR]: BaseRoom.CONFIGURE_BEHAVIOUR,
        [Door.TO_CALENDAR]: BaseRoom.SEE_CALENDAR,
    },
};

export const CLOSET_CONNECTIONS: ClosetPlan = {
    [ClosetType.SAVE_WAIT]: {
        [Door.SUCCESS]: ClosetType.SAVE_SUCCESS,
        [Door.FAILURE]: ClosetType.SAVE_FAILURE,
    },
};

export const CLOSET_EXITS: ClosetExits = {
    [ClosetType.SAVE_SUCCESS]: new Set([Door.ACK]),
    [ClosetType.SAVE_FAILURE]: new Set([Door.ACK]),
};

export const CLOSET_STARTS: ClosetListing = {
    [BaseRoom.CONFIGURE_EXECUTORS]: {
        [Door.PERSIST]: ClosetType.SAVE_WAIT,
    },
    [BaseRoom.CONFIGURE_TASKS]: {
        [Door.PERSIST]: ClosetType.SAVE_WAIT,
    },
    [BaseRoom.CONFIGURE_BEHAVIOUR]: {
        [Door.PERSIST]: ClosetType.SAVE_WAIT,
    },
    [BaseRoom.SEE_CALENDAR]: {
        [Door.PERSIST]: ClosetType.SAVE_WAIT,
    },
};

export function traverse(currentRoom: Room, door: Door): Room {
    const { baseRoom } = currentRoom;
    if (currentRoom instanceof Closet) {
        const { closetType } = currentRoom;
        if (CLOSET_CONNECTIONS[closetType] && CLOSET_CONNECTIONS[closetType][door]) {
            return new Closet(CLOSET_CONNECTIONS[closetType][door], baseRoom);
        }
        if (CLOSET_EXITS[closetType] && CLOSET_EXITS[closetType].has(door)) {
            return new Room(baseRoom);
        }
    } else if (CLOSET_STARTS[baseRoom][door]) {
        const target: ClosetType = CLOSET_STARTS[baseRoom][door];
        return new Closet(target, baseRoom);
    } else if (BASE_ROOM_PLAN[baseRoom][door]) {
        const target: BaseRoom = BASE_ROOM_PLAN[baseRoom][door];
        return new Room(target);
    }
    throw `Room: ${currentRoom.name()} is not connected to Door: ${door}`;
}
