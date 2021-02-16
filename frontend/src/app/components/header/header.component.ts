import { Component, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { Router } from '@angular/router'
import * as moment from 'moment'

import { AuthService } from '../../services/auth.service'
import { ROLE } from '../../shared/constants'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    currentDate: string = ''
    currentUserName: string = ''
    isAdmin: boolean = false
    // items: MenuItem[]
    // activeItem: MenuItem

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.currentDate = moment().lang('ru').format('LL')
        this.currentUserName = this.authService.getCurrentUser().name
        this.isAdmin = this.authService.getCurrentUser().role === ROLE.ADMIN
    }

    onLogout() {
        this.router.navigate([`/`])
        this.authService.logout()
    }

    // ngOnInit() {
    //     this.currentDate = moment().lang('ru').format('LL')
    //     this.items = [
    //         {label: 'Главная', icon: 'pi pi-fw pi-home', routerLink: ['/svod-table']},
    //         {label: 'Пользователи', icon: 'pi pi-fw pi-users', routerLink: ['/sv-admin', 'users']},
    //         {label: 'Настройки', icon: 'pi pi-fw pi-cog', routerLink: ['/sv-admin', 'settings']},
    //         {
    //             label: 'Выход',
    //             icon: 'pi pi-fw pi-sign-out',
    //             command: e => {
    //                 this.router.navigate([`/`])
    //                 this.authService.logout()
    //             }
    //         }
    //     ]
    //     this.activeItem = this.items[1];
    // }



}
