export const API_URLS = {
    login: '/login',
    auth: '/auth',
    logout: '/logout',
    feedback: '/feedbacks',
    // TODO: Update it to team feedback URL.
    teamFeedback: 'teams/feedbacks',
    user: {
        current: '/users/current'
    },
    // TODO: update these routes with actual API
    activateSprint: '/activate/:sprintID',
    freezeSprint: '/freeze/:sprintID',
    discardSprint: 'discard/:sprintID'
};
