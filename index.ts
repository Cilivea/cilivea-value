export type UUID = string
export type Primitive = string | number | boolean
export type ValueType = Primitive | Primitive[] | { [key: string]: UUID }

type WidenLiteral<T> =
    T extends number ? number :
    T extends string ? string :
    T extends boolean ? boolean :
    T

export class Value<T extends ValueType> {
    private _value: WidenLiteral<T>;
    public get value(): WidenLiteral<T> {
        return this._value;
    }
    public set value(v: WidenLiteral<T>) {
        this._value = v;
    }

    constructor(value: T) {
        this._value = value as WidenLiteral<T>
    }

    static serialize(value: ValueType): string {
        return JSON.stringify(value)
    }

    serialize(): string {
        return JSON.stringify(this.value)
    }

    static deserialize<P extends ValueType>(string: string): P {
        return JSON.parse(string)
    }

    static from_string<P extends ValueType>(string: string): Value<P> {
        return new Value(Value.deserialize(string))
    }
}

export type ValueUpdateHandler = (self: ValueType) => void
export class UpdatorValue<T extends ValueType> extends Value<T> {
    value_update_handlers: ValueUpdateHandler[] = []

    on_value_updated(f: ValueUpdateHandler) {
        this.value_update_handlers.push(f)
    }

    update() {
        this.value_update_handlers.forEach(fn => fn(this.value))
    }

    public override get value(): WidenLiteral<T> {
        return super.value;
    }

    public override set value(v: WidenLiteral<T>) {
        super.value = v;
        this.update()
    }
}
