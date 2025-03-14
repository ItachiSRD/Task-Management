import { useState } from 'react';
import './addtask.scss';
import { addTask } from '../../redux/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
const AddTask = () => {
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => ({ ...state }));
	const { currentUser } = auth;
	const [state, setState] = useState({
		task: '',
	});
	
	const handleChange = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(addTask(state.task, currentUser.tokens.access.token));
		setState({
			task: '',
		});
	};

	return (
		<div>
			<div className='addtask'>
				<form action='' onSubmit={handleSubmit}>
					<input
						type='text'
						name='task'
						placeholder='add your task'
						onChange={handleChange}
						value={state.task}
					/>
					<button className='button'>Add Task</button>
				</form>
			</div>
			<ToastContainer 
				position="top-right" 
				autoClose={2000} 
				hideProgressBar={false} 
				newestOnTop={false} 
				closeOnClick 
				rtl={false} 
				pauseOnFocusLoss 
				draggable 
				pauseOnHover 
			/>
		</div>
	);
};

export default AddTask;
