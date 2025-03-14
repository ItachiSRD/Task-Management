import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTasks } from '../../redux/taskSlice';
import ListCard from './ListCard';
import './tasklist.scss';

const TaskList = () => {
	const auth = useSelector((state) => state.auth);
	const tasks = useSelector((state) => state.task);

	const { currentUser } = auth;
	const { allTasks } = tasks;

	const dispatch = useDispatch();
	
	useEffect(() => {
		dispatch(getAllTasks(currentUser.tokens.access.token));
		
	}, [dispatch, currentUser.tokens, currentUser.id]);
	
	return (
		<div>
			<ul className='list-header'>
				<li>
					<h5>Id</h5>
				</li>
				<li>
					<h5>Issue Name</h5>
				</li>
				<li>
					<h5>Status</h5>
				</li>
				<li>
					<h5>Action</h5>
				</li>
			</ul>
			{(allTasks !== undefined ) ? (
		Object.values(allTasks).map((item) => (
			<ListCard key={item.id} item={item} token={currentUser.tokens.access.token}/>
		))
	) : (
		<></>
	)}
		</div>
	);
};

export default TaskList;
