import { Injectable } from '@angular/core'
import { EventEmitter } from '@angular/core'
import * as moment from 'moment'
import * as _ from 'lodash'
import * as XLSX from 'xlsx'

import { Svtable } from '../shared/interfaces'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
    dateUpdated = new EventEmitter()
    blockContentUpdated = new EventEmitter()

    private currentDate: string = moment().format('DD-MM-YYYY')
    private currentDate1 = moment().subtract(7, 'days');
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

    getDayBefore() {
        return moment(this.currentDate, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY')
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
        const res = (cel === 0 ? '' : String.fromCharCode(cel+96).toUpperCase()) + (String.fromCharCode(num-cel*26+96).toUpperCase())
        return num === 53 ? 'BA' : res
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

    getCellValue(col: any, data: string[]): any {
        const value = data[col.idx]
        if (col.type === 'formula' || col.type === 'percentage') {
            const cod = value.replace(/[A-Za-z]{1,2}/gi, match => {
                const idx = this.letterToNumber(match)
                return data[idx] ?  data[idx] : '0'
            })
            try {
                return eval(cod) ? _.toString(_.round(_.toNumber(eval(cod)), 2)) : '0'
            } catch {
                return '?ошибка формулы'
            }
        } else {
            return value
        }
    }

    getColTotal(col: any, svtable: Svtable): any {
        if (col.idx === 0) {
            return 'Всего:'
        } else {
            const total = svtable.rows.reduce((sum, row) => {
                const value = this.getCellValue(col, row.data)
                if (_.isString(value) && value) {
                    return sum + _.toNumber(value.replace(/,/, '.'))
                }
                return sum + 0
            }, 0)

            return total ? _.round(total, 2) : 0
        }
    }

    svtableToSheet(table: Svtable): any {
        const result = []

        const exth = []
        table.exth.forEach(row => {
            const temp = ['']
            row.forEach(el => {
                temp.push(el.value)
                for (let i=1; i < el.colspan; i++) {
                    temp.push('')
                }
            })
            exth.push(temp)
        })

        const header = ['Районы']

        const total = table.cols.map(col => {
            if (col.type === 'percentage') {
                return table.rows[0].data[col.idx]
            } else {
                return this.getColTotal(col, table)
            }
        })
        total.unshift('Всего:')

        table.cols.forEach((col, i) => {
            header.push(col.header)
            if (col.type === 'percentage') {
                total[i+1] = _.toNumber(this.getCellValue(col, total))
            }
        })
        const data = table.rows.map(
            row => row.data.map((_, i) => i === 0 ? row.data[0] : this.getCellValue(table.cols[i-1], row.data))
        )

        return XLSX.utils.aoa_to_sheet(result.concat([['', table.name]], [['']], exth, [header], data, [total]))
    }
}
