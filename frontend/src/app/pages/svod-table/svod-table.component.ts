import { Component, OnInit } from '@angular/core'
import { ConfirmationService, MessageService } from 'primeng/api'
import { HostListener } from "@angular/core"
import * as _ from 'lodash'
import * as moment from 'moment'
import * as XLSX from 'xlsx'

import { Svtable } from '../../shared/interfaces'
import { SvtablesService } from '../../services/svtables.service'
import { REGIONS } from '../../shared/constants'
import { UtilsService } from '../../services/utils.service'
import { AuthService } from '../../services/auth.service'

@Component({
    selector: 'app-svod-table',
    templateUrl: './svod-table.component.html',
    styleUrls: ['./svod-table.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class SvodTableComponent implements OnInit {
    editMode: boolean = false
    ableEdit: boolean = false
    viewMode: boolean = true
    addNewMode: boolean = false
    blockContent: boolean
    screenHeight: number
    screenWidth: number
    currentDate: string = ''
    svtables: Svtable[]
    currentSvtable: Svtable
    tabs: any[]
    activeTab: number = 0
    frozenCols: any[] = [{ idx: 0, header: 'Районы', type: 'name' }]
    fromDate: Date
    total: any[]

    constructor(
        private utilsService: UtilsService,
        private authService: AuthService,
        private svtablesService: SvtablesService,
        private utilsServive: UtilsService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
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
        )
        this.utilsServive.blockContentUpdated.subscribe(
            () => {
                this.blockContent = this.utilsService.getBlockContent()
            }
        )
        this.blockContent = this.utilsService.getBlockContent()
        this.initData()
    }

    initData() {
        this.currentDate = this.utilsService.getCurrentDate()
        this.svtablesService.getOnCurrentDate(this.currentDate).subscribe((svtables: Svtable[]) => {
            this.svtables = svtables
            this.currentSvtable = svtables.length > 0 ? svtables[0] : null
            this.total = this.currentSvtable.cols.map(col => {
                if (col.type === 'percentage') {
                    return this.currentSvtable.rows[0].data[col.idx]
                } else {
                    return this.getColTotal(col)
                }
            })
            this.total.unshift('Всего:')
        })

        // TO DO: get value from server
        this.ableEdit = this.authService.isEditable()
    }

    toggleEditable() {
        this.utilsService.setBlockContent(true)
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
        this.utilsService.setBlockContent(true)
        this.activeTab = -1
        this.addNewMode = true
        this.viewMode = false
    }

    onCancel() {
        this.utilsService.setBlockContent(false)
        if (this.addNewMode) {this.activeTab = 0}
        this.viewMode = true
        this.editMode = false
        this.addNewMode = false
    }

    onUpdate(table: Svtable) {
        this.utilsService.setBlockContent(false)
        this.svtables[this.activeTab] = table
        this.viewMode = true
        this.editMode = false
        this.addNewMode = false
    }

    onAddNew(table: Svtable) {
        this.utilsService.setBlockContent(false)
        const newTab = this.svtables.length
        this.svtables.push(table)
        this.activeTab = newTab
        this.viewMode = true
        this.editMode = false
        this.addNewMode = false
    }

    onRemove(id: string) {
        this.utilsService.setBlockContent(false)
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
        if (col.type === 'formula' || col.type === 'percentage') {
            const cod = value.replace(/[A-Za-z]{1,2}/gi, match => {
                const idx = this.utilsServive.letterToNumber(match)
                return data[idx] ?  data[idx] : '0'
            })
            try {
                return eval(cod) ? _.toString(_.round(_.toNumber(eval(cod)), 2)) : '0'
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

            return total ? _.round(total, 2) : 0
        }
    }

    onCopyFromDate() {
        const date = moment(this.fromDate).format('DD-MM-YYYY')
        this.svtablesService.getOnCurrentDate(date).subscribe((svtables: Svtable[]) => {
            this.svtables = svtables.map(table => {
                table.svtableDate = this.currentDate
                table.cols.forEach(col => {
                    if(col.type === 'value') {
                        table.rows.forEach(row => {
                            row.data[col.idx] = ''
                        })
                    }
                })
                return table
            })
            this.currentSvtable = svtables.length > 0 ? svtables[0] : null

            this.total = this.currentSvtable.cols.map(col => {
                if (col.type === 'percentage') {
                    return this.currentSvtable.rows[0].data[col.idx]
                } else {
                    return this.getColTotal(col)
                }
            })
            this.total.unshift('Всего:')

            if (svtables.length) {
                this.confirmationService.confirm({
                    message: `Вы действительно хотите импортивовать исходные таблицы от ${moment(this.fromDate).locale('ru').format('LL')}?`,
                    header: 'Подтверждение',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'Да',
                    rejectLabel: 'Нет',
                    accept: () => {
                        this.fromDate = null
                        this.svtablesService.addNewSvatebles(this.svtables).subscribe(res => {
                            if (res.success === 'true') {
                                this.messageService.add({severity:'success', summary:'Успешно', detail:'Таблицы были импортированны'})
                            } else {
                                this.svtables = []
                                this.currentSvtable = null
                                this.messageService.add({severity:'error', summary:'Ошибка', detail:'Не удалось ипортировать таблицы'})
                            }
                        })
                    },
                    reject: () => {
                        this.fromDate = null
                        this.svtables = []
                        this.currentSvtable = null
                        this.messageService.add({severity:'warn', summary:'Отклонено', detail:'Таблицы не были импортированны'})
                    }
                });
            } else {
                this.messageService.add({severity:'info', summary:'Нет данных', detail:'На выбранную дату нет сводных таблиц'})
            }
        })
    }

    exportExcel() {
        const wb: XLSX.WorkBook = XLSX.utils.book_new()
        this.svtables.forEach((table, i) => {
            const ws: XLSX.WorkSheet = this.utilsService.svtableToSheet(table)
            XLSX.utils.book_append_sheet(wb, ws, `${i+1}.${_.truncate(table.name, {'length': 15})}`)
        })

        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        this.saveAsExcelFile(excelBuffer, "Сводка")
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        import("file-saver").then(FileSaver => {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            let EXCEL_EXTENSION = '.xlsx'
            const data: Blob = new Blob([buffer], {
                type: EXCEL_TYPE
            })
            FileSaver.saveAs(data, fileName + '__' + this.currentDate + EXCEL_EXTENSION)
        })
    }
}
