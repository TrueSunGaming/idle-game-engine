import { derived, get, writable, type Readable, type Writable } from "svelte/store";
import { setDeltaInterval } from "./setDeltaInterval.js";

export class Producer {
    rate: Readable<number>;
    count: Writable<number> = writable(0);
    baseCost: number;

    constructor(baseCost: number, rate: Readable<number>) {
        this.rate = rate;
        this.baseCost = baseCost;
    }

    get totalRate(): Readable<number> {
        return derived([this.rate, this.count], ([r, c]) => r * c);
    }

    bind(produced: Writable<number>): number {
        const tr: Readable<number> = this.totalRate;
        return setDeltaInterval((delta) => produced.set(get(produced) + get(tr) * delta), 50 / 3);
    }
}