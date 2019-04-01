import { Injectable } from '@angular/core';

@Injectable()
export class FilterDataService {
  filterData = {
    'key-takeaways': [],
    'things-well-done': [],
    'additional-things-done': [],
    'other-highlights': [],
    'goals-added': [],
    'goals-accomplished': [],
    'goals-pending': [],
    'task-summary': [],
    'member-summary': [],
    'task-modal': [],
  };

  setFilterData(tableKey, data) {
    this.filterData[tableKey] = data;
  }

  getFilterData(tableKey) {
    return this.filterData[tableKey];
  }
}
