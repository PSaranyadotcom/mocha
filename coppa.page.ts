import { BrowserContext, Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { ICustomWorld } from "../support/custom-world";
import { IdpAccount, T2GP_LOGIN_BASE_URL, TwoKAccount } from "../utils/constants";
import { remove2KLinkOfIdpAccount } from "../utils/api";
import { buildCoppaKwsCallbackPath, isNonProdEnv } from "../utils/helpers";

export class CoppaPage extends BasePage {
  accountDetailHeader: Locator;
  parentEmailField: Locator;
  tosCheckbox: Locator;
  ppCheckbox: Locator;
  coppaConfirmationCheckbox: Locator;
  continueButton: Locator;
  grantPermissionButton: Locator;
  sendEmailButton: Locator;
  updateButton: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.accountDetailHeader = this.page.locator("header", {
      hasText: "Account Overview",
    });
    this.parentEmailField = this.page.locator("#parent-email");
    this.tosCheckbox = this.page.locator("#termsofservice");
    this.ppCheckbox = this.page.locator("#privacypolicy");
    this.coppaConfirmationCheckbox = this.page.locator("#coppa-confirm-permission");
    this.continueButton = this.page.getByRole("button", { name: "continue" });
    this.grantPermissionButton = this.page.locator("//button", {
      hasText: "Set Permissions",
    });
    this.sendEmailButton = this.page.getByText("Send Email");
    this.updateButton = this.page.getByRole("button", { name: "update" });
  }

  public async createCoppaChildAccount(
    this: ICustomWorld,
    idpAccount: IdpAccount,
    new2KChildAccount: TwoKAccount,
    guardianEmail: string
  ) {
    this.twoKAccount = new2KChildAccount;
    expect(await remove2KLinkOfIdpAccount(idpAccount, this.game!)).toBeTruthy();
    await this.pagesObj?.consoleOnboardingPage.consoleOnboarding.call(this, idpAccount);
    await this.pagesObj?.consoleOnboardingPage.verifyIdpPlatformIcon(idpAccount);
    await this.pagesObj?.consoleOnboardingPage.clickCreateButton();
    await this.pagesObj?.signUpPage.enterCountryBirthday(new2KChildAccount);
    await this.pagesObj?.basePage.waitForHeaderHavingText("Ask a grown-up to help you with this");
    await this.pagesObj?.consoleOnboardingPage.clickContinue();
    await this.pagesObj?.basePage.waitForHeaderHavingText("Your child needs help setting up a 2K Child Account");
    await this.pagesObj?.consoleOnboardingPage.clickContinue();
    this.redirectUrl = await this.pagesObj?.coppaPage.coppaAskGrownUpToHelp(guardianEmail);
  }

  public async createPartialChildAccount(
    this: ICustomWorld,
    idpAccount: IdpAccount,
    new2KChildAccount: TwoKAccount,
    guardianEmail: string
  ) {
    this.twoKAccount = new2KChildAccount;
    expect(await remove2KLinkOfIdpAccount(idpAccount, this.game!)).toBeTruthy();
    await this.pagesObj?.consoleOnboardingPage.consoleOnboarding.call(this, idpAccount);
    await this.pagesObj?.consoleOnboardingPage.verifyIdpPlatformIcon(idpAccount);
    await this.pagesObj?.consoleOnboardingPage.clickCreateButton();
    await this.pagesObj?.signUpPage.enterCountryBirthday(new2KChildAccount);
    await this.pagesObj?.signUpPage.partialAdultEnterEmailName(new2KChildAccount);
    await this.pagesObj?.signUpPage.verifyEmail();
    await this.pagesObj?.consoleOnboardingPage.clickContinue();
    await this.pagesObj?.basePage.waitForHeaderHavingText("Ask a grown-up to help you with this");
    await this.pagesObj?.consoleOnboardingPage.clickContinue();
    await this.pagesObj?.basePage.waitForHeaderHavingText("Your child needs help setting up a 2K Child Account");
    await this.pagesObj?.consoleOnboardingPage.clickContinue();
    this.redirectUrl = await this.pagesObj?.coppaPage.partialCoppaAskGrownUpToHelp(guardianEmail);
  }

  public async createChildAccountForDnaDev(this: ICustomWorld, new2KChildAccount: TwoKAccount, guardianEmail: string) {
    this.twoKAccount = new2KChildAccount;
    await this.pagesObj?.consoleOnboardingPage.consoleOnboarding.call(this, undefined, this.deviceCode);
    await this.pagesObj?.consoleOnboardingPage.clickCreateButton();
    await this.pagesObj?.signUpPage.enterCountryBirthday(new2KChildAccount);
    await this.pagesObj?.basePage.waitForHeaderHavingText("Ask a grown-up to help you with this");
    await this.pagesObj?.consoleOnboardingPage.clickContinue();
    await this.pagesObj?.basePage.waitForHeaderHavingText("Your child needs help setting up a 2K Child Account");
    await this.pagesObj?.consoleOnboardingPage.clickContinue();
    this.redirectUrl = await this.pagesObj?.coppaPage.coppaAskGrownUpToHelp(guardianEmail);
  }

  public async getParentHelp(this: ICustomWorld, new2KChildAccount: TwoKAccount) {
    await this.pagesObj?.basePage.waitForHeaderHavingText("Verify your identity");
    await this.page
      ?.locator("//p", {
        hasText: "Our Adult Verification Partner Kids Web Services (KWS) just sent an email to",
      })
      .waitFor({ state: "visible" });

    // const coppaGame = getCoppaGameById(getApplicationIdByPlatform(idpAccount.platform));
    // prod environment doesn't return token for generating url
    if (isNonProdEnv()) {
      // open above returned url in browser to bypass going through Super Awesome email link and adult verification process
      await this.page?.goto(T2GP_LOGIN_BASE_URL + this.redirectUrl!);
      await this.pagesObj?.basePage.waitForHeaderHavingText("Almost there! Create a 2K Child Account");
      await this.pagesObj?.signUpPage.coppaEnterEmailName(new2KChildAccount);
      await this.pagesObj?.basePage.waitForHeaderHavingText("Verify your child’s email");
      await this.pagesObj?.signUpPage.verifyEmail();
      await this.pagesObj?.basePage.waitForHeaderHavingText(
        "Your child’s 2K Child Account has been created and successfully linked"
      );
      if (this.game === "hammer") {
        await this.pagesObj?.coppaPage.clickGrantPermission();
        await this.pagesObj?.coppaPage.clickGrantPermission();
      }
      if (this.game! === "buildup") {
        this.pagesObj?.basePage.waitForHeaderHavingText("LEGO® 2K GOOOAL!");
        this.page?.locator('//div[@class="type-body-m"]', {
          hasText: "Allow Child to Spend Money in Game (optional)",
        });

        this.page?.locator('//div[@class="type-body-s"]', {
          hasText: "Allow your child to use real money purchasing to buy premium content from the game store.",
        });

        this.page?.locator("#no-vc-real-money-purchasing").check();
        await this.pagesObj?.coppaPage.clickGrantPermission();
      }
    }
  }

  public async getPartialParentHelp(this: ICustomWorld) {
    await this.pagesObj?.basePage.waitForHeaderHavingText("Verify your identity");
    await this.page
      ?.locator("//p", {
        hasText: "Our Adult Verification Partner Kids Web Services (KWS) just sent an email to",
      })
      .waitFor({ state: "visible" });

    if (isNonProdEnv()) {
      await this.page?.goto(T2GP_LOGIN_BASE_URL + this.redirectUrl!);
      if (this.game! === "buildup") {
        this.pagesObj?.basePage.waitForHeaderHavingText("LEGO® 2K GOOOAL!");
        this.page?.locator('//div[@class="type-body-m"]', {
          hasText: "Allow Child to Spend Money in Game (optional)",
        });

        this.page?.locator('//div[@class="type-body-s"]', {
          hasText: "Allow your child to use real money purchasing to buy premium content from the game store.",
        });

        await this.pagesObj?.coppaPage.clickGrantPermission();
      }
    }
  }

  public async coppaAskGrownUpToHelp(parentEmail: string) {
    await this.parentEmailField.fill(parentEmail);
    await this.tosCheckbox.check();
    await this.ppCheckbox.check();
    await this.coppaConfirmationCheckbox.check();
    await this.continueButton.click();
    const responsePromise = this.page?.waitForResponse((resp) =>
      resp.url().includes("/coppa/send-parent-verification")
    );
    const response = await responsePromise;
    const path = buildCoppaKwsCallbackPath(await response.json());
    return path;
  }

  public async partialCoppaAskGrownUpToHelp(parentEmail: string) {
    await this.parentEmailField.fill(parentEmail);
    await this.tosCheckbox.check();
    await this.ppCheckbox.check();
    await this.continueButton.click();
    const responsePromise = this.page?.waitForResponse((resp) =>
      resp.url().includes("/coppa/send-parent-verification")
    );
    const response = await responsePromise;
    const path = buildCoppaKwsCallbackPath(await response.json());
    return path;
  }

  public async clickGrantPermission() {
    await this.page.waitForTimeout(500);
    await this.grantPermissionButton.click();
  }

  public async inspectPermission() {
    const responsePromise = this.page?.waitForResponse((resp) => resp.url().includes("/grant-permissions"));
    const response = await responsePromise;
    return await response.request().postDataJSON().permissions;
  }

  public async requestLinkPermission() {
    await this.sendEmailButton.click();
    const responsePromise = this.page?.waitForResponse((resp) =>
      resp.url().includes("/coppa/send-parent-email-authorization")
    );
    await this.page.waitForTimeout(500);
    return await responsePromise;
  }

  public async checkTosPPUpgrade() {
    await this.tosCheckbox.check();
    await this.ppCheckbox.check();
    await this.updateButton.click();
  }
}
