import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  templateUrl: './question.base.component.html'
})
export class BaseQuestionComponent implements  ControlValueAccessor {
  type = 'base';
  selected: any;
  @Input() question;
  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  get value(): any {
    return this.selected;
  }

  set value(v: any) {
    if (v !== this.selected) {
      this.selected = v;
      this.onChangeCallback(v);
    }
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
}
