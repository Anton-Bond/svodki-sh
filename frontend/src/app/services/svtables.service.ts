import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { Svtable } from '../shared/interfaces'
import { DB } from '../shared/conf'

@Injectable({
  providedIn: 'root'
})
export class SvtablesService {
    constructor(private http: HttpClient) {}

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }

    create(svtable: Svtable) {
        return this.http.post<Svtable>(
            `${DB.url}/api/sv-table/new`,
            svtable,
            this.httpOptions
        )
    }

    getByDate(svtableDate: string): Observable<Svtable> {
        return this.http.get<Svtable>(`${DB.url}/api/sv-table/${svtableDate}`)
            // .pipe(map(data => ({
            //     svtableId: data.svtableId,
            //     svtableDate: data.svtableDate,
            //     header: JSON.parse(data.header.toString()),
            //     data: JSON.parse(data.data.toString())
            // })))
    }
}
