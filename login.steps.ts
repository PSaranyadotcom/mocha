import { expect } from "@playwright/test";
import { ICustomWorld } from "../support/custom-world";
import { When, Then } from "@cucumber/cucumber";
import { IdpAccount, QA_PASSWORD, TwoKAccount, Platform } from "../utils/constants";
import { randomString } from "../utils/helpers";

Then("I am redirected to correct page after login", async function (this: ICustomWorld) {
  switch (this.entry) {
    case "portal":
      await this.page?.waitForURL("**/account-detail**");
      expect(await this.pagesObj?.accountDetailPage.isOnAccountDetailPage()).toBeTruthy();
      break;
    case "launcher":
      await this.page?.waitForURL("**/signin/confirmation?**");
      expect(
        await this.page
          ?.locator("p", {
            hasText: "You will be prompted to open the 2K Launcher desktop app.",
          })
          .isVisible()
      ).toBeTruthy();
      break;
    case "store":
      await this.page?.waitForURL("**/connect/gateway?code=**");
      break;
  }
});

When("I log in via {string} as an adult", async function (this: ICustomWorld, entry: string) {
  this.entry = entry;
  await this.pagesObj?.loginPage.composeUrlAndLogin(this.twoKAccount!.email, QA_PASSWORD, entry);
});

When("I check 'Keep me logged in' checkbox", async function (this: ICustomWorld) {
  this.entry = "portal";
  await this.pagesObj?.loginPage.checkKeepMeLoggedIn();
});

When("I log in", async function (this: ICustomWorld) {
  await this.pagesObj?.loginPage.login(this.twoKAccount!.email, QA_PASSWORD);
  if (!this.isAgedUp === true) {
    await this.pagesObj?.accountDetailPage.isOnAccountDetailPage();
  }
});

When("I click on login button", async function (this: ICustomWorld) {
  await this.pagesObj?.loginPage.clickLoginButton();
});

When("I click on Create Account button", async function (this: ICustomWorld) {
  await this.pagesObj?.signUpPage.clickCreateAccountButton();
});

When("I enter my country and a child date of birth", async function (this: ICustomWorld) {
  await this.pagesObj?.signUpPage.enterCountryBirthday(errorChecking2KChildAccount);
});

When("I create an adult account", async function (this: ICustomWorld) {
  const twoKAccount = {
    country: "US",
    email: `portale2e+account.details.${randomString(6)}@2k.com`,
    isEmailVerified: true,
    password: QA_PASSWORD,
    dob: "01/01/1990",
    isDobVerified: true,
    firstname: "Account",
    lastname: "Details",
    displayname: "Automated",
    month: "1",
    year: 1990,
  };

  await this.pagesObj?.signUpPage.enterCountryBirthday(twoKAccount);
  await this.pagesObj?.signUpPage.signUp(twoKAccount);
  this.twoKAccount = twoKAccount;
});

When("I verify my email", async function (this: ICustomWorld) {
  await this.pagesObj?.signUpPage.verifyEmail();
  await this.page?.waitForTimeout(3000);
});

When("I log in with an already linked account", async function (this: ICustomWorld) {
  await this.pagesObj?.loginPage.login(alreadyLinked2KAccount.email, alreadyLinked2KAccount.password);
});

When("I sign in with {string}", async function (this: ICustomWorld, platform: string) {
  const popupPromise = this.page?.waitForEvent("popup");
  await this.pagesObj?.connectionsPage.signInWithPlatform(platform);
  const popup = await popupPromise;
  await this.pagesObj?.connectionsPage.metaLogin(metaAccount, popup!);
  await popup?.waitForEvent("close");
});

Then(
  "I sign in with {string} that is not linked to a 2k account",
  async function (this: ICustomWorld, platform: string) {
    const popupPromise = this.page?.waitForEvent("popup");
    await this.pagesObj?.connectionsPage.signInWithPlatform(platform);
    const popup = await popupPromise;
    await this.pagesObj?.connectionsPage.metaLogin(metaAccountErrorHandeling, popup!);
    await popup?.waitForEvent("close");
  }
);

When("I login as an child using the platform", async function (this: ICustomWorld) {
  await this.pagesObj?.consoleOnboardingPage.clickLoginButton();
  await this.pagesObj?.loginPage.login(errorChecking2KChildAccount.email, errorChecking2KChildAccount.password);
});

Then("I login as an adult using the platform", async function (this: ICustomWorld) {
  await this.pagesObj?.consoleOnboardingPage.clickLoginButton();
  await this.pagesObj?.loginPage.login(this.twoKAccount!.email, this.twoKAccount!.password);
});

Then("I login as an adult using the platform that is linked", async function (this: ICustomWorld) {
  await this.pagesObj?.consoleOnboardingPage.clickLoginButton();
  await this.pagesObj?.loginPage.login(alreadyLinkedMetaAccount.email, alreadyLinkedMetaAccount.password);
});

Then("I should receive an error message the account is already connected", async function (this: ICustomWorld) {
  const linkedErrorText = "Your {{appName}} account is already connected to the {{platform}} account.";
  const linkedText = await this.pagesObj?.loginPage.previouslyLinkedMessage();
  await expect(linkedText).toContain(linkedErrorText);
});

Then(
  "I should receive an error message that a child account can only be connected within a game",
  async function (this: ICustomWorld) {
    const linkedErrorText = "Child accounts can only connect within a game";
    const linkedText = await this.pagesObj?.loginPage.childLinkInGameError();
    await expect(linkedText).toContain(linkedErrorText);
  }
);

Then("I am redirected to correct page after log in", async function (this: ICustomWorld) {
  switch (this.entry) {
    case "portal":
      await this.page?.waitForURL("**/account-detail**");
      expect(await this.pagesObj?.accountDetailPage.isOnAccountDetailPage()).toBeTruthy();
      break;
    case "launcher":
      await this.page?.waitForURL("**/signin/confirmation?**");
      expect(
        await this.page
          ?.locator("p", {
            hasText: "You will be prompted to open the 2K Launcher desktop app.",
          })
          .isVisible()
      ).toBeTruthy();
      break;
    case "store":
      await this.page?.waitForURL("**/connect/gateway?code=**");
      break;
  }
});

const alreadyLinked2KAccount: TwoKAccount = {
  country: "US",
  month: "1",
  year: "1980",
  email: "all.linked.id@gmail.com",
  password: QA_PASSWORD,
  firstname: "2K",
  lastname: "Identity",
  displayname: "twokidentity",
};

const errorChecking2KChildAccount: TwoKAccount = {
  country: "US",
  month: "1",
  year: "2020",
  email: "portale2e+childaccounterrorchecking@2k.com",
  password: QA_PASSWORD,
  firstname: "",
  lastname: "",
  displayname: "Testing#89394",
};

const alreadyLinkedMetaAccount: TwoKAccount = {
  country: "US",
  month: "1",
  year: "2020",
  email: "portale2e+metalinked@2k.com",
  password: QA_PASSWORD,
  firstname: "Reagan",
  lastname: "Torres",
  displayname: "Testin123#25318",
};

const metaAccount: IdpAccount = {
  platform: Platform.META,
  id: "",
  email: "portale2e+Meta@2k.com",
  account: "e2etwoKportal",
  password: QA_PASSWORD,
  name: "e2etwoKportal",
};

const metaAccountErrorHandeling: IdpAccount = {
  platform: Platform.META,
  id: "",
  email: "portale2e+MetaErrorHandeling@2k.com",
  account: "e2etwoKportal",
  password: QA_PASSWORD,
  name: "e2etwoKportal",
};
