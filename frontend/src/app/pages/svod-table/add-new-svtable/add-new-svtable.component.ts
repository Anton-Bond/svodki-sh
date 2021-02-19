import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import { sortBy } from "lodash"
import { MenuItem } from 'primeng/api'

import { Svtable } from '../../../shared/interfaces'
import { REGIONS } from '../../../shared/constants'

@Component({
  selector: 'app-add-new-svtable',
  templateUrl: './add-new-svtable.component.html',
  styleUrls: ['./add-new-svtable.component.scss']
})
export class AddNewSvtableComponent implements OnInit {
    svtable: Svtable = {
        svtableDate: moment().format('DD-MM-YYYY'),
        name: '',
        cols: [],
        rows: []
    }
    cols: any[]
    selectedCol: number = 0
    items: MenuItem[]

    constructor() { }

    ngOnInit(): void {
        REGIONS.forEach(reg => {
            this.svtable.rows.push({region: reg.code, data: [reg.name, '']})
        })
        this.svtable.cols = [
            { idx: 1, header: '', type: 'value'  }
        ]

        this.items = [
            {label: 'Добавть колонку', icon: 'pi pi-plus-circle', command: () => this.addColumn(this.selectedCol)},
            {label: 'Удалить колонку', icon: 'pi pi-minus-circle', command: () => this.deleteColumt(this.selectedCol)}
        ];
    }

    addColumnToTheEnd() {
        const nextIdx = this.svtable.cols.reduce((res, curr) => curr.idx > res ? curr.idx : res, 1) + 1
        this.svtable.cols.push({ idx: nextIdx, header: '', type: 'value' })
        this.svtable.rows.forEach(r => r.data.push(''))
    }

    addColumn(idx: number) {
        // related COLS
        const newtIdx = idx + 1
        const tempCols = this.svtable.cols.map(col =>
            col.idx > idx ? ({ idx: ++col.idx, header: col.header, type: col.type }) : col
        )
        tempCols.splice(newtIdx, 0, { idx: newtIdx, header: '', type: 'value'  })
        this.svtable.cols = sortBy(tempCols, c => c.idx)

        // related ROWS
        this.svtable.rows.forEach(r => r.data.splice(newtIdx, 0, ''))
        this.selectedCol = 0
    }

    deleteColumt(idx: number) {

        console.log('onDelete coll >>>', idx)
    }


    showTable(selcol: number) {
        console.log('table >>> ', this.svtable)


        // this.messageService.add({severity: 'info', summary: 'Product Selected', detail: 'datail' });
    }
}
