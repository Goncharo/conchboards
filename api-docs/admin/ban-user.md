# Ban User

Toggles the ban flag on the specified user.

**URL** : `/admin/ban/:id`

**Method** : `POST`

**Auth required** : YES

## Response Content

**Success Response**

```json
{
    "success": true,
    "message": "Successfully banned user!"
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "Cannot ban user that does not exist."
}
```

## Notes

This call can fail for the following reasons:

* specified user does not exist

* calling user is not an admin

* database error
