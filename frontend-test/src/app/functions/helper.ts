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

export function singleTaskToEvent(task,calendarApi,createEventId){
  let color = '#3788d8';
  switch (task.task_type) {
    case 'final':
            color = 'red';
            break;
          case 'completed':
            color = 'green';
            break;
          case 'Meeting Notes':
            color = '#66cc91';
            break;
          default:
            break;
  }

  if (!task.title) {
    task.title = task.task_type;
  }

  if (task.start_date && task.end_date) {
    calendarApi.addEvent({
      id: task.id,
      title: task.title,
      start: task.start_date,
      end: task.end_date,
      db_id: task.id,
      color: color,
      allDay: false,
    });
  } else {
    calendarApi.addEvent({
      id: task.id,
      title: task.title,
      start: task.task_due_date,
      db_id: task.id,
      color: color,
      allDay: true,
    });
  }



  




}





