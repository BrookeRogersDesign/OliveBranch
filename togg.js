const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const [n,w,h] of [['d',1440,900],['m',390,844]]) {
    const ctx = await b.newContext({ viewport:{width:w,height:h} });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(n+': '+e.message));
    await p.goto('http://localhost:8899/index.html', { waitUntil:'load' });
    await p.click('[data-nav-toggle]'); await p.waitForTimeout(600);
    await p.screenshot({ path:`/home/claude/shots/tog-${n}-open.png` });
    // close with the SAME pill
    await p.click('[data-nav-toggle]'); await p.waitForTimeout(600);
    const closed = await p.$eval('[data-nav-overlay]', el => el.classList.contains('is-open'));
    // reopen with keyboard shortcut
    await p.keyboard.press('Control+k'); await p.waitForTimeout(500);
    const reopened = await p.$eval('[data-nav-overlay]', el => el.classList.contains('is-open'));
    // escape
    await p.keyboard.press('Escape'); await p.waitForTimeout(400);
    const escClosed = await p.$eval('[data-nav-overlay]', el => el.classList.contains('is-open'));
    console.log(n, '| pill closed:', !closed, '| ctrl+k reopened:', reopened, '| esc closed:', !escClosed);
    await ctx.close();
  }
  await b.close();
  console.log(errs.length ? errs.join('\n') : 'no errors');
})();
