import React from 'react';

const footerStyles = {
  width: '100%',
  justifyContent: 'space-between',
  display: 'flex',
  position: 'absolute',
  bottom: 0,
  color: 'black',
}

const footer = (props) => {
  return (
    <div className="footer" style={footerStyles}>
      <span>One</span>
      <span>Two</span>
      <span>Three</span>
    </div>
  )
}

export default footer;
