import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'counter',
  template: `
<div id="wrap" class="ct-wrap ct-anim"
  [class.blink]="blink"
>
  <div class="ct-count"
    [class.ct-1x]="size === 'small'"
    [class.ct-2x]="size === 'medium'"
    [class.ct-3x]="size === 'big'"
  >
    {{countValue}}
  </div>
</div>
  `,
  styles: [`
.ct-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #d6f0f9;
  border: solid 5px #d6f0f9;
  color: blue;
}

.ct-anim {
  -webkit-transition: background-color 250ms, border-top-color 250ms, border-bottom-color 250ms, border-right-color 250ms, border-left-color 250ms;
  transition: background-color 250ms, border-top-color 250ms, border-bottom-color 250ms, border-right-color 250ms, border-left-color 250ms;
}

.blink {
  background-color: #c0d0f0;
}

.border-top {
  border-top-color: #0000e0;
}

.border-right {
  border-right-color: #0000e0;
}

.border-bottom {
  border-bottom-color: #0000e0;
}

.border-left {
  border-left-color: #0000e0;
}

.ct-count {
  font-family: Arial;
  position: relative;
  text-align: center;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.ct-3x {
  font-size: 24px;
  font-weight: bold;
}

.ct-2x {
  font-size: 20px;
  font-weight: bold;
}

.ct-1x {
  font-size: 16px;
  font-weight: bold;
}
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CounterComponent),
      multi: true
    }
  ]
})
export class CounterComponent implements ControlValueAccessor, OnInit {

  @Output() change = new EventEmitter<number>();
  @Input() size: string = 'medium';
  @Input() interval: number = 1000;
  @Input() limit: number = 10;
  private _countValue = 0;
  @Input() set countValue(val) {
    this._countValue = val;
    this.propagateChange(this._countValue);
  }
  get countValue() {
    return this._countValue;
  }

  private blink: boolean = false;
  private timerCt: any;
  private timerAnim: any;

  constructor() {}

  ngOnInit() {
    this.timerCt = setInterval(() => {
      if (this.countValue === this.limit) {
        clearInterval(this.timerCt);
        return;
      }
      this.countValue++;
    }, this.interval);

    this.timerAnim = setInterval(() => {
      if (this.countValue === this.limit) {
        this.blink = false;
        clearInterval(this.timerAnim);
        return;
      }
      this.blink = !this.blink;
    }, this.interval / 2);
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.countValue = value;
    }
  }

  private propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}