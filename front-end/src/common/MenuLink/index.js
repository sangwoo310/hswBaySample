import React from 'react'
import { Link } from 'react-router-dom'

const MenuLink = ({ isSelected, to, text }) => (
  <Link to={to}>
    <div className="menu-container">
      {isSelected ? (
        <div className="menu-content-selected"> {text} </div>
      ) : (
        <div className="menu-content"> {text} </div>
      )}
    </div>
  </Link>
)

export default MenuLink
