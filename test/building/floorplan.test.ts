import {Room, Closet, BaseRoom, ClosetType} from "../../src/building/rooms";
import {Door} from "../../src/building/doors";
import {BASE_ROOM_PLAN, CLOSET_CONNECTIONS, CLOSET_EXITS, CLOSET_STARTS, traverse} from "../../src/building/floorplan";
import {oneOf} from "../utilities/generation/Input";

const randomBaseRoom = oneOf(Object.values(Door));

function testBaseContract(room: Room, door: Door): void {
    it(`Either returns a new room, or fails when in Room(${room.name()}), using Door(${door})`,
        (): void => {
            let result: Room;
            try {
                result = traverse(room, door);
            } catch {
                // ?
                return;
            }
            expect(result).not.toBeUndefined();
        }
    );
}
describe("traverse", (): void => {
    Object.values(Door).forEach((door: Door): void => {
        Object.values(BaseRoom).forEach((room: BaseRoom): void => {
            testBaseContract(new Room(room), door);
        });
        Object.values(ClosetType).forEach((closet: ClosetType): void => {
            testBaseContract(new Closet(closet, BaseRoom.SEE_CALENDAR), door);
        });
    });
    
    Object.values(BaseRoom).forEach((start: BaseRoom): void => {
        // this is because TS won't correctly infer the type in the for... in
        let door: Door;
        for (door in BASE_ROOM_PLAN[start]) {
            // this is because I had to use let earlier.
            (function(door): void {
                const finish = BASE_ROOM_PLAN[start][door];
                it(`Starting in ${start} and traveling through ${door} results in ${finish}`, (): void => {
                    const result: Room = traverse(new Room(start), door);
                    expect(result).not.toBeInstanceOf(Closet);
                    expect(result.baseRoom).toEqual(finish);
                });
            })(door);
        }

        for (door in CLOSET_STARTS[start]) {
            (function(door): void {
                const finish = CLOSET_STARTS[start][door];
                it(`Starting in ${start} and traveling through ${door} results in ${finish}`, (): void => {
                    const result: Room = traverse(new Room(start), door);
                    expect(result).toBeInstanceOf(Closet);
                    expect((result as Closet).closetType).toEqual(finish);
                });
                it(`Starting in ${start} and traveling through ${door} results in ${finish}`, (): void => {
                    const result: Room = traverse(new Room(start), door);
                    expect(result.baseRoom).toEqual(start);
                });
            })(door);
        }
    });

    let closet: ClosetType;
    for (closet in CLOSET_CONNECTIONS) {
        let door: Door;
        for (door in CLOSET_CONNECTIONS[closet]) {
            (function(start, door): void {
                const finish = CLOSET_CONNECTIONS[start][door];
                const base = randomBaseRoom();
                it(`Starting in ${start} and traveling through ${door} results in ${finish}`, (): void => {
                    const result: Room = traverse(new Closet(start, base), door);
                    expect(result).toBeInstanceOf(Closet);
                    expect((result as Closet).closetType).toEqual(finish);
                });
                it(`Starting in ${start} and traveling through ${door} remembers the base (${base})`, (): void => {
                    const result: Room = traverse(new Closet(start, base), door);
                    expect(result.baseRoom).toEqual(base);
                });
            })(closet, door);
        }
    }
    //Reusing closet...
    for (closet in CLOSET_EXITS) {
        (function(start): void {
            CLOSET_EXITS[closet].forEach((door): void => {
                const base = randomBaseRoom();
                it(`Starting in ${start} and traveling through ${door} results in return to base (${base})`, (): void => {
                    const result: Room = traverse(new Closet(start, base), door);
                    expect(result).not.toBeInstanceOf(Closet);
                    expect(result.baseRoom).toEqual(base);
                });
            });
        })(closet);
    }
});
