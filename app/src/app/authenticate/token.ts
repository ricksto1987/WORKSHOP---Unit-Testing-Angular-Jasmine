import { Account } from '../data/account';

export interface Token {
    AccountHolder: string;
    Accounts: Partial<Account>[];
}
