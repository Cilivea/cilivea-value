# Block layout
The block always contains the following:
* A UUID identifier
* A value field
* A type field
* A nested metadata field

```json
{
    "uuid": "a593b7fc-8304-4103-84c9-5fcdbf9a9017",
    "type": <Typename>,
    "value": <Value>,
    "meta": <Metadata>
}
```

The way the value in the value field is to be parsed changes according to the type field, which is documented below.


The metadata field is a JSON object, with primarily string values, and nested objects are intended to be used as namespaces.

# Supported datatypes

## Numeric types

These are all datatypes that store a number in their value field. The semantic meaning of the value however, is specified further by the type.


### Number
typename: `number`

For recording a pure number, like a coefficent or scalar.

A block containing the scalar number 12.4, would for instance look like this:


```json
{
    "uuid": "a593b7fc-8304-4103-84c9-5fcdbf9a9017",
    "type": "number",
    "value": 12.4
}
```

### Measure
typename: `measure`

For recording a physical measurement. All values here should be of an SI accepted type. This means units of Newtons, Meters, Pascals, Kilograms etc.

The unit of the value is stored in the unit field.

A block containing a measurement of 52.04 litres would look like this:

```json
{
    "uuid": "019c6ad4-c4c6-7276-8522-e0ba3c58bbd7",
    "type": "measure",
    "value": 52.04,
    "unit": "l"
}
```

Additionally, the unit can be a combined unit where an existing unit does not exist. The proposed syntax is as follows:

A block containing a measurements of 0.1 litres per seconds would look like this:

```json
{
    "uuid": "019c6af1-13ed-7058-a46a-31bbfa775c6f",
    "type": "measure",
    "value": 0.1,
    "unit": "l*s^-1"
}
```

or alternatively

```json
{
    "uuid": "019c6af1-13ed-7058-a46a-31bbfa775c6f",
    "type": "measure",
    "value": 0.1,
    "unit": "l/s"
}
```

However the first option should always be used, to avoid ambiguity with for example specific heat capacity (c), which is Joules per kg Kelvin. This is often written like c=J/kg\*K or c=J/(kg\*G). However this first spelling is ambiguous, and allowing the second and first one leads to multiple definitions of the same type. This is why writing c=J\*kg^-1\*K^-1 is less ambigous. It is the data views responsibility to display these units more nicely.

### Enum
The enum type is stored and treated as a number type, with an additional mappings field.

An example of an enum block is as follows.

```json
{
    "uuid": "019c6af3-a8b2-732c-8df9-1248e49722c9",
    "type": "enum",
    "value": 1,
    "mappings": {
        0: "closed",
        1: "opened",
    }
}
```

The aim of this is to provide a standardized view into what the discriminant in the enum means. Implementations may for example have the values meaning opened and closed swapped, but the mappings type ensures it is easily possible to understand this, and compensate for it if need be.

## string types

These are all the datatypes that store a string or string-like value in their data field

### Text
The text type stores a text string, it is intended to store human-readable text. The text can be anything that can be stored as a json string.

The usecase here is to have a MOTD or similar that updates regularly from the block device itself.

An example of a block containing the string `"Hello, world!"` is as follows:

```json
{
    "uuid": "019c6af9-8282-742b-83ae-7b64329a9c29",
    "type": "text",
    "value": "Hello, world!
}
```

### URI
The URI type stores a URI to a resource.

The MIME field is used to specify the type of resource expected from following the URI. Keep in mind that the MIME type may be wrong for example when expecting a `image/png` from a URL, and instead recieving a `404` or other error codes, therefore recieving `text/HTML` instead.

An example of a block containing a reference to `example.com` would be:

```json
{
    "type": "uri",
    "value": "https://www.example.com/",
    "MIME": "text/HTML",
}
```

## Blob types

These are all the datatypes that store arbitrary binary data.

### Base64

A block containing a base64 encoded data stream. The MIME field is a MIME type specifiying the format of the binary data.

An example of a block containing a small image of a cat is as follows:


```json
{
    "uuid": "019c6afd-c627-75bd-aaa1-0aa0a0ae7ed3",
    "value": "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAAgACADASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABgUEAv/EABYBAQEBAAAAAAAAAAAAAAAAAAECAP/aAAwDAQACEAMQAAABGUo7CEp0nw7QGBRBLugIJ0v/xAAcEAACAgIDAAAAAAAAAAAAAAABAgMEERMAEiL/2gAIAQEAAQUCh9S2osswZeAMVpv1sZBOvYLpEFatGpMXCej34zPLXTL6CgR3I8vY/8QAFxEBAQEBAAAAAAAAAAAAAAAAAAECEv/aAAgBAwEBPwGOWVf/xAAYEQEAAwEAAAAAAAAAAAAAAAAAAQISIf/aAAgBAgEBPwG09aXQ/8QAIhAAAQMCBgMAAAAAAAAAAAAAAQACESExAxAyQUJhEiLw/9oACAEBAAY/AmjtTh1O4XsIUhphMKLGQ0jii1y8eZoquhYcFpdpqrkki8ouGoXGWu+ypH3aJC//xAAfEAACAgICAwEAAAAAAAAAAAABEQAhMUFRYYGRsfD/2gAIAQEAAT8hreTCi4wfYha3MODA5KqWp17qKBkUsH9uFBkVlAhxhJnzZ9QLto93LkSgHTpg94jsG1jp4GNRMICASotWo3IrYhDYKA2LUEEgHh8Kf//aAAwDAQACAAMAAAAQRgtp/8QAGREBAQEAAwAAAAAAAAAAAAAAAQARITFB/9oACAEDAQE/EAJPptdkN4v/xAAXEQEBAQEAAAAAAAAAAAAAAAABEQAh/9oACAECAQE/EIYVwzFjnGm//8QAIxABAQACAQQBBQEAAAAAAAAAAREAITFBUXGRYYGhscHw8f/aAAgBAQABPxAMWghLZvEFAxWLEJ+j9HrnwCkS4G6aKg85ZIijVsMc655wDS9/MbBPwNp1uKATUNJa9vY9MnQzSVfsCg684YikkCIu1PGj3iHpI77CHkCibbO+nVRjQGNgbOgcGsegyKnlv97yya67Oip/mCFCCWtx3rXbJwBPcitB8FxG0M5KIbrih4z/2Q==",
    "MIME": "image/jpg",
    "type": "base64
}
```


## Complex type
### The complex type

The complex type is a block type that contains string keys to uuid values.
Its name arises from the fact that the complex type is used to build complex values and reusable structures.

The complex type consists of the folling fields:

* a field containing the id mappings
* an optional schema field, containing a URI to a schema file

This is a block describing heatpump, following a schema

```json
{
    "uuid": "019c8ead-2ef9-70af-9118-9026c328eb59",
    "$schema": "https://www.example.com/schemas/hvac/heatpump/0.1",
    "fields": {
        "temperature setpoint": "019c8eb0-18e3-7019-a6e1-ebbec42565b8",
        "current temperature": "019c8eb0-583b-7307-a278-6cf32e4ea5c3",
        "on/off": "019c8eb1-2938-71bb-a50a-e1145664e8c3"
    }
}
```

the IDs in the fields may point to either normal or complex blocks.