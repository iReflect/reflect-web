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
    getSprintTaskMarkDoneSuccess: 'Successfully marked the sprint task as done',
    getSprintTaskMarkUnDoneSuccess: 'Successfully marked the sprint task as undone',
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
    noSprintsError: 'Retro has no active or frozen sprints',
    sprintActivateError: 'Cannot Activate Sprint',
    sprintFreezeError: 'Cannot Freeze Sprint',
    sprintDiscardError: 'Cannot Discard Sprint',
    refreshSprintError: 'Cannot initiate sprint computation',
    autoRefreshFailure: 'Failed to refresh data!',
    goalResolvedSuccessfully: 'Goal resolved successfully',
    goalResolveFailed: `Failed to resolve the goal`,
    goalUnResolvedSuccessfully: 'Goal un-resolved successfully',
    goalUnResolveFailed: `Failed to un-resolve the goal`,
    sprintHighlightsGetError: 'Couldn\'t get the sprint highlights',
    sprintHighlightsUpdateError: `Couldn't update sprint highlight`,
    sprintHighlightsUpdateSuccess: 'Successfully updated sprint highlight',
    sprintHighlightsAddError: `Couldn't add a sprint highlight`,
    sprintHighlightsAddSuccess: 'Successfully added a sprint highlight',
    sprintNotesGetError: 'Couldn\'t get the sprint notes',
    sprintNotesUpdateError: `Couldn't update sprint note`,
    sprintNotesUpdateSuccess: 'Successfully updated sprint note',
    sprintNotesAddError: `Couldn't add a sprint note`,
    sprintNotesAddSuccess: 'Successfully added a sprint note',
    sprintPendingGoalsGetError: 'Couldn\'t get the pending goals',
    sprintAccomplishedGoalsGetError: 'Couldn\'t get the accomplished goals',
    sprintAddedGoalsGetError: 'Couldn\'t get the added goals',
    sprintGoalsUpdateError: `Couldn't update sprint goal`,
    sprintGoalsUpdateSuccess: 'Successfully updated sprint goal',
    sprintGoalsAddError: `Couldn't add a sprint goal`,
    sprintGoalsAddSuccess: 'Successfully added a sprint goal',
    dateNullError: 'Cannot set date as null',
};

export const QUESTION_RESPONSE_SEPARATOR = ',';

export const SPRINT_STATES = {
    DRAFT: 0,
    ACTIVE: 1,
    FROZEN: 2,
    DISCARDED: 3
};

export const ACTIONABLE_SPRINT_STATES = {
    [SPRINT_STATES.DRAFT]: 3,
    [SPRINT_STATES.ACTIVE]: 4,
    [SPRINT_STATES.FROZEN]: 5,
    [SPRINT_STATES.DISCARDED]: 6
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

export const SPRINT_SYNC_STATES = {
    NOT_SYNCED: 0,
    SYNCING: 1,
    SYNCED: 2,
    SYNC_FAILED: 3
};

export const SPRINT_SYNC_STATES_LABEL = {
    [SPRINT_SYNC_STATES.NOT_SYNCED]: 'Not Synced',
    [SPRINT_SYNC_STATES.SYNCING]: 'Syncing',
    [SPRINT_SYNC_STATES.SYNCED]: 'Synced',
    [SPRINT_SYNC_STATES.SYNC_FAILED]: 'Sync Failed'
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

export const RETRO_FEEDBACK_GOAL_KEY = 'goal';

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

export const MARK_DONE_LABELS = {
    DONE: 'Mark Done',
    UNDONE: 'Mark Undone',
};

export const TRACKER_TICKET_TYPE_MAP = {
    FEATURE: 'FeatureTypes',
    TASK: 'TaskTypes',
    BUG: 'BugTypes',
};

export const COMMA_SEPARATED_STRING_PATTERN = '([a-zA-Z\\s]+,\\s?)*([(a-zA-Z\\s]+)';
