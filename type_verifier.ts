
export type typemap = { [key: string]: boolean | undefined | "string" | "number" | "string?" | "number?" | "any" | "any?" | typemap, $$optional?: true }

export function verify_object(obj: any, typemap: typemap): boolean {
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

        if (typestr === "any") {
            if (typeof obj[key] === "undefined") {
                if (is_optional) { continue }
                else { return false }
            }
        }

        if (typeof obj[key] !== typestr) {
            if (is_optional) { continue }
            else { return false }
        }
    }

    return true
}
