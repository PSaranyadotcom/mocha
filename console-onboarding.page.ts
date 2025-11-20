import { BasePage } from "./base.page";
import { BrowserContext, Locator, Page } from "@playwright/test";
import { IdpAccount } from "../utils/constants";
import { retrieveActivationCode } from "../utils/api";
import { ICustomWorld } from "../support/custom-world";

export class ConsoleOnboardingPage extends BasePage {
  steamIcon: Locator;
  createAccountButton: Locator;
  loginButton: Locator;
  continueButton: Locator;
  emailField: Locator;
  passwordField: Locator;
  displayNameField: Locator;
  signUpButton: Locator;
  verificationCodeField: Locator;
  verifyEmailButton: Locator;
  connectButton: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.steamIcon = this.page.getByTestId("platform-link-Steam");
    this.createAccountButton = this.page.getByRole("button", { name: "create account" });
    this.loginButton = this.page.getByRole("button", { name: "Log In" });
    this.continueButton = this.page.getByRole("button", { name: "continue" });
    this.emailField = this.page.locator("#email");
    this.passwordField = this.page.locator("#password");
    this.displayNameField = this.page.locator("#displayName");
    this.signUpButton = this.page.getByTestId("signup");
    this.verificationCodeField = this.page.locator("#verification-code");
    this.verifyEmailButton = this.page.getByTestId("verify-email");
    this.connectButton = this.page.getByRole("button", { name: "CONNECT" });
  }

  public async consoleOnboarding(this: ICustomWorld, idpAccount?: IdpAccount, input?: string) {
    let userCode = input;
    if (!input) {
      userCode = await retrieveActivationCode(idpAccount!, this.game!);
    }
    await this.pagesObj?.activationPage.visitActivationCodePage();
    //   await waitForOneTrustBanner();
    await this.pagesObj?.activationPage.enterActivationCode(userCode!);
    await this.pagesObj?.activationPage.clickContinue();
  }

  public async verifyIdpPlatformIcon(idpAccount: IdpAccount) {
    switch (idpAccount.platform) {
      case "Steam":
        await this.steamIcon.waitFor({ state: "visible" });
        return await this.steamIcon.isVisible();
    }
  }

  public async verifyButtons() {
    return (await this.loginButton.isVisible()) && (await this.createAccountButton.isVisible());
  }

  public async clickCreateButton() {
    await this.createAccountButton.click();
  }

  public async clickLoginButton() {
    await this.loginButton.click();
  }

  public async clickContinue() {
    await this.continueButton.click();
  }

  public async clickConnect() {
    await this.connectButton.click();
  }
}
