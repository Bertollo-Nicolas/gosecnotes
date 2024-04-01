import React from 'react';
import './NotesExplorer.scss';
import { IoSearchOutline } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";import FoldersList from './components/folderList/FoldersList';
import logo from "../../assets/images/logo/logo.png";

const NotesExplorer = (props) => {
    return ( <>
        <aside className='notes-explorer'>
            <div className="notes-explorer--header gsn-header">
                <div className="notes-explorer--header__title">
                    <img src={logo} alt="logo" />
                    <span>GoSecNotes</span>
                </div> 
            </div>
            <div className="notes-explorer--options">
                <div className="notes-explorer--options__add-note notes-explorer--options__item">
                    <div className="content-block">
                        <IoAddCircleOutline />
                        <span>Create Note</span>
                    </div>
                    <span className='shortcut'>Ctrl N</span>
                </div>
                <div className="notes-explorer--options__search-note notes-explorer--options__item">
                    <div className="content-block">
                        <IoSearchOutline />
                        <span>Search</span>
                    </div>
                    <span className='shortcut'>Ctrl K</span>
                </div>
            </div>
            <div className="notes-explorer--list">
                <FoldersList />
            </div>
        </aside>
    </> );
}
 
export default NotesExplorer;