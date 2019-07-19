# Delete Specific Soundboard

Deletes the soundboard corresponding to the ID provided in the URL from the database.
Also delete all files on server corresponding to the deleted soundboard.

**URL** : `/soundboards/:id`

**Method** : `DELETE`

**Auth required** : YES

## Response Content

**Success Response**

```json
{
    "success": true,
    "message": "Soundboard deleted successfully!"
}
```

**Failure Response**

```json
{
    "success": false,
    "message": "Soundboard not found!"
}
```

## Notes

Deleting a specific soundboard can fail for the following reasons:

* soundboard with the provided ID in the URL does not exist

* database error

* file system error
