import { Component, OnInit, ElementRef, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { AccountComponent } from '../account/account.component';
import { BankAccountService } from './bank-account.service';
import { AuthenticateService } from '../authenticate/authenticate.service';
import { Token } from '../authenticate/token';
import { Account } from '../data/account';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})
export class BankAccountComponent implements OnInit {

  @ViewChild('inputUsername', { static: false })
  public InputUsername: ElementRef;

  @ViewChild('inputPassword', { static: false })
  public InputPassword: ElementRef;

  @ViewChildren(AccountComponent)
  accountComponents: QueryList<AccountComponent>;

  private currentAccountNumber: string;
  private savingsAccountNumber: string;

  private accounts: Account[];

  private userToken: Token;

  constructor(private authentication: AuthenticateService,
    private bankAccountService: BankAccountService) {
    this.userToken = null;
    this.accounts = [];
  }

  ngOnInit() {
    this.Initialise();
  }

  public async Authenticate() {
    await this.authentication.GetToken(this.InputUsername.nativeElement.value, this.InputPassword.nativeElement.value).subscribe(
      (token) => {

        if (token != null) {
          this.userToken = token;
          this.FetchAccounts();
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  public Initialise(): void {

    if (this.userToken === null) {
      return;
    }
  }

  public FetchAccounts(): void {
    this.bankAccountService.FetchAccounts(this.userToken.Accounts).subscribe(
      (accounts) => {
        this.accounts = accounts;
      },
      (error) => {
        console.log(error);
      });
  }

  public hostRefresh(): void {
    this.accountComponents.forEach((accountComponent: AccountComponent) => {
      accountComponent.Refresh();
    });
  }
}
