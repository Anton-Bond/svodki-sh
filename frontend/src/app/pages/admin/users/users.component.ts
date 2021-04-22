import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { DialogService } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api'

import { UsersService } from '../../../services/users.service'
import { User } from '../../../shared/interfaces'
import { TRANSLATE } from '../../../shared/translate'
import { ROLE, REGIONS } from '../../../shared/constants'
import { EditPassUserComponent } from '../edit-pass-user/edit-pass-user.component'
import { EditUserComponent } from '../edit-user/edit-user.component'
import { AddNewUserComponent } from '../add-new-user/add-new-user.component'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DialogService, MessageService]
})
export class UsersComponent implements OnInit {
    isLoaded = false
    users: User[] = []
    scrollable: boolean = false

    constructor(
        private dialogService: DialogService,
        private usersService: UsersService,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.fetchUsers()
    }

    fetchUsers() {
        this.usersService.getAllUsers().subscribe((users: User[]) => {
            this.users = users
            this.isLoaded = true
            this.scrollable = users.length > 8
        })
    }

    getReadabilityRegName(code: string) {
        const isRegion = REGIONS.find(r => r.code === code)
        return isRegion ? isRegion.name : code
    }
    getReadabilityRole(role: string) {
        return TRANSLATE.ROLE[role]
    }

    editUser(userId, name) {
        const ref = this.dialogService.open(EditUserComponent, {
            data: {
                id: userId
            },
            header: `Редактирование пользователя: ${name}`,
            width: '40%'
        })

        ref.onClose.subscribe(payload => {
            if (payload) {
                this.messageService.add({ severity:'success', detail: payload.message })
            }
            this.fetchUsers()
        });
    }

    changePassword(userId, name) {
        const ref = this.dialogService.open(EditPassUserComponent, {
            data: {
                id: userId
            },
            header: `Введите новый пароль для: ${this.getReadabilityRegName(name)}`,
            width: '40%'
        })

        ref.onClose.subscribe(payload => {
            if (payload) {
                this.messageService.add({ severity:'success', detail: payload.message })
            }
        });
    }

    addNew() {
        const ref = this.dialogService.open(AddNewUserComponent, {
            header: 'Регистрация нового пользователя',
            width: '40%'
        })

        ref.onClose.subscribe(payload => {
            if (payload) {
                this.messageService.add({ severity:'success', detail: payload.message })
            }
            this.fetchUsers()
        });
    }

}
