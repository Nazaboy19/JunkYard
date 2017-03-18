 const getId = function(id) {
      return document.getElementById(id)
    }
    let hour = getId('hour'),
        min = getId('min'),
        sec = getId('sec'),
        start = getId('start'),
        pause = getId('pause'),
        stop = getId('stop'),
        counterSec = 0,
        counterMin = 0,
        counterHour = 0;

function startInt() {
  counterSec += 1
  if (counterSec < 10) {
    return sec.innerHTML = '0'+ counterSec;
  }else if(counterSec > 59){
    counterSec = 0;
    counterMin += 1;
    sec.innerHTML = '0'+ counterSec;
    if(counterMin < 10) {
      min.innerHTML = '0'+ counterMin;
    }else if(counterMin > 59){
      counterSec = 0;
      counterMin = 0;
      counterHour += 1;
      sec.innerHTML = '0'+ counterSec;
      min.innerHTML = '0'+ counterMin;
      if (counterHour < 10) {
        hour.innerHTML = '0'+ counterHour;
      }else if(counterHour > 23) {
        counterSec = 0;
        counterMin = 0;
        counterHour = 0;
        hour.innerHTML = '0'+ counterHour;
        sec.innerHTML = '0'+ counterSec;
        min.innerHTML = '0'+ counterMin;
      }else {
         hour.innerHTML = counterHour;
      }
    }
    else{
       min.innerHTML = counterMin;
    }
  }else {
     sec.innerHTML = counterSec;
  } 
}

let timer;

start.onclick = () => {timer = setInterval(startInt, 1000)};
pause.onclick = () => {clearInterval(timer)};
stop.onclick = () => {clearInterval(timer);
                      counterSec = 0;
                      counterMin = 0;
                      counterHour = 0;
                      hour.innerHTML = '0'+ counterHour;
                      sec.innerHTML = '0'+ counterSec;
                      min.innerHTML = '0'+ counterMin;
                      };