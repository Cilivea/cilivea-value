import { type UUID as cryptoUUID } from "node:crypto"
import { verify_object } from "./type_verifier"

export type UUID = cryptoUUID
export type Primitive = string | number | boolean
export type ValueType = Primitive | Primitive[] | { [key: string]: UUID }

export type Meta = {
    [key: string]: Primitive | Meta
}

export interface BaseBlockInterface {
    uuid: UUID,
    type: string,
    value: any,
    meta: Meta
}

export interface NumericBlockInterface extends BaseBlockInterface {
    value: number
}

export interface NumberBlockInterface extends NumericBlockInterface {
    type: "number",
}

export interface MeasureBlockInterface extends NumericBlockInterface {
    type: "measure",
    unit: string
}

export interface EnumBlockInterface extends NumericBlockInterface {
    type: "enum",
    mappings: { [key: number]: string }
}

export interface StringBlockInterface extends BaseBlockInterface {
    value: string
}

export interface TextBlockInterface extends StringBlockInterface {
    type: "text"
}

export interface UriBlockInterface extends StringBlockInterface {
    MIME: string
    type: "uri"
}

export interface BlobBlockInterface extends BaseBlockInterface {
    value: string
}

export interface Base64BlockInterface extends BlobBlockInterface {
    MIME: string,
    type: "base64"
}

export interface ComplexBlockInterface extends BaseBlockInterface {
    $schema?: string,
    type: "complex",
    value: { [key: string]: string }
}

export class BaseBlock {
    data: BaseBlockInterface
    constructor(data: BaseBlockInterface) {
        this.data = data
    }

    static is_object_valid(v: any): v is BaseBlockInterface {
        return verify_object(v,
            {
                "type": "string", "value": "any", "uuid": "string", "meta": {}
            })
    }

    static from_json(json: string): BaseBlock {
        let obj = JSON.parse(json)
        if (this.is_object_valid(obj)) {
            return new BaseBlock(obj)
        }
        throw new Error()
    }

    to_json(): string {
        return JSON.stringify(this.data)
    }
}

export class NumberBlock extends BaseBlock {
    override data: NumberBlockInterface
    constructor(data: NumberBlockInterface) {
        super(data)
        this.data = data
    }

    static override is_object_valid(v: any): v is NumberBlockInterface {
        return verify_object(v,
            {
                "type": "string", "value": "number", "uuid": "string", "meta": {}
            })
    }

    static override from_json(json: string): NumberBlock {
        let obj = JSON.parse(json)
        if (this.is_object_valid(obj)) {
            return new NumberBlock(obj)
        }
        throw new Error()
    }
}

export class MeasureBlock extends BaseBlock {
    override data: MeasureBlockInterface
    constructor(data: MeasureBlockInterface) {
        super(data)
        this.data = data
    }

    static override is_object_valid(v: any): v is MeasureBlockInterface {
        return verify_object(v,
            {
                "type": "string", "value": "number", "unit": "string", "uuid": "string", "meta": {}
            })
    }

    static override from_json(json: string): MeasureBlock {
        let obj = JSON.parse(json)
        if (this.is_object_valid(obj)) {
            return new MeasureBlock(obj)
        }
        throw new Error()
    }
}


export class EnumBlock extends BaseBlock {
    override data: EnumBlockInterface
    constructor(data: EnumBlockInterface) {
        super(data)
        this.data = data
    }

    static override is_object_valid(v: any): v is EnumBlockInterface {
        return verify_object(v,
            {
                "type": "string", "value": "number", "uuid": "string", "meta": {}, "mappings": {}
            })
    }

    static override from_json(json: string): EnumBlock {
        let obj = JSON.parse(json)
        if (this.is_object_valid(obj)) {
            return new EnumBlock(obj)
        }
        throw new Error()
    }
}

export class TextBlock extends BaseBlock {
    override data: TextBlockInterface
    constructor(data: TextBlockInterface) {
        super(data)
        this.data = data
    }

    static override is_object_valid(v: any): v is TextBlockInterface {
        return verify_object(v,
            {
                "type": "string", "value": "string", "uuid": "string", "meta": {}
            })
    }

    static override from_json(json: string): TextBlock {
        let obj = JSON.parse(json)
        if (this.is_object_valid(obj)) {
            return new TextBlock(obj)
        }
        throw new Error()
    }
}


export class UriBlock extends BaseBlock {
    override data: UriBlockInterface
    constructor(data: UriBlockInterface) {
        super(data)
        this.data = data
    }

    static override is_object_valid(v: any): v is UriBlockInterface {
        return verify_object(v,
            {
                "type": "string", "MIME": "string", "value": "string", "uuid": "string", "meta": {}
            })
    }

    static override from_json(json: string): UriBlock {
        let obj = JSON.parse(json)
        if (this.is_object_valid(obj)) {
            return new UriBlock(obj)
        }
        throw new Error()
    }
}

export class Base64Block extends BaseBlock {
    override data: Base64BlockInterface
    constructor(data: Base64BlockInterface) {
        super(data)
        this.data = data
    }

    static override is_object_valid(v: any): v is Base64BlockInterface {
        return verify_object(v,
            {
                "type": "string", "MIME": "string", "value": "string", "uuid": "string", "meta": {}
            })
    }

    static override from_json(json: string): Base64Block {
        let obj = JSON.parse(json)
        if (this.is_object_valid(obj)) {
            return new Base64Block(obj)
        }
        throw new Error()
    }
}

export class ComplexBlock extends BaseBlock {
    override data: ComplexBlockInterface
    constructor(data: ComplexBlockInterface) {
        super(data)
        this.data = data
    }

    static override is_object_valid(v: any): v is ComplexBlockInterface {
        return verify_object(v,
            {
                "type": "string", "$schema": "string?", "value": {}, "uuid": "string", "meta": {}
            })
    }

    static override from_json(json: string): ComplexBlock {
        let obj = JSON.parse(json)
        if (this.is_object_valid(obj)) {
            return new ComplexBlock(obj)
        }
        throw new Error()
    }
}