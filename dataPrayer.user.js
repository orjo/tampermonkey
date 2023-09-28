// ==UserScript==
// @name         dataPrayer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  a better approach to show dataLayer events
// @author       znerolki
// @match        https://stage.cue.kleinezeitung.at/
// @match        https://test.cue.kleinezeitung.at/
// @match        http://local-klz.news:2000/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kleinezeitung.at
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
  
    window.dataLayer = new Proxy([], {
      set: function (target, key, value) {
        target[key] = value;
  
        const allowList = ['view_promotion', 'select_promotion'];
        const showColumns = ['onsitead_campaign', 'onsitead_creation', 'onsitead_variant', 'onsitead_detailed_placement'];
  
        if (allowList.includes(value.event_name)) {
          let imp = value[value.event_name].impressions[0];
          let headline = `%c${value.event_name} %cArea:%c ${imp.onsitead_creation} %cContainer:%c ${imp.onsitead_variant} %c(onsitead_detailed_placement) %c\u00A9 dataPrayer`;
          console.log(headline,
                      'font-size:14px;color:white;background:#282828;',
                      'color:white; background:#007acc;font-size:14px',
                      'font-size:12px;color:white;background:#282828',
                      'font-size:14px;color:white;background:#cc7a00;',
                      'font-size:12px;color:white;background:#282828',
                      'font-size:4px;color:#282828;background:#282828',
                      'font-size:10px;color:white;background:#AA336A');
  
          console.table(value.view_promotion.impressions, showColumns);
        }
        return true;
      },
    });
  })();