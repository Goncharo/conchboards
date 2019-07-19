import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule }  from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShareButtonModule } from '@ngx-share/button';
import { Meta } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SoundboardsComponent } from './soundboards/soundboards.component';
import { CreateComponent, DeactivateModal } from './create/create.component';
import { MySoundboardsComponent } from './my-soundboards/my-soundboards.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SoundboardsService } from './soundboards/soundboards.service';
import { ConfigurationService } from './configuration/configuration.service';
import { SoundboardComponent } from './soundboard/soundboard.component';
import { AuthService } from './auth/auth.service';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertsService } from './alerts/alerts.service';
import { VerifyComponent } from './auth/verify/verify.component';
import { SoundboardListItemComponent } from './soundboard-list-item/soundboard-list-item.component';
import { CreateCanDeactivateGuard } from './create/create-can-deactivate-guard.service';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { ResetPassComponent } from './auth/reset-pass/reset-pass.component';
import { SettingsComponent } from './settings/settings.component';
import { ChangePassComponent } from './settings/change-pass/change-pass.component';
import { LandingComponent } from './landing/landing.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { AboutComponent } from './about/about.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AdminComponent } from './admin/admin.component';
import { AdminService } from './admin/admin.service';
import { FaqComponent } from './faq/faq.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SoundboardsComponent,
    CreateComponent,
    MySoundboardsComponent,
    SoundboardComponent,
    SignupComponent,
    SigninComponent,
    AlertsComponent,
    VerifyComponent,
    SoundboardListItemComponent,
    DeactivateModal,
    SearchBarComponent,
    ForgotPassComponent,
    ResetPassComponent,
    SettingsComponent,
    ChangePassComponent,
    LandingComponent,
    AboutComponent,
    TermsComponent,
    PrivacyComponent,
    AdminComponent,
    FaqComponent
  ],
  entryComponents: [
    DeactivateModal
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    InfiniteScrollModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    NgbModule.forRoot(),
    ShareButtonModule.forRoot(),
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule
  ],
  providers: [
    SoundboardsService,
    ConfigurationService,
    AuthService,
    AuthGuard,
    CreateCanDeactivateGuard,
    AlertsService,
    AdminService,
    Meta
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
