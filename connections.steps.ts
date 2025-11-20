import { expect } from "@playwright/test";
import { ICustomWorld } from "../support/custom-world";
import { When, Then, Given } from "@cucumber/cucumber";
import { IdpAccount, Platform, QA_PASSWORD, T2GP_LOGIN_BASE_URL } from "../utils/constants";

Given("I have an active session on Xbox Live", async function (this: ICustomWorld) {
  await this.page?.goto(
    "https://www.xbox.com/en-GB/auth/msa?action=logIn&returnUrl=https%3A%2F%2Fwww.xbox.com%2Fen-GB%2F&ru=https%3A%2F%2Fwww.xbox.com%2Fen-GB%2F"
  );
  await this.pagesObj?.connectionsPage.xboxLogin(xboxAccount);
});

When("I get DNA dev device code from console onboarding emulator", async function (this: ICustomWorld) {
  await this.pagesObj?.connectionsPage.openConsoleOnboardingEmulator();
  this.deviceCode = await this.pagesObj?.connectionsPage.getDeviceCodeFromEmulator("Game of Aseem", "Dna Developers");
});

When("I get DNA dev child device code from console onboarding emulator", async function (this: ICustomWorld) {
  await this.pagesObj?.connectionsPage.openConsoleOnboardingEmulator();
  this.deviceCode = await this.pagesObj?.connectionsPage.getDeviceCodeFromEmulator(
    "Game of Aseem (Children)",
    "Dna Developers"
  );
});

When("I click on Continue With {string}", async function (this: ICustomWorld, platform: string) {
  const popupPromise = this.page?.waitForEvent("popup");
  await this.pagesObj?.connectionsPage.signInWithPlatform(platform);
  this.popUp = await popupPromise;
});

When("I open smerf connecting page", async function (this: ICustomWorld) {
  await this.page?.waitForTimeout(2000);
  await this.page?.goto(T2GP_LOGIN_BASE_URL + "/2k/connect-smerf");
});

When("I connect my 2k account with a {string} account", async function (this: ICustomWorld, platform: string) {
  const popupPromise = this.page?.waitForEvent("popup");
  await this.pagesObj?.connectionsPage.clickOnConnectButtonPlatform(platform);
  const popup = await popupPromise;
  switch (platform) {
    case "Xbox":
      await this.pagesObj?.connectionsPage.xboxLogin(xboxAccount, popup);
      break;
    case "Steam":
      await this.pagesObj?.connectionsPage.steamLogin(steamAccount, popup!);
      break;
    case "Meta":
      await this.pagesObj?.connectionsPage.metaLogin(metaAccount, popup!);
      break;
  }
  await popup?.waitForEvent("close");
});

When(
  "I try to connect my 2k account with an already linked {string} account",
  async function (this: ICustomWorld, platform: string) {
    const popupPromise = this.page?.waitForEvent("popup");
    await this.pagesObj?.connectionsPage.clickOnConnectButtonPlatform(platform);
    const popup = await popupPromise;
    if (platform === "Xbox") {
      await this.pagesObj?.connectionsPage.xboxLogin(alreadyLinkedXboxAccount, popup);
    }
    if (platform === "Steam") {
      await this.pagesObj?.connectionsPage.steamLogin(alreadyLinkedSteamAccount, popup!);
    }
    await popup?.waitForEvent("close");
  }
);

When("I connect my 2k account with a non Xbox microsoft account", async function (this: ICustomWorld) {
  const popupPromise = this.page?.waitForEvent("popup");
  await this.pagesObj?.connectionsPage.clickOnConnectButtonPlatform("Xbox");
  const popup = await popupPromise;
  await this.pagesObj?.connectionsPage.xboxLogin(nonXboxAccount, popup);
  this.popUp = popup;
  await popup?.waitForEvent("load");
});

When("I disconnect platform account with my 2k account", async function (this: ICustomWorld) {
  await this.page?.getByRole("button").getByText("disconnect").click();
  await this.page?.waitForTimeout(500);
  const unlinkButton = this.page?.getByRole("button").getByText("UNLINK");
  if (await unlinkButton?.isVisible()) {
    await unlinkButton!.click();
  }
});

Then("I should be prompted a {string} log in pop up", async function (this: ICustomWorld, platform: string) {
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
      expect(this.popUp?.url()).toContain("steamcommunity.com/openid/loginform");
      break;
    case "Twitter":
      expect(this.popUp?.url()).toContain("twitter.com/i");
      break;
    case "Epic":
      expect(this.popUp?.url()).toContain("epicgames.com/id/login");
      break;
    case "PSN":
      expect(this.popUp?.url()).toContain("account.sony.com/sonyacct/signin");
      break;
    case "Xbox":
      expect(this.popUp?.url()).toContain("login.live.com");
      break;
  }
});

Then("smerf connecting page should be shown correctly", async function (this: ICustomWorld) {
  expect(this.pagesObj?.connectionsPage.checkSmerfLinkingPage(this.twoKAccount?.email!)).toBeTruthy();
});

Then(
  "I should be redirected to {string} linking page in portal",
  async function (this: ICustomWorld, platform: string) {
    await this.page?.waitForURL("**/create-or-link**");
    expect(this.page?.url()).toContain("portal.2k.com/en/2k/create-or-link");
    expect(await this.pagesObj?.connectionsPage.isPlatformLogoVisible(platform));
    expect(await this.pagesObj?.loginPage.isLoginButtonVisible()).toBeTruthy();
    expect(await this.pagesObj?.loginPage.isCreateAccountButtonVisible()).toBeTruthy();
  }
);

Then("I should be prompted the smerf linking url", async function (this: ICustomWorld) {
  await this.page?.waitForURL("**/auth.smerf.com/**");
  expect(this.page?.url()).toContain("auth.smerf.com/connect-code?");
});

Then(
  "my {string} username should be displayed in connection page",
  async function (this: ICustomWorld, platform: string) {
    await this.page?.getByText(username[platform]).waitFor({ state: "visible" });
  }
);

Then(
  "my {string} username should no longer be shown in connection page",
  async function (this: ICustomWorld, platform: string) {
    await this.page?.waitForTimeout(500);
    await this.page?.reload();
    expect(await this.page?.getByText(username[platform]).isVisible()).toBeFalsy();
  }
);

Then("Dna Dev tile should be visible", async function (this: ICustomWorld) {
  await this.page?.getByText("Steam").waitFor({ state: "visible" });
  await this.page?.waitForTimeout(2000);
  expect(await this.page?.getByText("Dna Dev").isVisible()).toBeTruthy();
});

Then("Dna Dev tile should not be visible", async function (this: ICustomWorld) {
  await this.page?.waitForTimeout(1000);
  expect(await this.page?.getByText("Dna Dev").isVisible()).toBeFalsy();
});

const xboxAccount: IdpAccount = {
  platform: Platform.XBOX,
  id: "2535424170930416",
  email: "ctvpc.67@gmail.com",
  account: "ctvpc.67@gmail.com",
  password: QA_PASSWORD,
  name: "AdmiralAcorn917",
};

// Cannot login to twitch via chromium
// const twitchAccount: IdpAccount = {
//   platform: Platform.TWITCH,
//   id: "",
//   email: "portale2e@2k.com",
//   account: "portale2e@2k.com",
//   password: QA_PASSWORD,
//   name: "portale2e2k",
// };

const alreadyLinkedSteamAccount: IdpAccount = {
  platform: Platform.STEAM,
  id: "76561199238156874",
  email: "all.linked.id@gmail.com",
  account: "all.linked.id",
  password: QA_PASSWORD,
  name: "2kidentity",
};

const alreadyLinkedXboxAccount: IdpAccount = {
  platform: Platform.XBOX,
  id: "2535471353983682",
  email: "all.linked.id@gmail.com",
  account: "all.linked.id@gmail.com",
  password: QA_PASSWORD,
  name: "FadedDawn626281",
};

const nonXboxAccount: IdpAccount = {
  platform: Platform.XBOX,
  id: "",
  email: "ctvpc.71@outlook.com",
  account: "ctvpc.71@outlook.com",
  password: QA_PASSWORD,
  name: "",
};

const steamAccount: IdpAccount = {
  platform: Platform.STEAM,
  id: "76561199538146755",
  email: "portale2e@2k.com",
  account: "portale2e",
  password: QA_PASSWORD,
  name: "twoke2esteam",
};

const epicAccount: IdpAccount = {
  platform: Platform.EPIC,
  id: "",
  email: "portale2e@2k.com",
  account: "portale2e@2k.com",
  password: QA_PASSWORD,
  name: "portale2e",
};

const discordAccount: IdpAccount = {
  platform: Platform.DISCORD,
  id: "",
  email: "portale2e@2k.com",
  account: "portale2e",
  password: QA_PASSWORD,
  name: "portale2e",
};

const metaAccount: IdpAccount = {
  platform: Platform.META,
  id: "",
  email: "portale2e@2k.com",
  account: "e2etwoKportal",
  password: QA_PASSWORD,
  name: "e2etwoKportal",
};

const username: Record<string, any> = {
  Xbox: xboxAccount.name,
  Steam: steamAccount.account,
  Epic: epicAccount.name,
  Discord: discordAccount.name,
  Meta: metaAccount.name,
};
