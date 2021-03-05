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
    currentDate: string
    currentUserName: string = ''
    isAdmin: boolean = false
    calenDate: Date

    constructor(
        private utilsServive: UtilsService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.utilsServive.dateUpdated.subscribe(
            () => {
              this.currentDate = this.utilsServive.getHumCurrentDate()
            }
          );
        this.currentDate = this.utilsServive.getHumCurrentDate()
        this.currentUserName = this.authService.getCurrentUser().name
        this.isAdmin = this.authService.getCurrentUser().role === ROLE.ADMIN
    }

    onLogout() {
        this.router.navigate([`/`])
        this.authService.logout()
    }

    setCurrentDate() {
        if (this.calenDate && moment(this.calenDate).format('DD-MM-YYYY') !== this.utilsServive.getCurrentDate()) {
            console.log('click')
            this.utilsServive.setCurrentDate(this.calenDate)
        }
    }
}
