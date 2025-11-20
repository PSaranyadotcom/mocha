import { BasePage } from "./base.page";
import { BrowserContext, Locator, Page } from "@playwright/test";
import { extractAccountId } from "../utils/helpers";
import { getEmailVerificationCode } from "../utils/api";
import { TwoKAccount } from "../utils/constants";

export class SignUpPage extends BasePage {
  verificationCodeField: Locator;
  continueButton: Locator;
  verifyEmailButton: Locator;
  emailInput: Locator;
  confirmEmailInput: Locator;
  confirmPasswordInput: Locator;
  passwordInput: Locator;
  firstNameInput: Locator;
  lastNameInput: Locator;
  displayNameInput: Locator;
  createAccountButton: Locator;
  createChildAccountButton: Locator;
  tosCheckbox: Locator;
  ppCheckbox: Locator;
  cppCheckbox: Locator;
  signUpButton: Locator;
  countryDropDown: Locator;
  dobMonthDropDown: Locator;
  dobYearDropDown: Locator;
  ageGatecontinueButton: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.verificationCodeField = this.page.locator("#verification-code");
    this.continueButton = this.page.getByRole("button", { name: "continue" });
    this.verifyEmailButton = this.page.locator("button", {
      hasText: "Verify Email",
    });
    this.createAccountButton = this.page.getByText("create account");
    this.createChildAccountButton = this.page.getByRole("button").getByText("Create 2K Child account");
    this.emailInput = this.page.getByRole("textbox", { name: "EMAIL" }).first();
    this.confirmEmailInput = this.page.getByRole("textbox", { name: "CONFIRM EMAIL" });
    this.confirmPasswordInput = this.page.getByRole("textbox", { name: "CONFIRM PASSWORD" });
    this.passwordInput = this.page.getByRole("textbox", { name: "PASSWORD" }).first();
    this.firstNameInput = this.page.getByRole("textbox", { name: "FIRST NAME" });
    this.lastNameInput = this.page.getByRole("textbox", { name: "LAST NAME" });
    this.displayNameInput = this.page.getByRole("textbox", { name: "DISPLAY NAME" });
    this.tosCheckbox = this.page.getByLabel("I agree to 2K’s  Terms of Service");
    this.ppCheckbox = this.page.getByLabel("I have read and understand 2K’s  Privacy Policy");
    this.cppCheckbox = this.page.getByLabel("I have read and understand 2K's Child's Privacy Policy");
    this.verifyEmailButton = this.page.getByRole("button").getByText("Verify Email");
    this.signUpButton = this.page.getByRole("button").getByText("Sign Up");
    this.countryDropDown = this.page.locator("#country");
    this.dobMonthDropDown = this.page.locator("#month");
    this.dobYearDropDown = this.page.locator("#year");
    this.ageGatecontinueButton = this.page.getByRole("button", { name: "continue" });
  }

  public async enterCountryBirthday(account: TwoKAccount) {
    await this.countryDropDown.selectOption(account.country);
    await this.dobMonthDropDown.selectOption(account.month);
    await this.dobYearDropDown.selectOption(account.year.toString());
    await this.ageGatecontinueButton.click();
  }

  public async enterVerificationCode(code: string) {
    await this.verificationCodeField.waitFor({ state: "visible" });
    await this.verificationCodeField.fill(code);
  }

  public async clickContinue() {
    await this.continueButton.click();
  }

  public async clickVerifyEmail() {
    await this.verifyEmailButton.click();
  }

  public async getEmailVerificationCode() {
    const codeVerificationPageUrl = this.page.url();
    const accountId = extractAccountId(codeVerificationPageUrl);
    const verificationCode = await getEmailVerificationCode(accountId);
    return await verificationCode.toString();
  }

  public async clickCreateAccountButton() {
    await this.createAccountButton.click();
  }

  public async signUp(account: TwoKAccount) {
    await this.emailInput.click();
    await this.emailInput.fill(account.email);
    await this.confirmEmailInput.click();
    await this.confirmEmailInput.fill(account.email);
    await this.passwordInput.click();
    await this.passwordInput.fill(account.password);
    await this.confirmPasswordInput.fill(account.password);
    await this.firstNameInput.fill(account.firstname);
    await this.lastNameInput.fill(account.lastname);
    await this.displayNameInput.fill(account.displayname);
    await this.tosCheckbox.check();
    await this.ppCheckbox.check();
    await this.signUpButton.click();
  }

  public async partialAdultEnterEmailName(account: TwoKAccount) {
    await this.emailInput.fill(account.email);
    await this.confirmEmailInput.fill(account.email);
    await this.passwordInput.fill(account.password);
    await this.confirmPasswordInput.fill(account.password);
    await this.displayNameInput.fill(account.displayname);
    await this.tosCheckbox.check();
    await this.ppCheckbox.check();
    await this.signUpButton.click();
  }

  public async coppaEnterEmailName(account: TwoKAccount) {
    await this.emailInput.fill(account.email);
    await this.confirmEmailInput.fill(account.email);
    await this.passwordInput.fill(account.password);
    await this.confirmPasswordInput.fill(account.password);
    await this.displayNameInput.fill(account.displayname);
    await this.tosCheckbox.check();
    await this.cppCheckbox.check();
    await this.createChildAccountButton.click();
  }

  public async verifyEmail() {
    await this.verifyEmailButton.waitFor({ state: "visible" });
    const code = await this.getEmailVerificationCode();
    await this.enterVerificationCode(code);
    await this.clickVerifyEmail();
  }
}
