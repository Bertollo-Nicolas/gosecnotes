import React from 'react';
import './ContextMenu.scss';

const ContextMenu = React.forwardRef(({ x, y, options, isVisible, onClose }, ref) => {

    if (!isVisible) return null;

    return (
       <div ref={ref} style={{ position: 'absolute', top: y, left: x, zIndex: 100 }} className='context-menu'>
            <ul>
                {options.map((option, index) => (
                <li key={index} onClick={() => option.action(onClose)}>
                    {option.icon}
                    {option.label}
                </li>
                ))}
            </ul>
        </div>
    );
})
 
export default ContextMenu;