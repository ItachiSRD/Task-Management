import './header.scss';
import '../../styles/components/_button.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutSuccess, logout } from '../../redux/authSlice';
import history from '../../history';

const Header = () => {
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => ({ ...state }));

	const handleClick = async (e) => {
		e.preventDefault();
		dispatch(logout());
	};
	return (
		<div>
			<nav className='header'>
				<div className='header__logo'>
					<h5>Task Manager</h5>
				</div>
				<div className='header__buttons'>
					{auth.currentUser && auth.currentUser.tokens ? (
						<Link to='/signin' className='button' onClick={handleClick}>
							SignOut
						</Link>
					) : (
						<>
							<Link to='/signin' className='button'>
								SignIn
							</Link>
							<Link to='/signup' className='button'>
								SignUp
							</Link>
						</>
					)}
				</div>
			</nav>
		</div>
	);
};

export default Header;
