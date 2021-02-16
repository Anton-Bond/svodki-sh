import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { DialogService } from 'primeng/dynamicdialog'

import { UsersService } from '../../../services/users.service'
import { User } from '../../../shared/interfaces'
import { TRANSLATE } from '../../../shared/translate'
import { ROLE } from '../../../shared/constants'
import { EditPassUserComponent } from '../edit-pass-user/edit-pass-user.component'
import { EditUserComponent } from '../edit-user/edit-user.component'
import { AddNewUserComponent } from '../add-new-user/add-new-user.component'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DialogService]
})
export class UsersComponent implements OnInit {
    isLoaded = false
    users: User[] = []
    scrollable: boolean = false

    constructor(
        public dialogService: DialogService,
        private usersService: UsersService,
        private route: ActivatedRoute
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

    getReadabilityRole(role: string) {
        return TRANSLATE.ROLE[role];
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
                alert(payload.message)
            }
            this.fetchUsers()
        });
    }

    changePassword(userId, name) {
        const ref = this.dialogService.open(EditPassUserComponent, {
            data: {
                id: userId
            },
            header: `Введите новый пароль для: ${name}`,
            width: '40%'
        })

        ref.onClose.subscribe(payload => {
            if (payload) {
                alert(payload.message)
            }
        });
    }

    addNew() {
        const ref = this.dialogService.open(AddNewUserComponent, {
            header: 'Создание нового пользователя',
            width: '40%'
        })

        ref.onClose.subscribe(payload => {
            if (payload) {
                alert(payload.message)
            }
            this.fetchUsers()
        });
    }

}
