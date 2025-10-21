import { expect, test } from "bun:test"
import { Value, type ValueType } from ".."

const test_values: [ValueType, string][] = [
    [3, "3"],
    ["hello", "\"hello\""],
    [true, "true"],
    [[1, 2, 3], "[1,2,3]"],
    [{ "hello": "there" }, "{\"hello\":\"there\"}"]
]

for (let i in test_values) {
    let inital = test_values[i]![0]
    let expected = test_values[i]![1]
    test(`Serialize deserialize ${typeof inital}`, () => {
        let v = new Value(inital)
        let serialized = v.serialize()
        let deserialized = Value.deserialize(serialized)
        let copy = Value.from_string(serialized)

        expect(serialized).toEqual(expected)
        if (typeof inital !== "object") {
            expect(deserialized).toBe(inital)
        } else {
            expect(deserialized).toEqual(inital)
        }
        expect(copy).toEqual(v)
    })
}