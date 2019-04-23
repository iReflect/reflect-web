import { Injectable } from '@angular/core';
/*
In grid service we store states of columns and column filters for following tables :
1. Key Take-Aways
2. Additional Things Done
3. Things Well Done
4. Other Highlights
5. Goals added
6. Goals accomplished
7. Goals pending
8. Sprint task summary
9. Sprint member summary
*/
@Injectable()
export class GridService {
  columnState = {};
  filterState: any = {};
  constructor() { }

  saveColumnState(retroID: string, tableKey: string, columnState: any) {
    if (!this.columnState[retroID]) {
      this.columnState[retroID] = {};
    }
    this.columnState[retroID][tableKey] = columnState;
  }

  getColumnState(retroID: string, tableKey: string): any {
    if (this.columnState[retroID]) {
      return this.columnState[retroID][tableKey];
    }
  }

  clearColumnState() {
    this.columnState = {};
  }

  saveFilterState(tableKey: string, columnState: any) {
    this.filterState[tableKey] = columnState;
  }

  getFilterState(tableKey: string): any {
    return this.filterState[tableKey];
  }

  clearFilterState() {
    this.filterState = {};
  }
}
