# Favourite

Adds / removes the soundboard corresponding to the specified ID in the URL
to the user's favourites, depending on if they have already favourited
the board.

**URL** : `/soundboards/favourite/:id`

**Method** : `POST`

**Auth required** : YES

## Response Content

**Success Response**

```json
{
    "success" : true,
    "message": "Soundboard added to favourites!"
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

Favouriting a soundboard can fail for the following reasons:

* soundboard is not found

* database error
