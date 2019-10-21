import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { AccountData } from '../data/account-data';
import { Account } from '../data/account';

@Injectable()
export class BankAccountService {

    private bankAccounts: AccountData;

    constructor() {
        this.bankAccounts = {
            Accounts: [{
                AccountNumber: 'acc-1',
                AccountName: 'current',
                CurrentFunds: 23049
            }, {
                AccountNumber: 'acc-2',
                AccountName: 'savings',
                CurrentFunds: 54999
            }]
        };
    }

    public Withdraw(accountNumber: string, amount: number): Observable<number> {
        const account: Account = this.LocateBankAccount(accountNumber);
        if (account !== null) {
            account.CurrentFunds -= amount;
            return of(account.CurrentFunds);
        }
    }

    public FundsAvailable(accountNumber: string, amount: number): Observable<boolean> {
        const account: Account = this.LocateBankAccount(accountNumber);
        if (account !== null) {
            const available: boolean = (account.CurrentFunds - amount) > -1.0;
            return of(available === true);
        }
    }

    public Deposit(accountNumber: string, amount: number): Observable<number> {
        const account: Account = this.LocateBankAccount(accountNumber);
        if (account !== null) {
            account.CurrentFunds += amount;
            return of(account.CurrentFunds);
        }
    }

    public Transfer(sourceAccountNumber: string, destinationAccountNumber: string, amount: number) {
        const bankSourceAccount = this.LocateBankAccount(sourceAccountNumber);
        const bankDestinationAccount = this.LocateBankAccount(destinationAccountNumber);

        if (bankSourceAccount !== null && bankDestinationAccount !== null) {
            bankSourceAccount.CurrentFunds -= amount;
            bankDestinationAccount.CurrentFunds += amount;
        }
    }

    public FetchAccounts(accounts: Partial<Account>[]): Observable<Account[]> {
        const accountData: Account[] = [];

        for (const account of accounts) {
            if (account.AccountNumber === 'acc-1') {
                accountData.push(this.bankAccounts.Accounts[0]);
            }

            if (account.AccountNumber === 'acc-2') {
                accountData.push(this.bankAccounts.Accounts[1]);
            }
        }

        return of(accountData);
    }

    public LocateBankAccount(accountNumber: string): Account {
        for (const account of this.bankAccounts.Accounts) {
            if (account.AccountNumber === accountNumber) {
                return account;
            }
        }
        return null;
    }

    public GetAllAccounts(): Observable<Account[]> {
        const results = [];
        this.bankAccounts.Accounts.forEach((account: Account) => {
            results.push(account);
        });
        return of(results);
    }
}
