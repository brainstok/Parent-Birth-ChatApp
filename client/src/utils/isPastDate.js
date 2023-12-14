import moment from 'moment';

const isPastDate = (date) => {
  if (date) {
    const givenDate = moment(new Date(date));
    const today = moment(new Date());
    const result = givenDate.isBefore(today, 'days');
    return result;
  }
};

export default isPastDate;
