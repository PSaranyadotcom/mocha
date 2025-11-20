import axios from "axios";
import * as https from "https";
import {
  T2GP_LOGIN_BASE_URL,
  DNA_BASIC_AUTH,
  SSO_BASIC_URL,
  Platform,
  DNA_BASIC_AUTH_RESTRICTED,
  APPLICATIONS,
} from "./constants";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const errorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.log("error.response.data:", error.response.data);
      console.log("error.response.status:", error.response.status);
      console.log("error.response.headers:", error.response.headers);
    } else if (error.request) {
      console.log("error.request", error.request);
    } else {
      console.log("error.message:", error.message);
    }
    console.log("error.config", error.config);
  } else {
    console.log("Error:", error);
  }
};

const getInstanceId = (platform: Platform) => {
  switch (platform) {
    case Platform.EPIC: {
      return "2kconsoleepic";
    }
    case Platform.PLAYSTATION: {
      return "psninstanceid";
    }
    case Platform.STEAM: {
      return "steaminstanceid";
    }
    case Platform.XBOX: {
      return "xboxinstanceid";
    }
    default:
      return null;
  }
};

export const getParentalContext = async (
  basicAuth = DNA_BASIC_AUTH,
  email?: string,
  referrer?: string,
  account?: string
) => {
  const headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json",
  };
  const body = {
    email: email,
    type: "manageChildPermissions",
    referrer: referrer,
  };
  const url = `${SSO_BASIC_URL}/user/accounts/${account}`;

  try {
    const response = await axios({
      method: "get",
      url,
      data: body,
      headers,
      httpsAgent: agent,
    });
    return response.data;
  } catch (error) {
    console.log("getParentalContext() GET error", url);
    errorHandler(error);
    throw error;
  }
};

const composePlatformCredential = (platform: Platform, id: string, account: string, name: string) => {
  switch (platform) {
    case Platform.STEAM: {
      return {
        type: "steam",
        steamUserId: id,
        steamProfileName: account,
      };
    }
    case Platform.EPIC: {
      return {
        type: "epic",
        epicUserId: id,
        epicUserName: name,
      };
    }
    case Platform.PLAYSTATION: {
      return {
        type: "psn",
        psnAccountId: id,
        psnOnlineId: name,
        psnRegion: "scea",
        dob: "01/01/1980",
      };
    }
    case Platform.XBOX: {
      return {
        type: "xbl",
        xblXuid: id,
        xblGamertag: name,
        ageGroup: 4,
      };
    }
  }
};

const retrievePlatformAuthToken = async (
  platform: Platform,
  id: string,
  account: string,
  name: string,
  game: string
) => {
  const propertyPath = `${game}.${platform}`;
  const applicationId = propertyPath.split(".").reduce((obj, key) => obj?.[key as keyof object], APPLICATIONS);
  const headers = {
    Authorization: `Application ${applicationId}`,
    "Content-Type": "application/json",
  };
  const body = {
    locale: "en-US",
    accountType: "platform",
    credentials: composePlatformCredential(platform, id, account, name),
    instanceId: getInstanceId(platform),
    overrideSession: true,
  };
  const url = `${T2GP_LOGIN_BASE_URL}/dev/sso/auth/tokens`;
  try {
    const response = await axios({
      method: "post",
      url,
      data: body,
      headers,
      httpsAgent: agent,
    });
    if (!response.data.accessToken) {
      console.log(JSON.stringify(body));
      throw Error(JSON.stringify(response.data));
    }
    return response.data.accessToken;
  } catch (error) {
    console.log("retrievePlatformAuthToken() POST error", url);
    errorHandler(error);
    throw error;
  }
};

export const retrieveActivationCode = async (
  idpAccount: {
    platform: Platform;
    id: string;
    account: string;
    name: string;
  },
  game: string
) => {
  const accessToken = await retrievePlatformAuthToken(
    idpAccount.platform,
    idpAccount.id,
    idpAccount.account,
    idpAccount.name,
    game
  );
  const headers = { Authorization: `Bearer ${accessToken}` };
  const url = `${T2GP_LOGIN_BASE_URL}/oauth2/device_link`;
  try {
    const response: any = await axios({
      method: "post",
      url,
      headers,
      httpsAgent: agent,
    });
    return response.data.userCode;
  } catch (error) {
    console.log("retrieveActivationCode() POST error", url);
    errorHandler(error);
    throw error;
  }
};

const retrieveSSOAuthToken = async (email: string, password: string, basicAuth = DNA_BASIC_AUTH) => {
  const headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json",
  };
  const body = {
    locale: "en-US",
    accountType: "full",
    credentials: {
      type: "emailPassword",
      email,
      password,
    },
  };
  const url = `${SSO_BASIC_URL}/auth/tokens`;
  try {
    const response = await axios({
      method: "post",
      url,
      data: body,
      headers,
      httpsAgent: agent,
    });
    return response.data.accessToken;
  } catch (error) {
    console.log("retrieveSSOAuthToken() POST error", url);
    errorHandler(error);
    throw error;
  }
};

export const retrieveAccountId = async (email?: string, password?: string) => {
  const headers = {
    Authorization: `Basic ${DNA_BASIC_AUTH}`,
    "Content-Type": "application/json",
  };
  const body = {
    locale: "en-US",
    accountType: "full",
    credentials: {
      type: "emailPassword",
      email,
      password,
    },
  };
  const url = `${SSO_BASIC_URL}/auth/tokens`;
  try {
    const response = await axios({
      method: "post",
      url,
      data: body,
      headers,
      httpsAgent: agent,
    });
    return response.data.accountId;
  } catch (error) {
    console.log("retrieveAccountId() POST error", url);
    errorHandler(error);
    throw error;
  }
};

const removeIdpLink = async (accessToken: string, platform: string) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Cookie: `2kat=${accessToken}`,
    "Content-Type": "application/json",
  };
  const url = `${T2GP_LOGIN_BASE_URL}/user/accounts/me/links/${platform}`;
  try {
    const resp = await axios({
      method: "delete",
      url,
      headers,
      httpsAgent: agent,
    });
    return resp.status === 204;
  } catch (error) {
    console.log("removeIdpLink() DELETE error", url);
    errorHandler(error);
    throw error;
  }
};

export const removeIdpLinkOf2KAccount = async (
  twoKAccount: { email: string; password: string },
  platform: Platform
) => {
  const ssoAccessToken = await retrieveSSOAuthToken(twoKAccount.email, twoKAccount.password);
  switch (platform) {
    case Platform.APPLE: {
      return removeIdpLink(ssoAccessToken, "apple");
    }
    case Platform.EPIC: {
      return removeIdpLink(ssoAccessToken, "epic");
    }
    case Platform.NINTENDO: {
      return removeIdpLink(ssoAccessToken, "nintendo");
    }
    case Platform.PLAYSTATION: {
      return removeIdpLink(ssoAccessToken, "psn");
    }
    case Platform.STEAM: {
      return removeIdpLink(ssoAccessToken, "steam");
    }
    case Platform.XBOX: {
      return removeIdpLink(ssoAccessToken, "xbl");
    }
    case Platform.DISCORD: {
      return removeIdpLink(ssoAccessToken, "discord");
    }
  }
};

export const getEmailVerificationCode = async (accountId: string) => {
  const headers = { Authorization: `Basic ${DNA_BASIC_AUTH}` };
  const url = `${SSO_BASIC_URL}/user/accounts/${accountId}/verifications/codes`;
  try {
    const response = await axios({
      method: "get",
      url,
      headers,
      httpsAgent: agent,
    });
    return response.data;
  } catch (error) {
    console.log("getEmailVerificationCode() GET error", url);
    errorHandler(error);
    throw error;
  }
};

export const generateAgeUpContext = async (email: string) => {
  const headers = {
    Authorization: `Basic ${DNA_BASIC_AUTH}`,
    "Content-Type": "application/json",
  };
  const url = `${SSO_BASIC_URL}/user/emails`;
  const body = {
    email: email,
    type: "agingUp",
    emailBaseUrl: "localhost",
  };
  try {
    const resp = await axios({
      method: "post",
      url,
      data: body,
      headers,
      httpsAgent: agent,
    });
    return resp.status === 204;
  } catch (error) {
    console.log("removeIdpLink() DELETE error", url);
    errorHandler(error);
    throw error;
  }
};

export const getAccountDetailByEmail = async (email: string, password: string) => {
  const accountId = await retrieveAccountId(email, password);
  const headers = { Authorization: `Basic ${DNA_BASIC_AUTH}` };
  const url = `${SSO_BASIC_URL}/user/accounts/${accountId}`;
  try {
    const response = await axios({
      method: "get",
      url,
      headers,
      httpsAgent: agent,
    });
    return response.data;
  } catch (error) {
    console.log("getEmailVerificationCode() GET error", url);
    errorHandler(error);
    throw error;
  }
};

/**
 * Removes the link between the Platform or Device Account of the current user and the Account specified in the path.
 */
export const remove2KLinkOfIdpAccount = async (
  idpAccount: {
    platform: Platform;
    id: string;
    account: string;
    name: string;
  },
  game: string
) => {
  const accessToken = await retrievePlatformAuthToken(
    idpAccount.platform,
    idpAccount.id,
    idpAccount.account,
    idpAccount.name,
    game
  );
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  const url = `${SSO_BASIC_URL}/user/accounts/me/links/parent`;
  try {
    const resp: any = await axios({
      method: "delete",
      url,
      headers,
      httpsAgent: agent,
    });
    return resp.status === 204;
  } catch (error) {
    console.log("remove2KLinkOfIdpAccount() DELETE error", url);
    errorHandler(error);
    throw error;
  }
};

const getParentAccountId = async (accessToken: string) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const url = `${SSO_BASIC_URL}/user/accounts/me/parent`;
  try {
    const resp = await axios({
      method: "get",
      url,
      headers,
      httpsAgent: agent,
    });
    return resp.data.id;
  } catch (error) {
    console.log("getParentId() GET error", url);
    errorHandler(error);
    throw error;
  }
};

export const patch2KAccountByAccountId = async (accountId: string, data: any) => {
  const headers = {
    Authorization: `Basic ${DNA_BASIC_AUTH_RESTRICTED}`,
    "Content-Type": "application/json",
  };
  const url = `${SSO_BASIC_URL}/user/accounts/${accountId}`;
  try {
    const resp = await axios({
      method: "patch",
      url,
      data,
      headers,
      httpsAgent: agent,
    });
    return resp.status === 204;
  } catch (error) {
    console.log("patch2KAccountByAccountId() PATCH error", url);
    errorHandler(error);
    throw error;
  }
};

export const patch2KAccount = async (
  twoKAccount: {
    email: string;
    password: string;
  },
  data: any
) => {
  const accountId = await retrieveAccountId(twoKAccount.email, twoKAccount.password);
  return patch2KAccountByAccountId(accountId, data);
};

export const patch2KAccountMeByAuthToken = async (authToken: string, data: any) => {
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };
  const url = `${SSO_BASIC_URL}/user/accounts/me`;
  try {
    const resp = await axios({
      method: "patch",
      url,
      data,
      headers,
      httpsAgent: agent,
    });
    return resp.status === 204;
  } catch (error) {
    console.log("patch2KAccountMeByAuthToken() PATCH error", url);
    errorHandler(error);
    throw error;
  }
};

export const patch2KAccountMe = async (
  twoKAccount: {
    email: string;
    password: string;
  },
  data: any
) => {
  const authToken = await retrieveSSOAuthToken(twoKAccount.email, twoKAccount.password);
  return patch2KAccountMeByAuthToken(authToken, data);
};

export const createEmailOnlyAccount = async (
  email: string,
  props: any,
  idpAccount: {
    platform: Platform;
    id: string;
    account: string;
    name: string;
  },
  game: string
) => {
  const accessToken = await retrievePlatformAuthToken(
    idpAccount.platform,
    idpAccount.id,
    idpAccount.account,
    idpAccount.name,
    game
  );
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  const url = `${SSO_BASIC_URL}/user/accounts/me/links/parent`;
  try {
    const resp: any = await axios({
      method: "post",
      url,
      data: {
        email,
        emailVerificationType: 1,
      },
      headers,
      httpsAgent: agent,
    });
    if (resp.status === 201 && Object.keys(props).length !== 0) {
      const parentId = await getParentAccountId(accessToken);
      return patch2KAccountByAccountId(parentId, props);
    }
    return resp.status === 201;
  } catch (error) {
    console.log("createEmailOnlyAccount() POST error", url);
    errorHandler(error);
    throw error;
  }
};

export const create2KAccount = async (twoKAccount: {
  country: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  dob: string; // MM/DD/YYYY
  isDobVerified: boolean;
  firstname: string | undefined;
  lastname: string | undefined;
  displayname: string | undefined;
  subscribedNewsletters: string[] | undefined;
}) => {
  const data: any = {
    country: twoKAccount.country,
    userSelectedCountry: twoKAccount.country,
    email: twoKAccount.email,
    isEmailVerified: twoKAccount.isEmailVerified,
    password: twoKAccount.password,
    dob: twoKAccount.dob,
    isDobVerified: twoKAccount.isDobVerified,
  };
  if (twoKAccount.firstname) {
    data["firstName"] = twoKAccount.firstname;
  }
  if (twoKAccount.lastname) {
    data["lastName"] = twoKAccount.lastname;
  }
  if (twoKAccount.displayname) {
    data["displayName"] = twoKAccount.displayname;
  }
  if (twoKAccount.displayname) {
    data["subscribedNewsletters"] = twoKAccount.subscribedNewsletters;
  }

  const headers = {
    Authorization: `Basic ${DNA_BASIC_AUTH}`,
    "Content-Type": "application/json",
  };
  const url = `${SSO_BASIC_URL}/user/accounts`;
  try {
    const resp: any = await axios({
      method: "post",
      url,
      data,
      headers,
      httpsAgent: agent,
    });
    return resp.status === 201;
  } catch (error) {
    console.log("create2kAccount() POST error", url);
    errorHandler(error);
    throw error;
  }
};

export const loginRequest = async (
  data: {
    email: string;
    password: string;
    client_id: string;
    state: string;
    redirect_uri: string;
    csrfToken: string;
  },
  headers: { Cookie: string },
  forcedError = false
) => {
  const url = `${T2GP_LOGIN_BASE_URL}/web/authenticate`;
  try {
    const resp = await axios({
      method: "post",
      url,
      data,
      headers,
      httpsAgent: agent,
    });
    return resp;
  } catch (error) {
    if (!forcedError) {
      console.log("loginRequest() POST error", url);
      errorHandler(error);
      throw error;
    }
  }
};
