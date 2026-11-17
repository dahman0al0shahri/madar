/* Shared compact viewport, independent of lesson/tab type and future catalog entries. */
#madar-labs #madar-free #nf-stage{height:clamp(260px,38vh,360px);min-height:240px}
#madar-labs #madar-free #ml-workspace-fullscreen{flex:none;min-height:44px;white-space:nowrap;padding:8px 12px;border-color:#86b9c5;color:#defaff;background:#24404a;font-size:13px}
#madar-labs.ml-workspace-expanded{position:fixed;inset:0;z-index:10000;width:100%;height:100vh;height:100dvh;max-width:none;margin:0;padding:0;border:0;border-radius:0;background:#101a20;overflow:auto;overscroll-behavior:contain}
#madar-labs.ml-workspace-expanded> :not(#ml-workspace):not(#ml-dialog):not(#ml-toast){display:none!important}
#madar-labs.ml-workspace-expanded #ml-workspace{margin:0;padding:0}
#madar-labs.ml-workspace-expanded #madar-free{border-radius:0;overflow:visible}
#madar-labs.ml-workspace-expanded #madar-free .ml-workspace-toolbar{position:sticky;top:0;z-index:20;border-radius:0;padding-top:max(8px,env(safe-area-inset-top))}
#madar-labs.ml-workspace-expanded #madar-free #nf-stage{height:calc(100vh - 74px);height:calc(100dvh - 74px - env(safe-area-inset-top));min-height:180px}
#madar-labs.ml-workspace-expanded #ml-tools-guide{max-height:30vh;overflow:auto}
#madar-labs.ml-workspace-expanded #ml-toast{position:fixed;bottom:14px;inset-inline:16px;z-index:30}
@media(max-width:700px){#madar-labs #madar-free #nf-stage{height:280px;min-height:240px}#madar-labs #madar-free #ml-workspace-fullscreen{font-size:12px;padding-inline:8px}}
