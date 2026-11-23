import dayjs from 'dayjs';
import timezone  from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);
export const logInfo = (name: string, input?: any, output?: any) => {
  if (
    typeof window !== "undefined" &&
    window.location.hostname.includes("localhost")
  ) {
    console.log(
      `${dayjs().tz('Asia/Bangkok').format(
        "DD/MM/YYYY HH:mm"
      )} - [${name}] || CLIENT || INFO || Input: ${JSON.stringify(
        input
      )} || Output: ${JSON.stringify(output)} \n`
    );
  } else {
    console.log(
      `${dayjs().tz('Asia/Bangkok').format(
        "DD/MM/YYYY HH:mm"
      )} - [${name}] || SERVER || INFO || Input: ${JSON.stringify(
        input
      )} || Output: ${JSON.stringify(output)} \n`
    );
  }
};
export const logError = (name: string, input?: any, output?: any) => {
  if (
    typeof window !== "undefined" &&
    window.location.hostname.includes("localhost")
  ) {
    console.log(
      `${dayjs().tz('Asia/Bangkok').format(
        "DD/MM/YYYY HH:mm"
      )} - [${name}] || CLIENT || ERROR || Input: ${JSON.stringify(
        input
      )}|| Output: ${JSON.stringify(output)} \n`
    );
  } else {
    console.log(
      `${dayjs().tz('Asia/Bangkok').format(
        "DD/MM/YYYY HH:mm"
      )} - [${name}] || SERVER || ERROR || Input: ${JSON.stringify(
        input
      )}|| Output: ${JSON.stringify(output)} \n`
    );
  }
};
