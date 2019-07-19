# Forgot Pass

Sends the provided email a password reset link.

**URL** : `/forgotpass`

**Method** : `POST`

**Auth required** : NO

## Required Request Content

Takes the provided email and sends a password reset link if the
email corresponds to a user account in the database.

If this request is not from a mobile device, a captchaResponse should be provided.

```json
{
    "email": "test@test.ca",
    "captchaResponse": "alkj3aslk3987dkjh", // only needed if mobile is set to false, or not provided
    "mobile": false // if true, will skip captcha validation
}
```

## Response Content

**Success Response**

```json
{
    "success": true,
    "message": "A password reset token will be emailed to you shortly!"
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "Account with provided email not found."
}
```

## Notes

This call can fail for the following reasons:

* account with the requested email doesn't exist

* captcha failed to validate

* database error
