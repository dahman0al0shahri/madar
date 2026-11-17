/* Requirements are a permanent reference, grouped by the student's next lookup. */
#madar-labs #ml-requirements-title{margin:0 0 16px;font-size:17px;color:#f2d2a5}
#madar-labs #ml-requirements-content{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;text-align:right}
#madar-labs .ml-req-group{min-width:0;padding:16px;border:1px solid #ffffff14;border-radius:12px;background:#182329}
#madar-labs .ml-req-group h4{display:flex;align-items:center;gap:9px;font-size:14px;color:#f0e8db;margin:0 0 14px}
#madar-labs .ml-req-group h4>span{display:grid;place-items:center;flex:none;width:25px;height:25px;border-radius:8px;background:#d8ac7215;color:#edc18a;font-size:12px}
#madar-labs .ml-req-group table{width:100%;border-collapse:collapse;font-size:13px;text-align:right;table-layout:auto;margin:0}
#madar-labs .ml-req-group th{font-size:11px;font-weight:400;color:#a8babf;padding:0 0 8px;border-bottom:1px solid #ffffff1a}
#madar-labs .ml-req-group td{padding:9px 0;border-bottom:1px solid #ffffff0b;color:#e4eeee;vertical-align:top}
#madar-labs .ml-req-group th:not(:last-child),#madar-labs .ml-req-group td:not(:last-child){padding-inline-end:12px}
#madar-labs .ml-req-group tr:last-child td{border-bottom:0}
#madar-labs .ml-req-group bdi{font-family:Consolas,monospace;font-size:.95em;unicode-bidi:isolate;overflow-wrap:anywhere}
#madar-labs .ml-req-connections{list-style:none;padding:0;margin:0;display:grid;gap:0}
#madar-labs .ml-req-connections li{padding:8px 0;border-bottom:1px solid #ffffff0b}
#madar-labs .ml-req-connections li:last-child{border-bottom:0}
#madar-labs .ml-req-path{display:flex;align-items:center;gap:10px;direction:ltr;justify-content:flex-start;flex-wrap:wrap;font-size:14px;color:#e4eeee}
#madar-labs .ml-req-path>span{color:#d1aa75}
#madar-labs .ml-req-purpose{display:block;font-size:12px;color:#a9bec0;margin-top:3px}
#madar-labs .ml-req-facts{margin:12px 0 0;padding-top:10px;border-top:1px solid #ffffff14;font-size:12px}
#madar-labs .ml-req-facts>div{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px 14px;margin:5px 0}
#madar-labs .ml-req-facts dt{color:#a9bec0}#madar-labs .ml-req-facts dd{margin:0;color:#e4eeee}
#madar-labs .ml-req-rules{margin:0;padding-inline-start:20px;font-size:13px;color:#d7e3e5;line-height:1.9}
#madar-labs .ml-req-rules li+li{margin-top:8px}
#madar-labs #ml-requirements .ml-req-port-note{font-size:11px;color:#b4c4c9;background:#0e171d;padding:10px 12px;border-radius:8px;margin:14px 0 0}
#madar-labs #ml-requirements .ml-requirements-source{display:block;margin-top:14px;padding-top:12px;border-top:1px solid #ffffff12;font-size:11px;color:#9dadb3}
@media(max-width:760px){#madar-labs #ml-requirements-content{grid-template-columns:1fr}#madar-labs .ml-req-group{padding:12px}#madar-labs .ml-req-group table{font-size:12px}#madar-labs .ml-req-group th:not(:last-child),#madar-labs .ml-req-group td:not(:last-child){padding-inline-end:8px}}
#madar-labs .ml-quick-edit{display:flex;align-items:center;gap:10px 16px;flex-wrap:wrap;padding:12px 16px;border-block:1px solid #ffffff12;background:#152026}
#madar-labs .ml-quick-edit>div{display:flex;flex-wrap:wrap;gap:7px}
#madar-labs #ml-quick-target{flex:1 1 180px;font-size:13px;color:#e9d8bd;overflow-wrap:anywhere}
#madar-labs .ml-quick-edit button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px;font-size:12px;padding:7px 11px}
#madar-labs #ml-quick-delete{color:#ffb8bc;border-color:#c96b7455;background:#b0445014}
#madar-labs #ml-quick-cable-mode[aria-pressed=true]{color:#a1fff1;border-color:#68dcd4;background:#24514e}
#madar-labs #nf-stage[data-cable-select=true]{outline:2px solid #68dcd4;outline-offset:-2px}
#madar-labs #nf-stage[data-cable-select=true]>canvas{cursor:crosshair!important}
#madar-labs .ml-quick-tip{flex-basis:100%;font-size:11px;color:#9baeb6}
#madar-labs #nf-stage canvas:focus-visible{outline:2px solid #e6bd8b;outline-offset:-3px}
@media(pointer:coarse){#madar-labs .ml-quick-tip{display:none}#madar-labs .ml-quick-edit button{min-height:44px}}

#madar-labs .ml-cable-picker{padding:14px 16px;background:linear-gradient(115deg,#17252b,#121c21);border:1px solid #3c535d;border-radius:12px 12px 0 0;margin-top:12px}
#madar-labs .ml-cable-options{display:flex;align-items:center;flex-wrap:wrap;gap:8px}
#madar-labs .ml-cable-options strong{margin-inline-end:8px;font-size:13px}
#madar-labs .ml-cable-options button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:7px 12px;background:#172229;border-color:#44535b;font-size:12px}
#madar-labs .ml-cable-options button[aria-pressed=true]{background:#233a40;border-color:#79c9c4;box-shadow:inset 0 0 0 1px #79c9c426;color:#e4fffa}
#madar-labs .ml-cable-options small{color:#bccbd0;font-size:11px}
#madar-labs .ml-wire-sample{width:23px;height:4px;border-radius:4px;background:#6fa2c7;box-shadow:0 1px 0 #061017;display:inline-block}
#madar-labs .ml-wire-cross{background:#dc9a6c;transform:rotate(-20deg)}
#madar-labs .ml-cable-picker p{font-size:12px;line-height:1.8;color:#bdd0d6;margin:9px 0}
#madar-labs .ml-cable-current{display:flex;align-items:center;gap:12px;justify-content:space-between;flex-wrap:wrap;font-size:12px;color:#dce7e9}
#madar-labs #ml-cable-replace{font-size:12px;min-height:40px}
#madar-labs .ml-cable-picker details{margin-top:8px;font-size:12px;color:#9fb9c1}
#madar-labs #ml-cable-pinmap{overflow-wrap:anywhere;font-family:Consolas,monospace}
@media(max-width:600px){#madar-labs .ml-cable-options strong{flex-basis:100%}#madar-labs .ml-cable-options button{flex:1 1 auto;flex-wrap:wrap}#madar-labs .ml-cable-current{gap:8px}}
#madar-labs .ml-tab-item{position:relative;flex:0 0 var(--ml-tabwidth,185px);width:var(--ml-tabwidth,185px);min-width:0;display:flex}
#madar-labs .ml-tab-item>.ml-tab{width:100%;flex:1 1 auto;min-width:0;padding-inline-end:73px}
#madar-labs .ml-tab-item>.ml-tab-delete,#madar-labs .ml-tab-item>.ml-tab-archive{position:absolute;inset-inline-end:3px;top:50%;transform:translateY(-50%);width:32px;min-height:36px;padding:6px;border:0;border-radius:7px;background:transparent;color:#9bcac4;touch-action:manipulation}
#madar-labs .ml-tab-item>.ml-tab-archive{inset-inline-end:37px}
#madar-labs .ml-tab-item>.ml-tab-archive:hover,#madar-labs .ml-tab-item>.ml-tab-archive:focus-visible{color:#c9fff3;background:#30716788}
#madar-labs .ml-tab-item>.ml-tab-delete:hover,#madar-labs .ml-tab-item>.ml-tab-delete:focus-visible{color:#ffd1cb;background:#78342b66}
#madar-labs #ml-deleted-notice{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 14px;background:#172d2c;border:1px solid #37756e;border-radius:0 0 12px 12px;font-size:13px}
#madar-labs #ml-deleted-label{flex:1 1 180px;overflow-wrap:anywhere;line-height:1.7}
#madar-labs #ml-undo-delete{border-color:#60c9bb;color:#b9fff1;flex:none}
@media(max-width:600px){
 #madar-labs .ml-tabs{display:grid;grid-template-columns:32px minmax(0,1fr) 32px;gap:6px}
 #madar-labs #ml-pinned{grid-column:1 / 3;grid-row:1;width:min(190px,100%);justify-self:start;box-shadow:none}
 #madar-labs #ml-plus{grid-column:3;grid-row:1;width:32px}
 #madar-labs #ml-back{grid-column:1;grid-row:2;width:32px;min-width:32px}
 #madar-labs #ml-viewport{grid-column:2;grid-row:2;width:100%}
 #madar-labs #ml-next{grid-column:3;grid-row:2;width:32px;min-width:32px}
}
#ml-selftest{padding:22px;margin:14px 0;border:1px solid #dcb17966;border-radius:18px;background:linear-gradient(125deg,#28251f,#141e24)}#ml-selftest[hidden]{display:none}.ml-selftest-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}#ml-selftest h3{margin:7px 0;font-size:1.3rem}#ml-selftest p{line-height:1.85;color:#c7d1d5}#ml-selftest label{display:grid;gap:8px;max-width:520px}#ml-selftest select{max-width:100%;width:100%;min-height:44px}#ml-selftest-result{border-top:1px solid #e4bb7544;margin-top:20px;padding-top:18px}#ml-selftest-result ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:10px}#ml-selftest-result li{padding:12px;border-radius:10px;background:#0a131a;color:#f0c6a0}#ml-selftest-result li[data-ok=true]{color:#92dfbc}#ml-selftest-result li span{display:block;font-size:.85rem;margin-top:5px;color:#c2cbd0}#ml-selftest-variables{display:grid;gap:12px;border:1px solid #64828266;border-radius:12px;margin-bottom:16px}#ml-selftest-variables label{display:flex;align-items:center;gap:10px;min-height:36px}

