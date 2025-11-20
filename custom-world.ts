import { AllPagesObject } from "../pages/all-pages-object";
import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { BrowserContext, Page, Response } from "@playwright/test";
import { TwoKAccount } from "../utils/constants";

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export interface ICustomWorld extends World {
  platform?: string;
  entry?: string;
  twoKAccount?: TwoKAccount;
  debug: boolean;
  context?: BrowserContext;
  page?: Page;
  pagesObj?: AllPagesObject;
  redirectUrl?: string;
  game?: string;
  updatedEmail?: string;
  popUp?: Page;
  response?: Response;
  parentEmail?: string;
  deviceCode?: string;
  isAgedUp?: boolean;
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
  context?: BrowserContext | undefined;
  page?: Page | undefined;
  pagesObj?: AllPagesObject | undefined;
  debug = false;
}

setWorldConstructor(CustomWorld);
