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

const getValue = (value, data) => {
    try {
        const cod = value.replace(/[A-Za-z]{1,2}/gi, match => {
            const index = letterToNumber(match)
            return data[index] ?  data[index] : null
        })
        return eval(cod) ? _.toString(_.round(_.toNumber(eval(cod)), 2)) : null
    } catch {
        return null
    }

}

const getCellValue = (prevTable, col, data) => {
    const value = data[col.idx]
    if (col.type === 'formula' || col.type === 'percentage') {
        return this.getValue(value, data)
    } else if (col.type === 'perday') {
        if (prevTable) {
            const regData = prevTable.rows.find(row => row.data[0] === data[0])
            const today = getValue(value.split('-')[0], data)
            const yesterday = getValue(value.split('-')[1], regData.data)
            return _.toNumber(today) - _.toNumber(yesterday)
        }
        return 0
    } else {
        return value
    }
    // if (col.type === 'perday') {
    //     if (prevTable) {
    //         const regData = prevTable.rows.find(row => row.data[0] === data[0])
    //         const today = getValue(value.split('-')[0], data)
    //         const yesterday = getValue(value.split('-')[1], regData.data)
    //         return _.toNumber(today) - _.toNumber(yesterday)
    //     }
    //     return 0
    // }
    // return null
}

module.exports = async () => {
    try {
        const resTables = []
        const curDate = moment().format('DD-MM-YYYY')
        const prevDate = moment(curDate, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY')

        const curTables = await Svtable.find({ svtableDate: curDate })
        const prevTables = await Svtable.find({ svtableDate: prevDate })

        if (curTables.length > 0) {
            curTables.forEach((t, i) => {
                const newRows = []
                const cols = t.cols ? JSON.parse(t.cols) : []
                const rows = t.rows ? JSON.parse(t.rows) : []

                const prevTable = {
                    cols: prevTables[i].cols ? JSON.parse(t.cols) : [],
                    rows: prevTables[i].rows ? JSON.parse(t.rows) : []
                }

                rows.forEach(row => {
                    const newRow = { reg: row.data[0]}
                    cols.forEach(col => {
                        newRow[col.idx] = getCellValue(prevTable, col, row.data)
                        // const value = getCellValue(prevTable, col, row.data)
                        // if (value !== null) {
                            // newRow[col.idx] = value
                        // }
                    })
                    newRows.push(newRow)
                })

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
