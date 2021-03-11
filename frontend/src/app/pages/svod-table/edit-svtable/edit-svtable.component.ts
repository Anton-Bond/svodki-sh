import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core'
import { HostListener } from "@angular/core"
import * as moment from 'moment'
import { sortBy, times } from 'lodash'
import { MenuItem } from 'primeng/api'
import { DialogService } from 'primeng/dynamicdialog'

import { Svtable } from '../../../shared/interfaces'
import { REGIONS } from '../../../shared/constants'
import { FormulaInputModalComponent } from '../../../components/formula-input-modal/formula-input-modal.component'
import { UtilsService } from '../../../services/utils.service'
import { SvtablesService } from '../../../services/svtables.service'

@Component({
  selector: 'app-edit-svtable',
  templateUrl: './edit-svtable.component.html',
  styleUrls: ['./edit-svtable.component.scss'],
  providers: [DialogService]
})
export class EditSvtableComponent implements OnInit {
    @Input() editedSvtable: Svtable
    editMode: boolean = false
    initialRows: any[] = []
    emptySvtable: Svtable = {
        svtableDate: '',
        name: '',
        cols: [],
        rows: []
    }
    svtable: Svtable
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

    @Output() onCancel = new EventEmitter()
    @Output() onUpdate = new EventEmitter<Svtable>()
    @Output() onAddNew = new EventEmitter<Svtable>()
    @Output() onRemove = new EventEmitter<string>()

    ngOnInit(): void {
        if (this.editedSvtable) {
            this.editMode = true
            this.svtable = this.editedSvtable
        } else {
            REGIONS.forEach(reg => {
                this.initialRows.push({region: reg.code, data: [reg.name, '']})
            })

            this.emptySvtable.svtableDate = this.utilsService.getCurrentDate()
            this.emptySvtable.rows = this.initialRows
            this.emptySvtable.cols = [
                { idx: 1, header: '', type: 'value'  }
            ]
            this.svtable = this.emptySvtable
        }

        this.items = [
            {label: 'Добавть колонку', icon: 'pi pi-plus-circle', command: () => this.addColumn(this.selectedCol)},
            {label: 'Удалить колонку', icon: 'pi pi-minus-circle', command: () => this.deleteColumn(this.selectedCol)},
            {label: 'Формат', icon: 'pi pi-sliders-h', items: [
                {label: 'Значение', icon: 'pi pi-pencil', command: () => this.setValueCol(this.selectedCol)},
                {label: 'Формула', icon: 'pi pi-percentage', command: () => this.setFormulaCol(this.selectedCol)},
                {label: 'Норматив', icon: 'pi pi-book', command: () => this.setNormfCol(this.selectedCol)}
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

    setNormfCol(idx: number) {
        this.svtable.cols.forEach(c => {
            if (c.idx === idx) {
                c.type = 'norm'
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
        if (this.editMode) {
            this.svtablesService.updateOne(this.svtable).subscribe(svtable => {
                if (svtable) {
                    this.onUpdate.emit(svtable)
                    alert('Таблица была изменена')
                } else {
                    alert('Что-то пошло не так! Таблица не была изменена.')
                }
            },
                (e) => alert(e.error.message)
            )
        } else {
            this.svtablesService.addNew(this.svtable).subscribe(svtable => {
                if (svtable) {
                    this.onAddNew.emit(svtable)
                    alert('Новая таблица добавлена в базу')
                } else {
                    alert('Что-то пошло не так! Новая таблица не была добавлена.')
                }
            },
                (e) => alert(e.error.message)
            )
        }
    }

    cancelChanges() {
        this.onCancel.emit()
    }

    removeOne() {
        const isDelete = confirm('Вы действительно хотите удалить таблицу безвозвратно?')
        if (isDelete) {
                this.svtablesService.removeOne(this.svtable.svtableId).subscribe(svtable => {
                if (svtable) {
                    this.onRemove.emit(svtable.svtableId)
                    alert(`Таблица была удалена!`)
                } else {
                    alert('Что-то пошло не так! Таблица не была удалена.')
                }
            },
                (e) => alert(e.error.message)
            )
        }
    }
}
