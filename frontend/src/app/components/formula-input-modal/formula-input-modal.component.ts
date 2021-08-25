import { Component, OnInit } from '@angular/core'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
  selector: 'app-formula-input-modal',
  templateUrl: './formula-input-modal.component.html',
  styleUrls: ['./formula-input-modal.component.scss']
})
export class FormulaInputModalComponent implements OnInit {
    type: string = ''
    formula: string = ''
    today: string = ''
    yesterday: string = ''
    colTxt: string = ''

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        this.type = this.config.data.type
        this.colTxt = this.config.data.colTxt
        if (this.config.data.type !== 'perday') {
            this.formula = this.config.data.formula
        } else {
            this.today = this.config.data.formula.split(':')[0]
            this.yesterday = this.config.data.formula.split(':')[1]
        }
    }

    onSave() {
        const reg = new RegExp('^[0-9]')
        const reg2 = new RegExp('\\b' + this.colTxt + '\\b', 'i')
        if (reg.test(this.formula)) {
            alert('Формула не должна начинаться с числа!')
        } else if (reg2.test(this.formula)) {
            alert('Ошибка! Рекурсивный вызов!')
        } else {
            this.ref.close({
                formula: this.config.data.type !== 'perday' ? this.formula : this.today + ':' + this.yesterday
            })
        }
    }
}
