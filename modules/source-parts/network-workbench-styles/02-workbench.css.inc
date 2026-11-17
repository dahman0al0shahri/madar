/* Focused workbench: one live task; explanations live behind named keys. */
#madar-labs .ml-disclosure{min-width:0;border:1px solid #738f9144;border-radius:10px;background:#142025;overflow-wrap:anywhere}
#madar-labs .ml-disclosure>summary{cursor:pointer;min-height:44px;padding:9px 14px;display:flex;align-items:center;gap:8px;font-size:13px;color:#d9e4df;list-style:none}
#madar-labs .ml-disclosure>summary::-webkit-details-marker{display:none}
#madar-labs .ml-disclosure>summary:after{content:'＋';margin-inline-start:auto;color:#d9b782}
#madar-labs .ml-disclosure[open]>summary:after{content:'−'}
#madar-labs .ml-disclosure[open]>summary{border-bottom:1px solid #ffffff15;color:#f0cf9f}
#madar-labs .ml-disclosure> :not(summary){margin:12px;padding:0;max-width:calc(100% - 24px)}
#madar-labs .ml-secondary{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
#madar-labs .ml-secondary>.ml-disclosure{flex:1 1 145px}
#madar-labs .ml-secondary>.ml-disclosure[open]{flex-basis:100%;order:1}
#madar-labs .ml-task>div:first-child{min-width:0;flex:1 1 280px;overflow-wrap:anywhere}
#madar-labs .ml-task{margin-bottom:8px;padding:16px}
#madar-labs #ml-task-detail{display:block;max-width:100%;overflow-wrap:anywhere}
#madar-labs #ml-step-position{font-size:12px;margin:0;color:#ceb58d}
#madar-labs .ml-task .ml-kicker{display:none}
#madar-labs #ml-learning-panel{padding:10px 14px;margin-bottom:8px;background:#111b20}
#madar-labs #ml-learning-status:empty{display:none}
#madar-labs #ml-learning-panel #ml-requirements{margin:0}
#madar-labs #ml-requirements summary{cursor:pointer;min-height:38px;display:flex;align-items:center;font-size:13px;color:#b9c9ca}
#madar-labs #ml-diagnosis{min-width:0;overflow-wrap:anywhere;padding:10px}
#madar-labs #ml-locate{max-width:100%;white-space:normal}
#madar-labs #ml-diagnostic-output:empty{display:none}
#madar-labs #ml-context{padding-block:10px;align-items:center}
#madar-labs #ml-tab-options{flex:0 1 auto;max-width:100%}
#madar-labs #ml-tab-options>summary{font-size:12px}
#madar-labs #ml-name{font-size:15px}
#madar-labs #ml-kind{font-size:11px}
#madar-labs #ml-description:empty{display:none}
#madar-labs .ml-learning-tools{overflow:visible;flex-wrap:wrap;border:0}
#madar-labs .ml-learning-tools button{flex:1 1 150px;white-space:normal}
#madar-labs #ml-guidance{border:0;font-size:13px}
#madar-labs #ml-lesson-guide{display:block;border:0;background:none;padding:0;margin:0 0 8px;min-width:0}
#madar-labs .ml-lesson-instructions{padding:0;min-width:0}
#madar-labs .ml-lesson-instructions>summary{padding:8px 14px;min-height:44px;font-size:13px}
#madar-labs .ml-lesson-instructions>:not(summary){margin:14px;overflow-wrap:anywhere}
#madar-labs #ml-lesson-guide h3{font-size:18px}
#madar-labs #ml-lesson-away{margin-top:8px;font-size:13px}
#madar-labs #ml-workspace-help{margin:10px 0}
#madar-labs [hidden]{display:none!important}
@media(max-width:700px){
 #madar-labs .ml-top{padding-bottom:10px}#madar-labs h2{font-size:20px}
 #madar-labs #ml-context{flex-direction:row;flex-wrap:wrap}
 #madar-labs #ml-learning-panel{padding:8px 10px}
 #madar-labs[data-lesson] .ml-task #ml-task-detail{font-size:13px;line-height:1.85}
 #madar-labs .ml-secondary{gap:6px}#madar-labs .ml-secondary>.ml-disclosure{flex-basis:110px}
 #madar-labs .ml-secondary>.ml-disclosure[open]{flex-basis:100%}
 #madar-labs .ml-disclosure>summary{padding:8px 10px;font-size:12px}
}
#madar-labs #ml-ping-fold,#madar-labs #ml-simulation-scope{margin:12px 20px}
#madar-labs #ml-cli-guide{margin:10px 0;font-size:12px}
#madar-labs #ml-device-actions{margin-top:10px}
#madar-labs #ml-device-actions>button{margin:8px 4px;padding:8px 12px}
#madar-labs #ml-simulation-scope footer{border:0;background:transparent;line-height:1.9}
#madar-labs #nf-cli-context:empty{display:none}
#madar-labs .ml-course label,#madar-labs .ml-course select{min-width:0;max-width:100%}
#madar-labs #ml-setup-fold .ml-course{display:flex;flex-wrap:wrap}
#madar-labs #ml-setup-fold .ml-course label{flex:1 1 100%}
#madar-labs #ml-setup-fold .ml-course select{width:100%}
@media(max-width:700px){#madar-labs #ml-ping-fold,#madar-labs #ml-simulation-scope{margin:10px 12px}}

