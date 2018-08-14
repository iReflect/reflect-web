import { Injectable } from '@angular/core';
import { API_URLS } from '../../../constants/api-urls';
import { RestApiHelperService } from '../utils/rest-api-helper.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Restangular} from 'ngx-restangular';

@Injectable()
export class RetrospectiveService {
    private restangularWithLoader;
    private basicRestangular;

    constructor(private restApiHelperService: RestApiHelperService) {
        this.basicRestangular = restApiHelperService.getBasicDataApiHelper();
        this.restangularWithLoader = restApiHelperService.getDataApiHelperWithLoader();
    }

    getRestAngularService(isAutoRefresh): Restangular {
        return (isAutoRefresh ? this.basicRestangular : this.restangularWithLoader);
    }

    getRetrospectives(): Observable<any> {
        return this.restangularWithLoader
            .one(API_URLS.retrospectives)
            .get();
    }

    getRetrospectiveLatestSprint(retrospectiveID): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.latestSprint
                    .replace(':retrospectiveID', retrospectiveID)
            )
            .get();
    }

    getRetrospectiveByID(retrospectiveID): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.retroDetails
                    .replace(':retrospectiveID', retrospectiveID)
            )
            .get();

    }

    listSprintsByRetrospectiveID(retrospectiveID, params = {}): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintList
                    .replace(':retrospectiveID', retrospectiveID)
            )
            .get(params);
    }

    getTeamList(): any {
        return this.restangularWithLoader
            .one(API_URLS.teamsList)
            .get();
    }

    getTaskProvidersList(): any {
        return this.restangularWithLoader
            .one(API_URLS.taskProviderConfig)
            .get();
    }

    createRetro(retroConfig: any): Observable<any> {
        return this.restangularWithLoader
            .all('retrospectives')
            .post(retroConfig);
    }

    getSprintDetails(retrospectiveID, sprintID, isAutoRefresh): Observable<any> {
        return this.getRestAngularService(isAutoRefresh)
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .get();
    }

    activateSprint(retrospectiveID, sprintID): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('activate');
    }

    freezeSprint(retrospectiveID, sprintID): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('freeze');
    }

    discardSprint(retrospectiveID, sprintID): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .remove();
    }

    resyncSprintDetails(retrospectiveID, sprintID): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.refreshSprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post();
    }

    updateSprintDetails(retrospectiveID, sprintID, sprintData): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .customPUT(sprintData);
    }

    getRetroMembers(retrospectiveID, isAutoRefresh = false): Observable<any> {
        return this.getRestAngularService(isAutoRefresh)
            .one(
                API_URLS.teamMembers
                    .replace(':retrospectiveID', retrospectiveID)
            )
            .get();
    }

    addSprintMember(retrospectiveID, sprintID, memberID): Observable<any> {
        const sprintMember = {
            'memberID': memberID
        };
        return this.restangularWithLoader
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('members', sprintMember);
    }

    deleteSprintMember(retrospectiveID, sprintID, memberID) {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintMember
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':memberID', memberID)
            )
            .remove();
    }

    getSprintMemberSummary(retrospectiveID, sprintID, isAutoRefresh = false): Observable<any> {
        return this.getRestAngularService(isAutoRefresh)
            .one(
                API_URLS.sprintMemberSummary
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .get();
    }

    getSprintTaskMemberSummary(retrospectiveID, sprintID, taskID, isAutoRefresh): Observable<any> {
        return this.getRestAngularService(isAutoRefresh)
            .one(
                API_URLS.sprintTaskMemberSummary
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
            )
            .get();
    }

    getSprintTaskSummary(retrospectiveID, sprintID, isAutoRefresh = false): Observable<any> {
        return this.getRestAngularService(isAutoRefresh)
            .one(
                API_URLS.sprintTaskSummary
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .get();
    }

    getActivityLog(retrospectiveID, sprintID, isAutoRefresh = false): Observable<any> {
        return this.getRestAngularService(isAutoRefresh)
            .one(
                API_URLS.sprintActivityLog
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .get();
    }

    updateSprintMember(retrospectiveID, sprintID, sprintMemberID, updatedMemberData): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintMember
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':memberID', sprintMemberID)
            )
            .customPATCH(updatedMemberData);
    }

    updateSprintTask(retrospectiveID, sprintID, sprintTaskID, updatedTaskData): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintTaskDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', sprintTaskID)
            )
            .customPATCH(updatedTaskData);
    }

    updateSprintTaskMember(retrospectiveID, sprintID, taskID, sprintTaskMemberID, updatedTaskMemberData): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintTaskMember
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
                    .replace(':memberID', sprintTaskMemberID)
            )
            .customPATCH(updatedTaskMemberData);
    }

    getSprintMembers(retrospectiveID, sprintID): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintMembers
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .get();
    }

    addTaskMember(retrospectiveID, sprintID, taskID, memberID): Observable<any> {
        const sprintTaskMember = {
            'memberID': memberID
        };
        return this.restangularWithLoader
            .one(
                API_URLS.sprintTaskDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
            )
            .post('members', sprintTaskMember);
    }

    getTaskDetails(retrospectiveID, sprintID, taskID): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintTaskDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
            )
            .get();
    }

    createSprint(retrospectiveID, sprintDetails): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.retroDetails
                    .replace(':retrospectiveID', retrospectiveID)
            )
            .post('sprints', sprintDetails);
    }

    getSprintHighlights(retrospectiveID, sprintID, isAutoRefresh = false): Observable<any> {
        return this.getRestAngularService(isAutoRefresh)
            .one(
                API_URLS.sprintHighlights
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .get();
    }

    addSprintHighlight(retrospectiveID, sprintID, highlightSubType): Observable<any> {
        const highlightData = {
            subType: highlightSubType
        };
        return this.restangularWithLoader
            .one(
                API_URLS.sprintHighlights
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('', highlightData);
    }

    updateSprintHighlight(retrospectiveID, sprintID, sprintHighlightID, updatedHighlightData): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintHighlight
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':highlightID', sprintHighlightID)
            )
            .customPATCH(updatedHighlightData);
    }

    getSprintGoals(retrospectiveID, sprintID, goalType, isAutoRefresh = false): Observable<any> {
        return this.getRestAngularService(isAutoRefresh)
            .one(
                API_URLS.sprintGoals
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .customGET('', {goalType: goalType});
    }

    resolveSprintGoal(retrospectiveID, sprintID, goalID) {
        return this.restangularWithLoader
            .one(
                API_URLS.resolveSprintGoal
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':goalID', goalID)
            )
            .post();
    }

    unresolveSprintGoal(retrospectiveID, sprintID, goalID) {
        return this.restangularWithLoader
            .one(
                API_URLS.resolveSprintGoal
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':goalID', goalID)
            )
            .remove();
    }

    addNewRetroGoal(retrospectiveID, sprintID): Observable<any> {
        const data = {
            subType: 'goal'
        };
        return this.restangularWithLoader
            .one(
                API_URLS.sprintGoals
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('', data);
    }

    updateRetroGoal(retrospectiveID, sprintID, sprintGoalID, updatedGoalData): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintGoal
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':goalID', sprintGoalID)
            )
            .customPATCH(updatedGoalData);
    }

    getSprintNotes(retrospectiveID, sprintID, isAutoRefresh = false): Observable<any> {
        return this.getRestAngularService(isAutoRefresh)
            .one(
                API_URLS.sprintNotes
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .get();
    }

    addNewRetroNote(retrospectiveID, sprintID, noteSubType): Observable<any> {
        const noteData = {
            subType: noteSubType
        };
        return this.restangularWithLoader
            .one(
                API_URLS.sprintNotes
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('', noteData);
    }

    updateRetroNote(retrospectiveID, sprintID, sprintNoteID, updatedNoteData): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintNote
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':noteID', sprintNoteID)
            )
            .customPATCH(updatedNoteData);
    }

    markSprintTaskDone(retrospectiveID, sprintID, taskID): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintTaskMarkDone
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
            )
            .post('');
    }

    markSprintTaskUnDone(retrospectiveID, sprintID, taskID): Observable<any> {
        return this.restangularWithLoader
            .one(
                API_URLS.sprintTaskMarkDone
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
            )
            .remove();
    }
}
