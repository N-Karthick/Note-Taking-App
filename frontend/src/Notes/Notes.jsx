import { Card, Switch } from '@mui/material';
import React, { useState } from 'react';

const Notes = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleModeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div>
      <Card sx={{ width: '100%', height: '41rem', backgroundColor: darkMode ? 'black' : 'white' ,margin:'0px'}}>
        <h1 style={{color: darkMode ? 'white' : 'black',margin:'0px'}}>From Card
        <Switch sx={{position:'relative',left:'80rem'}} checked={darkMode} onChange={handleModeChange} />
     </h1>
         </Card>
    </div>
  );
};

export default Notes;
