import { derived, get, writable, type Readable, type Writable } from "svelte/store";
import { bindProduction } from "./bindProduction.js";

export class Producer {
    rate: Readable<number>;
    count: Writable<number> = writable(0);
    baseCost: number;
    costScaling: number;
    costStore: Writable<number>;

    constructor(baseCost: number, costScaling: number, costStore: Writable<number>, rate: Readable<number>) {
        this.rate = rate;
        this.costStore = costStore;
        this.baseCost = baseCost;
        this.costScaling = costScaling;
    }

    get totalRate(): Readable<number> {
        return derived([this.rate, this.count], ([r, c]) => r * c);
    }

    bind(result: Writable<number>): number {
        return bindProduction(result, this.totalRate);
    }

    get cost(): Readable<number> {
        return derived(this.count, (c) => this.baseCost * this.costScaling ** c);
    }

    get costNow(): number {
        return this.baseCost * this.costScaling ** get(this.count);
    }

    get canBuy(): Readable<boolean> {
        return derived([this.cost, this.costStore], ([c, m]) => m >= c);
    }

    get canBuyNow(): boolean {
        return get(this.costStore) >= this.costNow;
    }

    get maxBuy(): Readable<number> {
        return derived([this.count, this.costStore], ([c, m]) => Math.floor(Math.log(m * (this.costScaling - 1) / this.baseCost + this.costScaling ** c) / Math.log(this.costScaling)));
    }

    get maxBuyNow(): number {
        return Math.floor(Math.log(get(this.costStore) * (this.costScaling - 1) / this.baseCost + this.costScaling ** get(this.count)) / Math.log(this.costScaling));
    }

    static costOf(qty: number, count: number, baseCost: number, costScaling: number): number {
        return (baseCost * costScaling ** count * (costScaling ** qty - 1)) / (costScaling - 1);
    }

    costOfNow(qty: number): number {
        return Producer.costOf(qty, get(this.count), this.baseCost, this.costScaling);
    }

    costOf(qty: number): Readable<number> {
        return derived(this.count, (c) => Producer.costOf(qty, c, this.baseCost, this.costScaling));
    }

    costOfMax(qty = Infinity): Readable<number> {
        return derived([this.count, this.maxBuy], ([c, m]) => Producer.costOf(Math.min(qty, m), c, this.baseCost, this.costScaling));
    }

    costOfMaxNow(qty = Infinity): number {
        return Producer.costOf(Math.min(qty, this.maxBuyNow), get(this.count), this.baseCost, this.costScaling)
    }

    buy(): boolean {
        if (!this.canBuyNow) return false;

        this.costStore.set(get(this.costStore) - this.costNow);
        this.count.set(get(this.count) + 1);

        return true;
    }

    buyMax(amount = Infinity): number {
        const max: number = Math.min(amount, this.maxBuyNow);

        this.costStore.set(get(this.costStore) - this.costOfMaxNow(max));
        this.count.set(get(this.count) + max);

        return max;
    }
}