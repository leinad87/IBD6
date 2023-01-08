export class Position {
    ISIN: string;
    description: string;
    count: number;
    value: number;
    currency: string;
    country: string;
    valor: number;
    emisor: number;
    broker_country: string;

    constructor(ISIN: string, description: string, count: number, value: number, currency: string,
        country: string, valor: number, emisor: number, broker_country: string) {
        this.ISIN = ISIN;
        this.description = description;
        this.count = count;
        this.value = value;
        this.currency = currency;
        this.country = country;
        this.valor = valor;
        this.emisor = emisor;
        this.broker_country = broker_country;
    }

    split(count: number): Position[] {
        if (count === 1) {
            return [this]
        }

        var shares: number[] = Array.from({ length: count }, (_, i) => 0);

        // Start in a random position to avoid first holder has more stocks
        var idx = Math.floor(Math.random() * count)
        var aux = this.count;
        // Share stocks between holders
        while (aux > 0) {
            shares[idx] = shares[idx] + 1
            aux = aux - 1
            idx = (idx + 1) % count
        }

        // Create new positions
        return shares.map((shares_count) => {
            return new Position(
                this.ISIN,
                this.description,
                shares_count,
                (this.value / this.count) * shares_count,
                this.currency,
                this.country,
                this.valor,
                this.emisor,
                this.broker_country
            )
        })
    }
}