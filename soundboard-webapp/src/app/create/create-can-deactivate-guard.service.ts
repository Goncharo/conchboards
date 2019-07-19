import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { CreateComponent } from "./create.component";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class CreateCanDeactivateGuard implements CanDeactivate<CreateComponent>
{
    constructor(private auth: AuthService){}

    canDeactivate(component : CreateComponent, route : ActivatedRouteSnapshot, state : RouterStateSnapshot) :  Promise<any> | boolean
    {
        if(component.modified() && this.auth.isAuthenticated())
        {
            return component.confirm().then(
                (result) => {
                    if(result === "Leave")
                    {
                        return true;
                    }
                    return false;
                },
                (reason) => {
                    return false;
                }
            );
        }
        else
        {
            return true;
        }
    }
}