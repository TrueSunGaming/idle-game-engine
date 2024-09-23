const start: string[] = [
    "",
    "m",
    "b",
    "tr",
    "quadr",
    "quint",
    "sext",
    "sept",
    "oct",
    "non"
];

const startShort: string[] = [
    "",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "O",
    "N"
]

const ones: string[] = [
    "",
    "un",
    "duo",
    "tre",
    "quattour",
    "quin",
    "se",
    "septe",
    "octo",
    "nove"
];

const onesShort: string[] = [
    "",
    "U",
    "D",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "O",
    "N"
]

const tens: string[] = [
    "",
    "dec",
    "vigint",
    "trigint",
    "quadragint",
    "quinquagint",
    "sexagint",
    "septuagint",
    "octogint",
    "nonagint"
];

const tensShort: string[] = [
    "",
    "De",
    "V",
    "Tr",
    "Qd",
    "Qq",
    "Se",
    "St",
    "Oc",
    "No"
];

const hundreds: string[] = [
    "",
    "cent",
    "ducent",
    "trecent",
    "quadrigent",
    "quingent",
    "sescent",
    "septingent",
    "octingent",
    "nongent"
];

const hundredsShort: string[] = [
    "",
    "C",
    "Dc",
    "Tc",
    "Qag",
    "Qig",
    "Sc",
    "Sg",
    "Og",
    "Ng"
];

const tensTransitions: [string, string][] = [
    ["", ""],
    ["n", ""],
    ["m", "s"],
    ["n", "s"],
    ["n", "s"],
    ["n", "s"],
    ["n", ""],
    ["n", ""],
    ["m", "x"],
    ["", ""],
];

const hundredsTransitions: [string, string][] = [
    ["", ""],
    ["n", "x"],
    ["n", ""],
    ["n", "s"],
    ["n", "s"],
    ["n", "s"],
    ["n", ""],
    ["n", ""],
    ["m", "x"],
    ["", ""],
]

function determineFirstTransition(onesIndex: number, tensIndex: number, hundredsIndex: number): string {
    if (![3, 6, 7, 9].includes(onesIndex)) return "";
    const transitionIndex: number = tensIndex == 0 ? hundredsIndex : tensIndex
    const transitionLookup: [string, string][] = tensIndex == 0 ? hundredsTransitions : tensTransitions;
    const pairIndex: number = onesIndex == 3 || onesIndex == 6 ? 1 : 0;
    const result: string = transitionLookup[transitionIndex][pairIndex];
    if (onesIndex == 3 && result) return "s";
    return "";
}

function determineSecondTransition(tensIndex: number, hundredsIndex: number): string {
    if (tensIndex == 0 || hundredsIndex == 0) return "";

    return tensIndex < 3 ? "i" : "a";
}

export function largeNumberPart(index: number, format: "long" | "short", first: boolean, last: boolean): string {
    if (index < 0 || index >= 1000) return "";
    if (index == 0) return first ? "" : (format == "long" ? "nilli" : "0");

    const s: string[] = format == "long" ? start : startShort;
    if (index < 10) return s[index] + (format == "long" ? "illi" : (last ? "" : "-"));

    const o: string[] = format == "long" ? ones : onesShort;
    const t: string[] = format == "long" ? tens : tensShort;
    const h: string[] = format == "long" ? hundreds : hundredsShort;

    const onesIndex: number = index % 10;
    const tensIndex: number = Math.floor((index % 100) / 10);
    const hundredsIndex: number = Math.floor(index / 100);

    return (
        o[onesIndex]
        + (format == "long" ? determineFirstTransition(onesIndex, tensIndex, hundredsIndex) : "")
        + t[tensIndex]
        + (format == "long" ? determineSecondTransition(tensIndex, hundredsIndex) : "")
        + h[hundredsIndex]
        + (format == "long" ? "illi" : (last ? "" : "-"))
    );
}

export function largeNumberName(index: number, format: "long" | "short"): string {
    if (index < 1 || index == Infinity) return "";

    const indices: number[] = [];

    while (index > 0) {
        indices.unshift(index % 1000);
        index = Math.floor(index / 1000);
    }

    return indices.map((v, i) => largeNumberPart(v, format, i == 0, i == indices.length - 1)).join("") + (format == "long" ? "on" : "");
}