/* The lesson chrome is Madar; the work surface follows the 2012 R2 desktop. */
#madar-hub .op-layout{display:block}
#madar-hub .vm-brief{margin:0 0 16px;padding:16px 22px;border:1px solid #ffffff18;background:#191d28;border-radius:16px}
#madar-hub .vm-brief>summary{cursor:pointer;font-weight:700;color:#d4e7ff}
#madar-hub .vm-brief[open]{display:block}
#madar-hub .vm-brief .op-help{margin-top:16px}
#madar-hub .vm-workbench{position:relative;isolation:isolate;direction:ltr;text-align:left;color:#17212b;border:1px solid #54728688;border-radius:18px;overflow:hidden;background:#161c24;box-shadow:0 28px 80px #0005;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;line-height:1.45;min-height:740px}
#madar-hub .vm-workbench *{box-sizing:border-box}
#madar-hub .vm-workbench button{display:inline-block;min-height:28px;padding:4px 15px;border:1px solid #a6acb2;border-radius:1px;background:#f4f4f4;color:#17212b;font-family:inherit;font-size:12px;font-weight:400;line-height:1.4;box-shadow:none;cursor:pointer;letter-spacing:normal}
#madar-hub .vm-workbench button:hover{background:#e3f3fb;border-color:#298bb9;transform:none}
#madar-hub .vm-workbench button:focus-visible,#madar-hub .vm-workbench input:focus-visible,#madar-hub .vm-workbench select:focus-visible{outline:2px solid #087cae;outline-offset:2px}
#madar-hub .vm-workbench button:disabled{color:#8b9297;background:#eee;cursor:default}
#madar-hub .vm-workbench p{color:inherit;margin:10px 0;line-height:1.6;font-size:13px}
#madar-hub .vm-workbench h2{font-size:23px;font-weight:300;color:inherit;margin:12px 0 20px;line-height:1.3}
#madar-hub .vm-workbench h3{font-size:15px;font-weight:500;color:inherit;margin:14px 0 10px}
#madar-hub .vm-workbench input:not([type=checkbox]):not([type=radio]),#madar-hub .vm-workbench select{background:#fff;border:1px solid #8b9196;border-radius:0;padding:5px 7px;color:#18212a;min-height:28px;font-family:inherit;font-size:13px;width:100%;box-shadow:none}
#madar-hub .vm-workbench input[type=checkbox],#madar-hub .vm-workbench input[type=radio]{width:14px;height:14px;accent-color:#087da8;vertical-align:middle;margin:0 6px 0 0}
#madar-hub .vm-workbench label{color:inherit;font-size:13px;font-weight:400}
#madar-hub .vm-lab-toolbar{height:74px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 22px;background:linear-gradient(110deg,#122333,#1c3041);color:#eef7ff;border-bottom:1px solid #5bc9e82b;direction:rtl}
#madar-hub .vm-lab-toolbar b{font-size:23px;letter-spacing:1px}
#madar-hub .vm-lab-toolbar small{display:block;font-size:9px;letter-spacing:2px;color:#8bafc6}
#madar-hub .vm-lab-toolbar button{border:1px solid #95c1df35;background:#ffffff08;color:#e2f2ff;border-radius:8px;margin:0 3px;font-size:12px}
#madar-hub .vm-lab-state{color:#84d4bc;font-size:11px}
#madar-hub .vm-statusline{height:30px;padding:7px 15px;display:flex;justify-content:space-between;gap:10px;background:#111b24;color:#9fb1c0;direction:rtl;font-size:10px}
#madar-hub .vm-hyperv{height:638px;background:#fff}
#madar-hub .vm-host-title{height:32px;background:#72c7df;padding:7px 12px;text-align:center}
#madar-hub .vm-menubar{height:30px;background:#f3f3f3;border-bottom:1px solid #c8cdd0;padding:5px 12px}
#madar-hub .vm-host-grid{height:576px;display:grid;grid-template-columns:170px 1fr 170px}
#madar-hub .vm-host-grid>nav{padding:18px 12px;border-right:1px solid #d4d8da;background:#f9fafb;font-size:12px}
#madar-hub .vm-host-grid>main{padding:18px;min-width:0}
#madar-hub .vm-host-grid>aside{padding:12px;background:#edf4fa;border-left:1px solid #c9d8e3}
#madar-hub .vm-host-grid>aside button{display:block;border:0;background:transparent;color:#1b5d8b;margin:8px 0;padding:4px}
#madar-hub .vm-workbench table{width:100%;border-collapse:collapse;font-size:12px;text-align:left}
#madar-hub .vm-workbench th{background:#f2f4f5;color:#4d5a65;padding:8px;border-bottom:1px solid #c9cfd4;font-weight:400}
#madar-hub .vm-workbench td{padding:9px 8px;border-bottom:1px solid #e7ebee}
#madar-hub .vm-workbench tr[data-vm-select]{cursor:pointer}
#madar-hub .vm-workbench .selected{background:#d3eafb!important;color:#123853!important}
#madar-hub .vm-host-preview{display:flex;align-items:center;gap:25px;margin:40px 0 20px;border:1px solid #d8e0e6;padding:24px;background:#f7fafc}
#madar-hub .vm-host-preview>span{font-size:70px;color:#1883ac}
#madar-hub .vm-host-hint{color:#697a89!important;font-size:12px!important}
#madar-hub .vm-connectionbar{height:32px;padding:5px 14px;background:#c6e8f4;color:#244452;display:flex;align-items:center;justify-content:space-between;font-size:12px}
#madar-hub .vm-connectionbar button{border:0;background:transparent}
#madar-hub .vm-desktop{position:relative;height:606px;background:radial-gradient(ellipse at 70% 40%,#293740,#151c23 70%);overflow:hidden}
#madar-hub .vm-core-desktop{background:#090c10}
#madar-hub .vm-watermark{position:absolute;bottom:85px;right:45px;color:#f1f5f9;display:flex;align-items:center;gap:13px;opacity:.85;pointer-events:none}
#madar-hub .vm-watermark>b{font-size:62px;font-weight:300;color:#73cce7}
#madar-hub .vm-watermark>span{font-size:28px;font-weight:300}
#madar-hub .vm-watermark small{display:block;font-size:14px;letter-spacing:1px;color:#9cb6c5}
#madar-hub .vm-taskbar{position:absolute;bottom:0;height:43px;left:0;right:0;display:flex;align-items:center;background:#167795;gap:4px;padding:0 10px;z-index:4;overflow:hidden}
#madar-hub .vm-taskbar button{background:transparent;border:0;color:#fff;min-width:42px;padding:6px;font-size:18px;white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis}
#madar-hub .vm-taskbar button span{font-size:10px}
#madar-hub .vm-taskbar button.active{background:#ffffff20;border-bottom:2px solid #c6f3ff}
#madar-hub .vm-taskbar-tray{margin-left:auto}
#madar-hub .vm-taskbar-tray button{font-size:11px}
#madar-hub .vm-desktop-icons{position:absolute;top:20px;left:18px;display:grid;gap:20px}
#madar-hub .vm-desktop-icons button{width:90px;background:transparent;border:1px solid transparent;color:#d9f2ff;font-size:28px;padding:10px 3px}
#madar-hub .vm-desktop-icons small{display:block;font-size:11px;color:white}
#madar-hub .vm-start{position:absolute;inset:0 0 43px;background:#156582;padding:35px 45px;z-index:5;color:white}
#madar-hub .vm-start h2{font-size:42px}
#madar-hub .vm-start>div{display:grid;grid-template-columns:repeat(3,160px);gap:12px}
#madar-hub .vm-start button{height:100px;background:#288baf;color:white;border:1px solid #ffffff20;text-align:left;font-size:16px}
#madar-hub .vm-logon{position:absolute;top:60px;left:50%;transform:translateX(-50%);width:340px;background:#132936ed;padding:24px;color:white;border:1px solid #76bed344;border-radius:4px;box-shadow:0 20px 60px #0004}
#madar-hub .vm-avatar{font-size:58px;color:#6dd3ef}
#madar-hub .vm-logon small{display:block;color:#a0c0d0;font-size:11px;margin-top:12px}
#madar-hub .vm-logon button{margin-top:14px;width:100%;background:#1d8bb2;border-color:#3bb6df;color:white}
#madar-hub .vm-remote-note,#madar-hub .vm-off{position:absolute;inset:80px 15% auto;padding:30px;background:#142e3e;color:#e1f2fa;text-align:center}
#madar-hub .vm-off button{display:block;margin:20px auto}
#madar-hub .vm-window-layer{position:absolute;top:108px;bottom:73px;left:0;right:0;pointer-events:none;z-index:10}
#madar-hub .vm-window{position:absolute;left:var(--wx);top:var(--wy);width:min(480px,calc(100% - 30px));max-height:calc(100% - 15px);display:flex;flex-direction:column;background:#f3f3f3;border:1px solid #318ba5;box-shadow:0 15px 38px #0006;pointer-events:auto;overflow:hidden;color:#1e252c}
#madar-hub .vm-window.vm-wide{width:min(790px,calc(100% - 40px))}
#madar-hub .vm-window.vm-max{inset:0!important;width:100%;max-height:100%;height:100%}
#madar-hub .vm-titlebar{height:32px;flex-shrink:0;padding:0 0 0 10px;display:flex;align-items:center;justify-content:space-between;background:#69c5de;color:#082c3a;cursor:move;touch-action:none;user-select:none;gap:8px}
#madar-hub .vm-titlebar>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}
#madar-hub .vm-titlebar>div{display:flex;flex-shrink:0}
#madar-hub .vm-titlebar button{border:0;background:transparent;color:#163744;border-radius:0;min-height:26px;width:33px;padding:2px;font-size:17px}
#madar-hub .vm-titlebar button:last-child{background:#cc594c;color:white;width:42px}
#madar-hub .vm-titlebar button:last-child:hover{background:#e34130}
#madar-hub .vm-window-content{overflow:auto;min-height:0;background:#f6f6f6}
#madar-hub .vm-dialog{padding:20px 24px}
#madar-hub .vm-dialog-footer{padding:12px 16px;background:#eee;border-top:1px solid #d3d6d9;display:flex;justify-content:flex-end;gap:8px;position:sticky;bottom:0;z-index:2}
#madar-hub .vm-dialog-footer button{min-width:82px}
#madar-hub .vm-field{display:block;margin:12px 0}
#madar-hub .vm-field input,#madar-hub .vm-field select{display:block;margin-top:5px}
#madar-hub .vm-tick{display:block;margin:12px 0}
#madar-hub .vm-indent{padding-left:24px}
#madar-hub .vm-indent .vm-field{display:grid;grid-template-columns:145px 1fr;align-items:center;margin:9px 0}
#madar-hub .vm-tabs{padding:10px 15px 6px;background:#eee;border-bottom:1px solid #c5ccd0;color:#3e4952;white-space:nowrap;font-size:12px}
#madar-hub .vm-properties{display:grid;grid-template-columns:minmax(110px,1fr) 1.5fr;gap:16px 20px;font-size:12px;margin:20px 0}
#madar-hub .vm-properties dt{color:#63717b}
#madar-hub .vm-properties dd{margin:0;overflow-wrap:anywhere}
#madar-hub .vm-properties button{border:0;background:none;color:#0876ae;padding:0;min-height:0;text-align:left}
#madar-hub .vm-right{text-align:right;margin-top:14px}
#madar-hub .vm-bordered,#madar-hub .vm-component-list{border:1px solid #aaa;background:white;padding:10px}
#madar-hub .vm-component-list label,#madar-hub .vm-component-list button{display:block;width:100%;padding:5px;text-align:left;border:0;background:transparent;font-size:12px}
#madar-hub .vm-address{padding:8px 14px;background:#fff;border-bottom:1px solid #ccc;color:#4f6470}
#madar-hub .vm-adapter-item{padding:28px;min-height:150px}
#madar-hub .vm-adapter-item button{background:#e9f4fc;border:1px solid #98c3df;padding:12px 24px;text-align:left}
#madar-hub .vm-adapter-item small{display:block;color:#586d79;margin-top:6px}
#madar-hub .vm-manager-head{background:#fff;padding:18px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px}
#madar-hub .vm-manager-head strong{font-size:19px;font-weight:300;color:#0876a2}
#madar-hub .vm-manager-head button{background:transparent;border:0;padding:4px 8px;color:#45616e}
#madar-hub .vm-split{display:grid;grid-template-columns:185px 1fr;min-height:380px}
#madar-hub .vm-split>nav,#madar-hub .vm-split>aside{background:#e9edef;padding:14px 0;border-right:1px solid #c8d0d5;overflow:auto}
#madar-hub .vm-split>main{padding:20px 24px;min-width:0;background:#fff}
#madar-hub .vm-manager nav button{display:block;width:100%;text-align:left;border:0;background:transparent;padding:11px 14px;font-size:13px}
#madar-hub .vm-manager nav button.selected{background:#167b9f!important;color:white!important}
#madar-hub .vm-quick{background:#eaf3f7;padding:18px;border-left:5px solid #2993b7;display:grid;gap:8px}
#madar-hub .vm-quick span{font-size:10px;letter-spacing:2px;color:#577786}
#madar-hub .vm-quick button{border:0;color:#157ca6;background:transparent;text-align:left;font-size:16px;padding:8px 0}
#madar-hub .vm-tiles{display:flex;gap:12px;margin-top:24px}
#madar-hub .vm-tiles>div{flex:1;background:#f2f6f7;border-top:4px solid #3689a4;padding:14px;color:#1b718f;font-size:17px}
#madar-hub .vm-tiles strong{display:block;color:#458555;font-size:11px;margin-top:20px}
#madar-hub .vm-menu{position:absolute;z-index:150;background:#fff;padding:8px;box-shadow:0 8px 24px #0004;border:1px solid #a6b8c2;min-width:180px}
#madar-hub .vm-top-menu{right:12px;top:85px}
#madar-hub .vm-menu button{display:block;text-align:left;width:100%;background:white;border:0;padding:8px 12px}
#madar-hub .vm-clock{font-size:85px;float:left;margin:5px 30px 5px 0;color:#248ba8}
#madar-hub .vm-native-terminal{background:#090909;color:#ececec;font-family:Consolas,'Courier New',monospace;min-height:330px;padding:10px}
#madar-hub .vm-native-terminal.vm-sconfig{background:#012456}
#madar-hub .vm-console-window{width:min(780px,calc(100% - 35px))}
#madar-hub .vm-native-terminal pre{font:13px/1.5 Consolas,'Courier New',monospace;color:#f1f1f1;white-space:pre-wrap;overflow-wrap:anywhere;direction:ltr;text-align:left;background:transparent;border:0;padding:0;max-height:300px;overflow:auto;margin:0 0 8px}
#madar-hub .vm-native-terminal form{display:flex;align-items:center;gap:5px}
#madar-hub .vm-native-terminal label{white-space:nowrap;font:12px Consolas,monospace;color:#fff}
#madar-hub .vm-native-terminal input:not([type=radio]){background:transparent;color:white;border:0;outline:none;font-family:Consolas,monospace;padding:4px;min-width:50px}
#madar-hub .vm-native-terminal button{background:transparent;color:#fff;border:1px solid #ffffff40;padding:3px 8px}
#madar-hub .vm-wizard-heading{padding:18px 26px;background:white;display:flex;justify-content:space-between;border-bottom:1px solid #ccc}
#madar-hub .vm-wizard-heading h2{margin:0;font-size:24px}
#madar-hub .vm-wizard-heading small{text-align:right;font-size:9px;color:#677b87}
#madar-hub .vm-wizard{display:grid;grid-template-columns:175px 1fr;min-height:310px}
#madar-hub .vm-wizard>nav{padding:15px 0;background:#edf1f3;border-right:1px solid #d7dfe3}
#madar-hub .vm-wizard>nav span{display:block;padding:7px 14px;font-size:12px}
#madar-hub .vm-wizard>main{padding:18px 25px;background:white;min-width:0}
#madar-hub .vm-wizard>main .vm-field{margin:8px 0}
#madar-hub .vm-success{padding:12px;color:#2e7245;background:#eaf7ed;border-left:4px solid #42945e}
#madar-hub .vm-warning{padding:12px;color:#785d1e;background:#fff7df;border-left:4px solid #d7ac3f}
#madar-hub .vm-message{display:flex;align-items:center;gap:20px;padding:26px}
#madar-hub .vm-message>span{color:#158aad;font-size:35px}
#madar-hub .vm-training-note{font-size:11px!important;color:#617380!important}
#madar-hub .vm-mmc{grid-template-columns:310px 1fr;min-height:350px}
#madar-hub .vm-mmc nav{background:#fff;padding:12px 5px}
#madar-hub .vm-mmc nav button{display:block;white-space:nowrap;padding:4px;border:0;background:transparent;text-align:left;font-size:12px}
#madar-hub .vm-tree-indent{padding-left:15px}
#madar-hub .vm-setup-page{padding:24px 30px;background:#fff;min-height:330px}
#madar-hub .vm-setup-logo{font-size:32px;font-weight:300;color:#186c96;margin:18px 0 35px}
#madar-hub .vm-license{padding:16px;background:#f4f6f7;border:1px solid #bac5cc;font-size:12px}
#madar-hub .vm-progress{height:10px;background:#dbe5e9;margin:30px 0}
#madar-hub .vm-progress i{display:block;width:100%;height:100%;background:#30a8ba}
#madar-hub .vm-file-list{padding:30px;min-height:130px}
#madar-hub .vm-control-grid{display:grid;gap:15px;grid-template-columns:1fr 1fr;padding:30px}
#madar-hub .vm-workbench:fullscreen{border-radius:0;width:100vw;height:100vh}
#madar-hub .vm-workbench:fullscreen .vm-desktop{height:calc(100vh - 136px)}
#madar-hub .vm-workbench:fullscreen .vm-hyperv{height:calc(100vh - 104px)}
@media(max-width:850px){#madar-hub .vm-host-grid{grid-template-columns:110px 1fr 120px}#madar-hub .vm-host-grid>main{padding:12px}#madar-hub .vm-window{left:min(var(--wx),10px);top:min(var(--wy),20px);width:calc(100% - 20px)!important}#madar-hub .vm-lab-state{display:none}#madar-hub .vm-lab-toolbar{padding:12px}#madar-hub .vm-split{grid-template-columns:140px 1fr}#madar-hub .vm-mmc{grid-template-columns:260px 1fr}}
@media(max-width:560px){#madar-hub .vm-workbench{min-height:730px;border-radius:10px}#madar-hub .vm-host-grid{grid-template-columns:1fr 95px}#madar-hub .vm-host-grid>nav{display:none}#madar-hub .vm-host-grid td,#madar-hub .vm-host-grid th{padding:7px 3px;font-size:10px}#madar-hub .vm-host-grid th:last-child,#madar-hub .vm-host-grid td:last-child{display:none}#madar-hub .vm-host-preview{padding:12px;gap:10px}#madar-hub .vm-host-preview>span{font-size:35px}#madar-hub .vm-host-preview h3{font-size:13px}#madar-hub .vm-host-grid>aside{padding:8px}#madar-hub .vm-lab-toolbar b{font-size:18px}#madar-hub .vm-lab-toolbar small{font-size:7px}#madar-hub .vm-lab-toolbar button{padding:4px 7px;font-size:10px}#madar-hub .vm-connectionbar{font-size:9px}#madar-hub .vm-statusline span:first-child{font-size:8px}#madar-hub .vm-logon{width:280px}#madar-hub .vm-manager-head{display:block;padding:12px}#madar-hub .vm-manager-head>div{margin-top:10px}#madar-hub .vm-manager-head strong{font-size:17px}#madar-hub .vm-manager{grid-template-columns:108px 1fr}#madar-hub .vm-split>main{padding:12px}#madar-hub .vm-manager nav button{font-size:11px;padding:9px}#madar-hub .vm-properties{grid-template-columns:1fr;gap:5px;margin:10px 0}#madar-hub .vm-properties dd{margin-bottom:10px}#madar-hub .vm-quick{padding:10px}#madar-hub .vm-quick button{font-size:13px}#madar-hub .vm-tiles{display:none}#madar-hub .vm-workbench h2{font-size:20px}#madar-hub .vm-dialog{padding:15px}#madar-hub .vm-indent{padding-left:8px}#madar-hub .vm-indent .vm-field{grid-template-columns:120px 1fr}#madar-hub .vm-wizard{display:block}#madar-hub .vm-wizard>nav{display:flex;overflow:auto;border-bottom:1px solid #ccc;padding:6px}#madar-hub .vm-wizard>nav span{white-space:nowrap;padding:5px 10px;font-size:10px}#madar-hub .vm-wizard-heading{padding:14px}#madar-hub .vm-wizard-heading small{display:none}#madar-hub .vm-wizard>main{padding:14px}#madar-hub .vm-mmc{grid-template-columns:1fr}#madar-hub .vm-mmc>main{min-height:90px}#madar-hub .vm-mmc>nav{min-height:210px}#madar-hub .vm-start{padding:25px 18px}#madar-hub .vm-start>div{grid-template-columns:repeat(2,120px)}#madar-hub .vm-watermark{right:20px}#madar-hub .vm-watermark>span{font-size:20px}#madar-hub .vm-taskbar button span{display:none}#madar-hub .vm-setup-page{padding:20px}#madar-hub .vm-setup-logo{font-size:25px}}

#madar-hub .vm-task-title{font-size:23px;margin:8px 0 18px}
#madar-hub .vm-window{max-height:calc(100% - var(--wy))}
#madar-hub .vm-window.vm-max{max-height:100%}
#madar-hub .vm-core-desktop .vm-taskbar{background:#151a20}
@media(max-width:850px){#madar-hub .vm-window{max-height:calc(100% - 20px)}}
@media(max-width:350px){#madar-hub .vm-dialog-footer{flex-wrap:wrap}#madar-hub .vm-dialog-footer button{min-width:60px;padding:4px 8px}#madar-hub .vm-indent .vm-field{display:block}#madar-hub .vm-logon{width:calc(100% - 24px)}#madar-hub .vm-workbench .vm-lab-toolbar small{display:none}}

#madar-hub .vm-workbench.vm-expanded{position:fixed;inset:0;z-index:10000;width:100vw;height:100dvh;min-height:0;border-radius:0}
#madar-hub .vm-expanded .vm-desktop{height:calc(100dvh - 136px)}
#madar-hub .vm-expanded .vm-hyperv{height:calc(100dvh - 104px)}
#madar-hub .vm-expanded .vm-host-grid{height:calc(100dvh - 166px)}
html:has(.vm-expanded),body:has(.vm-expanded){overflow:hidden}
#madar-hub .vm-workbench.vm-expanded{width:100%}

