import { Component, OnInit } from '@angular/core'
import { HostListener } from "@angular/core"
import * as _ from 'lodash'

import { Svtable } from '../../shared/interfaces'
import { SvtablesService } from '../../services/svtables.service'
import { REGIONS } from '../../shared/constants'
import { UtilsService } from '../../services/utils.service'
import { AuthService } from '../../services/auth.service'

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
    currentDate: string = ''
    svtables: Svtable[]
    currentSvtable: Svtable
    tabs: any[]
    activeTab: number = 0
    frozenCols: any[] = [{ idx: 0, header: 'Районы', type: 'name' }]

    constructor(
        private utilsService: UtilsService,
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
        this.utilsServive.dateUpdated.subscribe(
            () => {
                this.initData()
            }
          );
          this.initData()
    }

    initData() {
        this.currentDate = this.utilsService.getCurrentDate()
        this.svtablesService.getOnCurrentDate(this.currentDate).subscribe((svtables: Svtable[]) => {
            this.svtables = svtables
            this.currentSvtable = svtables.length > 0 ? svtables[0] : null
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
                return eval(cod) ? _.round(_.toNumber(eval(cod)), 2) : '0'
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

            return total ? _.round(total, 2) : '0'
        }
    }
}
