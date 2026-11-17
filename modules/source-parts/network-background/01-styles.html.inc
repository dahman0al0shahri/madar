<style>
    #madar-net-space{--coal:#090b0e;--copper:#bb784e;--amber:#ffc478;--cream:#f7e7d4;position:relative;isolation:isolate;background:var(--coal);color:var(--cream);font-family:Tahoma,Arial,sans-serif;overflow:hidden;width:100%;min-width:0}
    #madar-net-space *{box-sizing:border-box}
    #madar-net-space .net-stage{position:relative;height:660px;overflow:hidden;background:#090b0e}
    #madar-net-space canvas{display:block;width:100%;height:100%;touch-action:pan-y}
    #madar-net-space .net-head{position:absolute;top:27px;right:28px;z-index:2;pointer-events:none}
    #madar-net-space .net-brand{font-size:22px;font-weight:700;letter-spacing:-1px}
    #madar-net-space .net-kicker{font-size:10px;letter-spacing:2.8px;color:#d49b70;margin-top:8px;direction:ltr}
    #madar-net-space .net-pause{position:absolute;left:24px;top:28px;width:44px;height:44px;border-radius:50%;border:1px solid #a16c4359;background:#15171cef;color:#ffd09a;font-size:18px;z-index:4;display:grid;place-items:center}
    #madar-net-space button:focus-visible{outline:2px solid #ffd09a;outline-offset:5px}
    #madar-net-space .net-caption{position:absolute;right:28px;bottom:25px;pointer-events:none;max-width:calc(100% - 56px)}
    #madar-net-space .net-caption small{color:#d39769;font-size:10px;letter-spacing:3px;display:block;margin-bottom:9px;direction:ltr;text-align:right}
    #madar-net-space .net-title{font-weight:500;font-size:25px;margin:0 0 7px;letter-spacing:-.6px}
    #madar-net-space .net-phase{font-size:12px;color:#b9b2a8;min-height:19px;line-height:1.6}
    #madar-net-space .net-footer{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:16px 24px;background:#0d1014;border-top:1px solid #b77b4c30}
    #madar-net-space .net-scenes{display:flex;gap:6px;flex-wrap:wrap}
    #madar-net-space .net-scenes button{font:inherit;font-size:12px;padding:10px 13px;min-height:42px;border:1px solid transparent;border-radius:7px;background:transparent;color:#a6a7aa;transition:background .2s,color .2s,border-color .2s}
    #madar-net-space .net-scenes button[aria-pressed="true"]{color:#ffca91;background:#a1643020;border-color:#c086504f}
    #madar-net-space .net-seq{font:10px monospace;color:#a88260;direction:ltr;letter-spacing:2px}
    #madar-net-space .net-progress{position:absolute;bottom:0;right:0;height:2px;width:100%;transform-origin:right;background:linear-gradient(90deg,#74482f,#f3b476);pointer-events:none}
    #madar-net-space .device-hit{position:absolute;padding:0;border:0;background:transparent;color:transparent;width:72px;height:72px;transform:translate(-50%,-50%);border-radius:10px;z-index:3}
    #madar-net-space .net-tip{position:absolute;z-index:4;background:#181b20ed;border:1px solid #b681515e;border-radius:5px;padding:7px 12px;color:#edc6a1;font-size:12px;pointer-events:none;transform:translate(-50%,-100%);white-space:nowrap}
    @media(max-width:520px){#madar-net-space .net-stage{height:610px}#madar-net-space .net-head{right:20px;top:24px}#madar-net-space .net-pause{left:18px;top:26px}#madar-net-space .net-title{font-size:23px}#madar-net-space .net-caption{right:20px;bottom:22px;max-width:calc(100% - 40px)}#madar-net-space .net-footer{padding:12px;gap:8px}#madar-net-space .net-scenes{gap:1px;justify-content:center;width:100%}#madar-net-space .net-scenes button{padding:9px 8px;font-size:11px}#madar-net-space .net-seq{margin:0 auto}}
  </style>
  <style>
    #madar-net-space .net-stage{height:720px}
    #madar-net-space .demo-scroll{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:#866044 #111419;z-index:2;overscroll-behavior:contain}
    #madar-net-space .demo-page{width:100%;min-height:1160px;padding:28px 34px 240px;color:#f3e6d6;direction:rtl}
    #madar-net-space .demo-nav{display:flex;align-items:center;gap:22px;min-height:48px;padding-left:66px}
    #madar-net-space .demo-logo{font-size:26px;font-weight:700;margin-left:auto}
    #madar-net-space .demo-nav button{font:inherit;font-size:13px;border:0;border-bottom:1px solid transparent;background:transparent;color:#b6aea5;min-height:44px;padding:8px 2px}
    #madar-net-space .demo-nav button[aria-pressed=true]{color:#ffc88c;border-color:#d6965d}
    #madar-net-space .demo-hero{margin:102px 0 0 auto;max-width:410px;padding:28px;background:linear-gradient(110deg,#0d1013b8,#111418ed);border-right:2px solid #aa734d}
    #madar-net-space .demo-eyebrow{color:#c28d66;font-size:12px;letter-spacing:1px}
    #madar-net-space .demo-hero h2{font-size:38px;line-height:1.4;margin:18px 0;color:#f7e7d4;font-weight:500}
    #madar-net-space .demo-hero p{font-size:16px;line-height:1.9;color:#bdb6ab;margin:0 0 26px}
    #madar-net-space .demo-start{font:inherit;font-size:14px;color:#21160d;background:#e5b07a;border:0;border-radius:7px;padding:13px 23px;min-height:46px}
    #madar-net-space .demo-lessons{margin:190px 0 0 auto;max-width:410px;background:#111418ed;padding:24px;border-top:1px solid #75533c}
    #madar-net-space .demo-lessons h3{font-size:21px;font-weight:500;margin:0 0 20px}
    #madar-net-space .lesson-line{display:flex;align-items:center;gap:18px;padding:22px 0;border-top:1px solid #ffffff12;font-size:15px}
    #madar-net-space .lesson-line small{font:12px monospace;color:#d49762;direction:ltr}
    #madar-net-space .self-device{position:absolute;left:7%;bottom:60px;width:210px;z-index:3;pointer-events:none;filter:drop-shadow(0 18px 18px #0008);transform:rotate(-3deg)}
    #madar-net-space .self-lid{padding:8px 7px 10px;background:linear-gradient(125deg,#555b5e,#24282b 24%,#191d20 70%,#62615b);border:1px solid #97816a;border-radius:8px;position:relative}
    #madar-net-space .self-lid:before{content:'';position:absolute;top:3px;left:50%;width:2px;height:2px;background:#b9a791;border-radius:50%}
    #madar-net-space .self-screen{position:relative;overflow:hidden;background:#090c10;width:100%;aspect-ratio:1.35;border:1px solid #090b0d}
    #madar-net-space .mirror-canvas{position:absolute;inset:0;width:100%;height:100%}
    #madar-net-space .mirror-surface{position:absolute;top:0;left:0;transform-origin:0 0;overflow:hidden}
    #madar-net-space .mirror-page{position:absolute;top:0;left:0}
    #madar-net-space .self-base{height:17px;margin:0 -15px;background:linear-gradient(#575b5c,#262b2f 70%,#101418);clip-path:polygon(6% 0,94% 0,100% 75%,96% 100%,4% 100%,0 75%);border-bottom:2px solid #877561}
    #madar-net-space .self-base:after{content:'';display:block;width:36px;height:4px;margin:auto;background:#20262b;border-radius:0 0 4px 4px}
    #madar-net-space .mirror-pointer{position:absolute;left:0;top:0;color:#ffd3a0;opacity:0;z-index:5;filter:drop-shadow(0 0 2px #000);font-size:18px;line-height:1;transform:translate(-1px,-1px)}
    #madar-net-space .mirror-pointer.touch{width:8px;height:8px;border:1px solid #ffd3a0;border-radius:50%;font-size:0;background:#ffba6033}
    #madar-net-space .net-pause{top:30px;left:22px;z-index:5}
    #madar-net-space .device-hit{display:none}
    @media(max-width:550px){#madar-net-space .net-stage{height:690px}#madar-net-space .demo-page{padding:22px 20px 235px}#madar-net-space .demo-nav{gap:15px;padding-left:44px}#madar-net-space .demo-logo{font-size:23px}#madar-net-space .demo-nav button{font-size:12px}#madar-net-space .demo-hero{margin-top:85px;padding:23px;max-width:100%}#madar-net-space .demo-hero h2{font-size:30px}#madar-net-space .demo-hero p{font-size:14px}#madar-net-space .self-device{width:146px;left:8%;bottom:43px}#madar-net-space .demo-lessons{margin-top:235px}#madar-net-space .net-pause{width:36px;height:36px;top:28px;left:14px}}
  </style>
  <style>
    #madar-net-space .self-device{z-index:1;width:clamp(150px,19%,184px);left:5%;bottom:8%;transform:rotate(-2deg)}
    #madar-net-space .self-screen{aspect-ratio:16/10}
    #madar-net-space .mirror-pointer svg{width:11px;height:11px;fill:#f7d0a0;stroke:#1b140f;stroke-width:1.4}
    #madar-net-space .mirror-pointer.touch svg{display:none}
    @media(max-width:550px){#madar-net-space .net-stage{height:760px}#madar-net-space .self-device{width:92px;bottom:34px;left:22px}#madar-net-space .self-screen{aspect-ratio:9/19.5}#madar-net-space .self-lid{border-radius:11px;padding:9px 4px 10px}#madar-net-space .self-base{display:none}#madar-net-space .demo-hero{margin-top:65px;padding:20px}#madar-net-space .demo-hero h2{font-size:28px}#madar-net-space .demo-lessons{margin-top:290px}}
  </style>
  <style>
    #madar-net-space .self-device{position:absolute;z-index:1;bottom:auto;transform:none;filter:none;pointer-events:none;opacity:.8}
    #madar-net-space .self-screen{position:absolute;border:0;border-radius:0;aspect-ratio:auto}
    #madar-net-space .mirror-pointer svg{width:3px;height:3px;stroke-width:1}
    #madar-net-space .mirror-pointer.touch{width:3px;height:3px;border-width:.5px}
  </style>
  <div class="net-stage">
    <canvas role="img" aria-label="خلفية فضاء إنترنت فحمية بوصلات نحاسية؛ أجهزة صغيرة ورسائل وصور وصوت وملفات موزعة في عمق الشبكة وتتحرك بين وصلاتها، بدون مشهد مركزي أو عناوين"></canvas>
    <button class="net-pause cursor-interaction" type="button" aria-label="إيقاف حركة الخلفية" aria-pressed="false">Ⅱ</button>
    <button class="device-hit cursor-interaction" type="button" data-device="0" aria-label="حاسب متصل"></button>
    <button class="device-hit cursor-interaction" type="button" data-device="1" aria-label="خادم موقع"></button>
    <button class="device-hit cursor-interaction" type="button" data-device="2" aria-label="هاتف متصل"></button>
    <div class="net-tip" hidden></div>
    <div class="demo-scroll" aria-label="صفحة تجريبية قابلة للتمرير">
      <div class="demo-page">
        <nav class="demo-nav" aria-label="أقسام المعاينة"><span class="demo-logo">مدار</span><button type="button" class="cursor-interaction" data-view="home" aria-pressed="true">الرئيسية</button><button type="button" class="cursor-interaction" data-view="lessons" aria-pressed="false">الدروس</button></nav>
        <section class="demo-hero"><span class="demo-eyebrow">التوجيه والتحويل</span><h2>من فهم الشبكة…<br>إلى ضبطها بيدك.</h2><p>تعرف وش خطوتك الجاية، وتفهم ليه تسويها، وتشوف دليل تقدّمك.</p><button class="demo-start cursor-interaction" type="button">يلا نبدأ نذاكر</button></section>
        <section class="demo-lessons"><h3>خطوتك الجاية</h3><div class="lesson-line"><small>01</small><span>الشبكات المحلية الافتراضية</span></div><div class="lesson-line"><small>02</small><span>الوصلات بين المحوّلات</span></div><div class="lesson-line"><small>03</small><span>التوجيه بين الشبكات</span></div></section>
      </div>
    </div>
    <div class="self-device" aria-hidden="true"><div class="self-screen"><canvas class="mirror-canvas"></canvas><div class="mirror-surface"></div><span class="mirror-pointer"><i data-lucide="mouse-pointer-2"></i></span></div></div>
  </div>
  