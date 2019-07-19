# Get My Soundboards

Returns all user's created/favourited soundboards corresponding to the provided query params.
Does not return sound files at this time as they are not needed for soundboard previews.

**URL** : `/mysoundboards`

**Method** : `GET`

**Auth required** : YES

## Required Query Parameters

**Example URL** : `/soundboards?page=1&limit=5&type=created`

* page - the page number (REQUIRED)
* limit - the number of results to return per page (REQUIRED)
* type - the type of query to perform, valid values are: created OR favourited (REQURED)

## Response Content

**Success Response**

```json
{
    "success" : true,
    "soundboards" : [{
        "name" : "coolboard",
        "image" : "imagename.jpeg",
        "favourites" : 2,
        "id" : "<SOUNDBOARD_UNIQUE_ID>",
        "creatorId" : "<ID_OF_USER_WHO_MADE_THIS>",
        "creatorUsername" : "<USERNAME_OF_USER_WHO_MADE_THIS>",
        "createdAt" : "<TIMESTAMP>"
    }]
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "Invalid query params."
}
```

## Notes

The image name returned is statically served by the server 
and can be accessed by linking to <API_URL>/static/<IMAGE_NAME.jpeg>

Getting my soundboards can fail for the following reasons:

* page, limit, or type query params missing

* database error
