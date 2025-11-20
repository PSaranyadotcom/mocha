import { ICustomWorld } from "../support/custom-world";
import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

When("I open the Communication page", async function (this: ICustomWorld) {
  await this.pagesObj?.communicationPage.clickCommunicationPage();
});

When("update language to {string}", async function (this: ICustomWorld, language: string) {
  await this.pagesObj?.communicationPage.clickUpdateLanguageButton();
  await this.pagesObj?.communicationPage.clickLanguageDropdown(language);
  await this.pagesObj?.communicationPage.clickSaveButton();
});

When("I decide to update the language", async function (this: ICustomWorld) {
  await this.pagesObj?.communicationPage.clickUpdateLanguageButton();
});

Then("I click the language dropdown and select {string}", async function (this: ICustomWorld, language: string) {
  await this.pagesObj?.communicationPage.clickLanguageDropdown(language);
});

When("I save my communication settings", async function (this: ICustomWorld) {
  await this.pagesObj?.communicationPage.clickSaveButton();
});

Then("The API should update", async function (this: ICustomWorld) {
  const language = await this.pagesObj?.communicationPage.checkTranslation();
  await expect(language.locale).toContain("es-US");
  await expect(language.language).toContain("es");
});

When("the copy should be translated in spanish", async function (this: ICustomWorld) {
  const translatedText = await this.pagesObj?.communicationPage.getTranslatedText();
  await expect(translatedText).toContain("Preferencias de comunicación");
});

When("I click update the newsletter button", async function (this: ICustomWorld) {
  await this.pagesObj?.communicationPage.clickUpdateNewsLetter();
});

When("I check the checkbox", async function (this: ICustomWorld) {
  await this.pagesObj?.communicationPage.setNewsLetterCheckbox();
});

Then("Newsletter API should update", async function (this: ICustomWorld) {
  const checkAPIUpdate = await this.pagesObj?.communicationPage.checkNewsLetterUpdate();
  expect(checkAPIUpdate).toBeTruthy();
});

When('I deselect master consent to receive newsletters', async function () {
  await this.pagesObj?.communicationPage.deselectNewsLetterCheckbox();
});

When('I select master consent to receive newsletters', async function () {
  await this.pagesObj?.communicationPage.setNewsLetterCheckbox();
});

Then('I should see I no newsletter subscriptions', async function () {
  await expect(this.pagesObj?.communicationPage.newsLetterCheckbox).toBeDisabled;
});

Then('I should see newsletter subscriptions', async function () {
  await expect(this.pagesObj?.communicationPage.newsLetterCheckbox).toBeChecked;
});

When('I deselect newsletter subscription for civilization', async function () {
  await this.pagesObj?.communicationPage.deselectCivilizationCheckbox();
});

Then('I see civilization is unsubscribed', async function () {
  await expect(this.pagesObj?.communicationPage.newsLetterCheckbox).toBeChecked;
  const checkAPIUpdate = await this.pagesObj?.communicationPage.checkNewsLetterUpdate();
  expect(JSON.stringify(checkAPIUpdate)).toContain("\"value\":\"civilization\",\"checked\":false")
});

