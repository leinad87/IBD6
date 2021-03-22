export default class forex {
    default_value: number;
    _value: number | null;

    constructor(default_value: number) {
        this.default_value = default_value;
        this._value = null;
    }

    public setFromString(value: string) {
        if (value.length == 0) this.removeValue()
        else this.value = parseFloat(value)
    }

    public removeValue() {
        this._value = null;
    }

    public set value(v: number) {
        this._value = v;
    }

    public get value(): number {
        if (this._value) { return this._value; }
        else { return this.default_value; }
    }
}