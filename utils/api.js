import { AsyncStorage } from "react-native";
import { CALENDAR_STORAGE_KEY, formatCalendarResults } from "./_calendar";

export function submitEntry({ entry, key }) {
  return AsyncStorage.mergeItem(
    CALENDAR_STORAGE_KEY,
    JSON.stringify({
      [key]: entry
    })
  );
}

export function fetchCalendarResults(force = false) {
  return new Promise((resolve, reject) => {
    if (force) {
      return AsyncStorage.clear();
    }
    return resolve();
  })
    .then(() => AsyncStorage.getItem(CALENDAR_STORAGE_KEY))
    .then(formatCalendarResults);
}
export function removeEntry(key) {
  return AsyncStorage.getItem(CALENDAR_STORAGE_KEY).then(results => {
    const data = JSON.parse(results);
    data[key] = undefined;
    delete data[key];
    return AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
  });
}
