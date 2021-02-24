import { Component, OnInit } from '@angular/core'
import { HostListener } from "@angular/core"
import { MenuItem } from 'primeng/api'
import * as moment from 'moment'
import * as _ from 'lodash'

import { Svtable } from '../../shared/interfaces'
import { SvtablesService } from '../../services/svtables.service'
import { REGIONS } from '../../shared/constants'
import { UtilsService } from 'src/app/services/utils.service'

@Component({
    selector: 'app-svod-table',
    templateUrl: './svod-table.component.html',
    styleUrls: ['./svod-table.component.scss']
})
export class SvodTableComponent implements OnInit {
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
    }


    toggleTab(idx: number) {
        this.activeTab = idx
        this.currentSvtable = this.svtables[idx]
    }

    createNewTable() {
        this.activeTab = -1
    }

    translateCode(code: string): string {
        return REGIONS.find(r => r.code === code).name
    }

    getCellValue(col: any, data: string[]): string {
        const value = data[col.idx]
        if (col.type === 'formula') {
            const cod = value.replace(/[A-Za-z]{1,2}/gi, match => {
                const idx = this.utilsServive.letterToNumber(match)
                return data[idx] ?  data[idx] : '0'
            })
            try {
                return eval(cod)
            } catch {
                return '?ошибка формулы'
            }
        } else {
            return value
        }
    }

    getColTotal(col: any) {
        if (col.idx === 0) {
            return 'Всего:'
        } else {
            return this.currentSvtable.rows.reduce((sum, row) =>
                sum + _.toNumber(this.getCellValue(col, row.data)), 0)
        }
    }
}
