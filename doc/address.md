# Address API Spec

## Create Address

Endpoint : `POST /v1/contact/:contactId/address`

Headers :
- X-USER-TOKEN : session-token

Request Body :
```json
{
    "street" : "Jl. Jendral Sudirman, optional",
    "city" : "Jakarta, optional",
    "province" : "DKI Jakarta, optional",
    "country" : "Indonesia",
    "postal_code" : "12345"
}
```

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": 1,
        "street": "Jl. Jendral Sudirman",
        "city": "Jakarta",
        "province": "DKI Jakarta",
        "country": "Indonesia",
        "postal_code": "12345"
    }
}
```

Response Body (Failed) :
```json
{
    "status": "error",
    "code": 400,
    "errors": "errors message"
}
```

## Get Address

Endpoint : `GET /v1/contact/:contactId/address/:addressId`

Headers :
- X-USER-TOKEN : session-token

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": 1,
        "street": "Jl. Jendral Sudirman",
        "city": "Jakarta",
        "province": "DKI Jakarta",
        "country": "Indonesia",
        "postal_code": "12345"
    }
}
```

Response Body (Failed) :
```json
{
    "status": "error",
    "code": 404,
    "errors": "Address not found"
}
```

## Update Address

Endpoint : `PUT /v1/contact/:contactId/address/:addressId`

Headers :
- X-USER-TOKEN : session-token

Request Body :
```json
{
    "street" : "Jl. Jendral Sudirman, optional",
    "city" : "Jakarta, optional",
    "province" : "DKI Jakarta, optional",
    "country" : "Indonesia",
    "postal_code" : "12345"
}
```

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": 1,
        "street": "Jl. Jendral Sudirman",
        "city": "Jakarta",
        "province": "DKI Jakarta",
        "country": "Indonesia",
        "postal_code": "12345"
    }
}
```

Response Body (Failed) :
```json
{
    "status": "error",
    "code": 400,
    "errors": "errors message"
}
```

## Remove Address

Endpoint : `DELETE /v1/contact/:contactId/address/:addressId`

Headers :
- X-USER-TOKEN : session-token

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "message": "Address removed"
}
```

Response Body (Failed) :
```json
{
    "status": "error",
    "code": 404,
    "errors": "Address not found"
}
```

## List Addresses

Endpoint : `GET /v1/contact/:contactId/addresses`

Headers :
- X-USER-TOKEN : session-token

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": [
        {
            "id": 1,
            "street": "Jl. Jendral Sudirman",
            "city": "Jakarta",
            "province": "DKI Jakarta",
            "country": "Indonesia",
            "postal_code": "12345"
        },
        {
            "id": 2,
            "street": "Jl. Jendral Sudirman",
            "city": "Jakarta",
            "province": "DKI Jakarta",
            "country": "Indonesia",
            "postal_code": "12345"
        }
    ]
}
```

