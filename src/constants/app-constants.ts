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

export const APP_ROUTE_URLS = {
    forwardSlash: '/',
    root: '',
    login: 'login',
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
    invalidOption: 'Please select a valid option!',
    memberNotSelectedError: 'Please select a member to add!',
    allocationNumberError: 'Allocation must be an integer between 0 to 100!',
    expectationNumberError: 'Expectation must be an integer between 0 to 100!',
    taskStoryPointsNegativeError: 'Sprint story points must be a non-negative number!',
    taskStoryPointsEstimatesError: 'Sprint story points must not exceed estimates!',
    vacationNumberError: 'Vacations must be a positive integer!',
    vacationTimeError: 'Number of vacations must be less than total sprint days!',
    getRetrospectiveMembersError: 'Cannot get Retrospective Members List!',
    getSprintMembersError: 'Cannot get Sprint Members List!',
    getSprintMemberSummaryError: 'Cannot get Sprint Members Details!',
    getSprintTaskMemberSummaryError: 'Cannot get Sprint task member summary!',
    getSprintTaskSummaryError: 'Cannot get Sprint Task Summary!',
    getSprintDetailsError: 'Cannot update sprint details!',
    memberAlreadyPresent: 'Member already present!',
    addSprintMemberError: 'Cannot add new sprint member!',
    addSprintTaskMemberError: 'Cannot add new sprint task member!',
    updateSprintMemberError: 'Cannot update sprint member details!',
    deleteSprintMemberError: 'Cannot delete sprint member!',
    sprintCreateError: 'Cannot create sprint!',
    getTeamListError: 'Cannot get teams list!',
    getTeamProviderOptionsError: 'Cannot get team provider options!',
    createRetroError: 'Cannot Create Retro!',
    getRetrospectivesError: 'Cannot get Retrospectives',
    getSprintsError: 'Cannot get Sprints',
    noSprintsError: 'Retro has no active or completed sprints',
    sprintActivateError: 'Cannot Activate Sprint',
    sprintFreezeError: 'Cannot Freeze Sprint',
    sprintDiscardError: 'Cannot Discard Sprint',
    refreshSprintError: 'Cannot initiate sprint computation'
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
    [RATING_STATES_LABEL[RATING_STATES.NOTABLE]]: '#10FF00',
    [RATING_STATES_LABEL[RATING_STATES.GOOD]]: '#60A549',
    [RATING_STATES_LABEL[RATING_STATES.OKAY]]: '#A7A211',
    [RATING_STATES_LABEL[RATING_STATES.BAD]]: '#FF9900',
    [RATING_STATES_LABEL[RATING_STATES.UGLY]]: '#FF3030'
};
