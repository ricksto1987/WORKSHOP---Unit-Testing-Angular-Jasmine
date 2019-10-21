import { Injectable } from '@angular/core';
import { Token } from '../authenticate/token';
import { Account } from '../data/account';

import { of, Observable } from 'rxjs';

Injectable()
export class AuthenticateService {

    public GetToken(username: string, password: string): Observable<Token> {

        if (username === 'mbag1' && password === 'secureone!1!') {
            const token: Token = {
                AccountHolder: 'Mr M. Bag',
                Accounts: [
                    {
                        AccountNumber: 'acc-1'
                    },
                    {
                        AccountNumber: 'acc-2'
                    }
                ]
            };

            return of(token);
        }
        return of(null);
    }
}
