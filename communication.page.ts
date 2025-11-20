import { BasePage } from "./base.page";
import { BrowserContext, Locator, Page } from "@playwright/test";
import { T2GP_LOGIN_BASE_URL } from "../utils/constants";

export class CommunicationPage extends BasePage {
  communicationPage: Locator;
  updateLanguageButton: Locator;
  languageDropdown: Locator;
  saveButton: Locator;
  updateNewsLetter: Locator;
  newsLetterCheckbox: Locator;
  translatedText: Locator;
  civilizationCheckbox: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.communicationPage = this.page.getByRole("link", { name: "COMMUNICATIONS" });
    this.translatedText = this.page.getByText("Preferencias de comunicación");
    this.updateLanguageButton = this.page
      .getByTestId("t2gp-panel-/portal/account-newsletter")
      .getByRole("button", { name: "Update" });
    this.languageDropdown = this.page.getByRole("combobox", { name: "language" });
    this.saveButton = this.page.getByRole("button", { name: "Save" });
    this.updateNewsLetter = this.page
      .getByTestId("t2gp-panel-/portal/subscriptions")
      .getByRole("button", { name: "Update" });
    this.newsLetterCheckbox = this.page.getByLabel(
      "I would like to receive news and promotional messages from 2K and its affiliates"
    );
    this.civilizationCheckbox = this.page.getByTestId('t2gp-panel-/portal/subscriptions').locator('section').filter({ hasText: 'CivilizationSubscribe' }).getByLabel('Subscribe');
  }

  public async clickCommunicationPage() {
    await this.communicationPage.click();
  }

  public async clickUpdateLanguageButton() {
    await this.page.waitForTimeout(1000);
    await this.updateLanguageButton.click();
  }

  public async clickLanguageDropdown(language: string) {
    await this.languageDropdown.selectOption(language);
  }

  public async clickSaveButton() {
    await this.page.waitForTimeout(1000);
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);
  }

  public async checkTranslation() {
    await this.page.waitForTimeout(1000);
    const responsePromise = this.page?.waitForResponse((resp) => resp.url().includes("user/accounts/me"));
    await this.page?.goto(`${T2GP_LOGIN_BASE_URL}/es/2k/portal/communications`);
    const response = await responsePromise;
    return await response.json();
  }

  public async getTranslatedText() {
    const translatedText = await this.translatedText.innerText();
    return await translatedText;
  }

  public async clickUpdateNewsLetter() {
    await this.page.waitForTimeout(1000);
    await this.updateNewsLetter.click();
  }

  public async setNewsLetterCheckbox() {
    await this.newsLetterCheckbox.setChecked(true);
  }
  
  public async deselectNewsLetterCheckbox() {
    await this.newsLetterCheckbox.setChecked(false);
  }

  public async setCivilizationCheckbox() {
    await this.civilizationCheckbox.setChecked(true);
  }

  public async deselectCivilizationCheckbox() {
    await this.civilizationCheckbox.setChecked(false);
  }
  
  public async checkNewsLetterUpdate() {
    await this.page.waitForTimeout(1000);
    const responsePromise = this.page?.waitForResponse((resp) =>
      resp.url().includes("/user/accounts/me/subscriptions")
    );
    await this.page?.goto(`${T2GP_LOGIN_BASE_URL}/user/accounts/me/subscriptions`);
    const response = await responsePromise;
    return await response.json();
  }



}
