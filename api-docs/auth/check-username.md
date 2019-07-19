# Check Username

Checks whether the specified username in the URL exists in the database.

**URL** : `/usernameExists/:username`

**Method** : `GET`

**Auth required** : NO

## Response Content

**Success Response**

```json
{
    "success": true,
    "usernameExists": false // whether the username exists in the database
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "Something went wrong!"
}
```

## Notes

This call can fail for the following reasons:

* database error
