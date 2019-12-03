import { DateTime as LuxonDateTime } from "luxon";

export const locale = (dateTime: string, locale = "es-ES"): LuxonDateTime =>
  LuxonDateTime.fromISO(dateTime).setLocale(locale);

export const datetime = {
  locale,
};

export default datetime;
