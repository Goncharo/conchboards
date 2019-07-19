# Signin

Returns the user ID & a signed JWT token.

**URL** : `/signin`

**Method** : `POST`

**Auth required** : NO

## Required Request Content

Takes the provided email/password, and if it matches a record in the database,
returns the corresponding user ID and a JWT token. This token will have to be provided
in the headers upon subsequent requests that require authentication.

Also, returns the isAdmin flag to denote users with administrative priviledges.

Note: the token will be valid for 7 days.

```json
{
    "email": "test@test.ca",
    "password": "test1234",
}
```

## Response Content

**Success Response**

```json
{
    "success" : true,
    "message" : "Successfully logged in!",
    "jwt" : "Bearer <JWT_TOKEN>",
    "id" : 666666,
    "isAdmin": false,
    "tokenValidFor" : 604800 // duration in seconds for which the token will be valid
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "User with provided email doesn't exist."
}
```

## Notes

Sign in can fail for the following reasons:

* user with the requested email doesn't exist

* provided password doesn't match in the database for the corresponiding user

* user has not verified account

* database error
