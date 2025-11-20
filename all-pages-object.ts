import { BasePage } from "./base.page";
import { LoginPage } from "./login.page";
import { AccountDetailPage } from "./accountDetail.page";
import { Page, BrowserContext } from "@playwright/test";
import { ActivationPage } from "./activation.page";
import { ConsoleOnboardingPage } from "./console-onboarding.page";
import { SignUpPage } from "./sign-up.page";
import { CoppaPage } from "./coppa.page";
import { ConnectionsPage } from "./connections.page";
import { CommunicationPage } from "./communication.page";
import { RAFOpportunitiesPage } from "./raf-opportunities.page";

export class AllPagesObject {
  basePage: BasePage;
  loginPage: LoginPage;
  accountDetailPage: AccountDetailPage;
  activationPage: ActivationPage;
  consoleOnboardingPage: ConsoleOnboardingPage;
  signUpPage: SignUpPage;
  coppaPage: CoppaPage;
  connectionsPage: ConnectionsPage;
  communicationPage: CommunicationPage;
  rafOpportunitiesPage: RAFOpportunitiesPage;

  constructor(public page: Page, public context: BrowserContext) {
    this.basePage = new BasePage(page, context);
    this.loginPage = new LoginPage(page, context);
    this.accountDetailPage = new AccountDetailPage(page, context);
    this.activationPage = new ActivationPage(page, context);
    this.consoleOnboardingPage = new ConsoleOnboardingPage(page, context);
    this.signUpPage = new SignUpPage(page, context);
    this.coppaPage = new CoppaPage(page, context);
    this.connectionsPage = new ConnectionsPage(page, context);
    this.communicationPage = new CommunicationPage(page, context);
    this.rafOpportunitiesPage = new RAFOpportunitiesPage(page, context);
  }
}
