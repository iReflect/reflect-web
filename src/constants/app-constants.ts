export const USER_AUTH_TOKEN_KEY = 'user_auth_token';

export const FEEDBACK_STATES = {
    NEW: 0,
    IN_PROGRESS: 1,
    SUBMITTED: 2
};
export const FEEDBACK_STATES_LABEL = {
    [FEEDBACK_STATES.NEW]: 'New',
    [FEEDBACK_STATES.IN_PROGRESS]: 'Draft/In Progress',
    [FEEDBACK_STATES.SUBMITTED]: 'Submitted'
};

export const QUESTION_TYPES = {
    MULTIPLE_CHOICE: 0,
    GRADING: 1,
    BOOLEAN: 2
};

export const COMMENT_TOOLTIP_MAP = {
    addComment: 'Add Comment',
    editComment: 'Edit Comment',
    viewComment: 'View Comment',
    hideComment: 'Hide Comment',
};

export const LOGIN_ERROR_TYPES = {
    notFound: 'notFound',
    unauthorized: 'unauthorized',
    internalError: 'internalError'
};

export const LOGIN_ERROR_MESSAGES = {
    notFound: `User doesn't exist! Try with another user or contact admin.`,
    unauthorized: 'Invalid Session! Login again.',
    internalError: 'Some error occurred! Try again.'
};

export const APP_ROUTE_URLS = {
    forwardSlash: '/',
    root: '',
    login: 'login',
    auth: 'auth',
    feedback: 'feedbacks/:id',
    feedbackList: 'feedbacks',
    teamFeedback: 'team/feedbacks/:id',
    teamFeedbackList: 'team/feedbacks',
    retrospectiveList: 'retrospectives',
    sprintDetails: 'retrospectives/:retrospectiveID/sprint/:sprintID',
    retrospectiveDashboard: 'retrospectives/:retrospectiveID/dashboard',
};

export const API_RESPONSE_MESSAGES = {
    feedBackSaved: 'Feedback saved successfully!',
    feedBackSubmitted: 'Feedback submitted successfully!',
    error: 'Some Error Occurred!',
    retroCreated: 'Retro Created successfully!',
    sprintActivated: 'Sprint activated successfully!',
    sprintFrozen: 'Sprint frozen successfully!',
    sprintDiscarded: 'Sprint discarded successfully!',
    invalidRetroAccessError: 'You do not have access to this retro!',
    sprintComputationInitiated: 'Sprint Computation Initiated Successfully!',
    memberUpdated: 'Member Updated Successfully!',
    sprintCreated: 'Sprint Created Successfully!',
    sprintUpdated: 'Sprint Updated Successfully!',
    invalidOption: 'Please select a valid option!',
    memberNotSelectedError: 'Please select a member to add!',
    allocationNegativeError: 'Allocation must be a non-negative number!',
    expectationNegativeError: 'Expectation must be a non-negative number!',
    taskStoryPointsNegativeError: 'Sprint story points must be a non-negative number!',
    taskStoryPointsEstimatesError: 'Sprint story points must not exceed estimates!',
    vacationNumberError: 'Vacations must be a positive integer!',
    vacationTimeError: 'Number of vacations must be not exceed total sprint days!',
    getRetrospectiveMembersError: 'Cannot get Retrospective Members List!',
    getSprintMembersError: 'Cannot get Sprint Members List!',
    getSprintMemberSummaryError: 'Cannot get Sprint Members Details!',
    getSprintTaskMemberSummaryError: 'Cannot get Sprint task member summary!',
    getSprintTaskSummaryError: 'Cannot get Sprint Task Summary!',
    getSprintDetailsError: 'Cannot update sprint details!',
    memberAlreadyPresent: 'Member already present!',
    addSprintMemberError: 'Cannot add new sprint member!',
    addSprintTaskMemberError: 'Cannot add new sprint task member!',
    updateSprintError: 'Cannot update sprint details!',
    updateSprintMemberError: 'Cannot update sprint member details!',
    deleteSprintMemberError: 'Cannot delete sprint member!',
    sprintCreateError: 'Cannot create sprint!',
    getTeamListError: 'Cannot get teams list!',
    noTeamsError: 'You are not a part of any team!',
    getTeamProviderOptionsError: 'Cannot get team provider options!',
    createRetroError: 'Cannot Create Retro!',
    getRetrospectivesError: 'Cannot get Retrospectives',
    getSprintsError: 'Cannot get Sprints',
    noSprintsError: 'Retro has no active or completed sprints',
    sprintActivateError: 'Cannot Activate Sprint',
    sprintFreezeError: 'Cannot Freeze Sprint',
    sprintDiscardError: 'Cannot Discard Sprint',
    refreshSprintError: 'Cannot initiate sprint computation',
    autoRefreshFailure: 'Failed to refresh data!',
    sprintHighlightsUpdateError: `Couldn't update sprint highlights`,
    sprintHighlightsUpdateSuccess: `Successfully updated sprint highlights`,
};

export const QUESTION_RESPONSE_SEPARATOR = ',';

export const SPRINT_STATES = {
    DRAFT: 0,
    ACTIVE: 1,
    FROZEN: 2,
    DISCARDED: 3
};

export const SPRINT_STATES_LABEL = {
    [SPRINT_STATES.DRAFT]: 'Draft',
    [SPRINT_STATES.ACTIVE]: 'Active',
    [SPRINT_STATES.FROZEN]: 'Frozen',
    [SPRINT_STATES.DISCARDED]: 'Discarded'
};

export const SPRINT_ACTIONS = {
    ACTIVATE: 0,
    FREEZE: 1,
    DISCARD: 2
};

export const SPRINT_ACTIONS_LABEL = {
    [SPRINT_ACTIONS.ACTIVATE]: 'Activate',
    [SPRINT_ACTIONS.FREEZE]: 'Freeze',
    [SPRINT_ACTIONS.DISCARD]: 'Discard'
};

export const SNACKBAR_DURATION = 2000;

export const RATING_STATES = {
    UGLY: 0,
    BAD: 1,
    OKAY: 2,
    GOOD: 3,
    NOTABLE: 4
};

export const RATING_STATES_LABEL = {
    [RATING_STATES.UGLY]: 'Ugly',
    [RATING_STATES.BAD]: 'Bad',
    [RATING_STATES.OKAY]: 'Okay',
    [RATING_STATES.GOOD]: 'Good',
    [RATING_STATES.NOTABLE]: 'Notable'
};

export const RATING_COLORS = {
    [RATING_STATES_LABEL[RATING_STATES.NOTABLE]]: '#32EB32',
    [RATING_STATES_LABEL[RATING_STATES.GOOD]]: '#60A549',
    [RATING_STATES_LABEL[RATING_STATES.OKAY]]: '#F5E93A',
    [RATING_STATES_LABEL[RATING_STATES.BAD]]: '#FF9900',
    [RATING_STATES_LABEL[RATING_STATES.UGLY]]: '#FF3030'
};

export const SPRINT_HIGHLIGHT_TYPES = {
    GOOD: 0,
    OKAY: 1,
    BAD: 2
};

export const MEMBER_TASK_ROLES = {
    IMPLEMENTOR: 0,
    REVIEWER: 1,
    VALIDATOR: 2
};

export const MEMBER_TASK_ROLES_LABEL = {
    [MEMBER_TASK_ROLES.IMPLEMENTOR]: 'Implementor',
    [MEMBER_TASK_ROLES.REVIEWER]: 'Reviewer',
    [MEMBER_TASK_ROLES.VALIDATOR]: 'Validator'
};
