import React from 'react'
import PropTypes from 'prop-types'

export default function Button({ className, dataTestId, onClick, title, children }) {
	return (
		<button
			type="button"
			className={className}
			data-testid={dataTestId}
			title={title}
			onClick={onClick}
		>
			{children}
		</button>
	)
}

Button.propTypes = {
	className: PropTypes.string,
	dataTestId: PropTypes.string,
	onClick: PropTypes.func,
	title: PropTypes.string,
	children: PropTypes.node,
}
