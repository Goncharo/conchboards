# Create New Soundboard

Creates new soundboard in the database.

**URL** : `/soundboards`

**Method** : `POST`

**Auth required** : YES

## Required Request Content

Creates new soundboard in the database corresponding to the provided data.
The soundboard image must be the last file object in the array.
The soundNames array should correspond 1:1 with the array of sound file objects.

```json
{
    "name": "coolboard",
    "soundNames": ["coolSound1", "coolSound2"], // array of the names the user selected
    "files" : [{
        // coolSound1 file object
    },
    {
        // coolSound2 file object
    },
    {
        // soundboard image file object
    }],
}
```

## Response Content

**Success Response**

```json
{
    "success": true,
    "message": "Successfully uploaded soundboard!"
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "Invalid soundboard!"
}
```

## Notes

The sound/image file objects should be added to the files[] array
in the proper way to add multipart form data to the HTTP request on the
platform you are developing on. That's why the structure is a bit vague. 

Creating a new sondboard can fail for the following reasons:
* name, or files/soundNames array is missing from the request
* database error
