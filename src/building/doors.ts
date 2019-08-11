export enum Door {
    // Transition to the CONFIGURE_EXECUTORS state
    TO_EXECUTORS = "TO_EXECUTORS",
    // Transition to the CONFIGURE_TASKS state
    TO_TASKS = "TO_TASKS",
    // TRANSITION to the CONFIGURE_BEHAVIOUR state
    TO_BEHAVIOUR = "TO_BEHAVIOUR",
    // Transition to the SEE_CALENDAR state
    TO_CALENDAR = "TO_CALENDAR",
    // Add an Executor
    ADD_EXECUTOR = "ADD_EXECUTOR",
    // Remove an Executor
    REMOVE_EXECUTOR = "REMOVE_EXECUTOR",
    // Add a task
    ADD_TASK = "ADD_TASK",
    // Remove a task
    REMOVE_TASK = "REMOVE_TASK",
    // TODO: Add a configuration behaviour here, tktk
    // Persist something
    PERSIST = "PERSIST",
    // Acknowledge a message from the system
    ACK = "ACK",
    // Confirm a risky action
    CONFIRM = "CONFIRM",
    // Cancel a risky action
    CANCEL = "CANCEL",
    // System sees success in a Hallway task
    SUCCESS = "SUCCESS",
    // System sees failure in a Hallway task
    FAILURE = "FAILURE",
}
