import React, {useState, useEffect} from 'react'
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Button, Container } from '@material-ui/core';


function EditorComponent(props){
    
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    
    return (
    <Container>
            <Button onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))}>BOLD</Button>
            <div style={{border: '1px solid gray', minHeight: '6em'}}>
                <Editor editorState={editorState} onChange={setEditorState} />;
            </div>
    </Container>)
}

export default EditorComponent;