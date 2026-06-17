import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDestaqueGrade]',
  standalone: true
})
export class DestaqueGradeDirective implements OnChanges {
  @Input() appDestaqueGrade = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  ngOnChanges(): void {
    if (this.appDestaqueGrade) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'border-color', '#16a34a');
      this.renderer.setStyle(this.elementRef.nativeElement, 'background', '#f0fdf4');
      this.renderer.setStyle(this.elementRef.nativeElement, 'box-shadow', '0 0 0 3px rgba(22, 163, 74, 0.12)');
      return;
    }

    this.renderer.removeStyle(this.elementRef.nativeElement, 'border-color');
    this.renderer.removeStyle(this.elementRef.nativeElement, 'background');
    this.renderer.removeStyle(this.elementRef.nativeElement, 'box-shadow');
  }
}
