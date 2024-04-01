import React, { useEffect, useRef } from 'react';
import './TextEditor.scss';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

const TextEditor = (props) => {

    const editorRef = useRef(null);

    useEffect(() => {
        const editor = new EditorJS({
          holder: 'editorjs',
          tools: {
            header: {
              class: Header,
              inlineToolbar: true
            },
            list: {
              class: List,
              inlineToolbar: true
            }
          }
        });
    
        editorRef.current = editor;
    
        // Pas besoin de détruire l'instance de l'éditeur
        // L'éditeur sera détruit automatiquement lorsque le composant sera démonté
    
        return () => {
          // Clean up any resources or subscriptions here if needed
        };
      }, []);

    return ( <>
        <div id="editorjs"></div>
    </> );
}
 
export default TextEditor;