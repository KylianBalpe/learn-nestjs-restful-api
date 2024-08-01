# User API Spec

## Register User

Endpoint: `POST /v1/register`

Request Body : 
```json
{
    "username": "iqbal",
    "password": "rahasia",
    "name": "Iqbal"
}
```

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": 1,
        "username": "iqbal",
        "name": "Iqbal"
    }
}
```

Response Body (Failed) :

```json
{
    "status": "error",
    "code": 400,
    "errors": "Username already exists"
}
```

## Login User

Endpoint: `POST /v1/login`

Request Body :
```json
{
    "username": "iqbal",
    "password": "rahasia"
}
```

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": 1,
        "username": "iqbal",
        "name": "Iqbal",
        "token": "session-token"
    }
}
```

Response Body (Failed) :
```json
{
    "status": "error",
    "code": 400,
    "errors": "Invalid username or password"
}
```

## Get User

Endpoint: `GET /v1/user`

Headers : 
- X-USER-TOKEN : session-token

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": 1,
        "username": "iqbal",
        "name": "Iqbal"
    }
}
```

Response Body (Failed) :
```json
{
    "status": "error",
    "code": 401,
    "errors": "Unauthorized"
}
```

## Update User


Endpoint: `PATCH /v1/user`

Headers :
- X-USER-TOKEN : session-token

Request Body :
```json
{
    "password": "rahasia", // optional
    "name": "Iqbal", // optional
}
```

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": 1,
        "username": "iqbal",
        "name": "Iqbal"
    }
}
```

Response Body (Failed) :

```json
{
    "status": "error",
    "code": 400,
    "errors": "Username already exists"
}
```

## Logout User

Endpoint: `DELETE /v1/user`

Headers :
- X-USER-TOKEN : session-token

Response Body (Success) :
```json
{
    "status": "success",
    "code": 200,
    "message": "Logout success"
}
```

Response Body (Failed) :
```json
{
    "status": "error",
    "code": 401,
    "errors": "Unauthorized"
}
```