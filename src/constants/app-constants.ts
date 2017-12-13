export const USER_AUTH_TOKEN_KEY = 'user_auth_token';
export const NEW_EVENT = 0;
export const IN_PROGRESS_EVENT = 1;
export const SUBMITTED_EVENT = 2;

export const FEEDBACK_EVENT_STATES = {
  [IN_PROGRESS_EVENT]: 'Draft/In Progress',
  [NEW_EVENT]: 'New',
  [SUBMITTED_EVENT]: 'Submitted'
};

export const MULTIPLE_CHOICE_TYPE_QUESTION = 1;
export const GRADE_TYPE_QUESTION = 2;
export const BOOLEAN_TYPE_QUESTION = 3;

export const QUESTION_TYPE_MAP = {
  [MULTIPLE_CHOICE_TYPE_QUESTION]: 'Multiple Choice',
  [GRADE_TYPE_QUESTION]: 'Grade',
  [BOOLEAN_TYPE_QUESTION]: 'Boolean'
};

export const APP_ROUTE_URLS = {
  forwardSlash: '/',
  root: '',
  login: 'login',
  feedback: 'feedbacks/:id',
};
