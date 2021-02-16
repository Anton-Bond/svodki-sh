import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-svod-table',
    templateUrl: './svod-table.component.html',
    styleUrls: ['./svod-table.component.scss']
})
export class SvodTableComponent implements OnInit {

    // products: Object[] = [
    //     {code: '1-2', name: 'some name', category: 'categ', quantity: 'bla-bla'},
    //     {code: '1-2', name: 'some name', category: 'categ', quantity: 'bla-bla'},
    //     {code: '1-2', name: 'some name', category: 'categ', quantity: 'bla-bla'},
    //     {code: '1-2', name: 'some name', category: 'categ', quantity: 'bla-bla'},
    //     {code: '1-2', name: 'some name', category: 'categ', quantity: 'bla-bla'},
    //     {code: '1-2', name: 'some name', category: 'categ', quantity: 'bla-bla'},
    //     {code: '1-2', name: 'some name', category: 'categ', quantity: 'bla-bla'},
    //     {code: '1-2', name: 'some name', category: 'categ', quantity: 'bla-bla'},
    //     {code: '1-2', name: 'some name', category: 'categ', quantity: 'bla-bla'},
    //     {code: '1-2', name: 'some name', category: 'categ', quantity: 'bla-bla'}
    // ]

    reg: Object[] = [
        { name: 'Брагинский', a: '45', b: '5', c: '26', e: '7', f: '83', g: '9', h: '10', k: '14', l: '12' },
        { name: 'Б-Кошелевск.', a: '14', b: '12', c: '53', e: '14', f: '15', g: '16', h: '20', k: '18', l: '19' },
        { name: 'Ветковский', a: '36', b: '87', c: '1', e: '3', f: '76', g: '27', h: '86', k: '4', l: '9' },
        { name: 'Гомельский', a: '19', b: '187', c: '871', e: '8', f: '86', g: '86', h: '7', k: '3', l: '86' },
        { name: 'Добрушский', a: '8', b: '3', c: '7', e: '5', f: '0', g: '7', h: '8', k: '6', l: '53' },
        { name: 'Ельский', a: '53', b: '83', c: '8', e: '88', f: '38', g: '86', h: '3', k: '56', l: '83' },
        { name: 'Житковичск.', a: '56', b: '69', c: '6', e: '68', f: '36', g: '34', h: '82', k: '86', l: '68' },
        { name: 'Жлобинский', a: '56', b: '76', c: '2', e: '68', f: '19', g: '86', h: '82', k: '8', l: '68' },
        { name: 'Калинкович.', a: '8', b: '76', c: '42', e: '86', f: '1919', g: '68', h: '28', k: '48', l: '86' },
        { name: 'Кормянский', a: '6', b: '35', c: '568', e: '686', f: '19', g: '18', h: '28', k: '25', l: '' },
        { name: 'Лельчицкий', a: '9', b: '6', c: '56', e: '54', f: '52', g: '25', h: '68', k: '86', l: '686' },
        { name: 'Лоевский', a: '52', b: '53', c: '35', e: '89', f: '899', g: '42', h: '52', k: '52', l: '5' },
        { name: 'Мозырский', a: '58', b: '68', c: '47', e: '89', f: '5', g: '54', h: '25', k: '5', l: '52' },
        { name: 'Наровлянск.', a: '68', b: '3', c: '47', e: '89', f: '89', g: '75', h: '75', k: '83', l: '83' },
        { name: 'Октябрьский', a: '58', b: '2', c: '47', e: '538', f: '4', g: '53', h: '53', k: '5354', l: '83' },
        { name: 'Петриковск.', a: '53', b: '8', c: '58', e: '57', f: '83', g: '98', h: '86', k: '86', l: '68' },
        { name: 'Речицкий', a: '35', b: '0', c: '83', e: '58', f: '63', g: '63', h: '36', k: '36', l: '654' },
        { name: 'Рогачевский', a: '75', b: '87', c: '0', e: '850', f: '8', g: '9', h: '37', k: '18', l: '8' },
        { name: 'Светлогорск.', a: '75', b: '85', c: '85', e: '58', f: '7', g: '78', h: '78', k: '87', l: '36' },
        { name: 'Хойникский', a: '57', b: '85', c: '58', e: '9', f: '6', g: '69', h: '53', k: '3', l: '53' },
        { name: 'Чечерский', a: '8', b: '8', c: '96', e: '69', f: '69', g: '38', h: '53', k: '53', l: '87' },
    ]

    constructor() { }

    ngOnInit(): void {
    }

}
