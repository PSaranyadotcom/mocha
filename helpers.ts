import pkceChallenge from "pkce-challenge";
import { v4 as uuidv4 } from "uuid";
import {
  Client,
  CoppaGame,
  EPIC_APPLICATION_ID,
  Platform,
  PSN_APPLICATION_ID,
  SSO_BASIC_URL,
  STEAM_APPLICATION_ID,
  T2GP_LOGIN_BASE_URL,
  UrlParams,
  XBL_APPLICATION_ID,
} from "./constants";

export const buildOauthPath = (oauthFields: { [key: string]: string }, hasPKCE: boolean): UrlParams => {
  const urlParams: UrlParams = {
    path: "/oauth2/authorize",
    params: {
      client_id: [oauthFields.client_id],
      state: [oauthFields.state],
      redirect_uri: [oauthFields.redirect_uri],
    },
  };
  if (hasPKCE) {
    urlParams.params.code_challenge = [oauthFields.code_challenge];
    urlParams.params.code_challenge_method = [oauthFields.code_challenge_method];
  }
  return urlParams;
};

export const buildCoppaKwsCallbackPath = (externalPayload: any) => {
  const params = {
    status: JSON.stringify({
      verified: true,
      transactionId: "fb7e1118-1844-45d5-8538-d5058ad429ed",
      errorCode: null,
    }),
    externalPayload: JSON.stringify(externalPayload),
  };
  const searchParams = new URLSearchParams(params);
  return `/2k/first-party/kws/callback?${searchParams}`;
};

export const buildCoppaPermissionsPath = (externalPayload: any) => {
  const { token } = externalPayload;
  return `/2k/permissions?token=${token}`;
};

export const extractAccountId = (url: string) => {
  const parsedUrl = new URL(url);
  const accountId = parsedUrl.searchParams.get("account_id");
  if (!accountId) {
    throw Error(`cannot extract 'account_id' from ${url}`);
  }
  return accountId;
};

export const getDobByAge = (age: { year: number; month: number }) => {
  const now = new Date();
  return new Date(now.getFullYear() - age.year, now.getUTCMonth() - age.month);
};

export const compose2KDateOfBirth = (account: { year: string | number; month: string }) => {
  let y: number;
  if (typeof account.year === "number") {
    y = new Date().getFullYear() - account.year;
  } else {
    y = parseInt(account.year);
  }
  const m: number = parseInt(account.month);
  // last day of previous month
  const dob = new Date(y, m, 0);
  return `${padding(dob.getMonth() + 1)}/${padding(dob.getDate())}/${dob.getFullYear()}`;
};

const padding = (n: number) => {
  const t = "00";
  const s = n.toString();
  return t.slice(s.length) + s;
};

export const composeLongDateOfBirth = (account: { year: string | number; month: string }) => {
  const dob = new Date(Number(account.year), Number(account.month) - 1);
  return `${dob.toLocaleString("default", {
    month: "long",
  })} ${account.year}`;
};

export const calculateAge = (twoKAccount: { month: string; year: string | number }) => {
  const now = new Date();
  let dob: Date;
  if (typeof twoKAccount.year === "string") {
    dob = new Date(Number(twoKAccount.year), Number(twoKAccount.month), 30);
  } else {
    dob = new Date(now.getFullYear() - twoKAccount.year, Number(twoKAccount.month), 30);
  }
  const age = now.getFullYear() - dob.getFullYear();
  const agePlus = now.getUTCMonth() - dob.getUTCMonth() > 0 ? age + 1 : age;
  return agePlus < 13 ? 13 : agePlus;
};

export const getCoppaGameById = (applicationId: string): CoppaGame => {
  switch (applicationId) {
    case "5643a0039a82436e85835822f85be9fb":
    case "dfcfb5abce63464d990d9610a9509d43":
    case "2b618f36baa5440586e3cfdc3bf6be51": {
      return {
        name: "buildup",
        productId: "93e955c41f504a63a41c4649abee20a8",
        permission: {
          groupName: "build-up-",
          permissions: [
            {
              name: "Online Play",
              id: "child-access-online-features",
              granted: true,
            },
            {
              name: "Telemetry",
              id: "record-game-events-telemetry",
              granted: false,
            },
            {
              name: "Real Money Purchasing",
              id: "real-money-purchasing",
              granted: false,
            },
          ],
        },
        rating: {
          esrb: {
            selector: 'img[alt="ESRB Everyone"]',
            descriptors: ["Comic Mischief", "Edutainment", "Informational", "In-Game Purchases", "Users Interact"],
          },
        },
      };
    }
    case "bd54a9cfc802487f975412f92458c220":
    case "1efdb2b7058c48258435862b3ba4f223":
    case "151f61fd9e634753bb7ac1a26ef55746":
    case "87d0897c00e242f4b64ba61c81391fc8": {
      return {
        name: "artemis",
        productId: "db79b4729ec741278d594dde7357bc20",
        permission: {
          groupName: "artemis-",
          permissions: [
            {
              name: "Online Play",
              id: "child-access-online-features",
              granted: true,
            },
            {
              name: "Telemetry",
              id: "record-game-events-telemetry",
              granted: false,
            },
            {
              name: "Real Money Purchasing",
              id: "real-money-purchasing",
              granted: false,
            },
          ],
        },
        rating: {
          esrb: {
            selector: "",
            descriptors: [],
          },
        },
      };
    }
    case "b8e9c05c01c3471bbdd2273916584fcf":
    case "b09e940e6e43477a90eb4806506b4113": {
      return {
        name: "ghost pepper",
        productId: "c71f50c3533c462785a2fc22f24c9fad",
        permission: {
          groupName: "",
          permissions: [
            {
              name: "Online Play",
              id: "child-access-online-features",
              granted: true,
            },
            {
              name: "Friends",
              id: "friends",
              granted: false,
            },
          ],
        },
        rating: {
          esrb: {
            selector: "",
            descriptors: [],
          },
        },
      };
    }
    case "4bc568ecf01b4396929bbe11f9c2ce01":
    case "50eecd616abc4aabbf0438ba98414687":
    case "4b0baf15df664edebf4eecde6c29ff98":
    case "bd2efa6d80d24b3bb66c14fa80506006": {
      return {
        name: "peppercorn",
        productId: "beee8045258b40fe852183aa0dc9b5d7",
        permission: {
          groupName: "peppercorn-",
          permissions: [
            {
              name: "Online Play",
              id: "child-access-online-features",
              granted: true,
            },
            {
              name: "Telemetry",
              id: "record-game-events-telemetry",
              granted: false,
            },
            {
              name: "Real Money Purchasing",
              id: "real-money-purchasing",
              granted: false,
            },
          ],
        },
        rating: {
          esrb: {
            selector: 'img[alt="ESRB Everyone"]',
            descriptors: ["Comic Mischief", "Edutainment", "Informational", "In-Game Purchases", "Users Interact"],
          },
        },
      };
    }
  }
  throw Error(`unknown applicationId: '${applicationId}'`);
};

// skip non-Steam console-onboarding cases if not in dev/stg
export const runOnboardingTest = (idpAccount: { platform: Platform }) => {
  if (T2GP_LOGIN_BASE_URL === "https://local.d2dragon.dev" || T2GP_LOGIN_BASE_URL === "https://dev.portal.2k.com") {
    return true;
  }
  return idpAccount.platform === Platform.STEAM;
};

// run partial coppa/lego cases if not in dev/stg
export const isNonProdEnv = () => {
  return (
    SSO_BASIC_URL === "https://a40fed8b097fa406dc6bc09bfa272277.my.2k.com/sso/v2.0" || // dev
    SSO_BASIC_URL === "https://e7bcfa5048776c67402cfb7e0cfa106f.my.2k.com/sso/v2.0" // stg
  );
};

export const getGuardianEmailAlias = () => `d2c_tester_401+${Date.now()}@take2games.com`;

export const getClientUrlParams = async (client: Client): Promise<UrlParams> => {
  let param: { clientId: string; redirectUrl: string; hasPKCE: boolean };
  switch (client) {
    case Client.STORE: {
      switch (T2GP_LOGIN_BASE_URL) {
        case "https://local.d2dragon.dev":
        case "https://dev.portal.2k.com": {
          param = {
            clientId: "8aeb4b4347f5478db93b588fae38284b",
            redirectUrl: encodeURIComponent("https://store-develop.2k.com/connect/gateway"),
            hasPKCE: false,
          };
          break;
        }
        case "https://stg.portal.2k.com": {
          param = {
            clientId: "8aeb4b4347f5478db93b588fae38284b",
            redirectUrl: encodeURIComponent("https://store-staging.2k.com/connect/gateway"),
            hasPKCE: false,
          };
          break;
        }
        default: {
          param = {
            clientId: "d8de20bf42ea4817867425b94d105883",
            redirectUrl: encodeURIComponent("https://store.2k.com/connect/gateway"),
            hasPKCE: false,
          };
        }
      }
      break;
    }
    case Client.LAUNCHER: {
      param = {
        clientId: "0730770bdf204acc8e78851f67990847",
        redirectUrl: encodeURIComponent("https://take2games.com"),
        hasPKCE: true,
      };
      break;
    }
    default: {
      // Portal
      switch (T2GP_LOGIN_BASE_URL) {
        case "https://local.d2dragon.dev":
        case "https://dev.portal.2k.com":
        case "https://stg.portal.2k.com": {
          param = {
            clientId: "ad4bbf4b7245461cbf7b93be973e98b6",
            redirectUrl: encodeURIComponent(T2GP_LOGIN_BASE_URL),
            hasPKCE: false,
          };
          break;
        }
        default: {
          param = {
            clientId: "6711c33a36104373a6f74661761e9f73",
            redirectUrl: encodeURIComponent(T2GP_LOGIN_BASE_URL),
            hasPKCE: false,
          };
        }
      }
    }
  }

  const { code_challenge } = await pkceChallenge(64);

  const oauthPathParams = buildOauthPath(
    {
      client_id: param.clientId,
      state: uuidv4(),
      code_challenge,
      code_challenge_method: "S256",
      redirect_uri: param.redirectUrl,
    },
    param.hasPKCE
  );
  console.log("urlPath:", `${T2GP_LOGIN_BASE_URL}${composeClientUrl(oauthPathParams)}`);
  return oauthPathParams;
};

export const composeClientUrl = (urlParams: UrlParams) => {
  const queryString = Object.keys(urlParams.params)
    .map((key) => {
      return urlParams.params[key]
        .map((v: any) => {
          return key + "=" + v;
        })
        .join("&");
    })
    .join("&");
  return `${urlParams.path}?${queryString}`;
};

export const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  const maskedName = name.slice(0, 2) + "***" + name[name.length - 1];
  const domainSlice1 = domain.slice(0, domain.lastIndexOf("."));
  const domainSlice2 = domain.slice(domain.lastIndexOf("."), domain.length);
  const maskedDomain = domainSlice1[0] + "***" + domainSlice1[domainSlice1.length - 1] + domainSlice2;
  const maskedEmail = maskedName + "@" + maskedDomain;
  return maskedEmail;
};

// export const getCsrfToken = async () => {
//   // innerHtml
//   const nextData = await (await $("script#__NEXT_DATA__")).getHTML(false);
//   return JSON.parse(nextData).props.pageProps.csrfToken;
// };

// export const getCookie = async (name: string) => {
//   const foundCookies = await browser.getCookies(name);
//   if (foundCookies.length > 0) {
//     return foundCookies[0];
//   }
//   return null;
// };

export const getApplicationIdByPlatform = (platform: Platform) => {
  switch (platform) {
    case Platform.STEAM:
      return STEAM_APPLICATION_ID;
    case Platform.EPIC:
      return EPIC_APPLICATION_ID;
    case Platform.PLAYSTATION:
      return PSN_APPLICATION_ID;
    case Platform.XBOX:
      return XBL_APPLICATION_ID;
    default:
      throw Error(`unsupported platform '${platform}'`);
  }
};

export const getLocalizedCountryName = (countyrCode: string, locale = "en") => {
  switch (locale) {
    case "en": {
      switch (countyrCode) {
        case "US":
          return "United States";
        case "FR":
          return "France";
        default:
          throw Error(`'${countyrCode}' not implemented yet`);
      }
    }
    default:
      throw Error(`'${locale}' not implemented yet`);
  }
};

export function randomString(length: number) {
  return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
    .toString(36)
    .slice(1);
}

export const openParentalMagicLink = (token: string, referrer: string, context: string, prodId?: string) => {
  let Url = T2GP_LOGIN_BASE_URL + `/2k/manage-account?token=${token}&referrer=${referrer}&context=${context}`;
  if (prodId) {
    Url = Url + `&prodproductId=${prodId}`;
  }
  return Url;
};

export const composeAgeUpMagicLink = (context: string) => {
  let Url = `${T2GP_LOGIN_BASE_URL}/2k/en-US/ageup/context/${context}`;
  return Url;
};
