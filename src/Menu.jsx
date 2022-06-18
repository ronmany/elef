import { Logout } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import React from 'react'
import AddScore from './AddScore';
import NewGame from './NewGame';

function Menu({ user, signout }) {
   return (
      <>
      { user ? (
            <Box sx={{ position: 'fixed', bottom: 0 }} >
               <Stack direction="row" spacing={{ xs: 3, sm: 4, md: 8 }} sx={{marginBottom: '12px'}}>
                  <NewGame user={user} />
                  <AddScore user={user} />
                  <Button startIcon={<Logout />} size='medium' onClick={signout}>Logout</Button>

               </Stack>

         </Box >
         ): null
         }
      </>
   )
}

export default Menu