import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
    title = 'app';

    constructor(private auth : AuthService,
                public router : Router){}

    public ngOnInit() : void 
    {
        var userJSON = localStorage.getItem('user');
        if(userJSON)
        {
            var user = JSON.parse(localStorage.getItem('user'));
            if(user)
            {
                this.auth.id = user.id;
                this.auth.jwt = user.jwt;
                this.auth.tokenExpiry = new Date(user.tokenExpiry);
                this.auth.isAdmin = user.isAdmin;
                this.auth.updateLocal();
            }
        }  
    }
}
