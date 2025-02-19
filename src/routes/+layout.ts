export const prerender = false;
export const ssr = false;

import type { LayoutLoad } from "./$types";

import "../common.scss";
import "../light.scss";
import "../dark.scss";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime, {
  thresholds: [
    { l: "s", r: 1 },
    { l: "m", r: 1 },
    { l: "mm", r: 59, d: "minute" },
    { l: "h", r: 1 },
    { l: "hh", r: 23, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 29, d: "day" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y", r: 1 },
    { l: "yy", d: "year" }
  ]
});

import Handlebars from "handlebars";
import helpers from "$lib/template_helpers";
import * as toast from "bulma-toast";
import _ from "lodash";
import { ajax } from "$lib/utils";

import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/en";

Handlebars.registerHelper(
  _.mapValues(helpers, (helper, name) => {
    return function (...args: any[]) {
      try {
        return helper.apply(this, args);
      } catch (e) {
        console.log("Error in helper", name, args, e);
      }
    };
  })
);

toast.setDefaults({
  position: "bottom-right",
  dismissible: true,
  pauseOnHover: true,
  extraClasses: "is-light"
});

export const load = (async () => {
  globalThis.USER_CONFIG = await ajax("/api/config");
  return {};
}) satisfies LayoutLoad;
