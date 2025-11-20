import { ICustomWorld } from "../support/custom-world";
import { Given, Then, When } from "@cucumber/cucumber";
import { Platform, QA_PASSWORD, T2GP_LOGIN_BASE_URL } from "../utils/constants";
import { randomString, openParentalMagicLink, compose2KDateOfBirth, composeAgeUpMagicLink } from "../utils/helpers";
import {
  create2KAccount,
  removeIdpLinkOf2KAccount,
  getParentalContext,
  retrieveAccountId,
  patch2KAccount,
  generateAgeUpContext,
  getAccountDetailByEmail,
} from "../utils/api";
import { DNA_BASIC_AUTH } from "../utils/constants";

import { expect } from "@playwright/test";

Given("a new adult account with email verified", async function (this: ICustomWorld) {
  const twoKAccount = {
    country: "US",
    email: `portale2e+account.details.${randomString(6)}@2k.com`,
    isEmailVerified: true,
    password: QA_PASSWORD,
    dob: "01/01/1990",
    isDobVerified: true,
    firstname: "Account",
    lastname: "Details",
    displayname: "AccountDetails",
    subscribedNewsletters: ["2k", "civilization"],
    month: "1",
    year: 1990,
  };
  await create2KAccount(twoKAccount);
  this.twoKAccount = twoKAccount;
});

When("I age up the child account to {int} years old", async function (this: ICustomWorld, age: number) {
  let dob = compose2KDateOfBirth({ year: age, month: "0" });
  const body = { dob: dob, isDobVerified: true };
  this.isAgedUp = true;
  await patch2KAccount(this.twoKAccount!, body);
});

When("I open the age up magic link", async function (this: ICustomWorld) {
  await generateAgeUpContext(this.twoKAccount?.email!);
  let response = await getAccountDetailByEmail(this.twoKAccount?.email!, this.twoKAccount?.password!);
  let url = composeAgeUpMagicLink(response!.ageUpContext);
  await this.page?.goto(url);
});

Then("2kfi cookie should not exist", async function (this: ICustomWorld) {
  const is2kfiExist = await is2kfiCookiesExist.call(this);
  expect(is2kfiExist).toBeFalsy();
});

Then("2kfi cookie should exist", async function (this: ICustomWorld) {
  const is2kfiExist = await is2kfiCookiesExist.call(this);
  expect(is2kfiExist).toBeTruthy();
});

Then("Permission slug should contain {string}", async function (this: ICustomWorld, slug: string) {
  const permissions = await this.pagesObj?.coppaPage.inspectPermission();
  expect(permissions).toContain(slug);
});

Then("Parent email should be sent correctly", async function (this: ICustomWorld) {
  const request = this.response?.request();
  const sessionObj = JSON.parse(request!.postDataJSON()!.sessionInfo);
  expect(sessionObj.parentEmail).toBe(this.parentEmail);
  expect(sessionObj.email).toBe(this.twoKAccount?.email);
});

Then("I should receive another email with verification code", async function (this: ICustomWorld) {
  const request = this.response?.request();
  const sessionObj = JSON.parse(request!.postDataJSON()!.sessionInfo);
  expect(sessionObj.email).toBe(this.twoKAccount?.email);
});

Given("I unlink my {string} idp account", async function (this: ICustomWorld, platform: string) {
  const platformObj = {
    Steam: Platform.STEAM,
    Xbox: Platform.XBOX,
    Epic: Platform.EPIC,
    Discord: Platform.DISCORD,
  };
  await removeIdpLinkOf2KAccount(
    {
      email: this.twoKAccount!.email,
      password: this.twoKAccount!.password,
    },
    platformObj[platform as keyof typeof platformObj]
  );
});

async function is2kfiCookiesExist(this: ICustomWorld) {
  const cookies = await this.context!.cookies();
  const exists =
    cookies.filter(function (el) {
      return el.name == "2kfi";
    }).length > 0;
  return exists;
}

Then("Links API should contain {string}", async function (this: ICustomWorld, platform: string) {
  const checkAPIUpdate = await this.pagesObj?.connectionsPage.checkConnetion();
  const confirmDiscordLinked = JSON.stringify(checkAPIUpdate).includes(platform);
  expect(confirmDiscordLinked).toBeTruthy();
});

Then("I request my parent to update my email", async function (this: ICustomWorld) {
  this.response = await this.pagesObj?.accountDetailPage.requestUpdatePermission();
  let responseJSON = await this.response?.json();

  const referrer = "62373add015746d7ad9c58e812205175";
  const token = responseJSON.token;

  const accountId = await retrieveAccountId(this.twoKAccount?.email, this.twoKAccount?.password);
  const context = await getParentalContext(DNA_BASIC_AUTH, this.twoKAccount?.email, referrer, accountId);

  const contextToken = context.parentLoginContext.context;

  const url = await openParentalMagicLink(token, referrer, contextToken);
  await this.page?.goto(url);
});

Then("I request my parent to link my account to dna dev", async function (this: ICustomWorld) {
  this.response = await this.pagesObj?.coppaPage.requestLinkPermission();
  let responseJSON = await this.response?.json();

  const referrer = "62373add015746d7ad9c58e812205175";
  const prodId = "6d632f3274714e64bf8208af294eb721";
  const token = responseJSON.token;

  let url = T2GP_LOGIN_BASE_URL + `/2k/parent-platform-consent?token=${token}&referrer=${referrer}&productId=${prodId}`;
  await this.page?.goto(url);
  await this.pagesObj?.consoleOnboardingPage.clickConnect();
  await this.page?.waitForTimeout(3000);
});
