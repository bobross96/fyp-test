export function Week(arg) {
    if (!arg.num || arg.num < 0 || arg.num > 14) {
      arg.text = '';
    } else if (arg.num == 8) {
      arg.text = 'Recess Week';
    } else if (arg.num > 8) {
      arg.text = `Sem 1 Week ${arg.num - 1}`;
    }
  }
export function getSchoolWeek(currentDate) {
    let startDate = new Date('8/11/2020');
    let nowDate = new Date(currentDate)
    let intNumber =
      Math.ceil(
        (nowDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7)
      ) + 1;

    return 'Week ' + intNumber;
  }

export function dateConverter(date,hour,minute){
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  let newStartDate = new Date(year,month,day,hour,minute)
  return newStartDate
}