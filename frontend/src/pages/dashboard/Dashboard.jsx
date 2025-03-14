import Sidebar from '../../components/sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './dashboard.scss';
import { useEffect } from 'react';
import { getAllTasks } from '../../redux/taskSlice';
const Dashboard = () => {
	const tasklist = useSelector((state) => state.task);
	const { allTasks } = tasklist;
	const user = useSelector((state) => state.auth);
	const { currentUser } = user;
	
	let pendingTask = [];
	let completedTask = [];
	for (let i = 0; i < (allTasks ? allTasks.length : 0); i++) {
		if (allTasks[i].status === 'TODO') {
			pendingTask.push(allTasks[i]);
		} else if (allTasks[i].status === 'DONE') {
			completedTask.push(allTasks[i]);
		}
	}
	
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getAllTasks(currentUser.tokens.access.token));
	}, [dispatch, currentUser.tokens.access.token, currentUser.id]);

	return (
		<div>
			<div className='dashboard'>
				<div className='dashboard__left'>
					<Sidebar />
				</div>
				<div className='dashboard__right'>
					<div className='dashboard__rightContent'>
						<h2>Task Status Dashboard</h2>
						<div className='taskcount'>
							<div className='todo box'>Todo - {pendingTask.length}</div>
							<div className='done box'>Complete - {completedTask.length}</div>
						</div>
						<div className='createButton'>
							<Link to='/taskmanager' className='button'>
								Manage Tasks
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
