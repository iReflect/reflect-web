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
  };
  coloumData = {};
  constructor() { }

  setColumnData(retroId, tableKey, data) {
    if (!this.coloumData[retroId]) {
      this.coloumData[retroId] = {
        'key-takeaways': [],
        'things-well-done': [],
        'additional-things-done': [],
        'other-highlights': [],
        'goals-added': [],
        'goals-accomplished': [],
        'goals-pending': [],
        'task-summary': [],
        'member-summary': [],
        'task-modal': []
      };
      this.coloumData[retroId][tableKey] = data;
    } else {
      this.coloumData[retroId][tableKey] = data;
    }
  }
  getColumnData(retroId, tableKey) {
    if (this.coloumData[retroId]) {
      return this.coloumData[retroId][tableKey];
    }
  }
  clearColumnData() {
    this.coloumData = {};
  }
  setFilterData(tableKey, data) {
    this.filterData[tableKey] = data;
  }

  getFilterData(tableKey) {
    return this.filterData[tableKey];
  }
  clearFilterData() {
    this.filterData = {
      'key-takeaways': [],
      'things-well-done': [],
      'additional-things-done': [],
      'other-highlights': [],
      'goals-added': [],
      'goals-accomplished': [],
      'goals-pending': [],
      'task-summary': [],
      'member-summary': [],
    };
  }
}
