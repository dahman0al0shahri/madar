/* Windows-inspired dark silk: the background itself moves independently. */
#madar-hub .vm-desktop,#madar-hub .vm-core-desktop{background:#0c1622}
#madar-hub svg.vm-windows-waves{position:absolute;inset:-5%;width:110%;height:110%;max-width:none;pointer-events:none;z-index:0;opacity:.9}
#madar-hub .vm-wave-layer{transform-origin:65% 50%;will-change:transform;animation:vm-windows-silk calc(8s / .73) ease-in-out infinite alternate}
#madar-hub .vm-wave-middle{animation-name:vm-windows-fold;animation-duration:calc(11s / .73);animation-delay:calc(-4s / .73)}
#madar-hub .vm-wave-near{animation-duration:calc(14s / .73);animation-delay:calc(-7s / .73);animation-direction:alternate-reverse;opacity:.88}
#madar-hub .vm-workbench[data-motion=paused] .vm-wave-layer{animation-play-state:paused}
@keyframes vm-windows-silk{from{transform:translate(-120px,48px) rotate(-5deg) scale(1.12)}to{transform:translate(120px,-64px) rotate(5deg) scale(1.18)}}
@keyframes vm-windows-fold{from{transform:translate(95px,-65px) rotate(4.5deg) scale(1.14)}to{transform:translate(-110px,72px) rotate(-4.5deg) scale(1.2)}}
@media(prefers-reduced-motion:reduce){#madar-hub .vm-wave-layer{animation:none!important;transform:none;will-change:auto}}

/* Light travels over the folds; the planetary emblem is header branding only. */
#madar-hub .vm-wave-current{fill:none;stroke:#82c5dc;stroke-width:2.4;stroke-linecap:round;stroke-dasharray:220 770;opacity:.52;animation:vm-current-flow calc(8s / .73) linear infinite}
#madar-hub .vm-wave-middle .vm-wave-current{animation-duration:calc(10s / .73);animation-delay:calc(-4s / .73);opacity:.42}
#madar-hub .vm-wave-near .vm-wave-current{animation-duration:calc(12s / .73);animation-delay:calc(-7s / .73);stroke:#91b8d1;opacity:.36}
#madar-hub .vm-wave-atmosphere{position:absolute;inset:-15%;pointer-events:none;background:radial-gradient(ellipse at 37% 45%,#2b799834,transparent 46%),radial-gradient(ellipse at 72% 72%,#425da928,transparent 38%);mix-blend-mode:screen;animation:vm-soft-light calc(10s / .73) ease-in-out infinite alternate;will-change:transform;z-index:0}
#madar-hub .vm-workbench[data-motion=paused] .vm-wave-current,#madar-hub .vm-workbench[data-motion=paused] .vm-wave-atmosphere{animation-play-state:paused}
@keyframes vm-current-flow{from{stroke-dashoffset:1980}to{stroke-dashoffset:0}}
@keyframes vm-soft-light{from{transform:translate(-5%,-3%) rotate(-5deg) scale(1)}to{transform:translate(7%,6%) rotate(5deg) scale(1.12)}}
@media(prefers-reduced-motion:reduce){#madar-hub .vm-wave-current,#madar-hub .vm-wave-atmosphere{animation:none!important;will-change:auto}#madar-hub .vm-wave-current{opacity:0}}
