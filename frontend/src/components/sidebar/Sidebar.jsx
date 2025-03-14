import './Sidebar.scss';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	const { auth } = useSelector((state) => ({ ...state }));
	const { currentUser } = auth;
	
	return (
		<div className='sidebar-container'>
			<ul className='sidebar'>
				<li className='list-item'>
					<h5>{currentUser.user.name}</h5>
				</li>
				<li className='list-item'>
					<Link to='/dashboard'>Dashboard</Link>
				</li>
				<li className='list-item'>
					<Link to='/settings'>Settings</Link>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
