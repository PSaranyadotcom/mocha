import { ICustomWorld } from "../support/custom-world";
import { When, Then } from "@cucumber/cucumber";
import { T2GP_LOGIN_BASE_URL } from "../utils/constants";

When("I open portal homepage", async function (this: ICustomWorld) {
  await this.page?.goto(T2GP_LOGIN_BASE_URL);
});

When("I click continue", async function (this: ICustomWorld) {
  await this.pagesObj?.basePage.clickContinueButton();
});

When("I refresh the page", async function (this: ICustomWorld) {
  await this.pagesObj?.basePage.refreshPage();
});

When("I logout", async function (this: ICustomWorld) {
  await this.pagesObj?.accountDetailPage.logout();
});

When("I wait for {int} ms", async function (this: ICustomWorld, ms: number) {
  await this.page?.waitForTimeout(ms);
});

Then("Snapshot {string}", async function (this: ICustomWorld, name: string) {
  await this.pagesObj?.basePage.screenshot(name);
});

Then("Snapshot", async function (this: ICustomWorld) {
  const image = await this.page?.screenshot();
  image && (await this.attach(image, "image/png"));
});

Then("I should be prompted an error of {string}", async function (this: ICustomWorld, errorMsg: string) {
  await this.page?.waitForTimeout(1000);
  await this.pagesObj?.basePage.isTextVisible(errorMsg);
});

Then("There should be an error of {string} in the popup", async function (this: ICustomWorld, errorMsg: string) {
  await this.popUp?.getByText(errorMsg).waitFor({ state: "visible" });
});

Then("debug", async function () {
  // eslint-disable-next-line no-debugger
  debugger;
});
