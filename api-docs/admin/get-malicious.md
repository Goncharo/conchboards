# Get Malicious

Gets the most malicious users sorted by soundboard report count & corresponding soundboard info.

**URL** : `/admin/malicious`

**Method** : `GET`

**Auth required** : YES

## Required Query Parameters

**Example URL** : `/admin/malicious?page=1&limit=5`

* page - the page number (REQUIRED)
* limit - the number of results to return per page (REQUIRED)

## Response Content

**Success Response**

```json
{
    "success" : true,
    "users" : [{
        "userID" : "<USER_ID>",
        "soundboards" : [{
            "id" : "<SOUNDBOARD_ID>",
            "name" : "Example Name",
            "reportCount" : 6
        }]
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

This call can fail for the following reasons:

* page and limit query params are not provided

* user is not an admin

* database error
