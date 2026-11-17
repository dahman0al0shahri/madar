/* One shared animated gradient: face and both spill layers inherit its exact phase. */
#madar-hub .sa button.sa-lang{overflow:visible;transform:none!important;will-change:auto;border-color:#d8f0dcaa;box-shadow:0 4px 12px #0004;animation:sa-translate-colors 4.8s ease-in-out infinite;transition:border-color .2s}
#madar-hub .sa button.sa-lang:hover,#madar-hub .sa button.sa-lang:active{transform:none;box-shadow:0 4px 12px #0004}
#madar-hub .sa button.sa-lang:before,#madar-hub .sa button.sa-lang:after{content:'';position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:inherit;transform:none;animation:none}
#madar-hub .sa button.sa-lang:before{z-index:-2;filter:blur(7px);opacity:.9}
#madar-hub .sa button.sa-lang:after{z-index:-3;filter:blur(19px);opacity:.8;animation:sa-translate-spill 4.8s ease-in-out infinite}
#madar-hub .sa .sa-lang-face{position:absolute;inset:0;z-index:-1;border-radius:inherit;background:inherit;pointer-events:none}
#madar-hub .sa .sa-lang-icon{animation:none;transform:none}
@keyframes sa-translate-colors{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes sa-translate-spill{0%,100%{opacity:.65}50%{opacity:.95}}
/* Soft light shafts, with independent slow sweeps rather than a rotating sunburst. */
#madar-hub .sa button.sa-lang{--sa-light-gradient:linear-gradient(110deg,#8cecd5,#ffe0a1 40%,#9bf0e3 70%,#ffe7b0);background-image:var(--sa-light-gradient)}
#madar-hub .sa button.sa-lang:before{filter:blur(5px);opacity:.48}#madar-hub .sa button.sa-lang:after{display:none}
#madar-hub .sa .sa-lang-rays{position:absolute;inset:0;z-index:-3;display:block;pointer-events:none;filter:blur(2.6px);background-position:inherit}
#madar-hub .sa .sa-lang-rays i{--sa-beam-angle:0deg;position:absolute;display:block;left:calc(100% - 8px);top:9px;width:124px;height:25px;transform-origin:0 50%;background-image:var(--sa-light-gradient);background-size:280% 100%;background-position:inherit;clip-path:polygon(0 40%,100% 0,100% 100%,0 60%);mask-image:linear-gradient(90deg,#000 0%,#000c 15%,#0005 50%,transparent 96%);opacity:.5;animation:sa-light-shaft 4.8s ease-in-out infinite alternate}
#madar-hub .sa .sa-lang-rays i:nth-child(1){--sa-beam-angle:-25deg;top:1px;width:100px;height:20px;animation-delay:-1.3s}
#madar-hub .sa .sa-lang-rays i:nth-child(2){--sa-beam-angle:20deg;top:23px;width:108px;height:22px;animation-delay:-4.1s;animation-duration:5.6s}
#madar-hub .sa .sa-lang-rays i:nth-child(3){--sa-beam-angle:-158deg;left:7px;top:6px;width:54px;height:14px;animation-delay:-2.8s;animation-duration:5.2s}
#madar-hub .sa .sa-lang-rays i:nth-child(4){--sa-beam-angle:65deg;left:65%;top:38px;width:72px;height:15px;animation-delay:-5.5s;animation-duration:6s}
#madar-hub .sa .sa-lang-rays i:nth-child(5){--sa-beam-angle:-72deg;left:62%;top:-5px;width:70px;height:14px;animation-delay:-2s;animation-duration:5.4s}
@keyframes sa-light-shaft{0%{transform:translateY(-3px) rotate(calc(var(--sa-beam-angle) - 7deg));opacity:.35}50%{opacity:.55}100%{transform:translateY(4px) rotate(calc(var(--sa-beam-angle) + 7deg));opacity:.42}}
@media(prefers-reduced-motion:reduce){#madar-hub .sa .sa-lang-rays i{transform:rotate(var(--sa-beam-angle));opacity:.45}}
#madar-hub .sa .sa-lang-rays i:nth-child(6){--sa-beam-angle:155deg;left:7px;top:32px;width:58px;height:14px;animation-delay:-3.2s;animation-duration:5.8s}
