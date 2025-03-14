import './registration.scss';
import '../../styles/components/_button.scss';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
	const dispatch = useDispatch();
	const { error, isLoading } = useSelector((state) => state.auth);
	
	const [state, setState] = useState({
		email: '',
		password: '',
		name: '',
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!state.name || !state.email || !state.password) {
			toast.error('All fields are required!');
			return;
		}

		dispatch(register(state));
	};

	const handleChange = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};


	return (
		<div className='signup-form'>
			<div className='signup-form__wrapper'>
				<form className='form' onSubmit={handleSubmit}>
					<h4>Sign up</h4>

					<div className='form-group'>
						<input
							type='text'
							placeholder='Enter Name'
							name='name'
							value={state.name}
							onChange={handleChange}
						/>
					</div>
					<div className='form-group'>
						<input
							type='email'
							name='email'
							value={state.email}
							placeholder='Enter Email'
							onChange={handleChange}
						/>
					</div>
					<div className='form-group'>
						<input
							type='password'
							name='password'
							value={state.password}
							placeholder='Enter Password'
							onChange={handleChange}
						/>
					</div>
					<div className='form-group'>
						<button className='button' disabled={isLoading}>
							{isLoading ? 'Signing Up...' : 'Sign Up'}
						</button>
					</div>
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

export default Signup;
