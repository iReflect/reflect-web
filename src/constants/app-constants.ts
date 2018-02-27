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
    getRetrospectiveMembersError: 'Error: Cannot get Retrospective Members List!',
    getSprintMembersError: 'Error: Cannot get Sprint Members List!',
    getSprintMemberSummaryError: 'Error: Cannot get Sprint Members Details!',
    getSprintTaskMemberSummaryError: 'Error: Cannot get Sprint task member summary!',
    getSprintTaskSummaryError: 'Error: Cannot get Sprint Task Summary!',
    getSprintDetailsError: 'Error: Cannot update sprint details!',
    memberAlreadyPresent: 'Error: Member already present!',
    addSprintMemberError: 'Error: Cannot add new sprint member!',
    addSprintTaskMemberError: 'Error: Cannot add new sprint task member!',
    updateSprintMemberError: 'Error: Cannot update sprint member details!',
    deleteSprintMemberError: 'Error: Cannot delete sprint member!',
    sprintCreateError: 'Error: Cannot create sprint!',
    getTeamListError: 'Error: Cannot get teams list!',
    getTeamProviderOptionsError: 'Error: Cannot get team provider options!',
    createRetroError: 'Error: Cannot Create Retro!',
    getRetrospectivesError: 'Error: Cannot get Retrospectives',
    getSprintsError: 'Error: Cannot get Sprints',
    noSprintsError: 'Error: Retro has no sprints',
    sprintActivateError: 'Error: Cannot Activate Sprint',
    sprintFreezeError: 'Error: Cannot Freeze Sprint',
    sprintDiscardError: 'Error: Cannot Discard Sprint',
    refreshSprintError: 'Error: Cannot initiate sprint computation'
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
    [RATING_STATES_LABEL[RATING_STATES.NOTABLE]]: '#0FF000',
    [RATING_STATES_LABEL[RATING_STATES.GOOD]]: '#00A000',
    [RATING_STATES_LABEL[RATING_STATES.OKAY]]: '#ff9900',
    [RATING_STATES_LABEL[RATING_STATES.BAD]]: '#ff8',
    [RATING_STATES_LABEL[RATING_STATES.UGLY]]: '#ff3030'
};
