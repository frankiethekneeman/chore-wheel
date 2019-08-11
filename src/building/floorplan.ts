import {Room, Closet, BaseRoom, ClosetType} from "./rooms";
import {Door} from "./doors";
type FloorPlan = {
    [R in BaseRoom]: {
        [D in Door]?: BaseRoom
    }
}

type ClosetPlan = {
    [C in ClosetType]?: {
        [D in Door]?: ClosetType
    }
}

type ClosetExits = {
    [C in ClosetType]?: Set<Door>
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

const closetConnections: ClosetPlan = {
    [ClosetType.SAVE_WAIT]: {
        [Door.SUCCESS]: ClosetType.SAVE_SUCCESS,
        [Door.FAILURE]: ClosetType.SAVE_FAILURE,
    },
};

const closetExits: ClosetExits = {
    [ClosetType.SAVE_SUCCESS]: new Set([Door.ACK]),
    [ClosetType.SAVE_FAILURE]: new Set([Door.ACK]),
};

export default function traverse(currentRoom: Room, door: Door): Room {
    const { baseRoom } = currentRoom;
    if (currentRoom instanceof Closet) {
        const { closetType, baseRoom } = currentRoom;
        if (closetConnections[closetType] && closetConnections[closetType][door]) {
            return new Closet(closetConnections[closetType][door], baseRoom);
        }
        if (closetExits[closetType] && closetExits[closetType].has(door)) {
            return new Room(baseRoom);
        }
    } else if (baseRoomPlan[baseRoom][door]) {
        return new Room(baseRoomPlan[baseRoom][door]);
    }
    throw `Room: ${currentRoom} is not connected to Door: ${door}`;
}
