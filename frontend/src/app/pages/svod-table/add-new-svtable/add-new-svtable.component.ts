import { Component, OnInit } from '@angular/core'
import { HostListener } from "@angular/core"
import * as moment from 'moment'
import { sortBy, zip } from "lodash"
import { MenuItem } from 'primeng/api'
import { DialogService } from 'primeng/dynamicdialog'

import { Svtable } from '../../../shared/interfaces'
import { REGIONS } from '../../../shared/constants'
import { FormulaInputModalComponent } from '../../../components/formula-input-modal/formula-input-modal.component'
import { UtilsService } from '../../../services/utils.service'
import { SvtablesService } from '../../../services/svtables.service'

@Component({
  selector: 'app-add-new-svtable',
  templateUrl: './add-new-svtable.component.html',
  styleUrls: ['./add-new-svtable.component.scss'],
  providers: [DialogService]
})
export class AddNewSvtableComponent implements OnInit {
    svtable: Svtable = {
        svtableDate: moment().format('17-02-2021'),
        // svtableDate: moment().format('DD-MM-YYYY'),
        name: '',
        cols: [],
        rows: []
    }
    selectedCol: number = 0
    items: MenuItem[]
    frozenCols: any[] = [{ idx: 0, header: 'Районы', type: 'name'  }]

    screenHeight: number
    screenWidth: number

    constructor(
        private dialogService: DialogService,
        private utilsService: UtilsService,
        private svtablesService: SvtablesService
    ) {
        this.getScreenSize()
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenHeight = window.innerHeight
        this.screenWidth = window.innerWidth
    }

    ngOnInit(): void {
        REGIONS.forEach(reg => {
            this.svtable.rows.push({region: reg.code, data: [reg.name, '']})
        })
        this.svtable.cols = [
            { idx: 1, header: '', type: 'value'  }
        ]

        this.items = [
            {label: 'Добавть колонку', icon: 'pi pi-plus-circle', command: () => this.addColumn(this.selectedCol)},
            {label: 'Удалить колонку', icon: 'pi pi-minus-circle', command: () => this.deleteColumn(this.selectedCol)},
            {label: 'Формат', icon: 'pi pi-sliders-h', items: [
                {label: 'Формула', icon: 'pi pi-percentage', command: () => this.setFormulaCol(this.selectedCol)},
                {label: 'Данные', icon: 'pi pi-pencil', command: () => this.setValueCol(this.selectedCol)}
            ]}
        ];
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

    deleteColumn(idx: number) {
        // related COLS
        const tempCols = this.svtable.cols
        tempCols.splice(idx-1, 1)
        this.svtable.cols = sortBy(tempCols.map(col =>
            col.idx > idx ? ({ idx: --col.idx, header: col.header, type: col.type }) : col
        ), c => c.idx)

        // related ROWS
        this.svtable.rows.forEach(r => r.data.splice(idx, 1))
        this.selectedCol = 0
    }

    setFormulaCol(idx: number) {
        this.svtable.cols.forEach(c => {
            if (c.idx === idx) {
                c.type = 'formula'
            }
        })
        this.selectedCol = 0
    }

    setValueCol(idx: number) {
        this.svtable.cols.forEach(c => {
            if (c.idx === idx) {
                c.type = 'value'
            }
        })
        this.selectedCol = 0
    }

    setFormula(idx: number, value: string) {

        const ref = this.dialogService.open(FormulaInputModalComponent, {
            data: {
                formula: value
            },
            header: 'Формула столбца: ' + this.utilsService.numberToLetter(idx),
            width: '30%'
        })

        ref.onClose.subscribe(payload => {
            if (payload) {
                this.svtable.rows.forEach(r => {r.data[idx] = payload.formula})
            }
        });
    }

    onSubmit() {
        this.svtablesService.addNew(this.svtable).subscribe(svtable => {
            if (svtable) {
                alert('Новая таблица добавлена в базу')
            } else {
                alert('Что-то пошло не так! Новая таблица не была добавлена.')
            }
        },
            (e) => alert(e.error.message)
        )
    }



    // addColumnToTheEnd() {
    //     const nextIdx = this.svtable.cols.reduce((res, curr) => curr.idx > res ? curr.idx : res, 1) + 1
    //     this.svtable.cols.push({ idx: nextIdx, header: '', type: 'value' })
    //     this.svtable.rows.forEach(r => r.data.push(''))
    // }
}
