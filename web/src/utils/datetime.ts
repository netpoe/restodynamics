import { DateTime as LuxonDateTime } from "luxon";

export const locale = (dateTime: string | Date | null | undefined, locale = "es-ES"): LuxonDateTime => {
  const dateFrom =
    typeof dateTime === "string"
      ? LuxonDateTime.fromISO(dateTime)
      : (dateTime === null || dateTime === undefined)
      ? LuxonDateTime.fromJSDate(new Date())
      : LuxonDateTime.fromJSDate(dateTime);
  return dateFrom.setLocale(locale);
};

export const datetime = {
  locale,
};

export default datetime;
