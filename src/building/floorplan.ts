import {Room, Hallway, BaseRoom, HallwayType} from "./rooms";
import {Door} from "./doors";
type FloorPlan = {
    [R in BaseRoom]: {
        [D in Door]?: BaseRoom
    }
}

const baseRoomPlan: FloorPlan = {
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

type HallPlan = {
    [C in HallwayType]?: {
        [D in Door]?: HallwayType
    }
}

type HallEnds = {
    [C in HallwayType]?: Set<Door>
}

const hallPlan: HallPlan = {
    [HallwayType.SAVE_WAIT]: {
        [Door.SUCCESS]: HallwayType.SAVE_SUCCESS,
        [Door.FAILURE]: HallwayType.SAVE_FAILURE,
    },
};

const terminals: HallEnds = {
    [HallwayType.SAVE_SUCCESS]: new Set([Door.ACK]),
    [HallwayType.SAVE_FAILURE]: new Set([Door.ACK]),
};

export default function traverse(currentRoom: Room, door: Door): Room {
    const { baseRoom } = currentRoom;
    if (currentRoom instanceof Hallway) {
        const { hallwayType, baseRoom } = currentRoom;
        if (hallPlan[hallwayType] && hallPlan[hallwayType][door]) {
            return new Hallway(hallPlan[hallwayType][door], baseRoom);
        }
        if (terminals[hallwayType] && terminals[hallwayType].has(door)) {
            return new Room(baseRoom);
        }
        return new Room(baseRoom);
    } else if (baseRoomPlan[baseRoom][door]) {
        return new Room(baseRoomPlan[baseRoom][door]);
    }
    throw `Room: ${currentRoom} is not connected to Door: ${door}`;
}
