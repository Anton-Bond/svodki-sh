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

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        this.type = this.config.data.type
        if (this.config.data.type !== 'perday') {
            this.formula = this.config.data.formula
        } else {
            this.today = this.config.data.formula.split('-')[0]
            this.yesterday = this.config.data.formula.split('-')[1]
        }
    }

    onSave() {
        this.ref.close({
            formula: this.config.data.type !== 'perday' ? this.formula : this.today + '-' + this.yesterday
        })
    }

}
