import { ICustomWorld } from "../support/custom-world";
import { Then, When } from "@cucumber/cucumber";
import { IdpAccount, Platform, QA_PASSWORD, THROW_AWAY_ACCOUNT_PREFIX, TwoKAccount } from "../utils/constants";
import { getGuardianEmailAlias, getDobByAge } from "../utils/helpers";
import { expect } from "@playwright/test";

When(
  "I create a child account via {string} with age of {int}",
  async function (this: ICustomWorld, game: string, age: number) {
    const dob = getDobByAge({ year: age, month: 0 });
    const guardianEmail = getGuardianEmailAlias();
    this.game = game;
    this.parentEmail = guardianEmail;
    const new2KChildAccount: TwoKAccount = {
      country: "AT",
      month: (dob.getUTCMonth() + 1).toString(),
      year: dob.getFullYear().toString(),
      email: `${THROW_AWAY_ACCOUNT_PREFIX}.coppa.${Date.now()}@take2games.com`,
      password: QA_PASSWORD,
      firstname: "",
      lastname: "",
      displayname: "ChildAccount",
    };
    this.twoKAccount = new2KChildAccount;
    if (age >= 14 && new2KChildAccount.country === "AT") {
      await this.pagesObj?.coppaPage.createPartialChildAccount.call(
        this,
        steamAccount,
        new2KChildAccount,
        guardianEmail
      );
    } else {
      await this.pagesObj?.coppaPage.createCoppaChildAccount.call(this, steamAccount, new2KChildAccount, guardianEmail);
    }
  }
);

When("I create a child account for dna dev", async function (this: ICustomWorld) {
  const dob = getDobByAge({ year: 7, month: 6 });
  const guardianEmail = getGuardianEmailAlias();
  this.parentEmail = guardianEmail;
  const new2KChildAccount: TwoKAccount = {
    country: "US",
    month: (dob.getUTCMonth() + 1).toString(),
    year: dob.getFullYear().toString(),
    email: `${THROW_AWAY_ACCOUNT_PREFIX}.coppa.${Date.now()}@take2games.com`,
    password: QA_PASSWORD,
    firstname: "",
    lastname: "",
    displayname: "ChildAccount",
  };
  this.twoKAccount = new2KChildAccount;
  await this.pagesObj?.coppaPage.createChildAccountForDnaDev.call(this, new2KChildAccount, guardianEmail);
});

When("I have my parent to help me setting up the account", async function (this: ICustomWorld) {
  await this.pagesObj?.coppaPage.getParentHelp.call(this, this.twoKAccount!);
});

When("I have my parent to help me setting up the partial account", async function (this: ICustomWorld) {
  await this.pagesObj?.coppaPage.getPartialParentHelp.call(this);
});

When("I agree to ToS and PP in age up page", async function (this: ICustomWorld) {
  await this.pagesObj?.coppaPage.checkTosPPUpgrade();
});

Then("The copy for aged up lego user should be correct", async function (this: ICustomWorld) {
  await this.page?.waitForTimeout(2000);
  const legoUserAgedUpCopy1 =
    "You’ve exceeded our maximum age for holding a 2K Child Account in your country / region, so your 2K Child Account needs to be updated to a 2K Account. A 2K Account includes:";
  const legoUserAgedUpCopy2 =
    "Because you have played one of our LEGO™ titles, your account will still be subject to parental permissions in our LEGO™ games until you reach the age of 16.";
  const legoUserAgedUpCopy3 =
    "Access to game features which require a 2K Account or may have been previously subject to certain parental permissions that we make available for 2K Child Accounts.";
  const legoUserAgedUpCopy4 = "Management of your 2K Account and game settings.";
  expect(await this.pagesObj?.basePage.isTextVisible(legoUserAgedUpCopy1)).toBeTruthy();
  expect(await this.pagesObj?.basePage.isTextVisible(legoUserAgedUpCopy2)).toBeTruthy();
  expect(await this.pagesObj?.basePage.isTextVisible(legoUserAgedUpCopy3)).toBeTruthy();
  expect(await this.pagesObj?.basePage.isTextVisible(legoUserAgedUpCopy4)).toBeTruthy();
});

Then("The copy for aged up non lego user should be correct", async function (this: ICustomWorld) {
  await this.page?.waitForTimeout(2000);
  const nonLegoUserAgedUpCopy1 =
    "Your 2K Child Account is now eligible to be upgraded to an adult 2K Account. This means you will no longer need parental permissions on any titles. Continue to see the changes to your account.";
  expect(await this.pagesObj?.basePage.isTextVisible(nonLegoUserAgedUpCopy1)).toBeTruthy();
});

Then("Parental Settings should be appearing in account details page", async function (this: ICustomWorld) {
  await this.page?.getByText("Account Overview").waitFor({ state: "visible" });
  expect(await this.pagesObj?.basePage.isTextVisible("PARENTAL SETTINGS")).toBeTruthy();
});

Then("Parental Settings should not be appearing in account details page", async function (this: ICustomWorld) {
  await this.page?.getByText("Account Overview").waitFor({ state: "visible" });
  expect(await this.pagesObj?.basePage.isTextNotVisible("PARENTAL SETTINGS")).toBeTruthy();
});

Then("Update email button should be shown in account details page", async function (this: ICustomWorld) {
  await this.page?.getByText("Account Overview").waitFor({ state: "visible" });
  expect(await this.page?.locator('//h1[.="Account Email"]/following-sibling::button').isVisible()).toBeTruthy();
});

const steamAccount: IdpAccount = {
  platform: Platform.STEAM,
  id: "76561199538146755",
  email: "portale2e@2k.com",
  account: "portale2e",
  password: QA_PASSWORD,
  name: "twoKe2eSteam",
};
