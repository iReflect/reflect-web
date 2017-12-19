import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

/* Pipe to return list of values of an object
  For example:
  let x = {a: 1, b: 3, c: 5};
  _.values(x);
  // => [1, 3, 5]
*/
@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {
    transform(obj, args: string[]): any {
        return _.values(obj);
    }
}
