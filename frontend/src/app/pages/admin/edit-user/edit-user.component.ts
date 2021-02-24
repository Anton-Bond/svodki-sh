import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

import { User } from '../../../shared/interfaces';
import { UsersService } from '../../../services/users.service';
import { ROLES, ROLE, REGIONS } from '../../../shared/constants';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
    isLoaded: boolean = false
    form: FormGroup
    user: User
    roles: Object[] = ROLES
    userId: string = ''
    noeditable: boolean = true
    someRegion: string = ROLE.REGION
    regions: any[] = REGIONS

    constructor(
        private route: ActivatedRoute,
        private usersService: UsersService,
        private router: Router,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(null, Validators.required),
            email: new FormControl(null, Validators.required),
            role: new FormControl(null, Validators.required),
        })

        this.userId = this.config.data.id

        this.form.disable();

        this.route.params
            .pipe(
                switchMap((params: Params) => {
                    if (this.userId) {
                        return this.usersService.getById(this.userId)
                    }
                    return of(null)
                })
            )
            .subscribe(
                (user: User) => {
                    if (user) {
                        this.user = user
                        this.form.patchValue({
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        })
                    }

                    this.form.enable()
                    this.isLoaded = true
                    this.noeditable = user.role === ROLE.REGION || user.email === 'admin@test.by'
                },
                (error) => alert(error.error.message)
            )

        // this.route.params
        //     .pipe(
        //         switchMap((params: Params) => {
        //             if (params['userId']) {
        //                 return this.usersService.getById(params['userId'])
        //             }
        //             return of(null)
        //         })
        //     )
        //     .subscribe(
        //         (user: User) => {
        //             if (user) {
        //                 this.userName = user.name
        //                 this.user = user
        //                 this.form.patchValue({
        //                     name: user.name,
        //                     email: user.email,
        //                     role: user.role,
        //                 })
        //             }

        //             this.form.enable()
        //             this.isLoaded = true
        //         },
        //         (error) => alert(error.error.message)
        //     )
    }

    // remove product from DB
    removeById() {
        this.usersService.removeById(this.user.userId).subscribe(() =>
            this.router.navigate(['/sv-admin'], {
                queryParams: {
                    deleteSuccess: true,
                },
            })
        )
    }

    onSubmit() {
        this.form.disable()
        this.usersService
            .update(this.user.userId, this.form.value)
            .subscribe(user => {
                this.ref.close({
                    message: user ? 'Профиль пользователя успешно изменен' : 'Что-то пошло не так!'
                })
            },
            (e) => {
                console.log('error >>', e)
                alert('Something went wrong!');
            }
            )
        // this.usersService
        //     .update(this.user.userId, this.form.value)
        //     .subscribe(user => {
        //         this.router.navigate(['/sv-admin', 'users'],
        //             { queryParams: { saveSuccess: true, userName: user.name }
        //         })
        //     })
        this.form.enable()
    }


    removeUser() {
        this.usersService
            .removeById(this.user.userId)
            .subscribe(user => {
                this.ref.close({
                    message: user ? 'Профиль пользователя был удален' : 'Что-то пошло не так!'
                })
            },
            (e) => {
                console.log('error >>', e)
                alert('Something went wrong!');
            }
            )
    }
}
