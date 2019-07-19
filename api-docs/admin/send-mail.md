# Send Mail

Sends an email to all non-admin users.

**URL** : `/admin/email`

**Method** : `POST`

**Auth required** : YES

## Required Request Content

Sends the specified HTML email body with the corresponding subject to all non-admin users.

```json
{
    "subject": "Test",
    "body": "<p>Hi!</p><p>This is the body.</p>" // HTML formatted email body, can be multiline
    
}
```

## Response Content

**Success Response**

```json
{
    "success": true,
    "message": "Sent out emails successfully."
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "Must provide a subject and an HTML body!"
}
```

## Notes

This call can fail for the following reasons:

* body and subject not provided

* user is not an admin

* database error
