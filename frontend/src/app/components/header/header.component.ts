import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { UtilsService } from '../../services/utils.service'
import { AuthService } from '../../services/auth.service'
import { User } from '../../shared/interfaces'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    blockContent: boolean
    currentDate: string
    calenDate: Date
    currentUser: User

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
        this.currentUser = this.authService.getCurrentUser()
    }

    onLogout() {
        this.router.navigate([`/`])
        this.authService.logout()
    }

    setCurrentDate() {
        this.utilsService.setCurrentDate(this.calenDate)
    }
}
