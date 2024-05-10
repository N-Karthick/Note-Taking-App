import React, { useState } from 'react';
import { Alert, Button, Card, CardContent, Switch, TextareaAutosize } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import { addNotes, userNotes, updateNote, deleteNote } from '../redux/action';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const Notes = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [AddNotes, setAddNotes] = useState(false);
  const [EditNotes, setEditNotes] = useState(false);
  const [DeleteNotes, setDeleteNotes] = useState(false);
  const notes = useSelector((state) => state.notesResponse);
  const AddMessage = useSelector((state) => state.addNoteResponse);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const Titles = notes?.message?.titles ?? [];
  const Notes = notes?.message?.contents ?? [];
  const FetchMessage = notes?.message?.message ?? [];
  const NoteAddMessage = AddMessage?.message?.message ?? [];

  const handleModeChange = () => {
    setDarkMode(!darkMode);
  };
  const handleAddNote = () => {
    setAddNotes(true);
    setSelectedNote(null);
  };

  const handleDeleteNote = () => {
    if (DeleteNotes) {
      dispatch(deleteNote(DeleteNotes))
    }
    dispatch(userNotes());
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };

  const handleRemoveNote = () => {
    setAddNotes(false);
  };

  const handleTitleClick = (note) => {
    setSelectedNote(note);
    setDeleteNotes(note);
    setTitle(note.title);
    setNote(note.note);
    setEditNotes(false);
  };

  const handleEditNote = () => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setNote(selectedNote.note);
      setEditNotes(true);
    }
  };

  const handleSubmit = () => {
    if (selectedNote) {
      dispatch(updateNote(title, note));
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    } else {
      dispatch(addNotes(title, note));
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    }
    dispatch(userNotes());
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
    setAddNotes(false);
  };

  return (
    <div>
      <Card sx={{ width: '100%', height: '41rem', backgroundColor: darkMode ? '#545454' : '#cbdff38f', margin: '0px' }}>
        <h1 style={{ color: darkMode ? 'white' : 'black', margin: '0rem 8rem' }}>
          NOTE-TAKING-APP
          <Switch sx={{ position: 'relative', left: '60rem' }} checked={darkMode} onChange={handleModeChange} />

          {AddNotes ? (
            <RemoveIcon sx={{ marginLeft: '13rem' }} onClick={handleRemoveNote} />
          ) : (<div>  <AddIcon sx={{ marginLeft: '13rem' }} onClick={handleAddNote} />
            <DeleteIcon sx={{ marginLeft: '13rem' }} onClick={handleDeleteNote} />
          </div>)}
          {AddNotes && (
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-evenly' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2 }} />
              <Card sx={{ width: '20rem', height: '10rem', backgroundColor: darkMode ? '#545454' : '#cbdff38f', position: 'relative', zIndex: 3 }}>
                <h6 style={{ color: darkMode ? 'white' : 'black', position: 'absolute', top: '-40px' }}>TITLE</h6>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 4, width: '10rem' }}>
                  <TextareaAutosize
                    minRows={3}
                    maxRows={10}
                    placeholder="Write your Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '14rem', padding: '2px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              </Card>
              <Card sx={{ width: '56.4rem', height: '10rem', backgroundColor: darkMode ? '#545454' : '#cbdff38f', position: 'relative', zIndex: 3 }}>
                <h6 style={{ color: darkMode ? 'white' : 'black', position: 'absolute', top: '-40px' }}>NOTES</h6>
                <div style={{ position: 'absolute', top: '35%', left: '20%', zIndex: 4, width: '40rem', height: '90%' }}>
                  <TextareaAutosize
                    minRows={3}
                    maxRows={10}
                    placeholder="Write your note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ width: '35rem', padding: '2px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <Button sx={{ color: !darkMode ? '#ffffff' : 'black', backgroundColor: !darkMode ? '#545454' : '#cbdff38f', position: 'absolute', top: '7.5rem', left: '49rem' }}
                  onClick={handleSubmit}>Submit</Button>
              </Card>
            </div>
          )}
        </h1>
        <CardContent sx={{ width: '94%', height: '35rem', border: '3px solid #d1d1d1', marginLeft: '2rem', display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ width: '30rem', height: '35rem', border: '2.5px solid #d1d1d1', marginLeft: '0.7rem' }}>
            <h2 style={{ color: darkMode ? 'white' : 'black', display: 'flex', justifyContent: 'center' }}>
              TITLES
            </h2>
            <hr />
            {Titles.map((title, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <h3
                  style={{ color: darkMode ? 'white' : 'black', cursor: 'pointer', flexGrow: 1 }}
                  onClick={() => handleTitleClick(Notes[index])}
                >
                  {index + 1}. {title}
                </h3>
                <EditIcon sx={{ cursor: 'pointer' }} onClick={handleEditNote} />
              </div>
            ))}
          </div>
          <div style={{ width: '60rem', height: '35rem', border: '2.5px solid #d1d1d1', marginLeft: '0.7rem' }}>
            <h2 style={{ color: darkMode ? 'white' : 'black', display: 'flex', justifyContent: 'center' }}>
              NOTES
            </h2>
            <hr />
            <div style={{ color: darkMode ? 'white' : 'black', padding: '1rem' }}>
              <div>
                {selectedNote && EditNotes ? (
                  <div>
                    <TextareaAutosize
                      minRows={3}
                      maxRows={10}
                      placeholder={selectedNote}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      style={{ height: '5rem', width: '35rem', padding: '2px', borderRadius: '4px', border: '3px solid #ccc' }}
                    />
                    <Button
                      sx={{ color: !darkMode ? '#ffffff' : 'black', backgroundColor: !darkMode ? '#545454' : '#cbdff38f', marginTop: ' 10rem ' }}
                      onClick={handleSubmit}
                    >
                      Update
                    </Button>
                  </div>
                ) : (
                  <div>
                    {selectedNote ? selectedNote : 'Click on a title to view the note'}
                  </div>
                )}

              </div>
              {showSuccessMessage && (<Alert  
              icon={<CheckIcon sx={{marginRight:'10px'}}/>}
              sx={{ zIndex: 1, display: 'flex', position: 'absolute', left: '36rem', bottom: '600px', backgroundColor: !darkMode ? '#545454' : '#cbdff38f', color: !darkMode ? 'white' : 'black'}}>
                {FetchMessage}
              </Alert>)}
            </div>
            <div>
              {showSuccessMessage && (<Alert
              icon={<CheckIcon sx={{marginRight:'-36px'}}/>}
             sx={{ zIndex: 1, display: 'flex', position: 'absolute', left: '36rem', bottom: '600px', backgroundColor: !darkMode ? '#545454' : '#cbdff38f', color: !darkMode ? 'white' : 'black' }}>
                {NoteAddMessage}
              </Alert>)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notes;
