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
    activateSprint: '/sprint/:sprintID/activate',
    freezeSprint: '/sprint/:sprintID/freeze',
    discardSprint: '/sprint/:sprintID/discard'
};
