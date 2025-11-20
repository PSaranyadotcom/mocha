import { BasePage } from "./base.page";
import { BrowserContext, Locator, Page } from "@playwright/test";
import { T2GP_LOGIN_BASE_URL } from "../utils/constants";
export class ActivationPage extends BasePage {
  verificationCodeField: Locator;
  continueButton: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.verificationCodeField = this.page.locator("#userCode");
    this.continueButton = this.page.getByRole("button", { name: "continue" });
  }

  public async visitActivationCodePage() {
    const Url = T2GP_LOGIN_BASE_URL + "/2k/device";
    await this.page.goto(Url);
  }

  public async enterActivationCode(code: string) {
    await this.verificationCodeField.waitFor({ state: "visible" });
    await this.verificationCodeField.fill(code);
  }

  public async clickContinue() {
    await this.continueButton.click();
  }
}
