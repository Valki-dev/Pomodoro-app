import { useRef } from 'react';
import './NotesList.css'


const NotesList = ({tasks, setTasks}) => {

    
    const strikeTask = (task) => {
        // let taskSelected = event.target;
        // taskSelected?.querySelector('.description').classList.toggle('strike');
        let taskIndex = tasks.findIndex(taskInArray => taskInArray.id == task.id);
        let taskFounded = tasks[taskIndex];
        let tasksCopy = [...tasks];
        taskFounded.completed = !taskFounded.completed;
        tasksCopy.splice(taskIndex, 1,taskFounded);
        console.log(tasksCopy);
        setTasks(tasksCopy)
    }

    const deleteTask = (task) => {
        let taskIndex = tasks.findIndex(taskInArray => taskInArray.id == task.id);
        let tasksCopy = [...tasks];
        tasksCopy.splice(taskIndex, 1);
        setTasks(tasksCopy);
    }

    return(
       <>
        {
            tasks.map((task) => {
                const {id, description, completed} = task;
                const classStrike = completed ? 'strike' : '';
                return(
                    <>
                        <div className="d-flex justify-content-center" key={id}>
                            <div className="col-12 col-lg-3 mt-3">
                                <div className="card" onClick={() => strikeTask(task)}>
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <span className={classStrike}>{description}</span>
                                        <button className='btn' onClick={() => deleteTask(task)}>X</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            })
        }
       </> 
    )
}

export default NotesList;