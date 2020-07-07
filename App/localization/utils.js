import cache from "./cache";

export default function(language, key) {
  let alanguage = language ? language : cache.getLanguage();
  let localizationJSON = {};
  switch (alanguage) {
    case "zh_hans": // 简体中文
      localizationJSON = require("./localization_zh_cn.json");
      break;
    case "zh_hant": // 繁体中文
      localizationJSON = require("./localization_zh_tw.json");
      break;
    case "ja": // 日文
      localizationJSON = require("./localization_ja_jp.json");
      break;
    case "ko": // 韩文
      localizationJSON = require("./localization_ko_kr.json");
      break;
    default:
      // 英文
      localizationJSON = require("./localization_en.json");
      break;
  }
  return localizationJSON[key] || key || "";
}
