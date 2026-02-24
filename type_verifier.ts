
type typemap = { [key: string]: boolean | undefined | "string" | "number" | "string?" | "number?" | typemap, $$optional?: true }

function verify_object(obj: any, typemap: typemap): boolean {
    for (let [key, value] of Object.entries(typemap)) {
        if (typeof value === "object") {
            if (typeof obj[key] !== "object") {
                if (value["$$optional"]) { continue }
                else { return false }
            }

            if (verify_object(obj[key], value) === false) { return false }
            else { continue }
        }

        value = value as "string" | "number" | "string?" | "number?"
        let is_optional = value.endsWith("?")
        let typestr = value.replace("?", "")
        if (typeof obj[key] !== typestr) {
            if (is_optional) { continue }
            else { return false }
        }
    }

    return true
}

let obj = {
    "a": "hello",
    "b": 2,
    "c": {
        "d": 4,
        "e": "5"
    }
}
let typeobj: typemap = {
    "a": "string",
    "b": "number",
    "c": {
        "d": "number",
        "e": "string",
        "f": "number?",
        "g": "string?"
    },
    "d": {
        "$$optional": true,
        "f": "number"
    }
}

console.log(verify_object(obj, typeobj))