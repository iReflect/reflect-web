export const USER_AUTH_TOKEN_KEY = 'user_auth_token';

export const AUTO_REFRESH_KEY = 'auto_refresh_saved_state';

export const LOGIN_STATES = {
    NOT_LOGGED_IN: 0,
    LOGGING_IN: 1,
    LOGIN_ERROR: 2,
    LOGGED_IN: 3
};

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
    internalError: 'internalError',
    invalidEmailOrPassword: 'invalidEmailOrPassword',
};

export const LOGIN_ERROR_MESSAGES = {
    invalidEmailOrPassword: 'Invalid Email Or Password',
    notFound: 'User doesn\'t exist! Try with another user or contact admin.',
    unauthorized: 'Invalid Session! Login again.',
    internalError: 'Some error occurred! Try again.'
};

export const APP_ROUTE_URLS = {
    root: '',
    forwardSlash: '/',
    login: 'login',
    auth: 'auth',
    maintenance: 'maintenance',

    feedbackList: 'feedbacks',
    feedback: 'feedbacks/:id',

    teamFeedbackList: 'team/feedbacks',
    teamFeedback: 'team/feedbacks/:id',

    retrospectiveList: 'retrospectives',
    retrospectiveDetail: 'retrospectives/:retrospectiveID',
    retrospectiveDashboard: 'retrospectives/:retrospectiveID/dashboard',

    sprintDetails: 'retrospectives/:retrospectiveID/sprints/:sprintID',
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
    issueUpdated: 'Issue Updated Successfully!',
    sprintCreated: 'Sprint Created Successfully!',
    sprintUpdated: 'Sprint Updated Successfully!',
    invalidOption: 'Please select a valid option!',
    memberNotSelectedError: 'Please select a member to add!',
    allocationNegativeError: 'Allocation must be a non-negative number!',
    expectationNegativeError: 'Expectation must be a non-negative number!',
    issueStoryPointsNegativeError: 'Story points must be a non-negative number!',
    issueStoryPointsEstimatesError: 'Story points must not exceed estimates!',
    vacationNumberError: 'Vacations must be a positive integer!',
    vacationTimeError: 'Number of vacations must be not exceed total sprint days!',
    getActivityLogError: 'Cannot get Activity Log!',
    getRetrospectiveMembersError: 'Cannot get Retrospective Members List!',
    getSprintMembersError: 'Cannot get Sprint Members List!',
    getSprintMemberSummaryError: 'Cannot get Sprint Members Details!',
    getSprintIssueMemberSummaryError: 'Cannot get Issue Member Summary!',
    getSprintIssueSummaryError: 'Cannot get Issues Summary!',
    getSprintIssueMarkedDoneSuccess: 'Successfully marked the Issue as done',
    getSprintIssueMarkedUndoneSuccess: 'Successfully marked the Issue as undone',
    getSprintDetailsError: 'Cannot update sprint details!',
    memberAlreadyPresent: 'Member already present!',
    addSprintMemberError: 'Cannot add new sprint member!',
    addSprintIssueMemberError: 'Cannot add the member to Issue!',
    updateSprintError: 'Cannot update sprint details!',
    updateSprintMemberError: 'Cannot update sprint member details!',
    updateSprintTaskError: 'Cannot update Issue!',
    deleteSprintMemberError: 'Cannot delete sprint member!',
    sprintCreateError: 'Cannot create sprint!',
    getTeamListError: 'Cannot get teams list!',
    noTeamsError: 'You are not a part of any team!',
    getTeamProviderOptionsError: 'Cannot get team provider options!',
    createRetroError: 'Cannot Create Retro!',
    getRetrospectivesError: 'Cannot get Retrospectives',
    getSprintsError: 'Cannot get Sprints',
    noSprintsError: 'Retro has no active or frozen sprints',
    sprintActivateError: 'Cannot Activate Sprint',
    sprintFreezeError: 'Cannot Freeze Sprint',
    sprintDiscardError: 'Cannot Discard Sprint',
    resyncSprintError: 'Cannot initiate sprint computation',
    autoRefreshFailure: 'Failed to refresh data!',
    activityLogRefreshFailure: 'Failed to refresh Activity Log!',
    sprintDetailsRefreshFailure: 'Failed to refresh Sprint Details!',
    sprintHighlightsTabRefreshFailure: 'Failed to refresh Sprint Highlights Tab!',
    memberSummaryRefreshFailure: 'Failed to refresh Member Summary!',
    issueSummaryRefreshFailure: 'Failed to refresh Issue Summary!',
    sprintNotesTabRefreshFailure: 'Failed to refresh Sprint Notes Tab!',
    goalResolvedSuccessfully: 'Goal resolved successfully!',
    goalResolveFailed: 'Failed to resolve the goal!',
    goalUnResolvedSuccessfully: 'Goal un-resolved successfully!',
    goalUnResolveFailed: 'Failed to un-resolve the goal!',
    sprintHighlightsGetError: 'Cannot get the sprint highlights!',
    sprintHighlightsUpdateError: 'Cannot update sprint highlight!',
    sprintHighlightsUpdateSuccess: 'Successfully updated sprint highlight!',
    sprintHighlightsAddError: 'Cannot add a sprint highlight!',
    sprintHighlightsAddSuccess: 'Successfully added a sprint highlight!',
    sprintNotesGetError: 'Cannot get the sprint notes!',
    sprintNotesUpdateError: 'Cannot update sprint note!',
    sprintNotesUpdateSuccess: 'Successfully updated sprint note!',
    sprintNotesAddError: 'Cannot add a sprint note!',
    sprintNotesAddSuccess: 'Successfully added a sprint note!',
    sprintPendingGoalsGetError: 'Cannot get the pending goals!',
    sprintAccomplishedGoalsGetError: 'Cannot get the accomplished goals!',
    sprintAddedGoalsGetError: 'Cannot get the added goals!',
    sprintGoalsUpdateError: 'Cannot update sprint goal!',
    sprintGoalsUpdateSuccess: 'Successfully updated sprint goal!',
    sprintGoalsAddError: 'Cannot add a sprint goal!',
    sprintGoalsAddSuccess: 'Successfully added a sprint goal!',
    dateNullError: 'Cannot set date as null!',
    permissionDeniedError: 'You do not have permission to view this page!'
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

export const AUTO_REFRESH_DURATION = 5000;

export const RESYNC_REFRESH_DURATION = 30000;

export const DATE_FORMAT = 'MMMM dd, yyyy';

export const RATING_STATES = {
    RED: 0,
    IMPROVE: 1,
    DECENT: 2,
    GOOD: 3,
    NOTABLE: 4
};

export const RATING_STATES_LABEL = {
    [RATING_STATES.RED]: 'Red',
    [RATING_STATES.IMPROVE]: 'Improve',
    [RATING_STATES.DECENT]: 'Decent',
    [RATING_STATES.GOOD]: 'Good',
    [RATING_STATES.NOTABLE]: 'Notable'
};

export const RATING_COLORS = {
    [RATING_STATES_LABEL[RATING_STATES.NOTABLE]]: '#32EB32',
    [RATING_STATES_LABEL[RATING_STATES.GOOD]]: '#60A549',
    [RATING_STATES_LABEL[RATING_STATES.DECENT]]: '#F5E93A',
    [RATING_STATES_LABEL[RATING_STATES.IMPROVE]]: '#FF9900',
    [RATING_STATES_LABEL[RATING_STATES.RED]]: '#FF3030'
};

export const MEMBER_TASK_ROLES = {
    DEVELOPER: 0,
    REVIEWER: 1
};

export const MEMBER_TASK_ROLES_LABEL = {
    [MEMBER_TASK_ROLES.DEVELOPER]: 'Developer',
    [MEMBER_TASK_ROLES.REVIEWER]: 'Reviewer'
};

export const SPRINT_SYNC_STATES = {
    NOT_SYNCED: 0,
    SYNCING: 1,
    SYNCED: 2,
    SYNC_FAILED: 3,
    QUEUED: 4
};

export const SPRINT_SYNC_STATES_LABEL = {
    [SPRINT_SYNC_STATES.NOT_SYNCED]: 'Not Synced',
    [SPRINT_SYNC_STATES.SYNCING]: 'Syncing',
    [SPRINT_SYNC_STATES.SYNCED]: 'Synced',
    [SPRINT_SYNC_STATES.SYNC_FAILED]: 'Sync Failed',
    [SPRINT_SYNC_STATES.QUEUED]: 'Queued'
};

export const RETRO_FEEDBACK_TYPES = {
    NOTE: 0,
    HIGHLIGHT: 1,
    GOAL: 2,
};

export const RETRO_FEEDBACK_GOAL_TYPES = {
    ADDED: 'goals-added',
    COMPLETED: 'goals-accomplished',
    PENDING: 'goals-pending',
};

export const RETRO_FEEDBACK_SCOPE_TYPES = {
    Team: 0,
    Individual: 1,
};

export const RETRO_FEEDBACK_SCOPE_LABELS = {
    [RETRO_FEEDBACK_SCOPE_TYPES.Team]: 'Team',
    [RETRO_FEEDBACK_SCOPE_TYPES.Individual]: 'Individual',
};

export const SPRINT_NOTES_SECTIONS_LIST = [
    {
        KEY: 'key-takeaways',
        LABEL: 'Key Take-Aways',
    },
    {
        KEY: 'things-well-done',
        LABEL: 'Things Well Done',
    }
];

export const HIGHLIGHTS_LIST = [
    {
        KEY: 'additional-things-done',
        LABEL: 'Additional Things Done'
    },
    {
        KEY: 'other-highlights',
        LABEL: 'Other Highlights'
    }
];

export const TRACKER_TICKET_TYPE_MAP = {
    FEATURE: 'FeatureTypes',
    TASK: 'TaskTypes',
    BUG: 'BugTypes',
};

export const TRACKER_TICKET_STATUS_MAP = {
    DONE: 'DoneStatus',
};

// this is a basic regex for comma seperated fields.TODO more optimisation is needed.
export const COMMA_SEPARATED_STRING_PATTERN = '([(a-zA-Z])([a-zA-Z-_\'\\s]+,\\s?)*([(a-zA-Z-_\'\\s]+)([(a-zA-Z])';

export const OAUTH_CALLBACK_EVENT_KEY = 'OAuthCallback';

// <-----------------constants for PBKDF2 encryption------------------>
export const ITERATION_COUNT = 10000;

export const KEY_SIZE = 256 / 32;

export const SALT_FOR_PASSWORD = '';
