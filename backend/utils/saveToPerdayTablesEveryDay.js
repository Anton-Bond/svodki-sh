const moment = require('moment')
const _ = require('lodash')

const Svtable = require('../models/svtable.model')
const PerdayTable = require('../models/perdayTable.model')

const letterToNumber = (str) => {
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

const getPerDay = (prevRows, value, data) => {
    if (prevRows) {
        const regData = prevRows.find(row => row.reg === data[0])
        const today = getValue(value.split(':')[0], data, prevRows)
        const yesterday = regData[letterToNumber(value.split(':')[1])]

        return _.toNumber(today) - _.toNumber(yesterday)
    }
    return 0
}

const getValue = (value, data, prevRows) => {
    try {
        const cod = value.replace(/[A-Za-z]{1,2}/gi, match => {
            const index = letterToNumber(match)

            const reg = new RegExp('^[A-Za-z(]')
            const reg2 = new RegExp(':')
            if (reg2.test(data[index])) {
                return getPerDay(prevRows, data[index], data)
            }
            if (reg.test(data[index])) {
                return getValue(data[index], data, prevRows)
            }

            return data[index] ? data[index] : 0
        })
        return eval(cod) ? _.toString(_.round(_.toNumber(eval(cod)), 2)) : 0
    } catch {
        return 0
    }

}

const getCellValue = (prevRows, col, data) => {
    const value = data[col.idx]
    if (col.type === 'formula' || col.type === 'percentage') {
        return getValue(value, data, prevRows)
    } else if (col.type === 'perday') {
        return prevRows.length > 0 ? getPerDay(prevRows, value, data) : 0
    } else {
        return value
    }
}

module.exports = async () => {
    try {
        const resTables = []
        const curDate = moment().format('DD-MM-YYYY')
        const prevDate = moment(curDate, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY')

        const curTables = await Svtable.find({ svtableDate: curDate })
        const prevTables = await PerdayTable.find({ date: prevDate })

        if (curTables.length > 0) {
            curTables.forEach((t, i) => {
                const newRows = []
                const cols = t.cols ? JSON.parse(t.cols) : []
                const rows = t.rows ? JSON.parse(t.rows) : []

                try {
                    const prevTable = prevTables.find(i => i.svtableId === t.svtableId)
                    const prevRows = prevTable ? JSON.parse(prevTable.rows) : []

                    rows.forEach(row => {
                        const newRow = { reg: row.data[0]}
                        cols.forEach(col => {
                            newRow[col.idx] = getCellValue(prevRows, col, row.data)
                        })
                        newRows.push(newRow)
                    })
                } catch (err) {
                    newRows.push({})
                    console.log(' [e] error while add to newRows')
                }

                resTables.push({
                    svtableId: t.svtableId,
                    date: t.svtableDate,
                    rows: JSON.stringify(newRows)
                })
                
            })
            await PerdayTable.create(resTables)
            console.log(' [i] perday tables was seccessully created')
        } else {            
            console.log(' [i] perday tables was not created')
        }
    } catch (e) {
        console.log(' [X] Some error occurred while receiving svod table. ', e)
    }
}
