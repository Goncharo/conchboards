# Ban Hammer

Bans user & deletes all their created soundboards.

Note: route exists, but functionality not implemented server-side. Implement if needed.

**URL** : `/admin/banhammer/:id`

**Method** : `POST`

**Auth required** : YES

## Response Content

**Success Response**

```json
{
    "success": true,
    "message": "Successfully ban hammered user!"
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "Cannot ban hammer user that does not exist."
}
```

## Notes

This call can fail for the following reasons:

* specified user does not exist

* calling user is not an admin

* database error
