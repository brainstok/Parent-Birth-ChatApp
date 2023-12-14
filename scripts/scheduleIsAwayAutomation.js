const Cron = require("croner");
const moment = require("moment");
const { handleIsAwaySetting } = require("../controllers/settings");

module.exports.scheduleIsAwayAutomation = (pattern, isAway) => {
  console.log(`Schedule isAway automation: ${isAway}`);

  Cron(
    pattern,
    {
      timezone: process.env.CRON_JOB_TIMEZONE,
    },
    () => {
      // Check if the app is being turned on
      if (!isAway) {
        // Check if its a weekend day
        const weekday = moment().format("dddd"); // Monday ... Sunday
        const isWeekend = weekday === "Sunday" || weekday === "Saturday";
        if (isWeekend) {
          // Return if weekend (do not turn on )
          return;
        } else {
          // Turn on if weekday
          handleIsAwaySetting({ isAway });
        }
      } else {
        handleIsAwaySetting({ isAway });
      }
    }
  );
};
