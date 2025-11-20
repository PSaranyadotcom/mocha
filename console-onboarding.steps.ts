import { ICustomWorld } from "../support/custom-world";
import { Then, When } from "@cucumber/cucumber";
import { IdpAccount, Platform, QA_PASSWORD, TwoKAccount } from "../utils/constants";
import { expect } from "@playwright/test";

When("I log in as an adult from console {string}", async function (this: ICustomWorld, platform: string) {
  this.platform = platform;
  await this.pagesObj?.consoleOnboardingPage.consoleOnboarding.call(this, steamAccount);
  // Todo: replace hardcoded steam in future
  await this.pagesObj?.consoleOnboardingPage.clickLoginButton();
  await this.pagesObj?.loginPage.login(this.twoKAccount!.email, this.twoKAccount!.password);
});

When("I continue linking windows dev to my existing adult account", async function (this: ICustomWorld) {
  await this.pagesObj?.consoleOnboardingPage.consoleOnboarding.call(this, undefined, this.deviceCode);
  await this.pagesObj?.consoleOnboardingPage.clickLoginButton();
  await this.pagesObj?.loginPage.login(this.twoKAccount!.email, this.twoKAccount!.password);
  await this.page?.waitForTimeout(2000);
});

When("I continue linking windows dev to my existing child account", async function (this: ICustomWorld) {
  const new2KChildAccount: TwoKAccount = {
    country: "US",
    month: "",
    year: "",
    email: "portale2e+child@2k.com",
    password: QA_PASSWORD,
    firstname: "",
    lastname: "",
    displayname: "ChildAccount",
  };
  this.twoKAccount = new2KChildAccount;

  await this.pagesObj?.consoleOnboardingPage.consoleOnboarding.call(this, undefined, this.deviceCode);
  await this.pagesObj?.consoleOnboardingPage.clickLoginButton();
  await this.pagesObj?.loginPage.login(this.twoKAccount!.email, this.twoKAccount!.password);
  await this.page?.waitForTimeout(2000);
});

When("I continue linking windows dev with my new account", async function (this: ICustomWorld) {
  await this.pagesObj?.consoleOnboardingPage.consoleOnboarding.call(this, undefined, this.deviceCode);
  await this.pagesObj?.consoleOnboardingPage.clickCreateButton();
});

When("I log in with {string} idp", async function (this: ICustomWorld, platform: string) {
  switch (platform) {
    case "Nintendo":
      expect(this.popUp?.url()).toContain("accounts.nintendo.com");
      break;
    case "Apple":
      expect(this.popUp?.url()).toContain("appleid.apple.com");
      break;
    case "Google":
      expect(this.popUp?.url()).toContain("accounts.google.com");
      break;
    case "Twitch":
      expect(this.popUp?.url()).toContain("twitch.tv/login");
      break;
    case "Facebook":
      expect(this.popUp?.url()).toContain("facebook.com/login.php");
      break;
    case "Steam":
      await this.pagesObj?.connectionsPage.steamLogin(steamAccount, this.popUp!);
      break;
    case "Twitter":
      expect(this.popUp?.url()).toContain("twitter.com/i");
      break;
    case "Epic":
      expect(this.popUp?.url()).toContain("epicgames.com/id/login");
      await this.pagesObj?.connectionsPage.epicLogin(steamAccount, this.popUp!);
      break;
    case "PSN":
      expect(this.popUp?.url()).toContain("account.sony.com/sonyacct/signin");
      await this.pagesObj?.connectionsPage.PSNLogin(PSNAccount, this.popUp!);
      break;
    case "Xbox":
      await this.pagesObj?.connectionsPage.xboxLogin(xboxAccount, this.popUp!);
      break;
    case "Discord":
      expect(this.popUp?.url()).toContain("discord.com");
      await this.pagesObj?.loginPage.discordLogin(discordAccount, this.popUp!);
      break;
    case "Meta":
      expect(this.popUp?.url()).toContain("oculus.com");
      await this.pagesObj?.connectionsPage.metaLogin(metaAccount, this.popUp!);
      break;
  }
  await this.page?.waitForTimeout(5000);
});

Then("My account should have been linked to {string}", async function (this: ICustomWorld, platform: string) {
  await this.page?.getByTestId("platform-link-2K").waitFor({ state: "visible" });
  if (platform === "Steam") {
    expect(await this.pagesObj?.consoleOnboardingPage.verifyIdpPlatformIcon(steamAccount));
  }
  // todo: need to remove hard code steam account
  expect(await this.page?.locator('//div[@class="t2gp-page-desc"]').innerText()).toContain(
    "You can now access all online features"
  );
  expect(await this.page?.locator('//div[@class="t2gp-page-desc"]').innerText()).toContain(
    "You can always unlink your accounts at portal.2k.com"
  );
  expect(await this.pagesObj?.basePage.getHeaderText()).toBe("Your accounts have been successfully connected");
});

const steamAccount: IdpAccount = {
  platform: Platform.STEAM,
  id: "76561199538146755",
  email: "portale2e@2k.com",
  account: "portale2e",
  password: QA_PASSWORD,
  name: "twoKe2eSteam",
};

const xboxAccount: IdpAccount = {
  platform: Platform.XBOX,
  id: "2535424170930416",
  email: "ctvpc.67@gmail.com",
  account: "ctvpc.67@gmail.com",
  password: QA_PASSWORD,
  name: "AdmiralAcorn917",
};

const PSNAccount: IdpAccount = {
  platform: Platform.PLAYSTATION,
  id: "",
  email: "portale2e@2k.com",
  account: "portale2e@2k.com",
  password: QA_PASSWORD,
  name: "portale2e2k",
};

const discordAccount: IdpAccount = {
  platform: Platform.DISCORD,
  id: "",
  email: "portale2e@2k.com",
  account: "portale2e",
  password: QA_PASSWORD,
  name: "",
};

const metaAccount: IdpAccount = {
  platform: Platform.META,
  id: "",
  email: "portale2e@2k.com",
  account: "e2etwoKportal",
  password: QA_PASSWORD,
  name: "e2etwoKportal",
};
