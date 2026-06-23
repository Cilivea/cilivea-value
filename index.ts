export type UUID = string;
export type Primitive = string | number | boolean;

export type MetaType = { [key: string]: string | MetaType };

type WidenLiteral<T> = T extends number
    ? number
    : T extends string
      ? string
      : T extends boolean
        ? boolean
        : T;

export interface TypeRegistry {
    primitive: Primitive;
    "primitive[]": Primitive[];
    complex: { [key: string]: UUID };
}

export type TypeName = keyof TypeRegistry;
export type ValueType = TypeRegistry[TypeName];
export type ResolveType<K extends TypeName> = TypeRegistry[K];

export function serialize<K extends TypeName>(value: TypeRegistry[K]): string {
    return JSON.stringify(value);
}

export function deserialize<T extends ValueType>(string: string): T {
    return JSON.parse(string);
}

export function get_type_name<K extends TypeName>(name: K): K {
    return name;
}

export class Value<T extends ValueType> {
    private _value: WidenLiteral<T>;
    public get value(): WidenLiteral<T> {
        return this._value;
    }
    public set value(v: WidenLiteral<T>) {
        this._value = v;
    }

    constructor(value: T) {
        this._value = value as WidenLiteral<T>;
    }

    static serialize(value: ValueType): string {
        return JSON.stringify(value);
    }

    serialize(): string {
        return JSON.stringify(this.value);
    }

    static deserialize<P extends ValueType>(string: string): P {
        return JSON.parse(string);
    }

    static from_string<P extends ValueType>(string: string): Value<P> {
        return new Value(Value.deserialize(string));
    }
}

export class Block<T extends ValueType> {
    uuid: UUID;
    value: Value<T>;
    meta: MetaType;
    has_meta: boolean;

    constructor(uuid: UUID, value: Value<T>, meta?: MetaType) {
        this.uuid = uuid;
        this.value = value;
        if (meta === undefined) {
            this.meta = {};
            this.has_meta = false;
        } else {
            this.meta = meta;
            this.has_meta = true;
        }
    }
}
