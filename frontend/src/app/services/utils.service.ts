import { Injectable } from '@angular/core'
import { EventEmitter } from '@angular/core'
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
    dateUpdated = new EventEmitter()
    blockContentUpdated = new EventEmitter()

    private currentDate: string = moment().format('DD-MM-YYYY')
    private blockContent: boolean = false

    constructor() { }

    setBlockContent(value: boolean){
        this.blockContent = value
        this.blockContentUpdated.emit(this.blockContent)
    }
    getBlockContent(): boolean  {
        return this.blockContent
    }

    getCurrentDate() {
        return this.currentDate
    }

    getHumCurrentDate() {
        return moment(this.currentDate, 'DD-MM-YYYY').locale('ru').format('LL')
    }

    setCurrentDate(date: Date) {
        this.currentDate = moment(date).format('DD-MM-YYYY')
        this.dateUpdated.emit(this.currentDate)
    }

    numberToLetter(num: number): string {
        if (num === 0) {
            return '#'
        }
        const cel = Math.floor(num / 27)
        return (cel === 0 ? '' : String.fromCharCode(cel+96).toUpperCase()) + (String.fromCharCode(num-cel*26+96).toUpperCase())
    }

    letterToNumber(str: string): number {
        let res = 0
        const arr = str.split('')
        arr.forEach((char, i) => {
            const num = char.toLowerCase().charCodeAt(0) - 96
            if (num === arr.length && num !== i+1) {
                res += 25
            }
            res += num + i * 25
        })
        return res
    }
}
