const moment = require("moment");

const calculateGetstation = (dueDate, dateOfBirth) => {
  if (dateOfBirth) {
    const mbabyBirthDate = moment(dateOfBirth);
    const mBabyDueDate = moment(dueDate);

    const diff = mbabyBirthDate.diff(mBabyDueDate, "days");

    return Math.round(diff / 7 + 40);
  } else {
    const currentDate = moment();

    let babyDate = dueDate;

    const mBabyDate = moment(babyDate);

    const diff = mBabyDate.diff(currentDate, "days");

    let value = diff <= 0 ? 0 : diff;

    const weeksGestation = Math.floor(
      Math.round(((280 - value) / 7) * 10) / 10
    );

    return weeksGestation >= 0 ? weeksGestation : 0;
  }
};

module.exports = calculateGetstation;
