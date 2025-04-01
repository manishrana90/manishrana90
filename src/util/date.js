export function getFormatedDate(date) {
  return date.toISOString().slice(0, 10);
}

export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}

export function msToTime(duration) {
  var res = duration.split('-');
  var resnext = parseInt(res[0]) + 30 * 60;
  var hous = new Date(res[0] * 1000).getHours();
  var mins = new Date(res[0] * 1000).getMinutes();

  var ampm;
  var housdate;
  var minsdate;
  housdate = 0;
  if (mins == 0) {
    minsdate = '00';
  } else {
    minsdate = mins;
  }

  var housend = new Date(resnext * 1000).getHours();
  var minend = new Date(resnext * 1000).getMinutes();

  var ampmend;
  var housdateend;
  var minsdateend;

  if (minend == 0) {
    minsdateend = '00';
  } else {
    minsdateend = minend;
  }

  if (housend == 0) {
    ampmend = 'Am';
    housdateend = '00';
  } else if (housend < 12) {
    ampmend = 'Am';
    housdateend = housend;
  } else {
    ampmend = 'Pm';

    if (housend > 12) {
      housdateend = housend - 12;
    } else {
      housdateend = housend;
    }
  }

  if (hous == 0) {
    ampm = 'Am';
    housdate = '00';
  } else if (hous < 12) {
    ampm = 'Am';
    housdate = hous;
  } else {
    ampm = 'Pm';
    housdate = hous;
  }

  if (housdate > 12) {
    housdate = housdate - 12;
  }
  return (
    housdate +
    ':' +
    minsdate +
    ' ' +
    ampm +
    ' - ' +
    housdateend +
    ':' +
    minsdateend +
    ' ' +
    ampmend
  );
}
