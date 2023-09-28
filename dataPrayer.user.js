// ==UserScript==
// @name         dataPrayer
// @namespace    https://www.kleinezeitung.at
// @website      https://www.kleinezeitung.at
// @version      0.4
// @description  a better approach to show dataLayer events
// @author       znerolki
// @match        https://test.cue.kleinezeitung.at/*
// @match        https://stage.cue.kleinezeitung.at/*
// @match        http://local-klz.news:2000/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kleinezeitung.at
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// ==/UserScript==

(function() {
  'use strict';

  let showColumns = GM_listValues();

  unsafeWindow.dataLayer = new Proxy([], {
    set: function (target, key, value) {
      target[key] = value;

      const allowList = ['view_promotion', 'select_promotion'];
      //const showColumns = ['onsitead_creation', 'onsitead_variant', 'onsitead_detailed_placement'];

      if (allowList.includes(value.event_name)) {
        let imp = value[value.event_name].impressions[0];
        let headline = `%c${value.event_name} %cArea:%c ${imp.onsitead_creation} %cContainer:%c ${imp.onsitead_variant} %c(index) %c\u00A9 dataPrayer v${GM_info.script.version}`;
        console.log(headline,
                    'font-size:14px;color:white;background:#282828;',
                    'color:white; background:#007acc;font-size:14px',
                    'font-size:12px;color:white;background:#282828',
                    'font-size:14px;color:white;background:#cc7a00;',
                    'font-size:12px;color:white;background:#282828',
                    'font-size:4px;color:#282828;background:#282828',
                    'font-size:10px;color:white;background:#AA336A');

        console.table(value.view_promotion.impressions, GM_listValues());
      }
      return true;
    },
  });


  // -------------------------------------- //
  // generate checkaboxas
  const allColumns = ['onsitead_advertiser', 'onsitead_campaign', 'onsitead_creation', 'onsitead_detailed_placement', 'onsitead_format', 'onsitead_general_placement', 'onsitead_type', 'onsitead_url', 'onsitead_variant'];
  let checkboxHTML = '';
  allColumns.forEach(col => {
    checkboxHTML += `<li><input type="checkbox" class="dtprr_chk" id="dtprr_${col}" value="${col}"/><label for="dtprr_${col}">${col}</label></li>`;
  });


  const newHTML = document.createElement ('div');
  newHTML.innerHTML = `<div class="dtprr_box">
<strong>dataPrayer v${GM_info.script.version}</strong>
<ul>
${checkboxHTML}
</ul>
  </div>`;

  document.body.appendChild (newHTML);


  const newCSS = document.createElement('style');
  newCSS.innerHTML = `
.dtprr_box {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px;
  color: #fff;
  background: #AA336A;
z-index: 999999;
border-radius: 16px;
filter: drop-shadow(black 0.3rem 0.3rem 6px);
}

.dtprr_chk {
 margin: 6px;
}
`;
  document.body.appendChild (newCSS);

  // load state into boxes
  showColumns.forEach(col => {
    document.querySelector(`.dtprr_chk[value=${col}]`).checked = true;
  });

  // event listener for boxes;
  const checkboxChanged = event => {
    if (event.target.checked) {

      console.log('----- CHANGE--- ');

      GM.setValue(event.target.value, event.target.checked);
    } else {
      GM.deleteValue(event.target.value);
    }
  };

  const boxes = document.querySelectorAll('.dtprr_chk');
  boxes.forEach(box => {
    box.addEventListener('change', checkboxChanged);
  });
})();