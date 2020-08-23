import React from 'react';
import { makeStyles } from '@material-ui/core';
import DrawingCanvas from './components/organisims/webrtc-image-view';


const useStyles = makeStyles({
  root: {
    width: '100vw',
    height: '100vh'
  }
})

const App = () => {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <DrawingCanvas />
    </div>
  );
};

export default App;
