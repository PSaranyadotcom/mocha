import { BasePage } from "./base.page";
import { BrowserContext, Locator, Page } from "@playwright/test";
import { composeClientUrl, getClientUrlParams } from "../utils/helpers";
import { Client, T2GP_LOGIN_BASE_URL, IdpAccount } from "../utils/constants";

export class LoginPage extends BasePage {
  firstPartyLoginButton: Locator;
  loginButton: Locator;
  emailInput: Locator;
  passwordInput: Locator;
  keepMeSignInCheckbox: Locator;
  forgotPasswordLink: Locator;
  socialListErrorNotification: Locator;
  signUpLink: Locator;
  createAccountButton: Locator;
  errorPrompt: Locator;
  twoKLogo: Locator;
  discordButton: Locator;
  alreadyLinkedMessage: Locator;
  linkInGameErrorMessage: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.firstPartyLoginButton = this.page.getByTestId("t2gp-first-party-login-buttons");
    this.loginButton = this.page.getByRole("button", { name: "Log In" });
    this.emailInput = this.page.getByRole("textbox", { name: "EMAIL" });
    this.passwordInput = this.page.getByRole("textbox", { name: "PASSWORD" });
    this.keepMeSignInCheckbox = this.page.locator("#keep_me_login");
    this.forgotPasswordLink = this.page.locator('a[href*="/2k/forgot-password"]');
    this.socialListErrorNotification = this.page.locator(".t2gp-social-account-list .t2gp-error");
    this.createAccountButton = this.page.getByRole("button").getByText("create account");
    this.signUpLink = this.page.locator('a[href*="/2k/signup"]');
    this.errorPrompt = this.page.locator(".t2gp-form-error-message");
    this.twoKLogo = this.page.getByTestId("t2gp-2k-logo");
    this.discordButton = this.page.getByRole("button", { name: "Sign in with Discord" });
    this.alreadyLinkedMessage = this.page.locator(".t2gp-form-error-message");
    this.linkInGameErrorMessage = this.page.locator(".t2gp-page-heading");
  }

  public async composeUrlAndLogin(email: string, password: string, entry = "portal") {
    let loginUrl = T2GP_LOGIN_BASE_URL;
    switch (entry) {
      case "portal":
        loginUrl += composeClientUrl(await getClientUrlParams(Client.PORTAL));
        break;
      case "launcher":
        loginUrl += composeClientUrl(await getClientUrlParams(Client.LAUNCHER));
        break;
      case "store":
        loginUrl += composeClientUrl(await getClientUrlParams(Client.STORE));
        break;
    }
    await this.page.goto(loginUrl);
    await this.login(email, password);
  }

  public async login(email: string, password: string) {
    await this.emailInput.waitFor({ state: "visible" });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  public async checkKeepMeLoggedIn() {
    const checked = await this.keepMeSignInCheckbox.isChecked();
    if (!checked) {
      await this.keepMeSignInCheckbox.check();
    }
  }

  public async clickLoginButton() {
    await this.loginButton.click();
  }

  public async isLoginButtonVisible() {
    return await this.loginButton.isVisible();
  }

  public async isCreateAccountButtonVisible() {
    return await this.createAccountButton.isVisible();
  }

  public async discordLogin(account: IdpAccount, popUp?: Page) {
    await this.page.waitForTimeout(2000);
    await popUp?.locator("input[name='email']").fill(account.email);
    await popUp?.locator("input[name='password']").fill(account.password);
    await popUp?.getByRole("button", { name: "Log In" }).click();
    await this.page.waitForTimeout(2000);

    const auth_us = await popUp?.getByRole("button", { name: "Authorize" });
    const auth_uk = await popUp?.getByRole("button", { name: "Authorise" });

    if (await auth_us!.isVisible()) {
      await auth_us!.click();
    } else if (await auth_uk!.isVisible()) {
      await auth_uk!.click();
    }
  }

  public async previouslyLinkedMessage() {
    return await this.alreadyLinkedMessage.innerText();
  }

  public async childLinkInGameError() {
    return await this.linkInGameErrorMessage.innerText();
  }
}
