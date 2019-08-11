export enum BaseState {
    //In this state, you can see and add to the list of executors
    CONFIGURE_EXECUTORS,
    //In this state, you can see and add to the list of tasks
    CONFIGURE_TASKS,
    //In this state, you can see and change the currently configured behaviour, such as:
    // Period Length
    // Start of First Period
    // Assignment Function
    CONFIGURE_BEHAVIOUR,
    //In this state, you can browse future and past assignment states.
    SEE_CALENDAR,
}

export enum TransientStateType {
    //This is a transient state, to freeze the UI while state is persisted to the store
    SAVE_WAIT,
    //In this state, you see persistence success
    SAVE_SUCCESS,
    //In this state, you see persistence failure
    SAVE_FAIL
}

export class TransientState {
    public stateType: TransientStateType;
    public baseState: BaseState;
    public constructor(stateType: TransientStateType, baseState: BaseState) {
        this.stateType = stateType;
        this.baseState = baseState;
        //Do nothing, this is a data container
    }
}

export type State = BaseState | TransientState
