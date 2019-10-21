import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BankAccountComponent } from './bank-account/bank-account.component';

import { AuthenticateService } from './authenticate/authenticate.service';
import { AccountComponent } from './account/account.component';
import { BankAccountService } from './bank-account/bank-account.service';

@NgModule({
  declarations: [
    AppComponent,
    BankAccountComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgbAlertModule,
    ReactiveFormsModule
  ],
  providers: [AuthenticateService, BankAccountService],
  bootstrap: [AppComponent]
})
export class AppModule { }
