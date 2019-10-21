import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { BankAccountService } from './bank-account/bank-account.service';
import { AccountComponent } from './account/account.component';
import { AuthenticateService } from './authenticate/authenticate.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BankAccountComponent,
        AccountComponent
      ],
      providers: [
        AuthenticateService,
        BankAccountService
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
