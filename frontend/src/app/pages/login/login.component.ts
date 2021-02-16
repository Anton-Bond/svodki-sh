import { Component, OnInit, OnDestroy } from '@angular/core'
import { Validators, FormGroup, FormControl } from '@angular/forms'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { AuthService } from '../../services/auth.service'
import { UsersService } from '../../services/users.service'
import { ROLE } from '../../shared/constants'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup
    aSub: Subscription

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl(null, [
                Validators.required,
                Validators.minLength(6),
            ]),
        })

        // this.route.queryParams.subscribe((params: Params) => {
        //     setTimeout(() => {
        //         this.message.text = params['text']
        //         this.message.type = 'success'
        //     }, 5000)
        // })
    }

    ngOnDestroy() {
        if (this.aSub) {
            this.aSub.unsubscribe()
        }
    }

    // private showMessage(text: string, type: string = 'danger') {
    //     // this.message = new Message(type, text);
    //     this.message = { type, text }
    // }

    onSubmit() {
        if (this.form.valid) {
            this.form.disable()
            this.aSub = this.authService.login(this.form.value).subscribe(
                () => {
                    const currentUser = this.authService.getCurrentUser();
                    if (currentUser.role === ROLE.ADMIN) {
                        this.router.navigate([`/sv-admin`])
                    } else {
                        this.router.navigate([`/svod-table/`])
                    }
                },
                (error) => {
                    // this.showMessage(error.error.message)
                    this.form.enable()
                }
            )
        }
    }

}
