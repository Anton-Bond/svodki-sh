import { Injectable } from '@angular/core'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import jwt_decode from 'jwt-decode'

import { User } from '../shared/interfaces'
import { ROLE } from '../shared/constants'
import { DB } from '../shared/conf'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {}

    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token)
        } catch (Error) {
            return null
        }
    }

    login(user: User): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${DB.url}/api/auth/login`, user).pipe(
            tap(({ token }) => {
                sessionStorage.setItem('auth-token', token)
            })
        )
    }

    // isAuthorized(): boolean {
    //     return !!sessionStorage.getItem('auth-token')
    // }

    logout() {
        sessionStorage.clear()
    }

    getCurrentUser(): User {
        return this.getDecodedAccessToken(sessionStorage.getItem('auth-token'))
    }

    isAdmn(): boolean {
        return this.getDecodedAccessToken(sessionStorage.getItem('auth-token')).role === ROLE.ADMIN
    }

    isEditable(): boolean {
        return this.getDecodedAccessToken(sessionStorage.getItem('auth-token')).role === ROLE.ADMIN
            || this.getDecodedAccessToken(sessionStorage.getItem('auth-token')).role === ROLE.DISP
    }

}
