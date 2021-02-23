import { Component, OnInit } from '@angular/core'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
  selector: 'app-formula-input-modal',
  templateUrl: './formula-input-modal.component.html',
  styleUrls: ['./formula-input-modal.component.scss']
})
export class FormulaInputModalComponent implements OnInit {
    formula: string = ''

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        this.formula = this.config.data.formula
    }

    onSave() {
        this.ref.close({
            formula: this.formula
        })
    }

}
