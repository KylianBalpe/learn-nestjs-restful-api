# Contact API Spec

## Create Contact

Endpoint : `POST /v1/contact`

Headers :
- X-USER-TOKEN : session-token

Request Body :
```json
{
    "first_name": "Iqbal",
    "last_name": "Pamula",
    "email": "iqbal@example.com",
    "phone": "08123456789"
}
```

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": 1,
        "first_name": "Iqbal",
        "last_name": "Pamula",
        "email": "iqbal@example.com",
        "phone": "08123456789"
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

## Get Contact

Endpoint : `GET /v1/contact/:contactId`

Headers :
- X-USER-TOKEN : session-token

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": 1,
        "first_name": "Iqbal",
        "last_name": "Pamula",
        "email": "iqbal@example.com",
        "phone": "08123456789"
    }
}
```

Response Body (Failed) :
```json
{
    "status": "error",
    "code": 404,
    "errors": "Contact not found"
}
```

## Update Contact

Endpoint : `PUT /v1/contact/:contactId`

Headers :
- X-USER-TOKEN : session-token

Request Body :
```json
{
    "first_name": "Iqbal",
    "last_name": "Pamula",
    "email": "iqbal@example.com",
    "phone": "08123456789"
}
```

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": 1,
        "first_name": "Iqbal",
        "last_name": "Pamula",
        "email": "iqbal@example.com",
        "phone": "08123456789"
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

## Remove Contact

Endpoint : `DELETE /v1/contact/:contactId`

Headers :
- X-USER-TOKEN : session-token

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "message": "Contact removed"
}
```

Response Body (Failed) :
```json
{
    "status": "error",
    "code": 404,
    "errors": "Contact not found"
}
```

## Search Contact

Endpoint : `GET /v1/contacts`

Headers :
- X-USER-TOKEN : session-token

Query Params :
- name: string, first name or last name, optional
- email: string, optional
- phone: string, phone number, optional
- page: number, default 1
- size: number, default 10

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": [
      {
        "id": 1,
        "first_name": "Iqbal",
        "last_name": "Pamula",
        "email": "iqbal@example.com",
        "phone": "08123456789"
      }
    ],
    "paging": {
      "current_page": 1,
      "size": 10,
      "total_page": 1
    }
}
```
