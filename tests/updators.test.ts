import { expect, test } from "bun:test"
import { UpdatorValue, Value } from ".."

test("Basic test", () => {
    let uv = new UpdatorValue(5)
    let written_value = 2
    uv.on_value_updated((new_value) => {
        expect(new_value).toBe(written_value)
    })

    expect(uv.value).toBe(5)
    uv.value = written_value

    written_value = 3
    uv.value = written_value

})

test("Object properties", (done) => {
    let uv = new UpdatorValue({ "test": "hello" })

    uv.on_value_updated((new_value) => {
        expect(new_value).toEqual({ "test": "there" })
        done()
    })

    expect(uv.value).toEqual({ "test": "hello" })

    uv.value["test"] = "there"
    uv.update()
})