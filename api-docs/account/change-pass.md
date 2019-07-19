# Change Pass

Changes the password of the authenticated user.

**URL** : `/changepass`

**Method** : `POST`

**Auth required** : YES

First checks to make sure the currentPassword provided matches the currently authenticated user's
existing password. Then, sets the users new password to the provided one.

```json
{
    "password": "newpass1234",
    "currentPassword": "oldpass1234"
}
```

## Response Content

**Success Response**

```json
{
    "success" : true,
    "message" : "Password changed succesfully!"
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "Current password does not match."
}
```

## Notes

Changing password can fail for the following reasons:

* password and/or currentPassword were not provided in the request

* provided currentPassword does not match the user's actual current password

* database error
