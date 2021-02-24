import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

    constructor() { }

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
