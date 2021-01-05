export class Position {
    ISIN: string;
    description: string;
    count: number;
    value: number;
    currency: string;
    country: string;
    valor: number;
    emisor: number;

    constructor(ISIN: string, description: string, count: number, value: number, currency: string,
        country: string, valor: number, emisor: number) {
        this.ISIN = ISIN;
        this.description = description;
        this.count = count;
        this.value = value;
        this.currency = currency;
        this.country = country;
        this.valor = valor;
        this.emisor = emisor;
    }
}