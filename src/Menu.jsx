import { Logout } from '@mui/icons-material';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import React from 'react'
import AddScore from './AddScore';
import NewGame from './NewGame';

function Menu({ user, signout }) {
   return (
      <>
      { user ? (
            <Box sx={{ position: 'fixed', bottom: 0, width: '80%', marginBottom: '4px'}} >
               <Stack direction="row" justifyContent="space-around" sx={{}}>
                  <NewGame user={user} />
                  <AddScore user={user} />
                  <Tooltip title="Logout">
                     <IconButton color='primary' size='large' onClick={signout}>
                        <Logout />
                     </IconButton>
                  </Tooltip>

               </Stack>

         </Box >
         ): null
         }
      </>
   )
}

export default Menu