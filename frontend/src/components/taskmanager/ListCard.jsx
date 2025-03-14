/* eslint-disable react/prop-types */
import './listcard.scss';
import { BiChevronLeft, BiChevronRight, BiTrash, BiEdit } from 'react-icons/bi';
import { arrowClick, deleteItem, updateTask } from '../../redux/taskSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
const ListCard = ({ item, token }) => {
	const dispatch = useDispatch();
	const [showPopup, setShowPopup] = useState(false);
	const [editedTask, setEditedTask] = useState(item.title);

	const ArrowClick = (direction) => {
		dispatch(arrowClick(item, direction, token));
	};

	const handleDelete = () => {
		dispatch(deleteItem(item.id, token));
	};

	// Open Edit Modal
	const handleEdit = () => {
		setShowPopup(true);
	};

	// Save Edited Task
	const handleSave = () => {
		dispatch(updateTask(item, editedTask, token));
		setShowPopup(false);
	};

	return (
		<div>
			<ul className={` ${item.status === 'DONE' ? 'completed menu' : 'menu'}`}>
				<li><p>{item.id}</p></li>
				<li><p>{item.title}</p></li>
				<li><p>{item.status}</p></li>
				<li>
					<button disabled={item.status === 'TODO'} onClick={() => ArrowClick('left')}>
						<BiChevronLeft />
					</button>
					<button disabled={item.status === 'DONE'} onClick={() => ArrowClick('right')}>
						<BiChevronRight />
					</button>
					<button onClick={handleEdit}><BiEdit /></button>
					<button onClick={handleDelete}><BiTrash /></button>
				</li>
			</ul>

			{/* Edit Popup Modal */}
			{showPopup && (
				<div className="modal-overlay">
					<div className="modal">
						<h3>Edit Task</h3>
						<input
							type="text"
							value={editedTask}
							onChange={(e) => setEditedTask(e.target.value)}
							className="modal-input"
						/>
						<div className="modal-buttons">
							<button className="save-btn" onClick={handleSave}>Save</button>
							<button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
						</div>
					</div>
				</div>
			)}
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

export default ListCard;
