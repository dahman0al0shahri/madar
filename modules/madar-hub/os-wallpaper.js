// Decorative Windows-inspired folds, not a real system state or lesson step.
function vmWindowsBackdrop(){return `<svg class="vm-windows-waves" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs>
 <linearGradient id="vm-wave-silk" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#080f1b"/><stop offset=".36" stop-color="#152c44"/><stop offset=".55" stop-color="#244b69"/><stop offset=".63" stop-color="#14283c"/><stop offset="1" stop-color="#09121e"/></linearGradient>
 <linearGradient id="vm-wave-fold" x1="0" y1="1" x2=".9" y2="0"><stop stop-color="#080e18"/><stop offset=".48" stop-color="#132c43"/><stop offset=".76" stop-color="#284f6a"/><stop offset=".81" stop-color="#3a6a83"/><stop offset=".86" stop-color="#172f47"/><stop offset="1" stop-color="#0b1727"/></linearGradient>
 <linearGradient id="vm-wave-edge" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#5788a1" stop-opacity="0"/><stop offset=".48" stop-color="#5788a1" stop-opacity=".4"/><stop offset=".76" stop-color="#80aabe" stop-opacity=".55"/><stop offset="1" stop-color="#5788a1" stop-opacity="0"/></linearGradient>
 <radialGradient id="vm-wave-shade"><stop stop-color="#0c1723" stop-opacity=".45"/><stop offset=".67" stop-color="#07101b" stop-opacity=".05"/><stop offset="1" stop-color="#060d17" stop-opacity=".65"/></radialGradient>
</defs>
<g class="vm-wave-layer vm-wave-far">
 <path fill="url(#vm-wave-silk)" d="M-180 850C100 690 270 740 420 575S620 190 960 150s470 160 830-230V-200H-180Z"/>
 <path fill="none" stroke="url(#vm-wave-edge)" stroke-width="1.4" d="M-180 850C100 690 270 740 420 575S620 190 960 150s470 160 830-230"/>
 <path class="vm-wave-current" d="M-180 850C100 690 270 740 420 575S620 190 960 150s470 160 830-230"/>
</g>
<g class="vm-wave-layer vm-wave-middle">
 <path fill="url(#vm-wave-fold)" d="M-200 1100C120 600 430 980 650 680S800 90 1180 220s450-140 650-520V1100Z"/>
 <path fill="none" stroke="url(#vm-wave-edge)" stroke-width="2" d="M-200 1100C120 600 430 980 650 680S800 90 1180 220s450-140 650-520"/>
 <path class="vm-wave-current" d="M-200 1100C120 600 430 980 650 680S800 90 1180 220s450-140 650-520"/>
</g>
<g class="vm-wave-layer vm-wave-near">
 <path fill="url(#vm-wave-silk)" d="M-100 1150C190 785 550 990 880 680s230-400 510-330 300-120 450-280V1100Z"/>
 <path fill="none" stroke="url(#vm-wave-edge)" stroke-width="1.5" d="M-100 1150C190 785 550 990 880 680s230-400 510-330 300-120 450-280"/>
 <path class="vm-wave-current" d="M-100 1150C190 785 550 990 880 680s230-400 510-330 300-120 450-280"/>
</g>
<rect width="1600" height="900" fill="url(#vm-wave-shade)"/>
</svg><div class="vm-wave-atmosphere" aria-hidden="true"></div>`;}
