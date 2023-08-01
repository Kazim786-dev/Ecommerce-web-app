import React from 'react'

const SidebarItem = ({ icon, text, isSelected, onItemClick }) => {
	return (
		<div
			className={`d-flex align-items-center pointer-cursor ${isSelected ? 'text-primary' : ''}`}
			onClick={onItemClick}
		>
			{icon}
			<span className="ms-2">{text}</span>
		</div>
	)
}

export default SidebarItem
