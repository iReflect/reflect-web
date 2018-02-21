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
        return this.restangular.one(API_URLS.retrospectives).get();
    }

    getRetrospectiveLatestSprint(retrospectiveID): Observable<any> {
        return this.restangular.one(API_URLS.latestSprint.replace(':retrospectiveID', retrospectiveID)).get();
    }

    getRetrospectiveByID(retrospectiveID): Observable<any> {
        return this.restangular.one(API_URLS.retroDetails.replace(':retrospectiveID', retrospectiveID)).get();

    }

    listSprintsByRetrospectiveID(retrospectiveID): Observable<any> {
        return this.restangular.one(API_URLS.sprintList.replace(':retrospectiveID', retrospectiveID)).get();
    }

    getTeamList(): any {
        return this.restangular.one(API_URLS.teamsList).get();
    }

    getTaskProvidersList(): any {
        return this.restangular.one(API_URLS.taskProviderConfig).get();
    }

    createRetro(retroConfig: any): Observable<any> {
        console.log(retroConfig);
        return this.restangular.all('retrospectives').post(retroConfig);
    }

    getSprintDetails(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
            .one(API_URLS.sprintDetails.replace(':retrospectiveID', retrospectiveID).replace(':sprintID', sprintID))
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

    discardSprint(sprintID): Observable<any> {
        return this.restangular.one(API_URLS.discardSprint.replace(':sprintID', sprintID)).remove();
    }

    refreshSprintDetails(retrospectiveID, sprintID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.refreshSprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post();
    }

    getRetroMembers(retrospectiveID): Observable<any> {
        return this.restangular.one(API_URLS.teamMembers.replace(':id', retrospectiveID)).get();
    }

    addSprintMember(retrospectiveID, sprintID, memberID): Observable<any> {
        return this.restangular
            .one(
                API_URLS.sprintDetails
                    .replace(':retrospectiveID', retrospectiveID)
                    .replace(':sprintID', sprintID)
            )
            .post('members', '{ "memberID": ' + memberID + ' }');
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

    updateSprintMember(updatedMemberData): Observable<any> {
        const odds = Math.floor(Math.random() * Math.floor(2));
        if (odds) {
            return Observable.of(updatedMemberData);
        } else {
            return Observable.throw({'error': 'Some Error!'});
        }
    }

    updateSprintTaskMember(updatedRowData): Observable<any> {
        const odds = Math.floor(Math.random() * Math.floor(20));
        if (odds) {
            return Observable.of(updatedRowData);
        } else {
            return Observable.throw({'error': 'Some Error!'});
        }
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

    addTaskMember(memberID, taskID): Observable<any> {
        const newMember = {
            'ID': memberID,
            'Name': 'Member' + memberID,
            'Total Sprint Hours': 0,
            'Total Time Spent': 0,
            'Sprint Story Points': 0,
            'Total Story Points': 0,
            'Rating': 2,
            'Comments': 'Hard worker'
        };
        const odds = Math.floor(Math.random() * Math.floor(2));
        if (odds) {
            return Observable.of(newMember);
        } else {
            return Observable.throw({'error': 'Some Error!'});
        }
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
        console.log(retrospectiveID);
        return this.restangular
            .one(API_URLS.retroDetails.replace(':retrospectiveID', retrospectiveID))
            .post('sprints', sprintDetails);
    }
}
