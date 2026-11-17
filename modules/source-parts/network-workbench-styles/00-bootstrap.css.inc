/* Workbench hierarchy: task, tools, physical network, then evidence. */
@font-face{font-family:MadarArabic;src:url('/assets/arabic.ttf') format('truetype');font-display:swap}
#madar-labs{padding:24px;background:linear-gradient(145deg,#141a1d,#0e1417 45%);border:1px solid #60707840;border-radius:20px;box-shadow:0 25px 65px #0003;font-family:MadarArabic,"Segoe UI",Tahoma,Arial,sans-serif}
#madar-labs .ml-top{padding-block:2px 18px;border-bottom:1px solid #ffffff12}
#madar-labs h2{font-size:28px;font-weight:650;line-height:1.5}
#madar-labs button{min-height:44px;border-radius:10px;box-shadow:inset 0 1px #ffffff06;transition:background .18s,border-color .18s,box-shadow .18s}
#madar-labs button:hover:not(:disabled){box-shadow:inset 0 1px #ffffff13,0 4px 12px #0002}
#madar-labs .ml-course{margin:14px 0;font-size:13px}
#madar-labs .ml-practice-entry{margin-top:18px;padding:18px 20px;background:linear-gradient(110deg,#162321,#1b272a);border-color:#67877d58}
#madar-labs .ml-tabs{background:#0b1115;padding:10px;border-radius:13px 13px 0 0;border:1px solid #3d4a50;margin-bottom:0}
#madar-labs #ml-save{padding:9px 12px;background:#10191b;border-inline:1px solid #3d4a50;border-bottom:1px solid #3d4a50;border-radius:0 0 10px 10px;font-size:12px;min-height:38px}
#madar-labs #ml-context{padding-block:16px;margin-block:0}
#madar-labs #ml-name{font-size:18px}
#madar-labs .ml-task{border:1px solid color-mix(in srgb,var(--ml-tone) 30%,transparent);border-inline-start:3px solid var(--ml-tone);background:linear-gradient(110deg,#1b2427,#242922);padding:20px;border-radius:13px;box-shadow:0 9px 25px #0002}
#madar-labs[data-kind=scratch] .ml-task{background:linear-gradient(110deg,#152327,#1b2b2c)}
#madar-labs #ml-task-title{font-size:18px;line-height:1.8}
#madar-labs #ml-task-detail{font-size:13px;line-height:1.9;color:#c1ccce}
#madar-labs #ml-verify{background:var(--ml-tone);color:#13201e;border-color:transparent;font-weight:650}
#madar-labs .ml-learning-tools{padding:12px 0;margin:8px 0 0;border-bottom:1px solid #ffffff12}
#madar-labs .ml-learning-tools button{font-size:13px;background:#172125}
#madar-labs .ml-copybar{padding:12px 0;gap:8px;margin:0}
#madar-labs .ml-copybar button{font-size:13px;background:#151e22}
#madar-labs #ml-clipboard{font-size:12px;color:#b2c3c7}
#madar-labs #ml-dialog{border:1px solid #648c87;border-radius:18px;background:#151e22;box-shadow:0 30px 100px #000a}
#madar-labs #ml-dialog::backdrop{background:#05090bc7;backdrop-filter:blur(5px)}
#madar-labs #ml-dialog{position:fixed;inset:auto;margin:0;overflow:auto;overscroll-behavior:contain;max-width:calc(100% - 24px)}
#madar-labs #ml-dialog[open]{animation:ml-dialog-enter .22s cubic-bezier(.16,1,.3,1) both}
#madar-labs #ml-dialog[data-menu=true]{padding:20px;border-color:#7ba69d88;background:linear-gradient(145deg,#233136,#131e22);box-shadow:0 22px 65px #0008,inset 0 1px #d7fff21c}
#madar-labs #ml-dialog[data-menu=true] .ml-dialog-head{padding-bottom:14px;border-bottom:1px solid #ffffff14;margin-bottom:16px}
#madar-labs #ml-dialog[data-menu=true] .ml-menu-option{min-height:60px;background:#16282ba6;border-color:#73b4a838;justify-content:flex-start;padding:14px 16px;gap:13px;text-align:right}
#madar-labs #ml-dialog[data-menu=true] .ml-menu-option:hover{background:#24433f;border-color:#8fddca}
#madar-labs #ml-dialog[data-menu=true] .ml-menu-option svg{color:#99e5d5;width:22px;height:22px}
@keyframes ml-dialog-enter{from{opacity:0;translate:0 8px}to{opacity:1;translate:0 0}}
@media(prefers-reduced-motion:reduce){#madar-labs #ml-dialog[open]{animation:none}}
#madar-labs #madar-free{border:1px solid #46575d;border-radius:14px;background:#10191d}
#madar-labs #madar-free .nf-tools{background:#182227;padding:12px 16px;border-bottom:1px solid #46575d}
#madar-labs #madar-free #nf-stage{height:550px;border-bottom:1px solid #53646c}
#madar-labs #madar-free .nf-instruction{width:fit-content;max-width:calc(100% - 24px);margin-inline:auto;padding:6px 13px;background:#0c141be6;border:1px solid #8ca3b42e;border-radius:30px;color:#d3dde1;line-height:1.8}
#madar-labs #madar-free .nf-cli{border-color:#536369;background:linear-gradient(130deg,#18242a,#101b20);border-radius:12px}
#madar-labs #madar-free #nf-cli-log{background:#080f14;border:1px solid #35464d;border-radius:8px;padding:16px;line-height:1.8;font-family:Consolas,"Courier New",monospace;color:#d7e9ec}
#madar-labs #madar-free #nf-command{background:#080f14;border-color:#547178;font-size:15px;min-height:44px}
#madar-labs #madar-free .nf-closeup{border-color:#617178;box-shadow:0 8px 24px #0004}
#madar-labs #madar-free .nf-notice{background:#25261e;border-color:#ac91574d;color:#ead6b3}
#madar-labs #madar-free summary{min-height:44px;display:flex;align-items:center;gap:8px}
#madar-labs #madar-free summary:before{content:"›";font-size:20px;transform:rotate(180deg);color:#b7cacc}
#madar-labs #madar-free details[open]>summary:before{transform:rotate(90deg)}
#madar-labs textarea:focus-visible,#madar-labs summary:focus-visible{outline:2px solid var(--ml-tone);outline-offset:3px}
@media(max-width:700px){#madar-labs{padding:14px;border-radius:14px}#madar-labs h2{font-size:23px}#madar-labs .ml-task{padding:16px}#madar-labs #madar-free #nf-stage{height:430px}#madar-labs .ml-top{gap:12px}#madar-labs .ml-practice-entry{padding:16px}#madar-labs .ml-learning-tools{gap:7px}#madar-labs .ml-learning-tools button{flex:1 1 130px}#madar-labs .ml-copybar button{flex:1 1 110px}#madar-labs #ml-task-title{font-size:17px}#madar-labs #madar-free .nf-tools{padding:10px}#madar-labs .ml-tabs{padding:7px}#madar-labs .ml-course label{flex-wrap:wrap}}
@media(max-width:380px){#madar-labs{padding:10px}#madar-labs h2{font-size:21px}#madar-labs .ml-top{padding-inline-end:0;flex-wrap:wrap}#madar-labs #madar-free #nf-stage{height:400px}}
@media(prefers-reduced-motion:reduce){#madar-labs button{transition:none}}
#madar-labs #ml-lesson-guide{border:1px solid #b8956255;border-radius:14px;background:linear-gradient(120deg,#202822,#172125);padding:22px;margin:8px 0 18px;display:grid;grid-template-columns:1fr 1.1fr;gap:16px 28px}
#madar-labs #ml-lesson-guide h3{font-size:22px;font-weight:650;margin:5px 0}
#madar-labs #ml-lesson-guide p{font-size:14px;line-height:1.9;margin:8px 0}
#madar-labs #ml-lesson-guide small{color:#b7c5c4}
#madar-labs .ml-lesson-instructions{align-self:start;border:1px solid #8db4ae38;border-radius:10px;padding:12px;background:#0f1b20}
#madar-labs .ml-lesson-instructions summary{cursor:pointer;min-height:44px;display:flex;align-items:center;color:#e6c697}
#madar-labs .ml-lesson-instructions summary:before{content:'＋';margin-inline-end:8px}
#madar-labs .ml-lesson-instructions[open] summary:before{content:'−'}
#madar-labs .ml-lesson-instructions ol{margin:8px 0;padding-inline-start:24px;font-size:14px;line-height:2}
#madar-labs .ml-lesson-instructions li+li{margin-top:12px}
#madar-labs .ml-lesson-prerequisite{grid-column:1/-1;border-top:1px solid #ffffff14;padding-top:12px;color:#cfdbd7}
#madar-labs #ml-lesson-away{grid-column:1/-1;padding:12px;border:1px solid #71d7c97d;background:#12302d;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
#madar-labs[data-lesson] .ml-task #ml-task-detail{font-size:15px;line-height:1.95;max-width:920px}
#madar-labs[data-lesson] #ml-requirements{margin-top:10px}
@media(max-width:700px){#madar-labs #ml-lesson-guide{grid-template-columns:1fr;padding:16px;gap:12px}#madar-labs #ml-lesson-guide h3{font-size:20px}}
