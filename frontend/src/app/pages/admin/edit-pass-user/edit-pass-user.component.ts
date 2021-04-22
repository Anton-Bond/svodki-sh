import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api'

import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-edit-pass-user',
  templateUrl: './edit-pass-user.component.html',
  styleUrls: ['./edit-pass-user.component.scss'],
  providers: [MessageService]
})
export class EditPassUserComponent implements OnInit {
    form: FormGroup
    userId: string = ''

    constructor(
        private usersService: UsersService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            password: new FormControl(null, [
                Validators.required,
                Validators.minLength(6)
            ]),
            repeatPassword: new FormControl(null, [
                Validators.required,
                Validators.minLength(6)
            ]),
        })

        //id: this.config.id
        this.userId = this.config.data.id
    }

    onSubmit() {
        this.form.disable()
        this.usersService
            .updatePass(this.userId, this.form.get('password').value)
            .subscribe(user => {
                    this.ref.close({
                        message: user ? 'Пароль успешно изменен' : 'Что-то пошло не так!'
                    });
                },
                (e) => {
                    console.log('error >>', e)
                    this.messageService.add({ severity:'error', detail: 'Что-то пошло не так!' })
                }
            )
        this.form.enable()
    }

}
