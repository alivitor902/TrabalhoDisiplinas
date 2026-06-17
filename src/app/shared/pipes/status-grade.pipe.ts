import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusGrade',
  standalone: true
})
export class StatusGradePipe implements PipeTransform {
  transform(adicionadaNaGrade: boolean): string {
    return adicionadaNaGrade ? 'Adicionada à grade' : 'Não adicionada';
  }
}
