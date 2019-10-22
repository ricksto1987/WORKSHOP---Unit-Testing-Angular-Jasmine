import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BankAccountService } from '../bank-account/bank-account.service';
import { Account } from '../data/account';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  @Input()
  public accountNumber: string;

  @Input()
  public accountName: string;

  @Input()
  public currentFunds: number;

  @Output()
  public hostRefresh: EventEmitter<null>;

  @ViewChild('inputAmount', { static: false })
  public inputAmount: number;

  public selectedAccountNumber: string;

  private canWithdraw: boolean;
  private canDeposit: boolean;
  private canTransfer: boolean;

  private showInsufficientFundsMessage: boolean;

  private allAccounts: Account[];

  private fundsFormControl: FormControl;

  constructor(private bankAccountService: BankAccountService) {
    this.accountNumber = '';
    this.accountName = '';
    this.currentFunds = 0;
    this.canWithdraw = false;
    this.canDeposit = false;
    this.canTransfer = false;
    this.showInsufficientFundsMessage = false;
    this.hostRefresh = new EventEmitter<null>();
    this.allAccounts = [];
    this.selectedAccountNumber = '';
    this.fundsFormControl = new FormControl(Validators.minLength(1));
  }

  ngOnInit() {
    this.canDeposit = true;
    if (this.currentFunds > 0) {
      this.canWithdraw = true;
      this.canTransfer = true;
    }
    this.BuildTransferList();
  }

  public Withdraw(amount: number): void {

    if (amount < 0.0) {
      return;
    }

    this.SufficientFunds(amount).subscribe((available: boolean) => {
      if (available) {
        this.bankAccountService.Withdraw(this.accountNumber, amount).subscribe(
          (currentFunds) => {
            this.currentFunds = currentFunds;
            this.UpdateUIControls();
          }
        );
      }
    });
  }

  public Deposit(amount: number): void {

    if (amount < 0.0) {
      return;
    }

    this.bankAccountService.Deposit(this.accountNumber, amount).subscribe(
      (currentFunds) => {
        this.currentFunds = currentFunds;
        this.UpdateUIControls();
      }
    );
  }

  public Transfer(amount: number): void {

    if (amount < 0.0) {
      return;
    }

    this.SufficientFunds(amount).subscribe((available: boolean) => {
      if (available) {
        const sourceAccountNumber = this.accountNumber;
        const destinationAccountNumber = this.selectedAccountNumber;

        this.bankAccountService.Transfer(sourceAccountNumber, destinationAccountNumber, amount);

        this.hostRefresh.emit();
      }
    });
  }

  public Refresh(): void {
    this.currentFunds = this.bankAccountService.LocateBankAccount(this.accountNumber).CurrentFunds;
    this.UpdateUIControls();
  }

  public SufficientFunds(amount: number): Observable<boolean> {
    let result = false;
    this.bankAccountService.FundsAvailable(this.accountNumber, amount).subscribe(
      (available) => {
        result = available;
      },
      (error) => {
        console.log(error);
      }
    );

    return of(result);
  }

  public UpdateUIControls(): void {
    this.showInsufficientFundsMessage = this.currentFunds <= -0.0;
    this.canWithdraw = this.currentFunds > 0.0;
    this.canTransfer = this.currentFunds > 0.0;
  }

  public parseFloatValue(value: string): number {
    return parseFloat(value);
  }

  public BuildTransferList(): void {
    this.bankAccountService.GetAllAccounts().subscribe((allAccounts: Account[]) => {
      allAccounts.forEach((account) => {
        if (account.AccountNumber !== this.accountNumber) {
          this.allAccounts.push(account);
          this.selectedAccountNumber = account.AccountNumber;
        }
      });
    });
  }

  public SetSelectedAccountNumber(accountNumber: string): void {
    this.selectedAccountNumber = accountNumber;
  }
}
