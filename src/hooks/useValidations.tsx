import {Validation} from '../types/configTypes';

const TRUSTED_DOMAINS = [
  'mail.uc.edu',
  'gmail.com',
  'aol.com',
  'yahoo.com',
  'outlook.com',
  'icloud.com',
];

export const EMAIL_VALIDATION: Validation[] = [
  {
    type: 'regex_match',
    argument: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errMessage: 'Email is invalid',
  },
  {
    type: 'string_includes',
    argument: TRUSTED_DOMAINS,
    errMessage: 'Domain is invalid',
  },
];

export const PASSWORD_VALIDATION: Validation[] = [
  {
    type: 'length',
    argument: 8,
    errMessage: 'Password must be at least 8 characters long',
    tooltipDesc: '8 Characters',
  },
  {
    type: 'regex_test',
    argument: /[a-z]/,
    errMessage: 'Password must include at least 1 lowercase letter',
    tooltipDesc: 'A lowercase letter',
  },
  {
    type: 'regex_test',
    argument: /[A-Z]/,
    errMessage: 'Password must include at least 1 uppercase letter',
    tooltipDesc: 'An uppercase letter',
  },
  {
    type: 'regex_test',
    argument: /\d/,
    errMessage: 'Password must include at least 1 number',
    tooltipDesc: 'A number',
  },
  {
    type: 'regex_test',
    argument: /[^a-zA-Z0-9]/,
    errMessage: 'Password must include at least 1 special character',
    tooltipDesc: 'A special character',
  },
];

export const NAME_VALIDATION: Validation[] = [
  {
    type: 'length',
    argument: 0,
    errMessage: 'Name cannot be empty',
  },
];
