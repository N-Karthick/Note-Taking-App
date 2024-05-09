import React, { useState } from 'react';
import { Button, Card, CardContent, Switch, TextareaAutosize } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addNotes } from '../redux/action';

const Notes = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [AddNotes, setAddNotes] = useState(false);
  const notes = useSelector((state) => state.notesResponse);
  const [isOpen, setIsOpen] = React.useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState(''); 

  const handleModeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleAddNote = () => {
    setAddNotes(true);
  };

  const handleRemoveNote = () => {
    setAddNotes(false);
  };

    const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleTitleClick = (note) => {
    setSelectedNote(note);
  };

  const handleSubmit = () => {
    setAddNotes(false)
    dispatch(addNotes(title, note)); 
    console.log("title--->",title,'Notes----->',note)
  };

  const Titles = notes?.message?.titles ?? [];
  const Notes = notes?.message?.contents ?? [];

  return (
    <div>
      <Card sx={{ width: '100%', height: '41rem', backgroundColor: darkMode ? '#545454' : '#cbdff38f', margin: '0px' }}>
        <h1 style={{ color: darkMode ? 'white' : 'black', margin: '0rem 8rem' }}>
          NOTE-TAKING-APP
          <Switch sx={{ position: 'relative', left: '60rem' }} checked={darkMode} onChange={handleModeChange} />
        
          {AddNotes ? (
            <RemoveIcon sx={{ marginLeft: '13rem' }} onClick={handleRemoveNote} />
          ) : (
            <AddIcon sx={{ marginLeft: '13rem' }} onClick={handleAddNote} />
          )}
          {AddNotes && (
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-evenly' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2 }} />
              <Card sx={{ width: '20rem', height: '10rem', backgroundColor: darkMode ? '#545454' : '#cbdff38f', position: 'relative', zIndex: 3 }}>
                <h6 style={{ color: darkMode ? 'white' : 'black', position: 'absolute', top: '-40px' }}>TITTLE</h6>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 4, width: '10rem' }}>
                  <TextareaAutosize
                    minRows={3}
                    maxRows={10}
                    placeholder="Write your Tittle..."
                    value={title}
                    onChange={handleTitleChange}   
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
                    onChange={handleNoteChange}
                    style={{ width: '35rem', padding: '2px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <Button sx={{ color:!darkMode ? '#ffffff' : 'black',backgroundColor: !darkMode ? '#545454' : '#cbdff38f',position:'absolute',top:'6rem',left:'49rem'}}
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
              <h3
                style={{ color: darkMode ? 'white' : 'black', cursor: 'pointer' }}
                key={index}
                onClick={() => handleTitleClick(Notes[index])}
              >
                {index + 1}. {title}
              </h3>
            ))}
          </div>

          <div style={{ width: '60rem', height: '35rem', border: '2.5px solid #d1d1d1', marginLeft: '0.7rem' }}>
            <h2 style={{ color: darkMode ? 'white' : 'black', display: 'flex', justifyContent: 'center' }}>
              NOTES
            </h2>
            <hr />
            <div style={{ color: darkMode ? 'white' : 'black', padding: '1rem' }}>
              {selectedNote ? selectedNote : 'Click on a title to view the note'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notes;
