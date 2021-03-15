import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LoginComponent } from './pages/login/login.component'
import { NotFoundComponent } from './pages/not-found/not-found.component'
import { AdminComponent } from './pages/admin/admin.component'
import { UsersComponent } from './pages/admin/users/users.component'
// import { EditUserComponent } from './pages/admin/edit-user/edit-user.component'
import { SvodTableComponent } from './pages/svod-table/svod-table.component'
import { FillInSvtableComponent } from './pages/svod-table/fill-in-svtable/fill-in-svtable.component'

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'sv-admin',
        component: AdminComponent,
        children: [
            { path: '', redirectTo: 'users', pathMatch: 'full' },
            { path: 'users', component: UsersComponent },
            // { path: 'users/:userId', component: EditUserComponent },
            // { path: 'users/passw/:userId/:name', component: UserPasswComponent },
            // { path: 'users/add/new', component: AddUserComponent },
        ]
    },
    { path: 'svod-table', component: SvodTableComponent },
    { path: 'svod-table/region/:userId', component: FillInSvtableComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
