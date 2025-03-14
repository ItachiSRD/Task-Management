import { createSlice } from '@reduxjs/toolkit';
import {API} from '../utils/AxiosInstance';
import { toast } from 'react-toastify';


const initalTask = localStorage.getItem('task')
	? JSON.parse(localStorage.getItem('task'))
	: null;

const initialState = {
	taskData: initalTask,
	allTasks: {},
};

export const taskSlice = createSlice({
	name: 'task',
	initialState,
	reducers: {
		startLoading: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		taskAddedSuccessfully: (state, action) => {
			state.taskData = action.payload;
			state.isLoading = false;
			toast.success('Task added successfully');
		},
		taskAddFailure: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			toast.error(action.payload);
		},
		getAllTaskSuccess: (state, action) => {
			state.allTasks = action.payload;
			state.isLoading = false;
		},
		getAllTaskFailure: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			toast.error(action.payload);
		},
		editTaskSuccess: (state, action) => {
			state.taskData = action.payload;
			state.isLoading = false;
			toast.success('Task updated successfully');
		},
		editTaskFailure: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			toast.error(action.payload);
		},
		deleteSuccess: (state) => {
			state.isLoading = false;
			toast.success('Task deleted successfully');
		},
		deletefail: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			toast.error(action.payload);
		},
	},
});

export const {
	startLoading,
	taskAddedSuccessfully,
	taskAddFailure,
	getAllTaskSuccess,
	getAllTaskFailure,
	editTaskSuccess,
	editTaskFailure,
	deleteSuccess,
	deletefail,
} = taskSlice.actions;

export default taskSlice.reducer;

// **Add Task**
export const addTask = (taskData, token) => async (dispatch) => {
	try {
		dispatch(startLoading());
		const taskDataJson = {
			title: taskData,
			description: "Sometask",
			status: "TODO",
		};
		  
		
		const response = await API.post(`/tasks`, taskDataJson, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		dispatch(taskAddedSuccessfully(response.data));
		dispatch(getAllTasks(token));
	} catch (error) {
		dispatch(taskAddFailure(error.response?.data?.message || 'Failed to add task'));
	}
};

// **Get All Tasks**
export const getAllTasks = (token) => async (dispatch) => {
	try {
		dispatch(startLoading());
		const response = await API.get(`/tasks`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		dispatch(getAllTaskSuccess(response.data));
	} catch (error) {
		dispatch(getAllTaskFailure(error.response?.data?.message || 'Failed to fetch tasks'));
	}
};

// **Update Task Status**
export const updateTask = (item, updatedData, token) => async (dispatch) => {
	try {
		dispatch(startLoading());
		let taskData = {
			title: updatedData,
			description: item.description,
			status: item.status,
		};
		const response = await API.put(`/tasks/${item.id}`, taskData, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		dispatch(editTaskSuccess(response.data));
		dispatch(getAllTasks(token));
	} catch (error) {
		dispatch(editTaskFailure(error.response?.data?.message || 'Failed to update task'));
	}
};

// **Delete Task**
export const deleteItem = (taskId, token) => async (dispatch) => {
	try {
		dispatch(startLoading());

		await API.delete(`/tasks/${taskId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		dispatch(deleteSuccess());
		dispatch(getAllTasks(token));
	} catch (error) {
		dispatch(deletefail(error.response?.data?.message || 'Failed to delete task'));
	}
};

export const arrowClick = (item, string, token) => async () => {
	let taskData = {
		title: item.title,
		description: item.description,
		status: (string==="left")?"TODO":"DONE",
	};

	try {
		let response = await API.put(
			`/tasks/${item.id}`,
			taskData,
			{
				headers: {
				Authorization: `Bearer ${token}`,
			}
		}
		);

		if (response) {
			window.location.reload();
		}
	} catch (error) {
		console.log(error);
	}
};