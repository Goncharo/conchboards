# Reset Pass

Resets the password of the user corresponding to the provided token to the provided password.

**URL** : `/resetpass/:token`

**Method** : `POST`

**Auth required** : NO

```json
{
    "password": "newpass1234"
}
```

## Response Content

**Success Response**

```json
{
    "success" : true,
    "message" : "Password changed succesfully! Please login again."
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "Account with provided email not found."
}
```

## Notes

The reset password URL sent to the user will link to the webapp,
so the iOS/Android apps don't need to worry about handling this route.

Password reset can fail for the following reasons:

* reset token does not match to a user in the database

* reset token or new password are not provided

* database error
