/* MADAR network LEDs: 5 Hz / 50% duty, combined LINK/ACT.
 * Sources: Microchip VSC8574-01 3.15.3; TI TLK110 3.9.
 * This is a documented generic profile, not an exact Cisco model specification.
 */
(function(root){'use strict';
 const appearance=Object.freeze({green:0x64ff8b,dark:0x17241b,emission:5,halo:.85});
 function level(linked,activity,seconds,reduced=false){if(!linked)return 0;if(reduced||!activity)return 1;return Math.floor(Math.max(0,seconds)*10)%2===0?0:1;}
 function system(powered,booting,seconds,reduced=false){return powered?(!booting||reduced?1:Math.floor(seconds*2)%2):0;}
 root.MadarNetworkLED=Object.freeze({appearance,level,system});
})(typeof window==='undefined'?globalThis:window);
