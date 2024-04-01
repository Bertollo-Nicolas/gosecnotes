import NotesExplorer from "./features/noteExplorer/NotesExplorer"
import TextEditor from "./features/textEditor/TextEditor"

import './App.scss';

function App() {
    return (
        <div id="App">
           <NotesExplorer />
           <TextEditor />
        </div>
    )
}

export default App
