(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["censor-sensor"] = factory();
	else
		root["censor-sensor"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const locales_1 = __webpack_require__(2);
var CensorTier;
(function (CensorTier) {
    CensorTier[CensorTier["Slurs"] = 1] = "Slurs";
    CensorTier[CensorTier["CommonProfanity"] = 2] = "CommonProfanity";
    CensorTier[CensorTier["SexualTerms"] = 3] = "SexualTerms";
    CensorTier[CensorTier["PossiblyOffensive"] = 4] = "PossiblyOffensive";
    CensorTier[CensorTier["UserAdded"] = 5] = "UserAdded";
})(CensorTier = exports.CensorTier || (exports.CensorTier = {}));
class CensorSensor {
    constructor() {
        this.locale = 'en';
        this.blackList = {};
        this.customDictionary = {};
        this.enabledTiers = {
            1: true,
            2: true,
            3: true,
            4: true,
            5: true
        };
        this.defaultCleanFunction = (str) => '****';
    }
    get currentDictionary() {
        return Object.assign({}, locales_1.AllLocales[this.locale], this.customDictionary);
    }
    get cleanFunction() {
        return this.customCleanFunction || this.defaultCleanFunction;
    }
    // locale functions
    addLocale(newLocale, dict) {
        locales_1.AllLocales[newLocale] = dict;
    }
    setLocale(locale) {
        this.locale = locale;
    }
    // tier functions
    disableTier(tier) {
        this.enabledTiers[tier] = false;
    }
    enableTier(tier) {
        this.enabledTiers[tier] = true;
    }
    // custom dict add/removal functions
    addWord(word, tier = CensorTier.UserAdded) {
        this.customDictionary[word] = tier;
        delete this.blackList[word];
    }
    removeWord(word) {
        delete this.customDictionary[word];
        this.blackList[word] = true;
    }
    // general phrase functions
    prepareForParsing(phrase) {
        return phrase.toLowerCase();
    }
    // profanity checking functions
    _isProfane(word, dict) {
        if (this.blackList[word])
            return false;
        const wordTier = dict[word];
        if (!wordTier)
            return false;
        if (!this.enabledTiers[wordTier])
            return false;
        return true;
    }
    isProfane(phrase) {
        const dict = this.currentDictionary;
        return this.prepareForParsing(phrase).split(' ').some(word => this._isProfane(word, dict));
    }
    _isProfaneIsh(phrase, dict) {
        let isAnyMatch = false;
        Object.keys(dict).forEach(dictWord => {
            if (isAnyMatch)
                return;
            if (this.blackList[dictWord])
                return;
            const tier = dict[dictWord];
            if (phrase.indexOf(dictWord) !== -1 && this.enabledTiers[tier])
                isAnyMatch = true;
        });
        return isAnyMatch;
    }
    isProfaneIsh(phrase) {
        const dict = this.currentDictionary;
        return this._isProfaneIsh(this.prepareForParsing(phrase), dict);
    }
    _profaneIshWords(phrase, dict) {
        const foundProfanity = [];
        Object.keys(dict).forEach(dictWord => {
            if (this.blackList[dictWord])
                return;
            const tier = dict[dictWord];
            if (phrase.indexOf(dictWord) !== -1 && this.enabledTiers[tier]) {
                foundProfanity.push(dictWord);
                foundProfanity.push(tier);
            }
        });
        return foundProfanity;
    }
    profaneIshWords(phrase) {
        const dict = this.currentDictionary;
        return this._profaneIshWords(phrase, dict);
    }
    setCleanFunction(func) {
        this.customCleanFunction = func;
    }
    resetCleanFunction() {
        this.setCleanFunction(null);
    }
    // string cleanup functionality
    cleanProfanity(phrase) {
        const dict = this.currentDictionary;
        const cleanFunc = this.cleanFunction;
        const joinPhrase = phrase.split(' ').map(word => {
            if (!this._isProfane(word.toLowerCase(), dict))
                return word;
            return cleanFunc(word);
        }).join(' ');
        return joinPhrase;
    }
    cleanProfanityIsh(phrase) {
        const cleanFunc = this.cleanFunction;
        const comparePhrase = this.prepareForParsing(phrase);
        const allProfanity = this.profaneIshWords(comparePhrase);
        allProfanity.forEach(word => {
            const regex = new RegExp(word, 'gi');
            phrase = phrase.replace(regex, cleanFunc(word));
        });
        return phrase;
    }
}
exports.CensorSensor = CensorSensor;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const en = __webpack_require__(3);
exports.AllLocales = {
    en
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {"bollocks":4,"dingleberry":4,"dingleberries":4,"douche":4,"suck":4,"sucks":4,"anal":3,"anus":3,"bdsm":3,"bestiality":3,"blowjob":3,"bondage":3,"boner":3,"boobs":3,"boob":3,"bukkake":3,"bunghole":3,"butt":3,"circlejerk":3,"clit":3,"clitoris":3,"cocks":3,"cock":3,"creampie":3,"cum":3,"cumming":3,"deepthroat":3,"dick":3,"dildo":3,"dominatrix":3,"dommes":3,"domme":3,"ecchi":3,"ejaculation":3,"erotic":3,"fellatio":3,"femdom":3,"fetish":3,"fingerbang":3,"futanari":3,"genitals":3,"grope":3,"g-spot":3,"handjob":3,"hentai":3,"homoerotic":3,"humping":3,"incest":3,"intercourse":3,"jailbait":3,"jizz":3,"kinkster":3,"kinky":3,"masturbate":3,"masturbation":3,"milf":3,"nipples":3,"nipple":3,"nude":3,"nudity":3,"nympho":3,"nymphomaniac":3,"orgasm":3,"orgy":3,"pedobear":3,"pedophile":3,"paedophile":3,"panty":3,"panties":3,"pegging":3,"penis":3,"playboy":3,"poon":3,"porn":3,"pubes":3,"pussy":3,"queef":3,"queaf":3,"rape":3,"raping":3,"rapist":3,"rectum":3,"scat":3,"schlong":3,"semen":3,"sex":3,"sexy":3,"skeet":3,"sodomize":3,"sodomy":3,"spooge":3,"splooge":3,"spunk":3,"swinger":3,"threesome":3,"titties":3,"titty":3,"tits":3,"tit":3,"tosser":3,"tubgirl":3,"twat":3,"upskirt":3,"vagina":3,"vibrator":3,"voyeur":3,"vulva":3,"wank":3,"yaoi":3,"yuri":3,"arsehole":2,"arse":2,"asshole":2,"assface":2,"asshat":2,"ass":2,"bastards":2,"bastard":2,"bitching":2,"bitchin":2,"bitches":2,"bitch":2,"bullshit":2,"damnit":2,"damn":2,"fucktards":2,"fucktard":2,"fucking":2,"fuckers":2,"fucker":2,"fuck":2,"god damn":2,"goddamn":2,"hell":2,"motherfucker":2,"pissing":2,"pissed":2,"piss":2,"shitter":2,"shitty":2,"shit":2,"beaners":1,"beaner":1,"bimbo":1,"coon":1,"coons":1,"cunt":1,"cunts":1,"darkie":1,"darkies":1,"fag":1,"fags":1,"faggot":1,"faggots":1,"hooker":1,"kike":1,"kikes":1,"nazi":1,"nazis":1,"neonazi":1,"neonazis":1,"negro":1,"negros":1,"nigga":1,"niggas":1,"nigger":1,"niggers":1,"paki":1,"pakis":1,"raghead":1,"ragheads":1,"shemale":1,"shemales":1,"slut":1,"sluts":1,"spic":1,"spics":1,"swastika":1,"towelhead":1,"towelheads":1,"tranny":1,"trannys":1,"trannies":1,"twink":1,"twinks":1,"wetback":1,"wetbacks":1}

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map