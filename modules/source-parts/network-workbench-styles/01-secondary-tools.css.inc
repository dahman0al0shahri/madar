/* Secondary tools stay in one reachable strip instead of pushing the canvas away. */
@media(max-width:700px){
 #madar-labs .ml-learning-tools{flex-wrap:nowrap;overflow-x:auto;padding:10px 2px 14px;scrollbar-width:thin;scrollbar-color:#8ba9ac #152024;overscroll-behavior-inline:contain;scroll-snap-type:x proximity}
 #madar-labs .ml-learning-tools button{flex:0 0 auto;scroll-snap-align:start;font-size:12px;padding:8px 12px}
 #madar-labs .ml-copybar button{flex:1 1 calc(50% - 8px);min-width:0;font-size:12px;padding:8px 5px}
 #madar-labs #ml-clipboard{flex:1 1 100%;line-height:1.7}
 #madar-labs .ml-task{gap:10px}#madar-labs .ml-task .ml-actions{width:100%;display:flex}
 #madar-labs .ml-task .ml-actions button{flex:1;font-size:12px;padding-inline:8px}
}
