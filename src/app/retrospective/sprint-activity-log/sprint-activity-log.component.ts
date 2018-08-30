import { Component, EventEmitter, Input, OnInit , OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';

import { MatSnackBar } from '@angular/material';
import { API_RESPONSE_MESSAGES, AUTO_REFRESH_DURATION, SNACKBAR_DURATION} from '../../../constants/app-constants';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { RetrospectiveService } from '../../shared/services/retrospective.service';

@Component({
  selector: 'app-sprint-activity-log',
  templateUrl: './sprint-activity-log.component.html',
  styleUrls: ['./sprint-activity-log.component.scss']
})
export class SprintActivityLogComponent implements OnInit, OnChanges, OnDestroy {

  @Input() retrospectiveID;
  @Input() sprintID;
  @Input() isTabActive;
  @Input() enableRefresh: boolean;
  @Input() refreshOnChange;

  @Output() onRefreshStart = new EventEmitter<boolean>();
  @Output() onRefreshEnd = new EventEmitter<boolean>();

  responseData: any;
  trailsDate: string;
  date: Date = new Date();
  autoRefreshCurrentState: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private retrospectiveService: RetrospectiveService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.autoRefreshCurrentState = this.enableRefresh;

    Observable.interval(AUTO_REFRESH_DURATION)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.isTabActive && this.autoRefreshCurrentState) {
                    this.getActivityLog(false, true);
                }
            });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.enableRefresh) {
      this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
  }
    if (changes.isTabActive && changes.isTabActive.currentValue) {
      this.getActivityLog();
    }
    if (this.isTabActive && !changes.isTabActive ) {
      if (changes.refreshOnChange) {
      this.getActivityLog(true, false);
      }
      if (this.autoRefreshCurrentState) {
        this.getActivityLog(true, true);
    }
    }
  }

  ngOnDestroy() {
    this.autoRefreshCurrentState = false;
    this.destroy$.next(true);
    this.destroy$.complete();
}

  isDateChange(i) {
    if (i === 0) {
      if (this.responseData[i]['CreatedAt'].substr(0 , 10) === this.date.toISOString().substr(0 , 10)) {
        this.trailsDate = 'Today';
      } else {
      this.trailsDate = this.responseData[i]['CreatedAt'].substr(0, 10);
      }
      return true;
    }
    if (this.responseData[i]['CreatedAt'].substr(0, 10) === this.responseData[i - 1]['CreatedAt'].substr(0, 10)) {
      return false;
    } else {
      this.trailsDate = this.responseData[i]['CreatedAt'].substr(0, 10);
      return true;
  }
}

  getActivityLog(isRefresh = false, isAutoRefresh = false) {
    if (!isAutoRefresh) {
      this.onRefreshStart.emit(true);
    }

    return this.retrospectiveService.getActivityLog(this.retrospectiveID, this.sprintID, isAutoRefresh)
    .takeUntil(this.destroy$)
    .subscribe(
      response => {
        this.responseData = response.data['Trails'];
        if (!isAutoRefresh) {
          this.onRefreshEnd.emit(true);
        }
      },
      err => {
        if (!isAutoRefresh) {
          this.onRefreshEnd.emit(true);
        }
        if (!isRefresh) {
          this.snackBar.open(
            API_RESPONSE_MESSAGES.getActivityLogError, '', {duration: SNACKBAR_DURATION});
          } else {
            this.snackBar.open(
            API_RESPONSE_MESSAGES.activityLogRefreshFailure, '', {duration: SNACKBAR_DURATION});
        }
      }
    );
  }
}
