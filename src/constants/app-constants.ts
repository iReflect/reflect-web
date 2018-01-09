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
    retroSpectiveList: 'retrospectives',
    retroSpectiveCreate: 'retrospectives/create',
};

export const API_RESPONSE_MESSAGES = {
    feedBackSaved: 'Feedback saved successfully!!',
    feedBackSubmitted: 'Feedback submitted successfully!!',
    error: 'Some Error Occurred!!',
    retroCreated: 'Retro Created successfully!!'
};

export const QUESTION_RESPONSE_SEPARATOR = ',';
