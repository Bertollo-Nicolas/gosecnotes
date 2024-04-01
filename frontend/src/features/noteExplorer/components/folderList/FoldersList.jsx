import React, { useEffect, useRef, useState } from 'react';
import './FoldersList.scss'

import { AddFolder, AddFile } from "../../../../../wailsjs/go/main/App";
import data from '../../../../../../data/data.json';

import { IoAdd, IoAddOutline } from "react-icons/io5";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { IoChevronForward } from "react-icons/io5";
import { IoFolderOpenOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoDuplicateOutline } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import { IoDocumentOutline } from "react-icons/io5";

import ContextMenu from '../../../../layout/contextMenu/ContextMenu';

const FoldersList = (props) => {

    const [openFolders, setOpenFolders] = useState({});
    const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, isVisible: false });
    const contextMenuRef = useRef(null);

    const handleAddFolderClick = () => {
        const folderName = prompt("Entrez le nom du dossier :");
        if (folderName) {
            AddFolder(folderName)
                .then(() => {
                    alert("Dossier créé avec succès !");
                })
                .catch((err) => {
                    alert("Une erreur est survenue lors de la création du dossier : " + err);
                });
        }
    };

    const handleAddFile = (folderPath) => {
        const fileName = prompt("Nom du nouveau fichier :");
        AddFile(fileName, folderPath);
    }

    const toggleFolder = (folderName) => {
        setOpenFolders(prev => {
            // Copie de l'état actuel
            const newState = { ...prev };

            // Si le dossier est déjà ouvert, on le ferme, sinon on l'ouvre
            if(newState[folderName]) {
                delete newState[folderName]; // Fermer le dossier
            } else {
                newState[folderName] = data[folderName] || []; // Ouvrir le dossier et charger les fichiers
            }

            return newState;
        });
    };

    const handleContextMenu = (event) => {

        event.stopPropagation();

        event.preventDefault();
        setContextMenu({
          x: event.pageX,
          y: event.pageY,
          isVisible: true,
          options: [
            { label: 'Duplicate', icon: <IoDuplicateOutline />, action: handleClose => { handleClose(); } },
            { label: 'Rename', icon: <IoCreateOutline />, action: handleClose => { handleClose(); } },
            { label: 'Delete', icon: <IoTrashOutline />, action: handleClose => { handleClose(); } },
            { label: 'Add a file', icon: <IoDocumentOutline />, action: handleClose => { handleClose(); } },
          ]
        });
    };

    const closeContextMenu = () => {
        setContextMenu({ ...contextMenu, isVisible: false });
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
          // Vous pouvez utiliser un ref pour vérifier si le clic est à l'extérieur du menu.
          if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
            closeContextMenu();
          }
        };
      
        document.addEventListener('mousedown', handleOutsideClick);
      
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return ( 
    <>
        <ContextMenu
            ref={contextMenuRef}
            x={contextMenu.x}
            y={contextMenu.y}
            options={contextMenu.options}
            isVisible={contextMenu.isVisible}
            onClose={closeContextMenu}
        />
        <div className="files-and-folder">
            <div className="files-and-folder--header">
                <div className="content-block">
                    <IoFolderOpenOutline />
                    <span>Folders</span>
                </div>
                <span className='btn-add-folder' onClick={handleAddFolderClick} ><IoAdd /></span>
            </div>
            <div>
            {Object.keys(data).map((folderName, index) => (
                <div className='files-and-folder--items-list__item' key={index}>
                    <div className="folder" onClick={() => toggleFolder(folderName)} onContextMenu={handleContextMenu}>
                        <div className="content-block" >
                            <IoChevronForward className={`chevron ${openFolders[folderName] ? 'rotated' : ''}`} />
                            <span>{folderName}</span>
                        </div>
                        <div className='options'>
                            <div className='btn-options'  onClick={handleContextMenu}>
                                <IoEllipsisHorizontalSharp />
                            </div>
                            <div className='btn-options' onClick={() => handleAddFile(folderName)}>
                                <IoAddOutline />
                            </div>
                        </div>
                    </div>
                    {openFolders[folderName] && (
                        <div className="folder-sub">
                            {data[folderName].length > 0 ? (
                                data[folderName].map((file, fileIndex) => (
                                    <div key={fileIndex} className='file'>
                                        <IoDocumentTextOutline />
                                        {file}
                                    </div>
                                ))
                            ) : (
                                <div>Aucun élément à afficher.</div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
        </div>
    </> );
}
 
export default FoldersList;