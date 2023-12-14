const moment = require("moment");

const calculateWeeksPostpartum = (dateOfBirth) => {
  const currentDate = moment();
  const mDateOfBirth = moment(dateOfBirth);
  const weeksPostpartum =
    Math.round(currentDate.diff(mDateOfBirth, "weeks") * 10) / 10;

  return weeksPostpartum;
};

module.exports = calculateWeeksPostpartum;
