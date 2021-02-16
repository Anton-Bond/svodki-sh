import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { User } from '../shared/interfaces'
import { DB } from '../shared/conf'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
    constructor(private http: HttpClient) {}

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${DB.url}/api/user`)
    }

    // get array of users from url and return user by email or null
    getById(userId: string): Observable<User> {
        return this.http.get<User>(`${DB.url}/api/user/${userId}`)
    }

    // new
    create(user: User) {
        return this.http.post<User>(
            `${DB.url}/api/user/new`,
            user,
            this.httpOptions
        )
    }

    update(userId: string, user: User): Observable<User> {
        return this.http.put<User>(
            `${DB.url}/api/user/${userId}`,
            user,
            this.httpOptions
        )
    }

    updatePass(userId: string, pass: string): Observable<User> {
        return this.http.put<User>(
            `${DB.url}/api/user/passw/${userId}`,
            { password: pass },
            this.httpOptions
        )
    }

    removeById(userId: string): Observable<any> {
        return this.http.delete<any>(`${DB.url}/api/user/${userId}`, this.httpOptions)
    }
}
