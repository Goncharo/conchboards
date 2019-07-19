# Verify

Verifies the user's email corresponding to the provided token.
The link to this route will be provided to the user by email after
signup.

**URL** : `/verify/:token`

**Method** : `GET`

**Auth required** : NO

## Response Content

**Success Response**

```json
{
    "success" : true,
    "message" : "Account verified successfully, you can now log in!"
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "Verification token not valid!"
}
```

## Notes

iOS/Android apps should handle this route to support universal/deep linking.

Sign in can fail for the following reasons:

* verification token cannot be found in the database

* database error
