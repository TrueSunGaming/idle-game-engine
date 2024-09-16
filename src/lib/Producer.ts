import { derived, writable, type Readable, type Writable } from "svelte/store";
import { bindProduction } from "./bindProduction.js";

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

    bind(result: Writable<number>): number {
        return bindProduction(result, this.totalRate);
    }
}