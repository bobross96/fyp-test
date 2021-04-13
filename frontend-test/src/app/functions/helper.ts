

export function getIconColour(name){

  let colourArray = ['#FA8072','#FF6347','#FFFF00',
                     '#9932CC','#7B68EE','#32CD32',
                     '#6B8E23','#008B8B','#00CED1',
                     '#D2B48C', '#7B68EE' ]
  let nameNumber = (name[0].toLowerCase().charCodeAt(0) - 97 + 1).toString()
  if (nameNumber[1]){
    return colourArray[parseInt(nameNumber[0]) + parseInt(nameNumber[1])]
  }
  else {
    return colourArray[parseInt(nameNumber[0])]
  }
  
}




export function Week(arg) {
    if (!arg.num || arg.num < 0 || arg.num > 14) {
      arg.text = '';
    } else if (arg.num == 8) {
      arg.text = 'Recess Week';
    } else if (arg.num > 8) {
      arg.text = `Sem 1 Week ${arg.num - 1}`;
    }
  }
export function getSchoolWeek(currentDate,sem1Start,sem2Start) {
    //console.log('helper running');
    
    let startDateSem2 = new Date('1/11/2021');
    let startDateSem1 = new Date('8/10/2020');
    let nowDate = new Date(currentDate)
    let startDate = startDateSem1
    if (nowDate.getTime() >= startDateSem2.getTime()){
      startDate = startDateSem2
    }
    let intNumber =
      Math.ceil(
        (nowDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7)
      ) + 1;

      return intNumber

    
  }

export function getWeekForTasks(dueDate,sem1Start,sem2Start){
  let startDateSem2 = new Date('1/11/2021');
  let startDateSem1 = new Date('8/10/2020');
  let nowDate = new Date(dueDate)
  let startDate = startDateSem1
  if (nowDate.getTime() >= startDateSem2.getTime()){
    startDate = startDateSem2
  }
  let intNumber =
    Math.ceil(
      (nowDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7)
    );

  if (intNumber == 8){
    return 'Recess Week'
  }

  else if (intNumber > 8){
    return (intNumber -1)
  }
  else {
    return intNumber
  }
}

export function whichSem(currentDate){
  let startDateSem2 = new Date('1/11/2021');
  let startDateSem1 = new Date('8/10/2020');
  if (currentDate.getTime() > startDateSem2.getTime()){
    return "2"
  }
  else return "1"
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
    case 'Final Report':
            color = '#4285f4';
            break;
          case 'Interim Report':
            color = '#3f51b5';
            break;
          case 'Meeting Notes':
            color = '#66cc91';
            break;
          default:
            break;
  }

  //if due date is passed 
  let dueDate = new Date(task.task_due_date)
  let nowDate = new Date()
  if (task.status == 'Pending' && dueDate.getTime() < nowDate.getTime()){
    
    
    color = "red"
  }
  

  if (!task.title) {
    task.title = task.task_type;
  }

  //if date is on the day itself, add red border?

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





