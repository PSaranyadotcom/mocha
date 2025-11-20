import { BrowserContext, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { IdpAccount, T2GP_LOGIN_BASE_URL } from "../utils/constants";

export class ConnectionsPage extends BasePage {
  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }

  public async signInWithPlatform(platform: string) {
    switch (platform) {
      case "Apple":
      case "Google":
      case "Twitch":
      case "Facebook":
      case "Twitter":
      case "Discord":
      case "Steam":
        await this.page.getByTitle(`Sign in with ${platform}`).click();
        break;
      case "Nintendo":
        await this.page.getByTitle("Sign in with Nintendo Account").click();
        break;
      case "Epic":
        await this.page.getByTitle("Sign in with Epic Games").click();
        break;
      case "PSN":
        await this.page.getByTitle("Sign in with PlayStation™Network").click();
        break;
      case "Xbox":
        await this.page.getByTitle("Sign in with Xbox network").click();
        break;
      case "Meta":
        await this.page.getByTitle("Sign in with Meta").click();
        break;
    }
  }

  public async checkSmerfLinkingPage(email: string) {
    await this.page.waitForTimeout(500);
    const smerfLogoVisible = await this.page.getByRole("img", { name: "Smerf logo" }).isVisible();
    const userMailVisibile = await this.page.getByText(email).isVisible();
    const connectionStringVisible = await this.page
      .getByRole("heading", { name: "Connect your 2K and Smerf accounts." })
      .isVisible();

    return smerfLogoVisible && userMailVisibile && connectionStringVisible;
  }

  public async xboxLogin(account: IdpAccount, popUp?: Page) {
    const currentPage = popUp ?? this.page;
    await currentPage.getByPlaceholder("Email, phone, or Skype").click();
    await currentPage.getByPlaceholder("Email, phone, or Skype").fill(account.email);
    await currentPage.getByRole("button", { name: "Next" }).click();
    await currentPage.getByPlaceholder("Password").click();
    await currentPage.getByPlaceholder("Password").fill(account.password);
    await currentPage.getByRole("button", { name: "Sign in" }).click();
    await currentPage.getByText("Yes").click();
  }

  public async checkConnetion() {
    const responsePromise = this.page?.waitForResponse((resp) => resp.url().includes("user/accounts/me/links"));
    const response = await responsePromise;
    return await response.json();
  }

  public async steamLogin(account: IdpAccount, popUp: Page) {
    await popUp
      .locator("form")
      .filter({ hasText: "Sign in with account namePasswordRemember meSign in Help, I can't sign in" })
      .locator('input[type="text"]')
      .fill(account.name);
    await popUp.locator('input[type="password"]').click();
    await popUp.locator('input[type="password"]').fill(account.password);
    await popUp.getByRole("button", { name: "Sign in" }).click();
    // There are two sign in button to click in steam login flow
    await popUp.getByRole("button", { name: "Sign in" }).waitFor({ state: "visible" });
    await popUp.getByRole("button", { name: "Sign in" }).click();
  }

  public async PSNLogin(account: IdpAccount, popUp: Page) {
    await popUp.getByPlaceholder("Sign-In ID (Email Address)").click();
    await popUp.getByPlaceholder("Sign-In ID (Email Address)").fill(account.email);
    await popUp.getByRole("button").getByText("Next").click();
    await popUp.getByPlaceholder("Password").click();
    await popUp.getByPlaceholder("Password").fill(account.password);
    await popUp.getByRole("button").getByText("Sign In").click();
  }

  public async epicLogin(account: IdpAccount, popUp: Page) {
    const popupPromise = popUp.waitForEvent("popup");
    // using steam login to bypass recaptcha in epic login
    // steam is linked with the epic account
    await popUp.locator("#login-with-steam").click();
    this.steamLogin(account, await popupPromise);
  }

  public async metaLogin(account: IdpAccount, popUp: Page) {
    await popUp.waitForTimeout(10000);
    if (await popUp.getByTestId("cookie-policy-manage-dialog-accept-button").isVisible()) {
      await popUp.getByTestId("cookie-policy-manage-dialog-accept-button").click();
    }
    await popUp.waitForTimeout(3000);
    if (await popUp.getByRole("button", { name: "Allow all cookies" }).isVisible()) {
      await popUp.getByRole("button", { name: "Allow all cookies" }).click();
    }
    await popUp.getByRole("button", { name: "Continue with email" }).click();
    await popUp.getByLabel("Email").fill(account.email);
    await popUp.getByRole("button", { name: "Next" }).click();
    await popUp.getByRole("button", { name: "Enter password instead" }).click();
    await popUp.getByLabel("Password").first().fill(account.password);
    await popUp.getByRole("button", { name: "Log in" }).click();
    await popUp.waitForTimeout(10000);
    if (await popUp.getByTestId("cookie-policy-manage-dialog-accept-button").isVisible()) {
      await popUp.getByTestId("cookie-policy-manage-dialog-accept-button").click();
    }
    await popUp.waitForTimeout(3000);
    if (await popUp.getByRole("button", { name: "Allow all cookies" }).isVisible()) {
      await popUp.getByRole("button", { name: "Allow all cookies" }).click();
    }
    await popUp.getByRole("button", { name: "CONNECT ACCOUNT" }).click();
  }

  public async isPlatformLogoVisible(platform: string) {
    switch (platform) {
      case "Apple":
        return await this.page.getByTestId("platform-link-Apple").isVisible();
      case "Google":
        return await this.page.getByTestId("platform-link-Google").isVisible();
      case "Twitch":
        return await this.page.getByTestId("platform-link-Twitch").isVisible();
      case "Discord":
        return await this.page.getByTestId("platform-link-Discord").isVisible();
      case "Facebook":
        return await this.page.getByTestId("platform-link-Facebook").isVisible();
      case "Twitter":
        return await this.page.getByTestId("platform-link-Twitter").isVisible();
      case "Steam":
        return await this.page.getByTestId("platform-link-Steam").isVisible();
      case "Nintendo":
        return await this.page.getByTestId("platform-link-Nintendo").isVisible();
      case "Epic":
        return await this.page.getByTestId("platform-link-Epic").isVisible();
      case "PSN":
        return await this.page.getByTestId("platform-link-PlayStation").isVisible();
      case "Xbox":
        return await this.page.getByTestId("platform-link-Xbox").isVisible();
    }
  }

  public async clickOnConnectButtonPlatform(platform: string) {
    switch (platform) {
      case "Apple":
        await this.page.getByTestId("t2gp-portal-connect-button-Apple").click();
        break;
      case "Google":
        await this.page.getByTestId("t2gp-portal-connect-button-Google").click();
        break;
      case "Twitch":
        await this.page.getByTestId("t2gp-portal-connect-button-Twitch").click();
        break;
      case "Facebook":
        await this.page.getByTestId("t2gp-portal-connect-button-Facebook").click();
        break;
      case "Twitter":
        await this.page.getByTestId("t2gp-portal-connect-button-Twitter").click();
        break;
      case "Steam":
        await this.page.getByTestId("t2gp-portal-connect-button-Steam").click();
        break;
      case "Nintendo":
        await this.page.getByTestId("t2gp-portal-connect-button-Nintendo").click();
        break;
      case "Epic":
        await this.page.getByTestId("t2gp-portal-connect-button-Epic").click();
        break;
      case "PSN":
        await this.page.getByTestId("t2gp-portal-connect-button-PlayStation").click();
        break;
      case "Xbox":
        await this.page.getByTestId("t2gp-portal-connect-button-Xbox").click();
        break;
      case "Meta":
        await this.page.getByTestId("t2gp-portal-connect-button-Meta").click();
        break;
    }
  }

  public async openConsoleOnboardingEmulator() {
    const testingEnv = T2GP_LOGIN_BASE_URL.split("//")[1].split(".")[0];
    await this.page?.goto(`https://${testingEnv}.console-onboarding.2kcoretech.build`);
  }

  public async getDeviceCodeFromEmulator(game: string, platform: string) {
    await this.page?.locator("select").selectOption({ label: game });
    const popupPromise = this.page.waitForEvent("popup");
    await this.page?.getByText(platform).click();
    const newPopup = await popupPromise;
    await newPopup.waitForTimeout(5000);
    const deviceCode = await newPopup.locator("//a").getAttribute("href");
    await newPopup.close();
    return deviceCode?.split("=")[1];
  }
}
