/* MADAR Night — a complete, quiet dark work surface, including native controls.
   Geometry and actions follow the lesson; color and decorative art belong to Madar. */
#madar-hub .vm-workbench{
 --vm-bg:#10151d;--vm-panel:#1b222d;--vm-raised:#242e3b;--vm-recess:#151c25;
 --vm-ink:#d3dce6;--vm-muted:#a3b2c2;--vm-line:#3c4b5d;--vm-control:#748599;
 --vm-accent:#8bbccf;--vm-selected:#263f50;
 color-scheme:dark;background:var(--vm-bg);color:var(--vm-ink);
 border-color:#354352;border-radius:18px;box-shadow:0 30px 75px #0006,0 1px 0 #73859c18 inset;
}
#madar-hub .vm-workbench ::selection{background:#3c6279;color:#edf3f8}
#madar-hub .vm-workbench button{background:#293442;color:var(--vm-ink);border-color:var(--vm-control);border-radius:5px;transition:background-color .12s,border-color .12s,color .12s}
#madar-hub .vm-workbench button:hover{background:#334456;border-color:#96b6cb;color:#eef5fa}
#madar-hub .vm-workbench button:active{background:#1b2b3c}
#madar-hub .vm-workbench button:focus-visible,#madar-hub .vm-workbench input:focus-visible,#madar-hub .vm-workbench select:focus-visible{outline:2px solid #9bc9df;outline-offset:3px}
#madar-hub .vm-workbench button:disabled{color:#8894a3;background:#202832;border-color:#445060;opacity:.75}
#madar-hub .vm-workbench input:not([type=checkbox]):not([type=radio]),#madar-hub .vm-workbench select{
 background:var(--vm-recess);border:1px solid var(--vm-control);border-radius:5px;color:var(--vm-ink);min-height:32px;box-shadow:0 1px 2px #0002 inset;color-scheme:dark;
}
#madar-hub .vm-workbench input::placeholder{color:#9aaabb;opacity:1}
#madar-hub .vm-workbench input:disabled{background:#202733;color:#8695a5;border-color:#465265}
#madar-hub .vm-workbench input[type=checkbox],#madar-hub .vm-workbench input[type=radio]{accent-color:#8bbccf;color-scheme:dark}
#madar-hub .vm-workbench option{background:#19222e;color:var(--vm-ink)}
#madar-hub .vm-workbench fieldset{border:1px solid var(--vm-line);border-radius:5px}
#madar-hub .vm-workbench hr{border:0;border-top:1px solid var(--vm-line);margin:15px 0}
#madar-hub .vm-glyph{width:18px;height:18px;display:inline-block;vertical-align:middle;flex-shrink:0}
#madar-hub .vm-lab-toolbar{background:linear-gradient(115deg,#121923,#1c2837);border-bottom-color:#435266;padding-inline:23px;position:relative}
#madar-hub .vm-lab-toolbar>span:first-child{position:relative;padding-inline-start:45px}
#madar-hub .vm-lab-toolbar>span:first-child:before{content:'';position:absolute;right:0;top:4px;width:29px;height:29px;border:1px solid #8ab2c6;border-radius:50%;box-shadow:0 0 0 5px #739db20c;transform:rotate(-35deg) scaleX(.7)}
#madar-hub .vm-lab-toolbar>span:first-child:after{content:'';position:absolute;right:2px;top:6px;width:6px;height:6px;background:#91bcc8;border-radius:50%;box-shadow:-13px 14px 0 -1px #7991b9}
#madar-hub .vm-lab-toolbar b{font-weight:600;letter-spacing:.4px;color:#d9e4ec}
#madar-hub .vm-lab-toolbar small{color:#9bacbe;font-size:9px;letter-spacing:1.7px;margin-top:2px}
#madar-hub .vm-lab-toolbar button{background:#ffffff04;border-color:#53657a;color:#b9cbdb;border-radius:7px;min-height:32px}
#madar-hub .vm-lab-toolbar button:hover{background:#2d3d50;border-color:#7e9caf}
#madar-hub .vm-lab-state{color:#9dc4b4}
#madar-hub .vm-statusline{background:#111822;color:#a1b2c3;border-top:1px solid #344253}
#madar-hub .vm-connectionbar{background:#202c3a;color:#b5c7d7;border-bottom:1px solid #40546a}
#madar-hub .vm-connectionbar button{background:transparent;color:#c1d1df;border-color:transparent}
#madar-hub .vm-desktop{
 background:radial-gradient(ellipse at 85% 80%,#29425155,transparent 55%),radial-gradient(ellipse at 20% 15%,#38475c33,transparent 55%),linear-gradient(125deg,#10161f,#18222c);
 isolation:isolate;
}
#madar-hub .vm-desktop:before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(#8197aa05 1px,transparent 1px),linear-gradient(90deg,#8197aa05 1px,transparent 1px);background-size:42px 42px;mask-image:linear-gradient(120deg,transparent 25%,#000);z-index:-1}
#madar-hub .vm-desktop:after{content:'';position:absolute;width:570px;height:340px;right:-170px;bottom:70px;border:1px solid #7392a21b;border-radius:50%;transform:rotate(-32deg);box-shadow:0 0 0 40px #7392a205,0 0 0 80px #7392a204;pointer-events:none;z-index:-1}
#madar-hub .vm-core-desktop{background:linear-gradient(120deg,#0b1018,#152131)}
#madar-hub .vm-watermark{opacity:.65;right:35px;bottom:85px;gap:17px;color:#b4c6d6}
#madar-hub .vm-watermark>b .vm-glyph{width:48px;height:48px;color:#87a9bb;stroke-width:1}
#madar-hub .vm-watermark>span{font-size:24px;letter-spacing:-.3px}
#madar-hub .vm-watermark small{font-size:11px;color:#a1b4c7;letter-spacing:2px;margin-top:5px}
#madar-hub .vm-desktop-icons{gap:12px}
#madar-hub .vm-desktop-icons button{background:transparent;border-color:transparent;border-radius:8px;color:#a7c5da;padding:12px 3px}
#madar-hub .vm-desktop-icons button:hover{background:#283c4f99;border-color:#6f879b}
#madar-hub .vm-desktop-icons .vm-glyph{width:35px;height:35px;filter:drop-shadow(0 3px 6px #0003);stroke-width:1.3;margin-bottom:7px}
#madar-hub .vm-desktop-icons small{color:#c1d1de;text-shadow:0 2px 4px #0007}
#madar-hub .vm-taskbar{background:#152332f2;border-top:1px solid #45566c;gap:5px;backdrop-filter:blur(16px)}
#madar-hub .vm-taskbar button{background:transparent;border-color:transparent;color:#bacbda;border-radius:4px 4px 0 0;display:flex;align-items:center;gap:7px;height:35px}
#madar-hub .vm-taskbar button.active{background:#2a3d50;border-bottom:2px solid #8bbccf}
#madar-hub .vm-taskbar button:hover{background:#34475a}
#madar-hub .vm-taskbar button span{font-size:11px;overflow:hidden;text-overflow:ellipsis}
#madar-hub .vm-taskbar-tray button{white-space:nowrap}
#madar-hub .vm-window{color:var(--vm-ink);background:var(--vm-panel);border-color:#48576b;border-radius:7px;box-shadow:0 22px 52px #0008,0 1px 0 #a2b8d008 inset}
#madar-hub .vm-window.vm-front{border-color:#829aaf;box-shadow:0 28px 65px #0009,0 0 0 1px #9ab4c512}
#madar-hub .vm-window.vm-max{border-radius:0}
#madar-hub .vm-titlebar{height:36px;background:#242f3e;color:#adbdce;border-bottom:1px solid #435166;padding-left:12px}
#madar-hub .vm-front>.vm-titlebar{background:linear-gradient(100deg,#30465b,#273749);color:#e0e8ee;border-bottom-color:#637e94}
#madar-hub .vm-titlebar>span{display:flex;align-items:center;gap:8px;font-weight:500}
#madar-hub .vm-titlebar .vm-glyph{width:15px;height:15px;color:#a2c5d9}
#madar-hub .vm-titlebar button{background:transparent;color:#b5c8d9;border-radius:0;height:35px;min-height:35px}
#madar-hub .vm-titlebar button:hover{background:#4a6075;color:#e5eef5}
#madar-hub .vm-titlebar button:last-child{background:transparent;color:#d1b8bc}
#madar-hub .vm-titlebar button:last-child:hover{background:#793e47;color:#f8e4e6}
#madar-hub .vm-window-content{background:var(--vm-panel);scrollbar-color:#62788d #171f29}
#madar-hub .vm-dialog-footer{background:#171f2a;border-top-color:#46546a;padding-block:13px}
#madar-hub .vm-dialog-footer button[type=submit],#madar-hub .vm-dialog-footer button[data-vm$="next"]{background:#31566c;border-color:#8db6cc;color:#e3eef5}
#madar-hub .vm-dialog-footer button[type=submit]:hover,#madar-hub .vm-dialog-footer button[data-vm$="next"]:hover{background:#3b6882}
#madar-hub .vm-tabs,#madar-hub .vm-address{background:#222d3b;color:#bacbd9;border-bottom-color:#46576c}
#madar-hub .vm-properties dt{color:var(--vm-muted)}
#madar-hub .vm-properties button{background:transparent;color:#9acbe0;border-color:transparent}
#madar-hub .vm-properties button:hover{background:#2a3a4b;color:#c5e4f1}
#madar-hub .vm-bordered,#madar-hub .vm-component-list{background:#141d28;border-color:#61758b;border-radius:5px}
#madar-hub .vm-component-list label,#madar-hub .vm-component-list button{color:var(--vm-ink);background:transparent}
#madar-hub .vm-workbench .selected{background:var(--vm-selected)!important;color:#d4e8f2!important;box-shadow:inset 3px 0 #8bbccf}
#madar-hub .vm-adapter-item button{background:#243746;border-color:#7892a8;color:#c7e0ee;border-radius:7px}
#madar-hub .vm-adapter-item small{color:#b1c1ce}
#madar-hub .vm-manager-head{background:#202b38;border-bottom:1px solid #3b4c60}
#madar-hub .vm-manager-head strong{color:#b5d0e0;font-weight:400}
#madar-hub .vm-manager-head button{background:transparent;color:#bdccdb;border-color:transparent}
#madar-hub .vm-split>nav,#madar-hub .vm-split>aside{background:#171f2b;border-right-color:#3e4d60}
#madar-hub .vm-split>main{background:var(--vm-panel)}
#madar-hub .vm-manager nav button{color:#aebfd0;background:transparent}
#madar-hub .vm-manager nav button.selected{background:#2c4458!important;color:#e0edf5!important;box-shadow:inset 3px 0 #8bbccf}
#madar-hub .vm-quick{background:linear-gradient(110deg,#233444,#202d3b);border:1px solid #425c70;border-left:3px solid #8bbccf;border-radius:5px}
#madar-hub .vm-quick span{color:#a6bacb}
#madar-hub .vm-quick button{color:#b9d5e6;background:transparent;border-color:transparent}
#madar-hub .vm-tiles>div{background:#222e3b;border:1px solid #46576b;border-top:2px solid #799bb3;border-radius:5px;color:#c4d7e6;font-size:16px}
#madar-hub .vm-tiles strong{color:#a1c8b4}
#madar-hub .vm-menu{background:#253140;border:1px solid #73879b;border-radius:6px;box-shadow:0 14px 36px #0008}
#madar-hub .vm-menu button{background:transparent;color:#d3dce6;border-radius:3px}
#madar-hub .vm-menu button:hover{background:#375069;color:#eef6fb}
#madar-hub .vm-clock{color:#9ebed3}
#madar-hub .vm-native-terminal{background:#10151d;color:#d1dae4}
#madar-hub .vm-native-terminal.vm-sconfig{background:#16243a}
#madar-hub .vm-native-terminal pre{color:#c9d7e5}
#madar-hub .vm-native-terminal label{color:#c8d9e5}
#madar-hub .vm-native-terminal input:not([type=radio]){background:#172333;border:1px solid #688098;color:#d8e6ee;box-shadow:none}
#madar-hub .vm-native-terminal button{background:#253b50;border-color:#7994ac;color:#d0e0ed}
#madar-hub .vm-wizard-heading{background:linear-gradient(110deg,#263443,#222c3a);border-bottom-color:#4a5b6e;padding-block:20px}
#madar-hub .vm-wizard-heading h2{color:#d4e1ea;font-size:23px;font-weight:400}
#madar-hub .vm-wizard-heading small{color:#a8bccc;line-height:1.7}
#madar-hub .vm-wizard>nav{background:#171f2b;border-right-color:#3d4d60;color:#a9bbcb}
#madar-hub .vm-wizard>nav span{padding-block:9px}
#madar-hub .vm-wizard>main{background:var(--vm-panel)}
#madar-hub .vm-success{color:#b3d7c2;background:#223d35;border-left-color:#8ac4a6;border-radius:4px}
#madar-hub .vm-warning{color:#e1c695;background:#3b3324;border-left-color:#c7a66d;border-radius:4px}
#madar-hub .vm-message>span{color:#a3c4d8}
#madar-hub .vm-training-note{color:#a7b8c9!important}
#madar-hub .vm-mmc nav{background:#17202b}
#madar-hub .vm-mmc nav button{background:transparent;color:#bfcede}
#madar-hub .vm-setup-page{background:var(--vm-panel)}
#madar-hub .vm-setup-logo{color:#b1cfe0}
#madar-hub .vm-license{background:#17202b;border-color:#586b7e;color:#bbcbd9;border-radius:4px}
#madar-hub .vm-progress{background:#303f50;border-radius:8px;overflow:hidden;height:6px}
#madar-hub .vm-progress i{background:#86aebf}
#madar-hub .vm-hyperv{background:var(--vm-panel)}
#madar-hub .vm-host-title{background:#2a3c4e;color:#d1e1eb;border-bottom:1px solid #4c6379;display:flex;align-items:center;justify-content:center;gap:8px}
#madar-hub .vm-menubar{background:#1b2531;border-bottom-color:#44556a;color:#b9cad9}
#madar-hub .vm-host-grid>nav{background:#171f2b;border-right-color:#3d4e62;color:#b6c9d9}
#madar-hub .vm-host-grid>aside{background:#1b2735;border-left-color:#3d5066;color:#bfcedb}
#madar-hub .vm-host-grid>aside button{background:transparent;color:#a4cce0;border-color:transparent}
#madar-hub .vm-workbench th{background:#202d3c;color:#aec1d2;border-bottom-color:#4e6277;font-size:11px}
#madar-hub .vm-workbench td{border-bottom-color:#354559;color:#c2d2df}
#madar-hub .vm-workbench td .vm-glyph{width:15px;height:15px;margin-right:6px;color:#91b4cc}
#madar-hub .vm-workbench tr[data-vm-select]:hover{background:#283c50}
#madar-hub .vm-host-preview{background:radial-gradient(ellipse at 0% 50%,#38526d44,transparent 60%),#1a2634;border:1px solid #4b6075;border-radius:10px;box-shadow:0 10px 24px #0002}
#madar-hub .vm-host-preview>span{display:grid;place-items:center;width:88px;height:88px;background:#24384c;border:1px solid #58738c;border-radius:17px;color:#a5c5da;box-shadow:0 8px 15px #0002}
#madar-hub .vm-host-preview .vm-glyph{width:48px;height:48px;stroke-width:1.2}
#madar-hub .vm-host-preview p{color:#a7bdcf;font-size:12px}
#madar-hub .vm-host-hint{color:#a3b7ca!important}
#madar-hub .vm-start{background:linear-gradient(130deg,#162332f7,#253448f7);backdrop-filter:blur(12px);color:#d4e3ee}
#madar-hub .vm-start button{background:#2a3e52;border-color:#657f98;color:#d0e1ed;border-radius:5px}
#madar-hub .vm-start button:hover{background:#38566e}
#madar-hub .vm-logon{background:#1b2938f5;border:1px solid #688398;border-radius:12px;box-shadow:0 24px 65px #0007}
#madar-hub .vm-avatar{display:grid;place-items:center;width:76px;height:76px;border:1px solid #7894ab;border-radius:50%;background:#2a4056;margin:0 auto 20px;color:#b5cfe0}
#madar-hub .vm-avatar .vm-glyph{width:39px;height:39px}
#madar-hub .vm-logon h2{color:#d7e3ec;text-align:center}
#madar-hub .vm-logon button{background:#31546c;border-color:#8fb3cc;color:#dbe8f2}
#madar-hub .vm-logon small{color:#a6bdce}
#madar-hub .vm-off,#madar-hub .vm-remote-note{background:#203145;border:1px solid #56728a;border-radius:9px;color:#cadbe9}
#madar-hub .vm-task-title{font-weight:600;letter-spacing:-.4px}
#madar-hub .vm-brief{background:#18212e;border-color:#394a60}
#madar-hub .vm-brief>summary{color:#bed0df}
@media(max-width:560px){
 #madar-hub .vm-lab-toolbar{padding-inline:10px;gap:5px}
 #madar-hub .vm-lab-toolbar>span:first-child{padding-inline-start:30px}
 #madar-hub .vm-lab-toolbar>span:first-child:before{width:21px;height:21px;top:2px}
 #madar-hub .vm-lab-toolbar>span:first-child:after{width:4px;height:4px;top:3px;box-shadow:-9px 10px 0 -1px #7991b9}
 #madar-hub .vm-lab-toolbar small{font-size:6px;letter-spacing:1px}
 #madar-hub .vm-watermark{right:18px;gap:12px}
 #madar-hub .vm-watermark>span{font-size:19px}
 #madar-hub .vm-watermark>b .vm-glyph{width:34px;height:34px}
 #madar-hub .vm-workbench td .vm-glyph{display:none}
 #madar-hub .vm-host-preview>span{width:49px;height:62px;border-radius:9px;flex-shrink:0}
 #madar-hub .vm-host-preview .vm-glyph{width:30px;height:30px}
 #madar-hub .vm-wizard>nav{border-bottom-color:#46576c}
 #madar-hub .vm-taskbar button{min-width:31px;padding-inline:6px}
 #madar-hub .vm-taskbar button span{display:none}
}
@media(prefers-reduced-motion:reduce){#madar-hub .vm-workbench *{transition:none!important;animation:none!important;scroll-behavior:auto!important}}

