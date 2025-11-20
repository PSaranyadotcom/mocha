import dotenv from "dotenv";
dotenv.config({});

export const QA_PASSWORD = String(process.env.QA_PASSWORD);

export const T2GP_LOGIN_BASE_URL = String(process.env.T2GP_LOGIN_BASE_URL);

export const SSO_BASIC_URL = String(process.env.SSO_BASIC_URL);

export const DNA_BASIC_AUTH = String(process.env.DNA_BASIC_AUTH);

export const DNA_BASIC_AUTH_RESTRICTED = String(process.env.DNA_BASIC_AUTH_RESTRICTED);

export const T2GP_SOCIAL_SERVICE_URL = String(process.env.T2GP_SOCIAL_SERVICE_URL);

export const EPIC_APPLICATION_ID = String(process.env.EPIC_APPLICATION_ID);

export const STEAM_APPLICATION_ID = String(process.env.STEAM_APPLICATION_ID);

export const XBL_APPLICATION_ID = String(process.env.XBL_APPLICATION_ID);

export const PSN_APPLICATION_ID = process.env.PSN_APPLICATION_ID;

export const GUARDIAN_EMAIL = "d2c_tester_440@take2games.com";

export const THROW_AWAY_ACCOUNT_PREFIX = "d2c_tester_auto+2k.auto.throwaway";

export const TIMEOUTS = {
  THREE_SECONDS: 3000,
  FIVE_SECONDS: 5000,
  TEN_SECONDS: 10000,
  FIFTEEN_SECONDS: 15000,
  THIRTY_SECONDS: 30000,
};

export const VIEWPORTS = [
  { type: "mobile", width: 375, height: 667 },
  { type: "desktop", width: 1920, height: 1080 },
];

export const REGEX = {
  jwtRegex: /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
  sigRegex: /([A-Za-z0-9-_=%]){15,}/,
  uuidRegex: /([a-fA-F0-9]){32}/,
};

export const COOKIES = {
  AGE_GATE: {
    name: "teenagers",
    regex: /[1]/,
  },
  KAT_TOKEN: {
    name: "2kat",
    regex: REGEX.jwtRegex,
  },
  KAT_SIG_TOKEN: {
    name: "2kat.sig",
    regex: REGEX.sigRegex,
  },
  PAT_TOKEN: {
    name: "2kpat",
    regex: REGEX.jwtRegex,
  },
  PAT_SIG_TOKEN: {
    name: "2kpat.sig",
    regex: REGEX.sigRegex,
  },
  FI_TOKEN: {
    name: "2kfi",
    regex: REGEX.uuidRegex,
  },
};

export interface ExpectedCookie {
  name: string;
  exist: boolean;
  match: RegExp;
}

export const expectedLoggedInCookies: ExpectedCookie[] = [
  {
    name: COOKIES.KAT_TOKEN.name,
    exist: true,
    match: COOKIES.KAT_TOKEN.regex,
  },
  {
    name: COOKIES.KAT_SIG_TOKEN.name,
    exist: true,
    match: COOKIES.KAT_SIG_TOKEN.regex,
  },
];

export const expectedKeepMeLoggedInCookies: ExpectedCookie[] = [
  {
    name: COOKIES.FI_TOKEN.name,
    exist: true,
    match: COOKIES.FI_TOKEN.regex,
  },
];

export const expectedLoggedOutCookies: ExpectedCookie[] = [
  {
    name: COOKIES.KAT_TOKEN.name,
    exist: false,
    match: COOKIES.KAT_TOKEN.regex,
  },
  {
    name: COOKIES.KAT_SIG_TOKEN.name,
    exist: false,
    match: COOKIES.KAT_SIG_TOKEN.regex,
  },
  {
    name: COOKIES.FI_TOKEN.name,
    exist: false,
    match: COOKIES.FI_TOKEN.regex,
  },
];

export const languages = {
  cs: "Čeština",
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  nl: "Nederlands",
  pl: "Polski",
  pt: "Português do Brasil",
  ru: "Russian",
  zh: "简体中文",
};

export const ERROR_MESSAGES = {
  ACCOUNT_BANNED: "Your account is banned.",
  ACCOUNT_LOCKED: "This account has been locked due to too many login attempts.",
  AGE_REQUIREMENT_NOT_MET: "You do not meet the requirements for an account",
  COUNTRY_IS_REQUIRED: "Country is required",
  DATE_OF_BIRTH_REQUIRED: "Date of birth is required",
  DISPLAY_NAME_INVALID:
    "Display Names must include 3 to 16 characters and only use letters and numbers. Special characters and spaces are not allowed. Display Names must not include offensive words",
  EMAIL_ALREADY_IN_USE: "This email is already in use. Try a different email or log in instead",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Email is invalid",
  EMAIL_IN_USE: "This email is already in use.",
  FIRST_NAME_REQUIRED: "First name is required.",
  FIRST_NAME_LAST_NAME_REQUIRED: "First and last name are required",
  INCORRECT_CREDENTIALS: "Your credentials are incorrect. Please try again or reset your password",
  LAST_NAME_REQUIRED: "Last name is required.",
  PASSWORD_INVALID: "Your password must contain",
  PASSWORD_INVALID_CHAR_LENGTH: "8 to 256 characters",
  PASSWORD_INVALID_UPPERCASE: "1 uppercase",
  PASSWORD_INVALID_LOWERCASE: "1 lowercase",
  PASSWORD_INVALID_NUMBER: "1 number or special character",
  PASSWORD_REQUIRED: "Password is required",
  PRIVACY_NOT_ACCEPTED: "The privacy policy must be read.",
  TERMS_NOT_ACCEPTED: "The terms and conditions must be accepted.",
  VERIFICATION_CODE_EXPIRED: "The verification code you entered is expired or invalid",
  VERIFICATION_CODE_LENGTH: "Verification code must be 6 digits",
  VERIFICATION_CODE_RESENT: "Verification code resent",
  VERIFICATION_LINK_RESENT: "Verification link resent",
};

export enum Client {
  STORE = "Store",
  LAUNCHER = "Launcher",
  PORTAL = "Portal",
}

export enum Platform {
  APPLE = "Apple",
  GOOGLE = "Google",
  EPIC = "Epic Games",
  META = "Meta",
  NINTENDO = "Nintendo Account",
  PLAYSTATION = "PlayStation™Network",
  STEAM = "Steam",
  TWOK = "2K",
  XBOX = "Xbox network",
  TWITCH = "Twitch",
  FACEBOOK = "Facebook",
  DISCORD = "Discord",
}

export enum IdpServiceState {
  NOT_LOGGED_IN,
  LOGGED_IN,
  LOGGED_IN_THEN_RE_LOGIN,
}

export enum Flow {
  COPPA,
  LEGO,
}

export const FIRST_PARTY_URLS = {
  STEAM: "https://steamcommunity.com",
  EPIC: "https://www.epicgames.com/id/login",
  EPIC_CALLBACK: "%2Ffirst-party%2Fepic%2Fcallback",
  XBOX: "https://login.live.com",
};

export interface IdpAccount {
  platform: Platform;
  id: string;
  email: string;
  account: string;
  password: string;
  name: string;
}

export interface TwoKAccount {
  country: string;
  month: string;
  year: string | number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  displayname: string;
}

export interface CoppaGame {
  name: string;
  productId: string;
  permission: {
    groupName: string;
    permissions: { name: string; id: string; granted: boolean }[];
  };
  rating: { esrb: { selector: string; descriptors: string[] } };
}
export interface UrlParams {
  path: string;
  params: { [key: string]: string[] };
}

export enum Game {
  PEPPERCORN = "peppercorn",
  BUILDUP = "buildup",
  ARTEMIS = "artemis",
  GHOSTPEPPER = "ghostPepper",
  BLUENOSE = "bluenose",
  HAMMER = "hammer",
  KOALA = "koala",
  INVERNESS = "inverness",
}

export const APPLICATIONS: Object = {
  peppercorn: {
    "Epic Games": "bd2efa6d80d24b3bb66c14fa80506006",
    "PlayStation™Network": "4b0baf15df664edebf4eecde6c29ff98",
    Steam: "50eecd616abc4aabbf0438ba98414687",
    "Xbox network": "4bc568ecf01b4396929bbe11f9c2ce01",
  },
  buildup: {
    "PlayStation™Network": "2b618f36baa5440586e3cfdc3bf6be51",
    Steam: "dfcfb5abce63464d990d9610a9509d43",
    "Xbox network": "5643a0039a82436e85835822f85be9fb",
  },
  artemis: {
    "Epic Games": "87d0897c00e242f4b64ba61c81391fc8",
    "PlayStation™Network": "1efdb2b7058c48258435862b3ba4f223",
    Steam: "bd54a9cfc802487f975412f92458c220",
    "Xbox network": "151f61fd9e634753bb7ac1a26ef55746",
  },
  ghostPepper: {
    "Xbox network": "b09e940e6e43477a90eb4806506b4113",
  },
  bluenose: {
    "PlayStation™Network": "949a1a695ea24ea5a4ed5a56540186c2",
    Steam: "3a83463e6de445c0a020785d5c921099",
    "Xbox network": "71939acdb4df4d3a8199267827e8f77d",
  },
  hammer: {
    "PlayStation™Network": "15412c515d5443f5b78125e64982515b",
    Steam: "1ae2c6f196ed4a9e8595cca5a3c9f8ae",
    "Xbox network": "345bd291331a40cea1d82f869e748645",
  },
  koala: {
    "PlayStation™Network": "ce82578bc82c498aa97623e06f09d065",
    Steam: "7ef72360d27a4a6db44ce5efbb95eedf",
    "Xbox network": "6d6c660afeec4668a9c32a202761f738",
  },
  inverness: {
    "PlayStation™Network": "352ec388feb747e5a81085fd27d7645d",
    Steam: "3086875973ff40b28597ffdcbfacdac5",
    "Xbox network": "066d4b6639564481a3c6f2258bb01322",
  },
  gameOfAseem: {
    dnaDevelopers: "3241adfc419f463b81f53a4e3c39c2f2",
  },
  gameOfAseemChild: {
    dnaDevelopers: "6d632f3274714e64bf8208af294eb721",
  },
};
