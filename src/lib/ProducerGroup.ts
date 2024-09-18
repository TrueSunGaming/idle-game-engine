import { derived, get, writable, type Writable, type Readable } from "svelte/store";
import type { Producer } from "./Producer.js";
import { bindProduction } from "./bindProduction.js";

export class ProducerGroup {
    producers: Writable<Producer[]> = writable([]);

    addProducers(...producers: Producer[]): void {
        this.producers.set([...get(this.producers), ...producers]);
    }

    get rates(): Readable<Readable<number>[]> {
        return derived(this.producers, (p) => p.map((v) => v.totalRate));
    }

    get totalRate(): Readable<number> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return derived([this.rates, ...get(this.rates)], ([_, ...r]) => r.reduce((t, v) => t + v, 0));
    }

    bind(result: Writable<number>): number {
        return bindProduction(result, this.totalRate);
    }
}