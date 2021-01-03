export class Position {
    ISIN: string;
    description: string;
    count: number;
    value: number;
    currency: string;

    constructor(ISIN: string, description: string, count: number, value: number, currency: string) {
        this.ISIN = ISIN;
        this.description = description;
        this.count = count;
        this.value = value;
        this.currency = currency;
    }
}