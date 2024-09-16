import { type Writable, type Readable, get } from "svelte/store";
import { setDeltaInterval } from "./setDeltaInterval.js";

export function bindProduction(result: Writable<number>, amount: Readable<number>): number {
    return setDeltaInterval((delta) => result.set(get(result) + get(amount) * delta), 50 / 3);
}