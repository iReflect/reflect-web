import { Injectable } from '@angular/core';
import { API_URLS } from '../../../constants/api-urls';
import { RestApiHelperService } from '../utils/rest-api-helper.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class RetrospectiveService {
    private restangular;

    constructor(private restApiHelperService: RestApiHelperService) {
        this.restangular = restApiHelperService.getDataApiHelper();
    }

    getRetrospectives(): Observable<any> {
        return this.restangular
            .one(API_URLS.retrospectives)
            .get();
    }

    getRetrospectiveLatestSprint(retrospectiveID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.latestSprint
                    .replace(':retrospectiveID', retrospectiveID)
            )
            .get();
    }

    getRetrospectiveByID(retrospectiveID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.retroDetails
                    .replace(':retrospectiveID', retrospectiveID)
            )
            .get();

    }

    listSprintsByRetrospectiveID(retrospectiveID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintList
                    .replace(':retrospectiveID', retrospectiveID)
            )
            .get();
    }

    getTeamList(): any {
        return this.restangular
            .one(API_URLS.teamsList)
            .get();
    }

    getTaskProvidersList(): any {
        return this.restangular
            .one(API_URLS.taskProviderConfig)
            .get();
    }

    createRetro(retroConfig: any): Observable<any> {
        return this.restangular
            .all('retrospectives')
            .post(retroConfig);
    }

    getSprintDetails(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .get();
    }

    activateSprint(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('activate');
    }

    freezeSprint(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('freeze');
    }

    discardSprint(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .remove();
    }

    resyncSprintDetails(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.refreshSprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post();
    }

    updateSprintDetails(retrospectiveID, sprintID, sprintData): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .customPUT(sprintData);
    }

    getRetroMembers(retrospectiveID): Observable<any> {
        return this.restangular
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
        return this.restangular
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('members', sprintMember);
    }

    deleteSprintMember(retrospectiveID, sprintID, memberID) {
        return this.restangular
            .one(
                API_URLS.sprintMember
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':memberID', memberID)
            )
            .remove();
    }

    getSprintMemberSummary(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintMemberSummary
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .get();
    }

    getSprintTaskMemberSummary(retrospectiveID, sprintID, taskID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintTaskMemberSummary
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
            )
            .get();
    }

    getSprintTaskSummary(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintTaskSummary
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .get();
    }

    updateSprintMember(retrospectiveID, sprintID, updatedMemberData): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintMember
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':memberID', updatedMemberData.ID)
            )
            .customPUT(updatedMemberData);
    }

    updateSprintTask(retrospectiveID, sprintID, updatedTaskID, updatedTaskData): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintTaskDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', updatedTaskID)
            )
            .customPATCH(updatedTaskData);
    }

    updateSprintTaskMember(retrospectiveID, sprintID, taskID, updatedMemberData): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintTaskMember
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
                    .replace(':memberID', updatedMemberData.ID)
            )
            .customPUT(updatedMemberData);
    }

    getSprintMembers(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
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
        return this.restangular
            .one(
                API_URLS.sprintTaskDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
            )
            .post('members', sprintTaskMember);
    }

    getTaskDetails(retrospectiveID, sprintID, taskID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintTaskDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
            )
            .get();
    }

    createSprint(retrospectiveID, sprintDetails): Observable<any> {
        return this.restangular
            .one(
                API_URLS.retroDetails
                    .replace(':retrospectiveID', retrospectiveID)
            )
            .post('sprints', sprintDetails);
    }

    getSprintHighlights(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
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
        return this.restangular
            .one(
                API_URLS.sprintHighlights
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('', highlightData);
    }

    updateSprintHighlight(retrospectiveID, sprintID, highlightData): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintHighlight
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':highlightID', highlightData.ID)
            )
            .customPUT(highlightData);
    }

    getSprintGoals(retrospectiveID, sprintID, goalType): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintGoals
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .customGET('', {goalType: goalType});
    }

    resolveSprintGoal(retrospectiveID, sprintID, goalID) {
        return this.restangular
            .one(
                API_URLS.resolveSprintGoal
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':goalID', goalID)
            )
            .post();
    }

    unresolveSprintGoal(retrospectiveID, sprintID, goalID) {
        return this.restangular
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
        return this.restangular
            .one(
                API_URLS.sprintGoals
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('', data);
    }

    updateRetroGoal(retrospectiveID, sprintID, goalData): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintGoal
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':goalID', goalData.ID)
            )
            .customPUT(goalData);
    }

    getSprintNotes(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
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
        return this.restangular
            .one(
                API_URLS.sprintNotes
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('', noteData);
    }

    updateRetroNote(retrospectiveID, sprintID, noteData): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintNote
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':noteID', noteData.ID)
            )
            .customPUT(noteData);
    }

    markSprintTaskDone(retrospectiveID, sprintID, taskID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintTaskMarkDone
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
            )
            .post('');
    }

    markSprintTaskUnDone(retrospectiveID, sprintID, taskID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintTaskMarkDone
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
                    .replace(':taskID', taskID)
            )
            .remove();
    }
}
