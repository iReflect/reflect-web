import { Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export class BaseQuestionComponent implements ControlValueAccessor {
    selected: any;
    @Input() question;
    @Input() disabled = false;
    protected onTouchedCallback: () => void = () => {
    }
    protected onChangeCallback: (_: any) => void = () => {
    }

    get value(): any {
        return this.selected;
    }

    set value(v: any) {
        if (v !== this.selected) {
            this.selected = v;
            this.onChangeCallback(this.formatValue(v));
        }
    }

    formatValue(value) {
        // Formats the value in a format which is required in the form
        return value;
    }

    writeValue(value: any): void {
        if (value !== this.selected) {
            this.selected = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
