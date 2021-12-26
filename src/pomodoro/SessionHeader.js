import React from 'react'
import PropTypes from 'prop-types'

export default function SessionHeader({ label, children }) {
	return <div className="row mb-2">
		<div className="col">
			<h2 data-testid="session-title">
				{label}
			</h2>
			<p className="lead" data-testid="session-sub-title">
				{children}
			</p>
		</div>
	</div>
}

SessionHeader.propTypes = {
	label: PropTypes.string,
	children: PropTypes.node,
}
