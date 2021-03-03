import { Component, OnInit } from '@angular/core'
import { HostListener } from "@angular/core"
import { MenuItem } from 'primeng/api'
import * as moment from 'moment'
import * as _ from 'lodash'

import { Svtable } from '../../shared/interfaces'
import { SvtablesService } from '../../services/svtables.service'
import { REGIONS } from '../../shared/constants'
import { UtilsService } from 'src/app/services/utils.service'
import { AuthService } from 'src/app/services/auth.service'

@Component({
    selector: 'app-svod-table',
    templateUrl: './svod-table.component.html',
    styleUrls: ['./svod-table.component.scss']
})
export class SvodTableComponent implements OnInit {
    ableEdit: boolean = false
    viewMode: boolean = true
    editMode: boolean = false
    addNewMode: boolean = false
    screenHeight: number
    screenWidth: number
    // currentDate: string = moment().format('DD-MM-YYYY')
    currentDate: string = moment().format('17-02-2021')
    svtables: Svtable[]
    currentSvtable: Svtable
    tabs: any[]
    activeTab: number = 0
    frozenCols: any[] = [{ idx: 0, header: 'Районы', type: 'name' }]

    constructor(
        private authService: AuthService,
        private svtablesService: SvtablesService,
        private utilsServive: UtilsService
    ) {
        this.getScreenSize()
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenHeight = window.innerHeight
        this.screenWidth = window.innerWidth
    }

    ngOnInit(): void {
        this.svtablesService.getOnCurrentDate(this.currentDate).subscribe((svtables: Svtable[]) => {
            this.svtables = svtables
            this.currentSvtable = svtables[0]
        })
        // TO DO: get value from server
        this.ableEdit = this.authService.isEditable()
    }

    toggleEditable() {
        this.editMode = this.ableEdit
        this.viewMode = false
    }

    toggleTab(idx: number) {
        if(this.viewMode) {
            this.activeTab = idx
            this.currentSvtable = this.svtables[idx]
        }
    }

    createNewTable() {
        this.activeTab = -1
        this.addNewMode = true
        this.viewMode = false
    }

    onCancel() {
        if (this.addNewMode) {this.activeTab = 0}
        this.viewMode = true
        this.editMode = false
        this.addNewMode = false
    }

    onUpdate(table: Svtable) {
        this.svtables[this.activeTab] = table
        this.viewMode = true
        this.editMode = false
        this.addNewMode = false
    }

    onAddNew(table: Svtable) {
        const newTab = this.svtables.length
        this.svtables.push(table)
        this.activeTab = newTab
        this.viewMode = true
        this.editMode = false
        this.addNewMode = false
    }

    onRemove(id: string) {
        const temp = [...this.svtables]
        this.activeTab = 0
        this.svtables = temp.filter(t => t.svtableId !== id)
        this.viewMode = true
        this.editMode = false
        this.addNewMode = false
    }

    translateCode(code: string): string {
        return REGIONS.find(r => r.code === code).name
    }

    getCellValue(col: any, data: string[]): any {
        const value = data[col.idx]
        if (col.type === 'formula') {
            const cod = value.replace(/[A-Za-z]{1,2}/gi, match => {
                const idx = this.utilsServive.letterToNumber(match)
                return data[idx] ?  data[idx] : '0'
            })
            try {
                // return eval(cod)
                return eval(cod) ? _.ceil(_.toNumber(eval(cod)), 2) : '0'
            } catch {
                return '?ошибка формулы'
            }
        } else {
            return value
        }
    }

    getColTotal(col: any): any {
        if (col.idx === 0) {
            return 'Всего:'
        } else {
            const total = this.currentSvtable.rows.reduce((sum, row) => {
                const value = this.getCellValue(col, row.data)
                if (_.isString(value) && value) {
                    return sum + _.toNumber(value.replace(/,/, '.'))
                }
                return sum + 0
            }, 0)

            return total ? total : '0' // +ceil
        }
    }
}
