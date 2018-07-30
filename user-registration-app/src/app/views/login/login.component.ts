import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgProgress } from '@ngx-progressbar/core';
import { AppConstants } from '../../AppConstants';
import { Login } from '../../models/login';
import { AuthProviders, AuthService } from '../../services/AuthService/auth.service';
import { CustomErrorHandlerService } from '../../services/services';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-login',
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent extends BaseComponent {
  public model: Login;

  constructor(authService: AuthService,
              router: Router,
              errorHandler: CustomErrorHandlerService,
              activatedRoute: ActivatedRoute,
              progressBar: NgProgress) {
    super(authService, router, errorHandler, activatedRoute, progressBar);
    this.model = new Login();
    this.authService.authState
      .subscribe((user) => {
        if (user) {
          this.onLogin();
        }
      });
  }

  login() {
    this.progressBar.start();
    this.loginHandler(this.authService.signInWithProvider(AuthProviders.GOOGLE_PROVIDER));
  }

  loginFacebook() {
    this.progressBar.start();
    this.loginHandler(this.authService.signInWithProvider(AuthProviders.FACEBOOK_PROVIDER));
  }

  loginGithub() {
    this.progressBar.start();
    this.loginHandler(this.authService.signInWithProvider(AuthProviders.GITHUB_PROVIDER));
  }

  loginEmail() {
    this.progressBar.start();
    if (this.model.email && this.model.password) {
      this.loginHandler(this.authService.signIn(this.model.email, this.model.password));
    }
  }

  private loginHandler(loginPromise: Promise<any>) {
    loginPromise
      .then(() => {
        this.onLogin();
      })
      .catch((error) => {
        console.error(error);
        this.errorHandler.handleError(error);
        this.progressBar.complete();
      });
  }

  onLogin() {
    this.readRouteAndNavigate((params) => {
      if (!params.redirectUrl) {
        this.router.navigate([AppConstants.REGISTER_ENDPOINT]);
      } else {
        this.router.navigate([params['redirectUrl']]);
      }
    });
  }
}
