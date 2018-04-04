import { Injectable } from '@angular/core';
import { API_RESPONSE_MESSAGES, DATE_FORMAT } from '../../../constants/app-constants';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Injectable()
export class UtilsService {
    constructor(private datePipe: DatePipe) { }

    getApiErrorMessage(response): string {
        if (response.data.error) {
            const message = response.data.error.trim();
            return message.charAt(0).toUpperCase() + message.substr(1);
        } else if (response.status === 403) {
            return API_RESPONSE_MESSAGES.permissionDeniedError;
        } else {
            return '';
        }
    }

    isAgGridEditingEvent(event) {
        if (event.editing) {
            return true;
        }
    }

    formatFloat(value) {
        if (!value) {
            return 0;
        }
        if (value === Math.round(Number(value))) {
            return value;
        }
        return value.toFixed(2);
    }

    workdayCount(start, end) {
        const first = moment(start).clone().endOf('week');
        const last = moment(end).clone().startOf('week');
        const days = last.diff(first, 'days') * 5 / 7;
        let wfirst = first.day() - moment(start).day();
        if (moment(start).day() === 0) {
            --wfirst;
        }
        let wlast = moment(end).day() - last.day();
        if (moment(end).day() === 6) {
            --wlast;
        }
        return wfirst + days + wlast;
    }

    getDateFromString(dateString: string) {
        return this.datePipe.transform(dateString, DATE_FORMAT);
    }
}
