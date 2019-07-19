# Signup

Create a new user in the database & send a verification email to the user.

**URL** : `/signup`

**Method** : `POST`

**Auth required** : NO

## Required Request Content

Creates a user in the database with email "test@test.ca", username "test_user", and password "test1234".
The new user will be sent a verification email via mailgun, and they will have to click
the provided link in order to verify their email address, to be able to sign in.

If this request is not from a mobile device, a captchaResponse should be provided.

```json
{
    "email": "test@test.ca",
    "password": "test1234",
    "username": "test_user",
    "captchaResponse": "alkj3aslk3987dkjh", // only needed if mobile is set to false, or not provided
    "mobile": false // if true, will skip captcha validation
}
```

## Response Content

**Success Response**

```json
{
    "success": true,
    "message": "Account created successfully! Please verify your account before logging in using the verification link that was emailed to you."
}
```

**Failure Response**


```json
{
    "success": false,
    "message": "User with provided email already exists!"
}
```

## Notes

Sign up can fail for the following reasons:

* data is missing from body of request

* user with the same email already exists in the database

* captcha failed to validate

* database error
