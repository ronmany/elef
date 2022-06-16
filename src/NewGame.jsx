import React, { useState } from 'react'
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, Stack,  TextField } from '@mui/material'
import { PlayArrow, AddCircle } from '@mui/icons-material';


function NewGame() {
   const [showDlg, setShowDlg] = useState(false)
   const [players, setPlayers] = useState([])
   const [newName, setNewName] = useState("")

   const nameInput = React.useRef(null)

   const handleDelete = (idx) => {
      let newList = [...players]
      newList.splice(idx, 1)
      setPlayers(newList)
   }

   const updateName = (e) => {
      setNewName(e.target.value)
   }

   const handleAdd = () => {
      setPlayers([...players, newName])
      setNewName("")
      setTimeout(() => nameInput.current.focus(), 100)
   }


   return (
      <>
         <Button startIcon={<PlayArrow />}
            size='large'
            sx={{ margin: '4px 6% 16px 6%', color: '#3085d6' }}
            onClick={() => setShowDlg(true)}>
            New Game
         </Button>
         <Dialog open={showDlg} onClose={()=> setShowDlg(false)} >
         <DialogTitle>Start New Game</DialogTitle>
         <DialogContent>
            <DialogContentText>
               To start a new 1000 game, setup players and game options
            </DialogContentText>
            <TextField
               autoFocus ref={nameInput}
               margin="dense"
               id="player"
               label="Add Player"
               type="text"
               variant="standard"
               color='secondary'
               value={newName}
               onChange={updateName}
               InputProps={{
                  endAdornment: (
                     <InputAdornment position="end" onClick={handleAdd}>
                        <AddCircle />
                     </InputAdornment>
                  ),
                  }}
            />
            <Stack direction="row" spacing={1}>
                  {players.map((player, idx) => { return (
                     <Chip key={idx}
                        label={player}
                        onDelete={() => handleDelete(idx)}
                        />

                     )}
                  )}
            </Stack>
            <p>Number of rounds between &#34;Glock&#34; (double score)</p>
            <p>winning score</p>



         </DialogContent>
         <DialogActions>
            <Button onClick={()=>setShowDlg(false)}>Cancel</Button>
         </DialogActions>
      </Dialog>

      </>

   )
}

export default NewGame