import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

import { UsersService } from '../../../services/users.service';
import { ROLES } from '../../../shared/constants';

@Component({
    selector: 'app-add-new-user',
    templateUrl: './add-new-user.component.html',
    styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements OnInit {
    form: FormGroup
    roles: Object[] = ROLES

    constructor(
        private usersService: UsersService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl(null, Validators.required),
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
            repeatPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
            role: new FormControl(null, Validators.required)
        })
    }

    onSubmit() {
        this.form.disable()

        this.usersService.create(this.form.value)
        .subscribe(user => {
            this.ref.close({
                message: user ? 'Новый пользователь был успешно добавлен' : 'Что-то пошло не так!'
            });
        },
            (e) => alert(e.error.message)
        )

        this.form.enable();
    }
}
