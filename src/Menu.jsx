import { Logout } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import React from 'react'
import NewGame from './NewGame';

function Menu({ auth }) {
   return (
      <>
      { auth ? (
         <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }} >
               {/* <Button startIcon={<PlayArrow />} size='large' sx={{margin: '4px 6% 16px 6%', color: '#3085d6'}}>New Game</Button> */}
            <NewGame />
            <Button startIcon={<Logout />} size='large' sx={{margin: '4px 6% 16px 6%', color: '#3085d6'}} onClick={() => auth.signOut()}>Logout</Button>
         </Box >
         ): null
         }
      </>
   )
}

export default Menu