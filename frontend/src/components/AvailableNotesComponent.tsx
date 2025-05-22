import React, { useState, useEffect } from "react";
import "draft-js/dist/Draft.css";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import EditorComponent from "./EditorComponent";

function AvailableNotesComponent(props) {

  // TODO : Make notes as a context and pull wherever needed, or use Redux to store updates and reflect changes.
  const [notes, setNotes] = useState(Array<any>);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentEditingNote, setCurrentEditingNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newNoteName, setNewNoteName] = useState("");
  const [isNewNoteNameError, setIsNewNoteNameError] = useState(false);
  const [newNoteNameErrorMessage, setNewNoteNameErrorMessage] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  const convertToKeyValueObject = (items: Array<any> | any) => {
    const returnObj: any = {};

    if (Array.isArray(items)) {
      if (items.length >= 1)
        items.forEach(e => {
          returnObj[e.note_id] = e;
        });
    } else returnObj[items.note_id] = items;

    return returnObj;
  };

  const getNotes = () => {
    setErrorMessage("");
    setLoading(true);

    console.log("Getting Notes ! ");

    if (!props.backendURL) {
      setErrorMessage(
        "Backend cannot able to connect due to wrong location, please try later !"
      );
      return;
    }

    fetch(`${props.backendURL}/api/notes`)
      .then(res => res.json())
      .then(response => {
        setNotes(convertToKeyValueObject(response.response));
        setLoading(false);
      })
      .catch(err => {
        setErrorMessage("something went wrong, please try later !");
        setLoading(false);
      });
  };

  const editNote = note => {
    setErrorMessage("");
    setCurrentEditingNote(note);
  };

  const createNewNote = () => {
    if (!props.backendURL) {
      setErrorMessage(
        "Backend cannot able to connect due to wrong location, please try later !"
      );
      return;
    }

    if (!(newNoteName && newNoteName.length >= 4)) {
      setIsNewNoteNameError(true);
      setNewNoteNameErrorMessage("Note name shoulb be atleast 4 chars");
      return;
    }

    setLoading(true);

    const body = {
      name: newNoteName,
      created_by: props.userName,
      body: "This is a sample body text",
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch(`${props.backendURL}/api/notes`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setLoading(false);
        setNewNoteName("");
        setDialogOpen(false);
        getNotes();
        setDialogOpen(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        setErrorMessage("Falied creating new note, Please try later !");
      });
  };

  const getTableViewOfNotes = () => {
    return (
      <Container style={{ height: "50em", overflow: "scroll" }}>
        <TableContainer>
          <Table aria-label="Available Notes To Collaborate">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Body</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(notes).map((noteKey: any) => (
                <TableRow key={notes[noteKey].id}>
                  <TableCell align="left">{notes[noteKey].note_id}</TableCell>
                  <TableCell align="left">{notes[noteKey].name}</TableCell>
                  <TableCell align="left">
                    {notes[noteKey].body.slice(0, 15)}...
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      onClick={() => editNote(notes[noteKey])}
                      color="primary"
                    >
                      Edit Note
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  };

  const createNoteComponentDialog = () => {
    return (
      <Dialog
        onClose={() => {
          setDialogOpen(false);
        }}
        open={dialogOpen}
      >
        <DialogTitle>Create Note</DialogTitle>
        <Container
          maxWidth="md"
          style={{ marginTop: "5%", marginBottom: "5%", width: "20em" }}
        >
          <TextField
            style={{ marginBottom: "5%" }}
            placeholder="Note Name"
            error={isNewNoteNameError}
            helperText={newNoteNameErrorMessage}
            fullWidth
            onChange={event => {
              setNewNoteNameErrorMessage("");
              setIsNewNoteNameError(false);
              setNewNoteName(event.target.value);
            }}
          />
          <Button variant="contained" color="primary" onClick={createNewNote}>
            Create
          </Button>
        </Container>
      </Dialog>
    );
  };

  const setUpdatedNote = (updatedNote: any) => {
    const currentNotes = notes;
    currentNotes[updatedNote.note_id] = updatedNote;
    setNotes(currentNotes);
    setCurrentEditingNote(updatedNote);
  };

  return (
    <Container>
      <Typography style={{ width: "100%", textAlign: "center", margin: 5 }}>
        User logged in as {props.userName}
      </Typography>
      <Typography style={{ color: "red" }}>{errorMessage}</Typography>
      {createNoteComponentDialog()}
      <Container>
        {loading ? (
          <CircularProgress></CircularProgress>
        ) : (
          <Container>
            <Button
              style={{ margin: 2 }}
              variant="contained"
              color="primary"
              onClick={getNotes}
              disabled={currentEditingNote ? true: false}
            >
              Refresh Table
            </Button>
            <Button
              style={{ margin: 2 }}
              variant="contained"
              color="primary"
              onClick={() => setDialogOpen(!dialogOpen)}
              disabled={currentEditingNote ? true: false}
            >
              Create Note
            </Button>
          </Container>
        )}
      </Container>
      {currentEditingNote ? (
        <EditorComponent
          backendURL={props.backendURL}
          userName={props.userName}
          note={currentEditingNote}
          pullNotes={() => getNotes()}
          setUpdatedNote={(note: any) => setUpdatedNote(note)}
          returnBackToTableView={() => setCurrentEditingNote("")}
        />
      ) : (
        getTableViewOfNotes()
      )}
    </Container>
  );
}

export default AvailableNotesComponent;
