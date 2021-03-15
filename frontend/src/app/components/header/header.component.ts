import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import * as moment from 'moment'

import { UtilsService } from '../../services/utils.service'
import { AuthService } from '../../services/auth.service'
import { ROLE } from '../../shared/constants'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    blockContent: boolean
    currentDate: string
    currentUserName: string = ''
    isAdmin: boolean = false
    calenDate: Date

    constructor(
        private utilsService: UtilsService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.utilsService.blockContentUpdated.subscribe(
            () => {
                this.blockContent = this.utilsService.getBlockContent()
            }
        )
        this.utilsService.dateUpdated.subscribe(
            () => {
              this.currentDate = this.utilsService.getHumCurrentDate()
            }
        )
        this.blockContent = this.utilsService.getBlockContent()
        this.currentDate = this.utilsService.getHumCurrentDate()
        this.currentUserName = this.authService.getCurrentUser().name
        this.isAdmin = this.authService.getCurrentUser().role === ROLE.ADMIN
    }

    onLogout() {
        this.router.navigate([`/`])
        this.authService.logout()
    }

    setCurrentDate() {
        this.utilsService.setCurrentDate(this.calenDate)
    }
}
