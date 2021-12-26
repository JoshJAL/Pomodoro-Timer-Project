import React from 'react'
import PropTypes from 'prop-types'

export default function SessionSection({ children, session }) {
	return session ? <>{children}</> : null
}

SessionSection.propTypes = {
	children: PropTypes.node,
	session: PropTypes.object,
}
