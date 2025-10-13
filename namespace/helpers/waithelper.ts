import { expect, Page, Locator } from '@playwright/test';


export class Wait {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

async forVisible(selector: string, timeout = 10000): Promise<void> {
  await this.page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return false;

      const style = window.getComputedStyle(el);
      const isVisible =
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        parseFloat(style.opacity) > 0 &&
        el.offsetWidth > 0 &&
        el.offsetHeight > 0;

      return isVisible;
    },
    selector,
    { timeout }
  );
}


    async forHidden(selector: string, timeout = 10000): Promise<void> {
    await this.page.waitForFunction(
        (sel) => {
        return new Promise<void>((resolve) => {
            const el = document.querySelector(sel);
            if (!el) return resolve();
            if (!el.classList.contains('show')) return resolve();
            const onHidden = () => {
            el.removeEventListener('hidden.bs.modal', onHidden);
            resolve();
            };
            el.addEventListener('hidden.bs.modal', onHidden);
        });
        },
        selector,
        { timeout }
    );

    await expect(this.page.locator(selector)).toBeHidden({ timeout });
    }


}