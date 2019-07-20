# Conchboards API

API Documentation for Conchboards.

All endpoints are prefixed with <hostname>/api/

ie https://conchboards.com/api/

## Open Endpoints

Open endpoints require no Authentication token.

### User Authentication Routes

* [Signup](auth/signup.md) : `POST /signup`
* [Verify](auth/verify.md) : `POST /verify/:token`
* [Signin](auth/signin.md) : `POST /signin`
* [Check If Username Exists](auth/check-username.md) : `GET /usernameExists/:username`

### User Account Routes

* [Forgot Password](account/forgot-pass.md) : `POST /forgotpass`
* [Reset Password](account/reset-pass.md) : `POST /resetpass/:token`

### Soundboard Routes

* [Get All Soundboards](soundboards/get-all.md) : `GET /soundboards` // auth token optional
* [Get Specific Soundboard](soundboards/get-specific.md) : `GET /soundboards/:id` // auth token optional

## Endpoints that require Authentication token

These endpoints require a valid Authorization header with JWT token in the request. 
The JWT token is obtained from the /signin route above.
Header should be in the following format:

```json
{
    "Authorization": "Bearer <JWT_TOKEN>"
}
```
### User Account Routes

* [Change Password](account/change-pass.md) : `POST /changepass`

### Soundboard Routes

* [Create New Soundboard](soundboards/new.md) : `POST /soundboards`
* [Get All Soundboards](soundboards/get-all.md) : `GET /soundboards` // auth token optional
* [Get My Soundboards](soundboards/get-mysoundboards.md) : `GET /mysoundboards`
* [Get Specific Soundboard](soundboards/get-specific.md) : `GET /soundboards/:id` // auth token optional
* [(Un)favourite a Soundboard](soundboards/favourite.md) : `POST /soundboards/favourite/:id`
* [Delete Soundboard](soundboards/delete-specific.md) : `DELETE /soundboards/:id`
* [Report a Soundboard](soundboards/report.md) : `POST /mysoundboards /soundboards/report/:id`

### Admin Routes
* [Send Email to Users](admin/send-mail.md) : `POST /admin/email`
* [Get Malicious Users](admin/get-malicious.md) : `GET /admin/malicious`
* [Ban User](admin/ban-user.md) : `POST /admin/ban/:id`
* [Ban Hammer](admin/ban-hammer.md) : `POST /admin/banhammer/:id`
