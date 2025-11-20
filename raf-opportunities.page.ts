import { BasePage } from "./base.page";
import { BrowserContext, Locator, Page } from "@playwright/test";

export class RAFOpportunitiesPage extends BasePage {
  navigationMenuTitle: Locator;
  rafHeader: Locator;
  rafDescription: Locator;
  rafActiveCampaignsTab: Locator;
  rafExpiredCampaignsTab: Locator;
  rafEmptyList: Locator;
  rafFirstActiveCard: Locator;
  rafFirstExpiredCard: Locator;
  rafActiveCards: Locator;
  rafExpiredCards: Locator;
  rafBackFromDetails: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.navigationMenuTitle = this.page.locator("header", { hasText: "Account Overview" });
    this.rafHeader = this.page.getByRole('heading', { name: 'Refer a Friend' });
    this.rafDescription = this.page.getByText("Invite your friends to join you in on your favorite games, and unlock exclusive rewards together as you explore new levels!");
    this.rafActiveCampaignsTab = this.page.getByRole("button").getByText("Active campaigns");
    this.rafExpiredCampaignsTab = this.page.getByRole("button").getByText("Expired campaigns");
    this.rafEmptyList = this.page.getByText("No campaigns here yet");
    this.rafFirstActiveCard = this.page.getByTestId("t2gp-active-item-0");
    this.rafFirstExpiredCard = this.page.getByTestId("t2gp-inactive-item-0");
    this.rafActiveCards = this.page.locator("[data-testid^='t2gp-active-item']");
    this.rafExpiredCards = this.page.locator("[data-testid^='t2gp-inactive-item']");
    this.rafBackFromDetails = this.page.locator("[data-testid='t2gp-back-to-page']");
  }

  public async rafEmptyPage() {
    try {
      await Promise.all([
        this.rafHeader.waitFor({ state: "visible", timeout: 5000 }).catch(() => {
          throw new Error("RAF Header was not visible");
        }),
        this.rafDescription.waitFor({ state: "visible", timeout: 5000 }).catch(() => {
          throw new Error("RAF Description was not visible");
        }),
        this.rafActiveCampaignsTab.waitFor({ state: "visible", timeout: 5000 }).catch(() => {
          throw new Error("RAF Active Campaigns Tab was not visible");
        }),
        this.rafExpiredCampaignsTab.waitFor({ state: "visible", timeout: 5000 }).catch(() => {
          throw new Error("RAF Expired Campaigns Tab was not visible");
        }),
        this.rafEmptyList.waitFor({ state: "visible", timeout: 5000 }).catch(() => {
          throw new Error("RAF Empty List message was not visible");
        }),
      ]);
    } catch (error) {
      console.error("Error loading elements on RAF Opportunities Page:", error);
      throw error;
    }

    const areAllElementsVisible =
      await Promise.all([
        this.rafHeader.isVisible(),
        this.rafDescription.isVisible(),
        this.rafActiveCampaignsTab.isVisible(),
        this.rafExpiredCampaignsTab.isVisible(),
        this.rafEmptyList.isVisible(),
      ]);

    return areAllElementsVisible.every(isVisible => isVisible);
  }


}
