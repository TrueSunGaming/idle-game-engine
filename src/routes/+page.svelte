<script lang="ts">
    import { formatNumber } from "$lib/formatNumber.js";
    import { Producer } from "$lib/Producer.js";
    import { ProducerGroup } from "$lib/ProducerGroup.js";
    import { get, readable, writable, type Readable, type Writable } from "svelte/store";

    const money: Writable<number> = writable(100);

    const prod: Producer = new Producer(100, 1.1, money, readable(1000));
    const pg: ProducerGroup = new ProducerGroup();
    pg.addProducers(prod);

    pg.bind(money);

    const cost: Readable<number> = prod.cost;
</script>

{ formatNumber($money, "long") }

<button on:click={ () => prod.buy() }>buy ({ Math.floor($cost).toLocaleString() })</button>