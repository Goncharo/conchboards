# Report

Appends the user's ID to the specified soundboard's reportedBy array. The
reported soundboard will be filtered out in the user's future searches.

**URL** : `/soundboards/report/:id`

**Method** : `POST`

**Auth required** : YES

## Response Content

**Success Response**

```json
{
    "success" : true,
    "message": "Thank you for your feedback! The soundboard has been reported, and it will not be visible to you in future searches."
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

Reporting a soundboard can fail for the following reasons:

* soundboard is not found

* database error
