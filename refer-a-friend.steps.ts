import { ICustomWorld } from "../support/custom-world";
import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

When("I navigate to refer a friend area", async function (this: ICustomWorld) {
  await this.pagesObj?.basePage.clickOnMenuItem("Refer a Friend");
});

Then("I should see the raf empty page", async function (this: ICustomWorld) {
  await this.pagesObj?.rafOpportunitiesPage.rafEmptyPage();
});

When("I should see at least one campaign in the {string} list", async function (this: ICustomWorld, list: string) {
  switch (list) {
    case "Active":
      await this.page?.waitForTimeout(5000);
      expect(await this.pagesObj?.rafOpportunitiesPage.rafActiveCards.count()).toBeGreaterThan(0);
        break;
    case "Expired":
      await this.pagesObj?.rafOpportunitiesPage.rafExpiredCampaignsTab.click()
      await this.page?.waitForTimeout(5000);
      expect(await this.pagesObj?.rafOpportunitiesPage.rafExpiredCards.count()).toBeGreaterThan(0);
        break;
    default:
      console.error("Invalid list parameter:", list);
        break;
  }
});

Then("I should be able to see the time left on any active campaign on the active list", async function (this: ICustomWorld) {
  await this.page?.waitForTimeout(5000);
  expect(await this.pagesObj?.rafOpportunitiesPage.rafActiveCards.count())
  .toEqual(await this.page?.getByText("days left").count());
});

When("I click on the first campaign available in the {string} list", async function (this: ICustomWorld, list: string) {
  switch (list) {
    case "Active":
      await this.page?.waitForTimeout(3000);
      await this.pagesObj?.rafOpportunitiesPage.rafFirstActiveCard.click();    
        break;
    case "Expired":
      await this.pagesObj?.rafOpportunitiesPage.rafExpiredCampaignsTab.click()
      await this.page?.waitForTimeout(3000);
      await this.pagesObj?.rafOpportunitiesPage.rafFirstExpiredCard.click();
        break;
  }
});

Then("I should be redirected to the details page of the selected campaign", async function (this: ICustomWorld) {
  await this.page?.waitForTimeout(3000);
  const currentUrl = await this.page?.url();
  expect(currentUrl).toContain('/refer-a-friend?id=refer-a-friend&gameId=');
});

Then("I should be able to go back to the campaign list", async function (this: ICustomWorld) {
  await this.pagesObj?.rafOpportunitiesPage.rafBackFromDetails.click()
  await this.page?.waitForTimeout(5000);
  const currentUrl = await this.page?.url();
  expect(currentUrl).toContain('/refer-a-friend');
});
