import { Logout } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import React from 'react'
import NewGame from './NewGame';

function Menu({ user, signout }) {
   return (
      <>
      { user ? (
         <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }} >
               {/* <Button startIcon={<PlayArrow />} size='large' sx={{margin: '4px 6% 16px 6%', color: '#3085d6'}}>New Game</Button> */}
            <NewGame auth={user} />
            <Button startIcon={<Logout />} size='large' sx={{margin: '4px 6% 16px 6%', color: '#3085d6'}} onClick={signout}>Logout</Button>
         </Box >
         ): null
         }
      </>
   )
}

export default Menu