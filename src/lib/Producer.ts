import type { Readable } from "svelte/store";

export class Producer {
    rate: Readable<number>;

    constructor(rate: Readable<number>) {
        this.rate = rate;
    }
}