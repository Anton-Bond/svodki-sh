import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import { pickBy, sortBy, omit, pick } from "lodash";

import { Svtable } from '../../../shared/interfaces'
import { REGIONS } from '../../../shared/constants'

@Component({
  selector: 'app-add-new-svtable',
  templateUrl: './add-new-svtable.component.html',
  styleUrls: ['./add-new-svtable.component.scss']
})
export class AddNewSvtableComponent implements OnInit {
    currentCol: number = 0
    svtable: Svtable = {
        svtableDate: moment().format('DD-MM-YYYY'),
        name: '',
        cols: [],
        rows: []
    }
    cols: any[]

    constructor() { }

    ngOnInit(): void {
        REGIONS.forEach(reg => {
            this.svtable.rows.push({region: reg.code, data: [reg.name, '']})
        })
        this.svtable.cols = [
            { idx: 1, header: '', type: 'value'  }
        ]
    }

    addColumnToTheEnd() {
        const nextIdx = this.svtable.cols.reduce((res, curr) => curr.idx > res ? curr.idx : res, 1) + 1
        this.svtable.cols.push({ idx: nextIdx, header: '', type: 'value' })
        // this.svtable.rows = this.svtable.rows.map(r => pickBy({ ...r, ['C' + nextIdx]: '' }, v => true ))
        this.svtable.rows.forEach(r => r.data.push(''))
    }

    setCurrentCol(idx: number) {
        this.currentCol = idx
    }

    addColumn() {
        // related COLS
        const newtIdx = this.currentCol + 1
        const tempCols = this.svtable.cols.map(col =>
            col.idx > this.currentCol ? ({ idx: ++col.idx, header: col.header, type: col.type }) : col
        )
        tempCols.splice(newtIdx, 0, { idx: newtIdx, header: '', type: 'value'  })
        this.svtable.cols = sortBy(tempCols, c => c.idx)

        // related ROWS
        this.svtable.rows.forEach(r => r.data.splice(newtIdx, 0, ''))
    }



    showTable() {
        console.log('table >>> ', this.svtable)
    }
}


// REGION DATA HOW OBJECT

// import { Component, OnInit } from '@angular/core'
// import * as moment from 'moment'
// import { pickBy, sortBy, omit, pick } from "lodash";

// import { Svtable } from '../../../shared/interfaces'
// import { REGIONS } from '../../../shared/constants'

// @Component({
//   selector: 'app-add-new-svtable',
//   templateUrl: './add-new-svtable.component.html',
//   styleUrls: ['./add-new-svtable.component.scss']
// })
// export class AddNewSvtableComponent implements OnInit {
//     currentCol: number = 0
//     svtable: Svtable = {
//         svtableDate: moment().format('DD-MM-YYYY'),
//         name: '',
//         cols: [],
//         rows: []
//     }
//     cols: any[]

//     constructor() { }

//     ngOnInit(): void {
//         REGIONS.forEach(reg => {
//             this.svtable.rows.push({region: reg.code, C1: ''})
//         })
//         this.svtable.cols = [
//             { idx: 1, header: '', type: 'value'  }
//         ]
//     }

//     translateCode(code: string) {
//         return REGIONS.find(r => r.code === code).name
//     }

//     addColumnToTheEnd() {
//         const nextIdx = this.svtable.cols.reduce((res, curr) => curr.idx > res ? curr.idx : res, 1) + 1
//         this.svtable.cols.push({ idx: nextIdx, header: '', type: 'value' })
//         this.svtable.rows = this.svtable.rows.map(r => pickBy({ ...r, ['C' + nextIdx]: '' }, v => true ))
//     }

//     setCurrentCol(idx: number) {
//         this.currentCol = idx
//     }

//     addColumn() {
//         // related COLS
//         const newtIdx = this.currentCol + 1
//         const tempCols = this.svtable.cols.map(col =>
//             col.idx > this.currentCol ? ({ idx: ++col.idx, header: col.header, type: col.type }) : col
//         )
//         tempCols.splice(newtIdx, 0, { idx: newtIdx, header: '', type: 'value'  })
//         this.svtable.cols = sortBy(tempCols, c => c.idx)

//         // related ROWS  {region: "bragin", C1: "1", C3: "3", C5: "5", C4: "4", …}
//         let arr = []
//         const temp = {}

//         console.log('temp ROWS>>', temp)
//     }



//     showTable() {
//         console.log('table >>> ', this.svtable)
//     }
// }
