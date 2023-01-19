import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import NotesList from './components/NotesList';
import Logo from './assets/logo_gris.png'

function App() {
  const [counterMinutes, setCounterMinutes] = useState(25);
  const [counterSeconds, setCounterSeconds] = useState(0);
  const [typeOfCounter, setTypeOfCounter] = useState({ pomodoro: true, shortBreak: false, longBreak: false });
  const [pomodoroCounter, setPomodoroCounter] = useState(0);
  const [activated, setActivated] = useState(false);
  const [counterPaused, setCounterPaused] = useState({minutes: 25, seconds: 0, paused: true, interval: -1});
  const [newDescription, setNewDescription] = useState("");
  const [tasks, setTasks] = useState([]);

  let ids = [];

  useEffect(() => {
    if (activated) {
      setCounterPaused({...counterPaused, paused: false})

      const interval = setInterval(() => setCounterSeconds(counterSeconds - 1), 1000);
      setCounterPaused({...counterPaused, interval: interval});
      let numberOfPomodoros = pomodoroCounter;
      let isActivated = activated;
      let minutes = 0;
      let seconds = 0;
      let type = typeOfCounter;

      if ((typeOfCounter.pomodoro) && (counterMinutes == 0) && (counterSeconds == 0)) {
        clearInterval(interval);
        isActivated = false;
        numberOfPomodoros++;
        setCounterPaused({...counterPaused, paused: true});
        Swal.fire({
          title: '¿Descansamos?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Aceptar',
          denyButtonText: `Cancelar`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if ((result.isConfirmed) && (numberOfPomodoros % 4 == 0)) {
            type.pomodoro = false;
            type.longBreak = true;
            type.shortBreak = false;

            minutes = 15;
            seconds = 0;
          } else if (result.isConfirmed) {
            type.pomodoro = false;
            type.longBreak = false;
            type.shortBreak = true;

            minutes = 5;
            seconds = 0;
          } else {
            type.pomodoro = true;
            type.longBreak = false;
            type.shortBreak = false;

            minutes = 25;
            seconds = 0;
          }
        })
      } else if ((typeOfCounter.shortBreak || typeOfCounter.longBreak) && (counterMinutes == 0) && (counterSeconds == 0)) {
        Swal.fire('¡Se acabó el descanso!')
        clearInterval(interval);
        isActivated = false;
        type.pomodoro = true;
        type.shortBreak = false;
        type.longBreak = false;
      } else if (counterSeconds == 0) {
        seconds = 59;
        minutes = counterMinutes - 1;
      }

      setPomodoroCounter(numberOfPomodoros);
      if (!isActivated) {
        setActivated(isActivated);
      }

      if (minutes != 0) {
      }

      if (seconds != 0) {
        setCounterMinutes(minutes);
        setCounterSeconds(seconds);
      }

      setTypeOfCounter(type);
      return () => clearInterval(interval);
    }

  }, [activated, counterSeconds]);

  const handleSetPomodoro = () => {
    setActivated(true);
    const { pomodoro, shortBreak, longBreak } = typeOfCounter;
    
    let minutes = 0;
    let seconds = 0;
    if(typeOfCounter.pomodoro && counterPaused.paused) {
      minutes = counterPaused.minutes;
      seconds = counterPaused.seconds;
      setCounterPaused({...counterPaused, paused: false})
    } else {
      if (pomodoro) {
        seconds = 59;
        minutes = 24;
      } else if (shortBreak) {
        seconds = 59;
        minutes = 4;
      } else if (longBreak) {
        seconds = 59;
        minutes = 14;
      }
    }
    
    setCounterSeconds(seconds);
    setCounterMinutes(minutes);
  }

  const handleSetCounterPaused = () => {
    setCounterPaused({...counterPaused, minutes: counterMinutes, seconds: counterSeconds, paused: true});
    console.log(counterPaused);
    clearInterval(counterPaused.interval);
    setActivated(false);
  }

  const handleSetNewDescription = (event) => {
    let description = event.target.value;
    setNewDescription(description);
  }

  const handleSetTasks = (event) => {
    event.preventDefault();

    if(newDescription.trim() != "") {
      let tasksCopy = [...tasks];
      let id = generateId()
      let task = {
        id: id,
        description: newDescription,
        completed: false
      }
      tasksCopy.push(task);
      setTasks(tasksCopy);
      console.log(tasks);
    }
  }

  const generateId = () => {
    do {
      let randomNumber = Math.floor(Math.random(1) * 9999999);
      if(!ids.includes(randomNumber)) {
        ids.push(randomNumber);
        return randomNumber;
      }
    } while(ids.includes(randomNumber));
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row" id='header'>
          <div className="col-12 col-lg-12 mt-3 mb-3" id='tittle'>
            <h2 className='ms-3'>Valki Pomodoro App</h2>
          </div>
        </div>
        <div className="row" id='counter'>
          <div className="col-12 col-lg-12 mt-4 mb-4 d-flex justify-content-center">
            <div className='d-flex flex-column' id='border'>
              <h1 className='text-center'>{(counterMinutes < 10) ? `0${counterMinutes}` : counterMinutes}:{counterSeconds < 10 ? `0${counterSeconds}` : counterSeconds}</h1>
              <p className='text-center'>Pomodoros: {pomodoroCounter}</p>
                {counterPaused.paused ? <button className='btn btn-danger mt-3' onClick={handleSetPomodoro} id="btnStart">Iniciar</button> : <button className='btn btn-danger mt-3' onClick={handleSetCounterPaused} id="btnStart">Pausar</button>}
                {/* <button className='btn btn-danger mt-3' onClick={handleSetPomodoro} id="btnStart">Iniciar</button> */}
            </div>
          </div>
        </div>

        <div className="row" id='search'>
          <div className="col-12 col-lg-12 mt-5 d-flex justify-content-center">
            <div className='d-flex'>
              <div className="input-group">
                <form className='form d-flex justify-content-center'>
                  <input type="text" className="form-control" placeholder="Añadir una tarea..." aria-label="Añadir una tarea..." aria-describedby="btnAddTask" value={newDescription} onChange={handleSetNewDescription} />
                  <button className="btn btn-danger" type="submit" id="btnAddTask" onClick={handleSetTasks} ><b>+</b></button>
                </form>
              </div>
            </div>
          </div>
          <div className="container mt-3 mb-5 d-flex flex-column">
            <NotesList tasks={tasks} setTasks={setTasks}></NotesList>
          </div>
        </div>

        <div className="row" id='footer'>
            <div className="col-12 col-lg-12 mt-2 d-flex justify-content-center">
              <div className='d-flex flex-column'>
                <a href="https://github.com/Valki-dev">
                  <img src={Logo} alt="Logo no disponible" width={80}/>
                  <p className='text-center'>Valki_dev</p>
                </a>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default App;
