import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { AdminComponent } from './pages/admin/admin.component';
import { HeaderComponent } from './components/header/header.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenubarModule } from 'primeng/menubar';
import { EditUserComponent } from './pages/admin/edit-user/edit-user.component';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { EditPassUserComponent } from './pages/admin/edit-pass-user/edit-pass-user.component';
import { AddNewUserComponent } from './pages/admin/add-new-user/add-new-user.component';
import { SvodTableComponent } from './pages/svod-table/svod-table.component';

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent,
        LoginComponent,
        AdminComponent,
        HeaderComponent,
        UsersComponent,
        EditUserComponent,
        EditPassUserComponent,
        AddNewUserComponent,
        SvodTableComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        InputTextModule,
        CheckboxModule,
        ButtonModule,
        RadioButtonModule,
        RippleModule,
        FormsModule,
        ReactiveFormsModule,
        TabViewModule,
        TableModule,
        MenubarModule,
        ProgressSpinnerModule,
        CardModule,
        DividerModule,
        PanelModule,
        PasswordModule,
        TabMenuModule,
        DropdownModule,
        DynamicDialogModule,

        AppRoutingModule       // can be last
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
