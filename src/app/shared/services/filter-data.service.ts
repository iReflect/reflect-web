import { Injectable } from '@angular/core';

import {
  HIGHLIGHTS_LIST,
  RETRO_FEEDBACK_GOAL_TYPES,
  RETRO_SUMMARY_TYPES,
  RETRO_MODAL_TYPES,
  SPRINT_NOTES_SECTIONS_LIST,
} from '@constants/app-constants';
@Injectable()
export class FilterDataService {
  filterData = {
    [SPRINT_NOTES_SECTIONS_LIST[0].KEY]: [],
    [SPRINT_NOTES_SECTIONS_LIST[1].KEY]: [],
    [HIGHLIGHTS_LIST[0].KEY]: [],
    [HIGHLIGHTS_LIST[1].KEY]: [],
    [RETRO_FEEDBACK_GOAL_TYPES.ADDED]: [],
    [RETRO_FEEDBACK_GOAL_TYPES.COMPLETED]: [],
    [RETRO_FEEDBACK_GOAL_TYPES.PENDING]: [],
    [RETRO_SUMMARY_TYPES.TASK]: [],
    [RETRO_SUMMARY_TYPES.MEMBER]: [],
    [RETRO_MODAL_TYPES.TASK]: [],
  };

  setFilterData(tableKey, data) {
    this.filterData[tableKey] = data;
  }

  getFilterData(tableKey) {
    return this.filterData[tableKey];
  }
}
