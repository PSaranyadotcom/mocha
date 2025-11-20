import { ICustomWorld } from "../support/custom-world";
import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { getEmailVerificationCode, retrieveAccountId } from "../utils/api";
import { randomString } from "../utils/helpers";

When("I update my email in account detail page", { timeout: 7000 }, async function (this: ICustomWorld) {
  this.updatedEmail = `portale2e+account.details.${randomString(6)}@2k.com`;
  await this.pagesObj?.accountDetailPage.updateEmail(this.updatedEmail);
});

When("I click verify email to resend verification", async function () {
  await this.pagesObj?.accountDetailPage.resendEmailVerification();
});

When("I update the email to an existing 2k email", { timeout: 7000 }, async function (this: ICustomWorld) {
  await this.pagesObj?.accountDetailPage.updateEmail("portale2e@2k.com");
});

When("I enter email verification code in dialog", async function (this: ICustomWorld) {
  const accountId = await retrieveAccountId(this.twoKAccount?.email, this.twoKAccount?.password);
  const verificationCode = await getEmailVerificationCode(accountId);
  await this.pagesObj?.accountDetailPage.enterVerificationCode(verificationCode);
});

Then("I should get an errror message that I am using an existing email", async function (this: ICustomWorld) {
  const errorMessage = await this.pagesObj?.accountDetailPage.getEmailMessage();
  await expect(errorMessage).toMatch("This email is already in use. Try a different email or log in instead");
});

When("I close the dialog without entering verification code", async function (this: ICustomWorld) {
  await this.pagesObj?.accountDetailPage.closeDialog();
});

When("I cancel updating email", async function (this: ICustomWorld) {
  await this.pagesObj?.accountDetailPage.cancelUpdateEmail();
});

When("I open {string} tab in account detail page", async function (this: ICustomWorld, tab: string) {
  await this.pagesObj?.accountDetailPage.goToTab(tab);
});

When("I update my search visibility to {string}", async function (this: ICustomWorld, visibility: string) {
  await this.pagesObj?.accountDetailPage.updateSearchVisibility(visibility);
});

When("I block user {string}", async function (this: ICustomWorld, userTag: string) {
  await this.pagesObj?.accountDetailPage.addUsertoBlockList(userTag);
});

When("I remove user {string} from my block list", async function (this: ICustomWorld, userTag: string) {
  await this.pagesObj?.accountDetailPage.removeUserFromBlockList(userTag);
});

When("I request my parent to update my permission", async function (this: ICustomWorld) {
  this.response = await this.pagesObj?.accountDetailPage.requestUpdatePermission();
});

Then("my email should be updated successfully after refreshing the page", async function (this: ICustomWorld) {
  await this.page?.reload();
  const currentEmail = await this.pagesObj?.accountDetailPage.getCurrentEmail();
  expect(currentEmail === this.updatedEmail).toBeTruthy();
});

Then("Communications tab should be shown", async function (this: ICustomWorld) {
  await this.page?.getByText("Account Overview").waitFor({ state: "visible" });
  expect(await this.pagesObj?.basePage.isTextVisible("COMMUNICATIONS")).toBeTruthy();
});

Then("I should not be able to see messages related to update email", async function (this: ICustomWorld) {
  const textSting = [
    `You requested to change your email to ${this.updatedEmail}`,
    `Your email will be updated once verified. Use your current email to log in.`,
    `Your email will change to ${this.updatedEmail} once verified. Verify ema`,
  ];
  await this.page?.reload();

  for (const str of textSting) {
    expect(await this.pagesObj?.basePage.isTextNotVisible(str)).toBeTruthy();
  }
});

Then("I should see messages related to update email", async function (this: ICustomWorld) {
  const textSting = [
    `You requested to change your email to ${this.updatedEmail}`,
    `Your email will be updated once verified. Use your current email to log in.`,
    `Your email will change to ${this.updatedEmail} once verified. Verify ema`,
  ];
  await this.page?.reload();

  for (const str of textSting) {
    expect(await this.pagesObj?.basePage.isTextVisible(str)).toBeTruthy();
  }
});

Then(
  "search visibility should be updated to {string} in privacy tab",
  async function (this: ICustomWorld, visibility: string) {
    await this.page?.waitForTimeout(700);
    if (visibility === "On") {
      expect(await this.pagesObj?.accountDetailPage.isSearchVisibilityOn()).toBeTruthy();
    } else {
      expect(await this.pagesObj?.accountDetailPage.isSearchVisibilityOn()).toBeFalsy();
    }
  }
);

Then("user {string} should be shown in my block list", async function (this: ICustomWorld, userTag: string) {
  await this.page?.waitForTimeout(1500);
  // ToDo: replace the hardcode timeout to wait for API reponse
  expect(await this.pagesObj?.accountDetailPage.isUserInBlockList(userTag)).toBeTruthy();
});

Then("user {string} should not be shown in my block list", async function (this: ICustomWorld, userTag: string) {
  await this.page?.waitForTimeout(1500);
  // ToDo: replace the hardcode timeout to wait for API reponse
  expect(await this.pagesObj?.accountDetailPage.isUserInBlockList(userTag)).toBeFalsy();
});
