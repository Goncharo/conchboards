import { NgModule }  from "@angular/core";
import { Route, RouterModule, Routes, PreloadAllModules }  from "@angular/router";
import { SoundboardsComponent } from "./soundboards/soundboards.component";
import { MySoundboardsComponent } from "./my-soundboards/my-soundboards.component";
import { CreateComponent } from "./create/create.component";
import { SoundboardComponent } from "./soundboard/soundboard.component";
import { SigninComponent } from "./auth/signin/signin.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth-guard.service";
import { VerifyComponent } from "./auth/verify/verify.component";
import { CreateCanDeactivateGuard } from "./create/create-can-deactivate-guard.service";
import { ForgotPassComponent } from "./auth/forgot-pass/forgot-pass.component";
import { ResetPassComponent } from "./auth/reset-pass/reset-pass.component";
import { SettingsComponent } from "./settings/settings.component";
import { LandingComponent } from "./landing/landing.component";
import { AboutComponent } from "./about/about.component";
import { TermsComponent } from "./terms/terms.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { AdminComponent } from "./admin/admin.component";
import { FaqComponent } from "./faq/faq.component";

const appRoutes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'soundboards', component: SoundboardsComponent },
    { path: 'soundboards/:id', component: SoundboardComponent },
    { path: 'mysoundboards', canActivate: [AuthGuard], component: MySoundboardsComponent },
    { path: 'create', canActivate: [AuthGuard], canDeactivate: [CreateCanDeactivateGuard],component: CreateComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'verify', component: VerifyComponent },
    { path: 'forgotpass', component: ForgotPassComponent },
    { path: 'resetpass', component: ResetPassComponent },
    { path: 'settings', canActivate: [AuthGuard], component: SettingsComponent },
    { path: 'about', component: AboutComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'privacy', component: PrivacyComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'faq', component: FaqComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { preloadingStrategy : PreloadAllModules })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule
{

}