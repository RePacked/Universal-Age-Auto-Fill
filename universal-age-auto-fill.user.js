// ==UserScript==
// @name         Universal Age Auto-Fill (Ultra Optimized with Dynamic Language Caching)
// @namespace    https://github.com/RePacked/Universal-Age-Auto-Fill
// @version      1.0
// @updateURL    https://github.com/RePacked/Universal-Age-Auto-Fill/raw/refs/heads/main/universal-age-auto-fill.user.js
// @downloadURL  https://github.com/RePacked/Universal-Age-Auto-Fill/raw/refs/heads/main/universal-age-auto-fill.user.js
// @description  Autofills age fields with ultra-optimized performance and dynamic language caching.
// @author       RePacked
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    // Default date-of-birth values
    const DEFAULT_YEAR = "1990";
    const DEFAULT_MONTH = "1";   // January-December (1-12)
    const DEFAULT_DAY = "1";

    // Constants for faster access
    const LOWER_YEAR_KEYWORDS = ["year", "dobyear", "birthyear", "age_year"];
    const LOWER_MONTH_KEYWORDS = ["month", "dobmonth", "birthmonth", "age_month"];
    const LOWER_DAY_KEYWORDS = ["day", "dobday", "birthday", "age_day"];
    const localizedMonthsCache = {}; // Cache for localized month names

    // Full list of localized month names (January to December)
    const localizedMonthsData = {
        en: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
        es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
        de: ["januar", "februar", "märz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"],
        it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
        nl: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
        bg: ["януари", "февруари", "март", "април", "май", "юни", "юли", "август", "септември", "октомври", "ноември", "декември"],
        hr: ["siječanj", "veljača", "ožujak", "travanj", "svibanj", "lipanj", "srpanj", "kolovoz", "rujan", "listopad", "studeni", "prosinac"],
        cs: ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"],
        da: ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"],
        et: ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"],
        fi: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
        el: ["ιανουάριος", "φεβρουάριος", "μάρτιος", "απρίλιος", "μάιος", "ιούνιος", "ιούλιος", "αύγουστος", "σεπτέμβριος", "οκτώβριος", "νοέμβριος", "δεκέμβριος"],
        hu: ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"],
        lv: ["janvāris", "februāris", "marts", "aprīlis", "maijs", "jūnijs", "jūlijs", "augusts", "septembris", "oktobris", "novembris", "decembris"],
        lt: ["sausis", "vasaris", "kovas", "balandis", "gegužė", "birželis", "liepa", "rugpjūtis", "rugsėjis", "spalis", "lapkritis", "gruodis"],
        mt: ["jannar", "frar", "marzu", "april", "mejju", "ġunju", "lulju", "awwissu", "settembru", "ottubru", "novembru", "diċembru"],
        pl: ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"],
        pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
        ro: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
        sk: ["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december"],
        sl: ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"],
        sv: ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
        uk: ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень"],
        ru: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
        af: ["januarie", "februarie", "maart", "april", "mei", "junie", "julie", "augustus", "september", "oktober", "november", "desember"]
    };

    // Functions defined as constants for potential inline optimization by the JavaScript engine
    const getLangCode = () => (document.documentElement.lang || "en").slice(0, 2).toLowerCase();

    const getLocalizedMonthLower = (monthNumber) => {
        const lang = getLangCode();
        // Check if the localized months for the current language are already cached
        if (!localizedMonthsCache[lang]) {
            const months = localizedMonthsData[lang];
            // If the language is found, cache the lowercase month names; otherwise, use English as the default
            localizedMonthsCache[lang] = months ? months.map(m => m.toLowerCase()) : localizedMonthsData.en.map(m => m.toLowerCase());
        }
        const index = parseInt(monthNumber, 10) - 1;
        // Return the lowercase localized month name if the index is valid
        return (index >= 0 && index < 12) ? localizedMonthsCache[lang][index] : null;
    };

    // Function to trigger both 'input' and 'change' events on an element
    const trigger = (el) => {
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
    };

    // Function to check if a lowercase string contains any of the lowercase keywords
    const matches = (val, keywords) => !!val && keywords.some(kw => val.includes(kw));

    // Function to detect the field type (year, month, day) based on element attributes
    const detectType = (el) => {
        const lName = (el.name || "").toLowerCase();
        const lId = (el.id || "").toLowerCase();
        const lPlaceholder = (el.placeholder || "").toLowerCase();
        const lAria = (el.getAttribute("aria-label") || "").toLowerCase();
        const lDataName = (el.getAttribute("data-name") || "").toLowerCase();

        if (matches(lName, LOWER_YEAR_KEYWORDS) || matches(lId, LOWER_YEAR_KEYWORDS) || matches(lPlaceholder, LOWER_YEAR_KEYWORDS) || matches(lAria, LOWER_YEAR_KEYWORDS) || matches(lDataName, LOWER_YEAR_KEYWORDS)) return "year";
        if (matches(lName, LOWER_MONTH_KEYWORDS) || matches(lId, LOWER_MONTH_KEYWORDS) || matches(lPlaceholder, LOWER_MONTH_KEYWORDS) || matches(lAria, LOWER_MONTH_KEYWORDS) || matches(lDataName, LOWER_MONTH_KEYWORDS)) return "month";
        if (matches(lName, LOWER_DAY_KEYWORDS) || matches(lId, LOWER_DAY_KEYWORDS) || matches(lPlaceholder, LOWER_DAY_KEYWORDS) || matches(lAria, LOWER_DAY_KEYWORDS) || matches(lDataName, LOWER_DAY_KEYWORDS)) return "day";
        return null;
    };

    // Function to fill standard input and select elements
    const fillStandard = (el) => {
        const tag = el.tagName.toLowerCase();
        const type = (el.type || "").toLowerCase();
        const fieldType = detectType(el);
        if (!fieldType) return false;

        let val;
        if (fieldType === "year") val = DEFAULT_YEAR;
        else if (fieldType === "day") val = DEFAULT_DAY;
        else if (fieldType === "month") val = DEFAULT_MONTH;

        if (tag === "select") {
            const options = el.options;
            const numVal = parseInt(val, 10);
            const localizedMonth = getLocalizedMonthLower(val);
            const hasZero = Array.from(options).some(opt => opt.value === "0");

            for (let i = 0, len = options.length; i < len; ++i) {
                const opt = options[i];
                if (opt.value === val || (!isNaN(parseInt(opt.value, 10)) && parseInt(opt.value, 10) + (hasZero ? 1 : 0) === numVal) || (localizedMonth && opt.text.toLowerCase() === localizedMonth)) {
                    el.value = opt.value;
                    trigger(el);
                    return true;
                }
            }
        } else if (tag === "input") {
            if (type === "" || type === "text" || type === "number" || type === "tel") {
                const localizedMonthUpper = getLocalizedMonthLower(val);
                el.value = fieldType === "month" && localizedMonthUpper ? localizedMonthUpper[0].toUpperCase() + localizedMonthUpper.slice(1) : val;
                trigger(el);
                return true;
            } else if (type === "radio" && (el.value === val || parseInt(el.value, 10) === numVal || el.value.toLowerCase() === val)) {
                el.checked = true;
                trigger(el);
                return true;
            }
        }
        return false;
    };

    // Function to process standard input and select fields
    const processStandard = () => {
        document.querySelectorAll("input, select").forEach(fillStandard);
    };

    // Function to process custom dropdown elements (assuming a specific structure)
    const processCustom = () => {
        const dropdowns = document.querySelectorAll("div.select[data-name]");
        const defaultMonthNum = parseInt(DEFAULT_MONTH, 10);
        const localizedDefaultMonthLower = getLocalizedMonthLower(DEFAULT_MONTH);

        dropdowns.forEach(dropdown => {
            const lDataName = dropdown.getAttribute("data-name").toLowerCase();
            let fType = null;
            if (lDataName.includes("year")) fType = "year";
            else if (lDataName.includes("month")) fType = "month";
            else if (lDataName.includes("day")) fType = "day";
            if (!fType) return;

            const desiredVal = fType === "year" ? DEFAULT_YEAR : (fType === "day" ? DEFAULT_DAY : DEFAULT_MONTH);
            const hidden = dropdown.querySelector("input[type='hidden']");

            if (fType === "month") {
                const options = dropdown.querySelectorAll("ul li a");
                const hasZero = Array.from(options).some(opt => opt.getAttribute("data-value") === "0");

                if (hidden) {
                    const hVal = hidden.value;
                    if ((!isNaN(parseInt(hVal, 10)) && parseInt(hVal, 10) + (hasZero ? 1 : 0) === defaultMonthNum) || (localizedDefaultMonthLower && hVal.toLowerCase() === localizedDefaultMonthLower)) return;
                }

                const display = dropdown.querySelector("span");
                if (display) display.click();

                setTimeout(() => {
                    for (let i = 0, len = options.length; i < len; ++i) {
                        const opt = options[i];
                        const oVal = (opt.getAttribute("data-value") || opt.innerText || "").trim();
                        const oValLower = oVal.toLowerCase();
                        const numOVal = parseInt(oVal, 10);

                        if (!isNaN(numOVal) && numOVal + (hasZero ? 1 : 0) === defaultMonthNum) {
                            opt.click();
                            return;
                        }
                        if (localizedDefaultMonthLower && oValLower === localizedDefaultMonthLower) {
                            opt.click();
                            return;
                        }
                    }
                }, 300);
            } else {
                if (hidden && hidden.value === desiredVal) return;
                const display = dropdown.querySelector("span");
                if (display) display.click();
                setTimeout(() => {
                    const options = dropdown.querySelectorAll("ul li a");
                    for (let i = 0, len = options.length; i < len; ++i) {
                        const opt = options[i];
                        if ((opt.getAttribute("data-value") || opt.innerText || "").trim() === desiredVal) {
                            opt.click();
                            return;
                        }
                    }
                }, 300);
            }
        });
    };

    // Main function to initiate the auto-fill process
    const autoFillAgeFields = () => {
        processStandard();
        processCustom();
    };

    // Debounce function to limit the rate at which a function can fire
    const debounce = (func, wait) => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    };

    // Function to run the auto-fill process and observe DOM changes
    const run = () => {
        autoFillAgeFields();
        const debouncedFill = debounce(autoFillAgeFields, 500);
        new MutationObserver(debouncedFill).observe(document.body, { childList: true, subtree: true });
    };

    // Run the script when the DOM is fully loaded or immediately if it's already loaded
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
