import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfirmationService, MessageService } from 'primeng/api'
import * as _ from 'lodash'

import { Svtable, User } from '../../../shared/interfaces'
import { SvtablesService } from '../../../services/svtables.service'
import { UtilsService } from '../../../services/utils.service'
import { AuthService } from '../../../services/auth.service'
import { UsersService } from '../../../services/users.service'

@Component({
  selector: 'app-fill-in-svtable',
  templateUrl: './fill-in-svtable.component.html',
  styleUrls: ['./fill-in-svtable.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class FillInSvtableComponent implements OnInit, OnDestroy {
    blockContent: boolean
    currentDate: string = ''
    svtables: Svtable[]
    currentSvtable: Svtable
    tabs: any[]
    activeTab: number = 0
    currentUser: User

    dayBeforeDate: string = ''
    dayBeforeSvtables: Svtable[]
    dayBeforeCurrentSvtable: Svtable

    constructor(
        private usersService: UsersService,
        private utilsService: UtilsService,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private svtablesService: SvtablesService,
        private utilsServive: UtilsService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        const userId = this.route.snapshot.paramMap.get('userId');
        this.usersService.getById(userId).subscribe((user: User) => this.currentUser = user)
        this.currentDate = this.utilsService.getCurrentDate()
        this.svtablesService.getOnCurrentDate(this.currentDate).subscribe((svtables: Svtable[]) => {
            this.svtables = svtables
            this.currentSvtable = svtables.length > 0 ? this.getCurrentSvatableRegionData(svtables[this.activeTab]) : null
        })

        this.dayBeforeDate = this.utilsService.getDayBefore()
        this.svtablesService.getOnCurrentDate(this.dayBeforeDate).subscribe((svtables: Svtable[]) => {
            this.dayBeforeSvtables = svtables
            this.dayBeforeCurrentSvtable = svtables.length > 0 ? this.getCurrentSvatableRegionData(svtables[this.activeTab]) : null
        })

        this.utilsService.setBlockContent(true)
    }

    ngOnDestroy() { this.utilsService.setBlockContent(false) }

    getCurrentSvatableRegionData(svtable: Svtable): Svtable {
        return ({ ...svtable, rows:  svtable.rows.filter(row => row.region === this.currentUser.name) })
    }

    toggleTab(idx: number) {
        this.activeTab = idx
        this.currentSvtable = this.getCurrentSvatableRegionData(this.svtables[idx])
    }

    toggleTabPrev() {
        if (this.activeTab > 0) {
            this.activeTab--
            this.currentSvtable = this.getCurrentSvatableRegionData(this.svtables[this.activeTab])
        }
    }

    toggleTabNext() {
        if (this.activeTab < this.svtables.length - 1) {
            this.activeTab++
            this.currentSvtable = this.getCurrentSvatableRegionData(this.svtables[this.activeTab])
        }
    }

    getCellValue(col: any, data: string[]): any {
        const value = data[col.idx]
        if (col.type === 'formula' || col.type === 'percentage') {
            const cod = value.replace(/[A-Za-z]{1,2}/gi, match => {
                const idx = this.utilsServive.letterToNumber(match)
                return data[idx] ?  data[idx] : '0'
            })
            try {
                return eval(cod) ? _.round(_.toNumber(eval(cod)), 2) : '0'
            } catch {
                return '-'
            }
        } else {
            return value
        }
    }

    // noLess() {
    //     if (this.dayBeforeCurrentSvtable) {
    //         this.currentSvtable.cols.forEach((col, i) => {
    //             if (col.type === 'value' && this.dayBeforeCurrentSvtable.cols[i].type === 'value') {
    //                 this.currentSvtable.rows[0].data[col.idx] =
    //                 _.toNumber(this.currentSvtable.rows[0].data[col.idx]) >= _.toNumber(this.dayBeforeCurrentSvtable.rows[0].data[col.idx])
    //                     ? this.currentSvtable.rows[0].data[col.idx]
    //                     : this.dayBeforeCurrentSvtable.rows[0].data[col.idx]
    //             }
    //         })
    //     }
    // }

    onSubmit() {
        // this.noLess()
        this.svtablesService.updateOneRegion(this.currentSvtable.svtableDate, this.currentSvtable.svtableId, this.currentSvtable.rows[0]).subscribe(res => {
            if (res.success === 'true') {
                this.messageService.add({severity:'success', summary:'Успешно', detail:'Данные сохранены'})
            } else {
                this.messageService.add({severity:'error', summary:'Ошибка', detail:'Не удалось сохранить данные'})
            }
        })
    }

}
