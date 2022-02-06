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
        // const res = (cel === 0 ? '' : String.fromCharCode(cel+96).toUpperCase()) + (String.fromCharCode(num-cel*26+96).toUpperCase())
        if (num === 53) {
            return 'BA'

        } else if (num === 79) {
            return 'CA'
        } else if (num === 80) {
            return 'CB'

        } else if (num === 105) {
            return 'DA'
        } else if (num === 106) {
            return 'DB'
        } else if (num === 107) {
            return 'DC'

        } else if (num === 131) {
            return 'EA'
        } else if (num === 132) {
            return 'EB'
        } else if (num === 133) {
            return 'EC'
        } else if (num === 134) {
            return 'ED'

        } else if (num === 157) {
            return 'FA'
        } else if (num === 158) {
            return 'FB'
        } else if (num === 159) {
            return 'FC'
        } else if (num === 160) {
            return 'FD'
        } else if (num === 161) {
            return 'FE'

        } else if (num === 183) {
            return 'GA'
        } else if (num === 184) {
            return 'GB'
        } else if (num === 185) {
            return 'GC'
        } else if (num === 186) {
            return 'GD'
        } else if (num === 187) {
            return 'GE'
        } else if (num === 188) {
            return 'GE'
        }

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

    getColTotal(col: any, svtable: Svtable, revDayTable: Svtable = undefined): any {
        if (col.idx === 0) {
            return 'Всего:'
        } else {
            const total = svtable.rows.reduce((sum, row) => {
                const value = this.getCellValue(col, row.data, revDayTable)
                if (_.isString(value) && value) {
                    return sum + _.toNumber(value.replace(/,/, '.'))
                }
                if (_.isNumber(value) && value) {
                    return sum + value
                }
                return sum + 0
            }, 0)

            return total ? _.round(total, 2) : 0
        }
    }

    getCellValue(col: any, data: string[], revDayTable: Svtable = undefined): any {
        const value = data[col.idx]
        if (col.type === 'perday') {
            const perDay = this.getPerDay(value, data, revDayTable)
            return perDay ? _.round(perDay, 2) : 0
        }
        if (col.type === 'formula' || col.type === 'percentage') {
            // const cod = value.replace(/[A-Za-z]{1,2}/gi, match => {
            //     const idx = this.letterToNumber(match)
            //     return data[idx] ?  data[idx] : '0'
            // })
            // try {
            //     return eval(cod) ? _.toString(_.round(_.toNumber(eval(cod)), 2)) : '0'
            // } catch {
            //     return '?ошибка формулы'
            // }
            return this.getValue(value, data)
        } else {
            return value
        }
    }

    getPerDay(value: string, data: string[], prevDayTable: Svtable = undefined) {
        if (prevDayTable && value) {
            const regData = prevDayTable.rows.find(row => row.reg === data[0])
            const today = this.getValue(value.split(':')[0], data, prevDayTable)
            const yesterday = value.split(':')[1] && regData ? regData[this.letterToNumber(value.split(':')[1])] : '0'
            const result = _.toNumber(today) - _.toNumber(yesterday)

            return result
        }
        return 0
    }

    getValue(value: string, data: string[], prevDayTable: Svtable = undefined) {
        const cod = typeof value === 'string' ? value.replace(/[A-Za-z]{1,2}/gi, match => {
            const index = this.letterToNumber(match)
            const reg = new RegExp('^[A-Za-z(]')
            const reg2 = new RegExp(':')
            if (reg2.test(data[index])) {
                return this.getPerDay(data[index], data, prevDayTable)
            }
            if (reg.test(data[index])) {
                return this.getValue(data[index], data)
            }
            return !data[index] ?  '0' : typeof data[index] === 'number' ? data[index] : data[index].replace(/,/, '.')
        }) : value

        try {
            if (eval(cod) === Infinity) { return 'Дел_На_Ноль' }
            return eval(cod) ? _.toString(_.round(_.toNumber(eval(cod)), 2)) : '0'
        } catch {
            return 'Ошиб_Формулы'
        }

    }

    svtableToSheet(table: Svtable, prevDayTable: Svtable): any {
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
                return this.getColTotal(col, table, prevDayTable)
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
            // row => row.data.map((_, i) => i === 0 ? row.data[0] : this.getCellValue(table.cols[i-1], row.data))
            row => row.data.map((_, i) => {
                if (i === 0) return row.data[0];
                if (table.cols[i-1]?.type === 'perday') {
                    return this.getPerDay(row.data[i], row.data, prevDayTable);
                }
                return this.getCellValue(table.cols[i-1], row.data, prevDayTable);
            })
        )

        return XLSX.utils.aoa_to_sheet(result.concat([['', table.name]], [['']], exth, [header], data, [total]))
    }
}
