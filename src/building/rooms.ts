export enum BaseRoom {
    //In this state, you can see and add to the list of executors
    CONFIGURE_EXECUTORS = "CONFIGURE_EXECUTORS",
    //In this state, you can see and add to the list of tasks
    CONFIGURE_TASKS = "CONFIGURE_TASKS",
    //In this state, you can see and change the currently configured behaviour, such as:
    // Period Length
    // Start of First Period
    // Assignment Function
    CONFIGURE_BEHAVIOUR = "CONFIGURE_BEHAVIOUR",
    //In this state, you can browse future and past assignment states.
    SEE_CALENDAR = "SEE_CALENDAR",
}

export enum HallwayType {
    //This is a transient state, to freeze the UI while state is persisted to the store
    SAVE_WAIT = "SAVE_WAIT",
    //In this state, you see persistence success
    SAVE_SUCCESS = "SAVE_SUCCESS",
    //In this state, you see persistence failure
    SAVE_FAILURE = "SAVE_FAILURE",
}

export class Room {
    public baseRoom: BaseRoom;
    public constructor(baseRoom: BaseRoom) {
        this.baseRoom = baseRoom;
    }
}

export class Hallway extends Room {
    public hallwayType: HallwayType;
    public constructor(hallwayType: HallwayType, baseRoom: BaseRoom) {
        super(baseRoom);
        this.hallwayType = hallwayType;
    }
}
