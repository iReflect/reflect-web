export const API_URLS = {
    login: '/login',
    auth: '/auth',
    logout: '/logout',
    feedback: '/feedbacks',
    teamFeedback: '/team-feedbacks',
    user: {
        current: '/users/current'
    },
    taskProviderConfig: '/task-tracker/config-list',
    retrospectives: '/retrospectives',
    teamsList: '/teams',
    teamMembers: '/teams/:retrospectiveID/members',
    retroDetails: '/retrospectives/:retrospectiveID',
    sprintList: 'retrospectives/:retrospectiveID/sprints',
    latestSprint: '/retrospectives/:retrospectiveID/latest-sprint',
    sprintDetails: '/retrospectives/:retrospectiveID/sprints/:sprintID',
    refreshSprintDetails: '/retrospectives/:retrospectiveID/sprints/:sprintID/process',
    sprintMemberSummary: '/retrospectives/:retrospectiveID/sprints/:sprintID/member-summary',
    sprintMembers: '/retrospectives/:retrospectiveID/sprints/:sprintID/members',
    sprintMember: '/retrospectives/:retrospectiveID/sprints/:sprintID/members/:memberID',
    sprintTaskSummary: '/retrospectives/:retrospectiveID/sprints/:sprintID/tasks/',
    sprintTaskDetails: '/retrospectives/:retrospectiveID/sprints/:sprintID/tasks/:taskID',
    sprintTaskMemberSummary: '/retrospectives/:retrospectiveID/sprints/:sprintID/tasks/:taskID/members',
    sprintTaskMember: '/retrospectives/:retrospectiveID/sprints/:sprintID/tasks/:taskID/members/:memberID',
    activateSprint: '/retrospectives/:retrospectiveID/sprints/:sprintID/activate',
    freezeSprint: '/retrospectives/:retrospectiveID/sprints/:sprintID/freeze',
    discardSprint: '/sprints/:sprintID'
};
