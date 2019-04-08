import { Injectable } from '@angular/core';

import {
  Retro_Grid_Service_Data,
  SPRINT_NOTES_SECTIONS_LIST,
  HIGHLIGHTS_LIST,
  RETRO_FEEDBACK_GOAL_TYPES,
  RETRO_MODAL_TYPES,
  RETRO_SUMMARY_TYPES
} from '@constants/app-constants';
@Injectable()
export class GridService {
  columnState = {};
  filterState = Retro_Grid_Service_Data;
  constructor() { }

  saveColumnState(retroId: string, tableKey: string, columnState: any) {
    if (!this.columnState[retroId]) {
      this.columnState[retroId] = {
        [RETRO_MODAL_TYPES.TASK]: [],
        [HIGHLIGHTS_LIST[0].KEY]: [],
        [HIGHLIGHTS_LIST[1].KEY]: [],
        [RETRO_SUMMARY_TYPES.TASK]: [],
        [RETRO_SUMMARY_TYPES.MEMBER]: [],
        [RETRO_FEEDBACK_GOAL_TYPES.ADDED]: [],
        [RETRO_FEEDBACK_GOAL_TYPES.PENDING]: [],
        [SPRINT_NOTES_SECTIONS_LIST[0].KEY]: [],
        [SPRINT_NOTES_SECTIONS_LIST[1].KEY]: [],
        [RETRO_FEEDBACK_GOAL_TYPES.COMPLETED]: [],
      };
      this.columnState[retroId][tableKey] = columnState;
    } else {
      if(tableKey == RETRO_SUMMARY_TYPES.MEMBER && this.columnState[retroId][tableKey].length == 10 && columnState.length == 9) {
         columnState.push(this.columnState[retroId][tableKey][9])
      }
      this.columnState[retroId][tableKey] = columnState;
    }
  }

  getColumnState(retroId: string, tableKey: string): any {
    if (this.columnState[retroId]) {
      return this.columnState[retroId][tableKey];
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
    this.filterState = Retro_Grid_Service_Data;
  }
}
