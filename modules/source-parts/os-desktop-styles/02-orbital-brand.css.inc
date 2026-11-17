/* OS edition of the original MADAR sphere: same geometry, lighting and pearl. */
#madar-hub .vm-lab-toolbar>span:first-child{padding-inline-start:62px}
#madar-hub .vm-lab-toolbar>span:first-child:before,#madar-hub .vm-lab-toolbar>span:first-child:after{display:none}
#madar-hub .vm-orbital-mark{display:grid;place-items:center;position:relative;transform:none;margin:0;pointer-events:none}
#madar-hub .vm-orbital-mark:after{content:'';position:absolute;border:1px solid #eac68b70;border-radius:50%}
#madar-hub .vm-orbital-mark .vm-orbit-server{display:grid;place-items:center;color:#efd0a1;z-index:3;filter:drop-shadow(0 2px 2px #050709) drop-shadow(0 0 18px #e9c69113)}
#madar-hub .vm-orbit-server .vm-glyph{width:30%;height:30%;min-width:90px;min-height:90px;stroke-width:.8;stroke:#efd0a1;fill:#dbc49906}
#madar-hub .vm-orbital-mark>.vm-orbit-server{position:absolute;inset:0;font-size:inherit}
#madar-hub .vm-orbit-badge{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:34px;height:34px}
#madar-hub .vm-orbit-badge .vm-orbit-server .vm-glyph{min-width:15px;min-height:15px;width:15px;height:15px;stroke-width:1.2}
#madar-hub .vm-orbit-badge .mh-liquid-bubble{width:7px;height:7px;border-width:.5px}
#madar-hub .vm-orbit-badge .mh-liquid-bubble:after{box-shadow:inset -1px -1px 2px #060c1b45,inset .5px .5px 1px #ffffff70}
#madar-hub .vm-desktop,#madar-hub .vm-core-desktop{background:radial-gradient(ellipse at 28% 88%,#33343460,transparent 60%),linear-gradient(125deg,#1b2026,#161b21 65%,#1c2026)}
#madar-hub .vm-desktop:before,#madar-hub .vm-desktop:after{display:none}
#madar-hub .vm-desktop-wallpaper{position:absolute;inset:0 0 48px;display:grid;place-items:center;overflow:hidden;pointer-events:none;z-index:0}
#madar-hub .vm-desktop-icons{position:relative;z-index:2}
#madar-hub .vm-watermark{z-index:1;opacity:.45;bottom:76px}
#madar-hub .vm-watermark>span{font-size:18px}
#madar-hub .vm-watermark>b .vm-glyph{width:35px;height:35px}
#madar-hub .vm-logon,#madar-hub .vm-off,#madar-hub .vm-remote-note{z-index:4;position:relative}
#madar-hub .vm-start{z-index:8}
#madar-hub .vm-taskbar{z-index:9}
@media(max-width:560px){
 #madar-hub .vm-lab-toolbar>span:first-child{padding-inline-start:38px}
 #madar-hub .vm-orbit-badge{width:24px;height:24px;right:3px}
 #madar-hub .vm-orbit-badge .vm-orbit-server .vm-glyph{min-width:12px;min-height:12px;width:12px;height:12px}
 #madar-hub .vm-orbit-badge .mh-liquid-bubble{width:6px;height:6px}
 #madar-hub .vm-watermark{right:16px;bottom:70px}
 #madar-hub .vm-watermark>span{font-size:14px}
 #madar-hub .vm-watermark small{font-size:8px}
}

