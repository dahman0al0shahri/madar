import { test, expect } from '@playwright/test';

test('hub route replacement keeps one owned animation loop and preserves course rendering', async ({ page, context, baseURL }) => {
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === baseURL || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort();
  });
  const errors=[];page.on('pageerror', error=>errors.push(error.message));
  const config={access:{office:'public',network:'public',os1:'public'},contentAccess:{},grants:{},updates:[
    {id:'one',title:'Synthetic first',body:'Synthetic body',course:'',target:'courses',places:['global'],status:'published',pin:true,date:'2026-11-18',duration:12,scene:'office'},
    {id:'two',title:'Synthetic second',body:'Synthetic body',course:'',target:'courses',places:['global'],status:'published',pin:false,date:'2026-11-18',duration:12,scene:'hub'},
  ]};
  const profile={version:1,visits:{},notes:{},latest:null,syntheticUnknown:{keep:true}};
  await page.route('**/api/madar', route=>route.fulfill({json:{account:{user:null,isAdmin:true},config,lessons:[],notes:[],allowed:[],canPractice:true}}));
  await page.route('**/madar-persistence.js', route=>route.fulfill({contentType:'text/javascript',body:`
    window.runtimeWrites=[];
    const values={config:${JSON.stringify(config)},profile:${JSON.stringify(profile)}};
    window.MadarStore={open:async kind=>({value:structuredClone(values[kind]),save:async snapshot=>{
      values[kind]=structuredClone(snapshot);window.runtimeWrites.push({kind,snapshot:structuredClone(snapshot)});
    },download(){},discardAndReload(){}})};
  `}));
  await page.addInitScript(()=>{
    const request=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window);
    const pending=new Set();window.hubPendingFrames=()=>pending.size;
    window.requestAnimationFrame=callback=>{
      const owned=String(new Error().stack).includes('/hub/announcements.mjs');
      const id=request(time=>{pending.delete(id);callback(time);});
      if(owned)pending.add(id);return id;
    };
    window.cancelAnimationFrame=id=>{pending.delete(id);cancel(id);};
  });
  await page.goto('/#madar');
  await page.waitForFunction(()=>typeof document.getElementById('madar-hub')?.previewState==='function');
  await expect(page.locator('#mh-slide h2')).toHaveText('Synthetic first');
  await page.locator('#mh-next').click();await expect(page.locator('#mh-slide h2')).toHaveText('Synthetic second');
  await page.locator('#mh-prev').click();await expect(page.locator('#mh-slide h2')).toHaveText('Synthetic first');
  await page.locator('#mh-pause').click();
  await expect(page.locator('#mh-slide')).toHaveAttribute('aria-live','off');
  await page.locator('#mh-pause').click();
  await expect(page.locator('#mh-slide')).toHaveAttribute('aria-live','polite');
  for(let index=0;index<3;index++) {
    await page.locator('#mh-main [data-go="courses"]').first().click();
    await expect(page.locator('.mh-course-card')).toHaveCount(3);
    await page.locator('#mh-home-link').click();
    await expect(page.locator('#mh-slide h2')).toHaveText('Synthetic first');
    await expect.poll(()=>page.evaluate(()=>window.hubPendingFrames())).toBe(1);
  }
  await page.locator('#mh-main [data-go="courses"]').first().click();
  await page.locator('.mh-course-card.network [data-go]').click();
  await page.locator('.mh-course-nav [data-go="course:network:reference"]').click();
  await expect(page.locator('#mh-command-query')).toBeVisible();
  await page.locator('#mh-command-query').fill('missing-synthetic-command');
  await expect(page.locator('#mh-command-empty')).toBeVisible();
  await page.locator('#mh-home-link').click();
  await expect.poll(()=>page.evaluate(()=>window.hubPendingFrames())).toBe(1);
  expect(await page.evaluate(()=>document.getElementById('madar-hub').previewState().profiles.student.syntheticUnknown)).toEqual({keep:true});
  expect(errors).toEqual([]);
});
