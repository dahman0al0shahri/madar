/* MCQ bank: long Arabic options, clear focus and feedback. */
.options .option{display:flex;align-items:flex-start;gap:12px;line-height:1.85;padding:17px 18px;min-height:62px;text-align:start;transition:border-color .15s,background .15s}
.option input{flex:none;margin-top:9px}.option-letter{display:grid;place-items:center;flex:0 0 30px;min-height:30px;border:1px solid #526373;border-radius:8px;color:#c9d7e2;font-weight:700}
.option:has(input:checked){border-color:#6ddacc;background:rgba(109,218,204,.09)}.option:focus-within{outline:2px solid #6ddacc;outline-offset:3px}
.options .option.option-correct{border-color:#6ddacc;background:rgba(109,218,204,.09)}.options .option.option-wrong{border-color:#eda398;background:rgba(237,163,152,.09)}
.skip:not(:focus){opacity:0;pointer-events:none}
.answer-reasons{margin:18px 0;border-top:1px solid #43525f;padding-top:14px}.answer-reasons summary{cursor:pointer;color:#d9e6ec;line-height:1.8}.answer-reasons p{padding:8px 0}
.source-locator{font-size:.9rem;color:#bacbd5}.selected-reason{border-inline-start:3px solid #eda398;padding-inline-start:14px}
@media(max-width:540px){.options .option{padding:14px 12px;gap:9px}.option-letter{flex-basis:26px;min-height:26px}}
