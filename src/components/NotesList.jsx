import { useRef } from 'react';
import './NotesList.css'


const NotesList = ({tasks, setTasks}) => {

    
    const strikeTask = (event) => {
        let taskSelected = event.target;
        taskSelected?.querySelector('.description').classList.toggle('strike');
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
                const {id, description} = task;
                return(
                    <>
                        <div className="d-flex justify-content-center">
                            <div className="col-12 col-lg-3 mt-3">
                                <div className="card" onClick={() => strikeTask(event)} key={id}>
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <span className='description'>{description}</span>
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