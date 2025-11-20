import { BrowserContext, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class AccountDetailPage extends BasePage {
  accountDetailHeader: Locator;
  // Menu Tabs
  privacyTabButton: Locator;
  securityTabButton: Locator;
  //
  updateVisibilityButton: Locator;
  updateEmailButton: Locator;
  updateEmailField: Locator;
  saveButton: Locator;
  verificationCodeField: Locator;
  verifyButton: Locator;
  resendVerificationButton: Locator;
  currentEmail: Locator;
  verifyEmailLink: Locator;
  closeButton: Locator;
  cancelButton: Locator;
  searchVisibilityCheckbox: Locator;
  blockButton: Locator;
  emailErrorMessage: Locator;
  //Coppa
  requestUpdatePermissionButton: Locator;
  sendEmailToParentButton: Locator;
  menuButton: Locator;
  logoutButton: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.accountDetailHeader = this.page.locator("header", {
      hasText: "Account Overview",
    });
    this.privacyTabButton = this.page.getByRole("menuitem").getByRole("link", { name: "privacy" });
    this.securityTabButton = this.page.getByRole("menuitem").getByRole("link", { name: "security" });
    // ToDo: updateVisibilityButton need rewrite in the future
    this.updateVisibilityButton = this.page
      .getByTestId("t2gp-panel-/portal/privacy/search")
      .getByTestId("t2gp-panel-update-button");
    // ToDo: updateEmailButton need rewrite in the future
    this.updateEmailButton = this.page
      .getByTestId("t2gp-panel-/portal/account-email")
      .getByTestId("t2gp-panel-update-button");
    this.updateEmailField = this.page.getByRole("textbox", { name: "EMAIL" });
    this.saveButton = this.page.getByRole("button").getByText("Save");
    this.verificationCodeField = this.page.getByLabel("Input your verification code");
    // ToDo: verifyButton need rewrite in the future
    this.verifyButton = this.page.getByTestId("verify-email");
    this.verifyEmailLink = this.page
      .getByTestId("t2gp-portal-account-info-pending-email")
      .getByTestId("t2gp-portal-verify-email-link");
    this.resendVerificationButton = this.page.getByRole("button").getByText("Resend Verification Code");
    this.currentEmail = this.page.getByTestId("t2gp-portal-account-info-current-email");
    this.closeButton = this.page.getByTitle("Close");
    this.cancelButton = this.page.getByRole("button").getByText("Cancel");
    this.searchVisibilityCheckbox = this.page.locator("#searchvisibility");
    this.blockButton = this.page.getByRole("button", { name: "Block" });
    this.requestUpdatePermissionButton = this.page.getByText("REQUEST UPDATE");
    this.sendEmailToParentButton = this.page.getByText("send email to parent");
    this.emailErrorMessage = this.page.locator(".t2gp-form-error-message");
    this.menuButton = this.page.getByTestId("t2gp-portal-top-nav-button");
    this.logoutButton = this.page.getByText("Log Out");
  }

  public async isOnAccountDetailPage() {
    await this.accountDetailHeader.waitFor({ state: "visible" });
    return await this.accountDetailHeader.isVisible();
  }

  public async updateEmail(email: string) {
    await this.updateEmailButton.click();
    await this.updateEmailField.click({ clickCount: 3 });
    await this.page.keyboard.press("Backspace");
    await this.updateEmailField.fill(email);
    if (email === "portale2e@2k.com") {
      await this.saveButton.click();
    } else {
      await this.saveButton.click();
      await this.verificationCodeField.click();
    }
  }

  public async getEmailMessage() {
    let errorMessage = await this.emailErrorMessage.textContent();
    return await errorMessage;
  }

  public async enterVerificationCode(code: number) {
    await this.verificationCodeField.fill(code.toString());
    await this.verifyButton.click();
  }

  public async resendEmailVerification() {
    await this.verifyEmailLink.click();
    await this.resendVerificationButton.click();
  }

  public async getCurrentEmail() {
    return await this.currentEmail.textContent();
  }

  public async closeDialog() {
    await this.closeButton.click();
  }

  public async cancelUpdateEmail() {
    await this.cancelButton.click();
  }

  public async goToTab(tab: string) {
    await this.page.getByRole("menuitem").getByText(tab).click();
  }

  public async updateSearchVisibility(visibility: string) {
    await this.updateVisibilityButton.click();
    const isChecked = await this.searchVisibilityCheckbox.isChecked();
    const visibilityBoolean = visibility === "On";
    if (visibilityBoolean != isChecked) {
      await this.searchVisibilityCheckbox.click();
    }
    await this.saveButton.click();
  }

  public async isSearchVisibilityOn() {
    return await this.page.getByTestId("t2gp-panel-/portal/privacy/search").getByText("On").isVisible();
  }

  public async logout() {
    await this.menuButton.click();
    await this.logoutButton.click();
  }

  public async addUsertoBlockList(userTag: string) {
    await this.page.getByRole("textbox").click();
    await this.page.getByRole("textbox").fill(userTag);
    await this.blockButton.click();
  }

  public async isUserInBlockList(userTag: string) {
    return await this.page
      .getByTestId("t2gp-panel-/portal/privacy/blocked")
      .locator("div")
      .filter({ hasText: `${userTag}` })
      .isVisible();
  }

  public async removeUserFromBlockList(userTag: string) {
    await this.page
      .getByTestId("t2gp-panel-/portal/privacy/blocked")
      .locator("div")
      .filter({ hasText: `${userTag}` })
      .getByRole("button")
      .click();
  }

  public async requestUpdatePermission() {
    await this.requestUpdatePermissionButton.click();
    await this.page.waitForTimeout(500);
    const responsePromise = this.page?.waitForResponse((resp) =>
      resp.url().includes("/coppa/send-update-permissions-request")
    );
    await this.page.waitForTimeout(500);
    await this.sendEmailToParentButton.click();
    await this.page.waitForTimeout(500);
    return await responsePromise;
  }
}
