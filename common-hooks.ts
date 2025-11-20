import config from "../../config";
import { ICustomWorld } from "./custom-world";
import { AllPagesObject } from "../pages/all-pages-object";
import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { ITestCaseHookParameter } from "@cucumber/cucumber/lib/support_code_library_builder/types";
import { chromium, ChromiumBrowser, firefox, FirefoxBrowser, webkit, WebKitBrowser } from "@playwright/test";

setDefaultTimeout(process.env.PWDEBUG ? -1 : config.defaultTimeout);

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;

BeforeAll(async function (this: ICustomWorld) {
  const commonBrowserOptions = {
    headless: config.runHeadless,
    slowMo: config.runSlow,
  };

  switch (config.browser) {
    case "firefox":
      browser = await firefox.launch({
        ...commonBrowserOptions,
        firefoxUserPrefs: {
          "media.navigator.streams.fake": true,
          "media.navigator.permission.disabled": true,
        },
      });
      break;

    case "webkit":
      browser = await webkit.launch(commonBrowserOptions);
      break;

    default:
      browser = await chromium.launch({
        ...commonBrowserOptions,
        args: [
          "--use-fake-ui-for-media-stream",
          "--use-fake-device-for-media-stream",
          "--no-sandbox",
          "--disable-dev-shm-usage",
        ],
      });
  }
});

Before({ tags: "@ignore" }, async function () {
  return "skipped" as any;
});

Before({ tags: "@debug" }, async function (this: ICustomWorld) {
  this.debug = true;
});

Before(async function (this: ICustomWorld) {
  // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: config.recordVideos ? { dir: "screenshots" } : undefined,
  });
  this.page = await this.context.newPage();
  this.pagesObj = new AllPagesObject(this.page, this.context);
  // await this.page.goto(config.baseUrl);
});

After(async function (this: ICustomWorld, Scenario: ITestCaseHookParameter) {
  if (Scenario.result) {
    await this.attach(`Status: ${Scenario.result?.status}. Duration:${Scenario.result.duration?.seconds}}s`);

    if (Scenario.result.status === Status.FAILED) {
      const image = await this.pagesObj?.basePage.screenshot(`${Scenario.pickle.name}`);
      image && (await this.attach(image, "image/png"));
    }
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
