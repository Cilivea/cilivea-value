import { randomUUIDv5 } from "bun";
import {
    NumberBlock as DumbNumber,
    MeasureBlock as DumbMeasure,
    EnumBlock as DumbEnum,
    TextBlock as DumbText,
    UriBlock as DumbUri,
    Base64Block as DumbBase64,
    ComplexBlock as DumbComplex,
    type UUID
} from "./dumb_blocks";

export class NumberBlock {
    data: DumbNumber
    constructor(uuid: UUID, initial_value: number) {
        this.data = new DumbNumber({ meta: {}, type: "number", uuid: uuid, value: initial_value })
    }


    public get value(): number {
        return this.data.data.value;
    }
    public set value(v: number) {
        this.data.data.value = v;
    }
}

export class MeasureBlock {
    data: DumbMeasure
    constructor(uuid: UUID, initial_value: number, unit: string) {
        this.data = new DumbMeasure({ meta: {}, type: "measure", uuid: uuid, value: initial_value, unit: unit })
    }
}

export class EnumBlock {
    data: DumbEnum
    constructor(uuid: UUID, initial_value: number, mappings: { [key: number]: string }) {
        this.data = new DumbEnum({ meta: {}, type: "enum", uuid: uuid, value: initial_value, mappings: mappings }
        )
    }
}

export class TextBlock {
    data: DumbText
    constructor(uuid: UUID, initial_value: string) {
        this.data = new DumbText({ meta: {}, type: "text", uuid: uuid, value: initial_value })
    }
}

export class UriBlock {
    data: DumbUri
    constructor(uuid: UUID, uri: string, MIME: string) {
        this.data = new DumbUri({ meta: {}, type: "uri", uuid: uuid, value: uri, MIME: MIME })
    }
}

export class Base64Block {
    data: DumbBase64
    constructor(uuid: UUID, value: string, MIME: string) {
        this.data = new DumbBase64({ meta: {}, type: "base64", uuid: uuid, value: value, MIME: MIME })
    }
}

export class ComplexBlock {
    data: DumbComplex
    children: { [key: string]: AnyBlock }
    constructor(uuid: UUID, children: { [key: string]: AnyBlock }, schema?: string) {
        let ids: { [key: string]: string } = {}
        this.children = children
        for (let [key, value] of Object.entries(children)) {
            ids[key] = value.data.data.uuid
        }

        this.data = new DumbComplex({
            uuid: uuid,
            type: "complex",
            value: ids,
            $schema: schema,
            meta: {}
        })
    }
}

export class ArrayBlock<T extends AnyBlock> extends ComplexBlock {
    constructor(uuid: UUID, length: number, value_constructor: (uuid: string, i: number) => T) {
        let children: { [key: string]: T } = {}

        let mappings: { [key: string]: string } = {}
        for (let i = 0; i < length; i++) {
            let child_uuid = randomUUIDv5(uuid, i.toString())
            children[i.toString()] = value_constructor(child_uuid, i)
            mappings[i.toString()] = child_uuid
        }

        super(uuid, children)
    }
}

export type AnyBlock = NumberBlock | MeasureBlock | EnumBlock | TextBlock | UriBlock | Base64Block | ComplexBlock