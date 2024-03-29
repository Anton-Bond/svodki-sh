import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import * as _ from 'lodash'

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

    getOnCurrentDate(currentDate: string): Observable<Svtable[]> {
        return this.http.get<Svtable[]>(`${DB.url}/api/sv-table/on-current-date/${currentDate}`)
    }

    getPerDayTables(date: string): Observable<any[]> {
        return this.http.get<any[]>(`${DB.url}/api/sv-table/on-daybefore-date/${date}`)
    }

    create(svtable: Svtable) {
        return this.http.post<Svtable>(
            `${DB.url}/api/sv-table/new`,
            svtable,
            this.httpOptions
        )
    }

    addNewSvatebles(svtables: Svtable[]): Observable<any> {
        return this.http.post<Svtable>(
            `${DB.url}/api/sv-table/addNewSvatebles`,
            svtables,
            this.httpOptions
        )
    }

    addNew(svtable: Svtable): Observable<Svtable> {
        return this.http.post<Svtable>(`${DB.url}/api/sv-table/new`, svtable, this.httpOptions)
    }

    updateOne(svtable: Svtable): Observable<Svtable> {
        return this.http.put<Svtable>(`${DB.url}/api/sv-table/${svtable.svtableId}`, svtable, this.httpOptions)
    }

    removeOne(curDate: string, svtableId: string): Observable<Svtable> {
        return this.http.delete<Svtable>(`${DB.url}/api/sv-table/${curDate}/${svtableId}`)
    }

    updateOneRegion(curDate: string, svtableId: string, dataRow: any): Observable<any> {
        return this.http.put<any>(`${DB.url}/api/sv-table/region/${curDate}/${svtableId}`, dataRow, this.httpOptions)
    }
}
