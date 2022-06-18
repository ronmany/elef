import React, { useState } from 'react'
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import { PlayArrow, AddCircle, Cancel, DeleteSweep } from '@mui/icons-material';
import { useGame, useGameWrite } from './GameProvider';


function NewGame({user}) {
   const [showDlg, setShowDlg] = useState(false)
   const [players, setPlayers] = useState([])
   const [newName, setNewName] = useState("")
   const [winScore, setWinScore] = useState(1000)
   const [glock, setGlock] = useState(5)


   const nameInput = React.useRef(null)
   const game = useGame()
   const gameWrite = useGameWrite()

   const handleDelete = (idx) => {
      let newList = [...players]
      newList.splice(idx, 1)
      setPlayers(newList)
   }

   const clearAll = () => {
      setPlayers([])
   }

   const updateName = (e) => {
      setNewName(e.target.value)
   }

   const handleKeyDown = (e) => {
      if (e.key === "Enter")
         handleAdd()
   }

   const handleAdd = () => {
      if (! newName) return
      setPlayers([...players, newName])
      setNewName("")
      setTimeout(() => nameInput.current.focus(), 100)
   }

   const handleStart = async () => {
      gameWrite(user, {
         winScore: winScore || 1000,
         glock: glock,
         players: players.map((p, i) => {
            return { name: p, order: i + 1, scores: [] }
         })
      })
      setShowDlg(false)
   }


   const readActiveGameData = async () => {
      if (game?.players?.length) {
         setPlayers(game.players.map(p => p.name))
         setWinScore(game.winScore || 1000)
         setGlock(game.glock || 0)
      }
   }


   return (
      <>
         <Button startIcon={<PlayArrow />} size='medium' onClick={() => setShowDlg(true)}>
            New Game
         </Button>
         <Dialog open={showDlg} onClose={()=> setShowDlg(false)} >
         <DialogTitle sx={{"&.MuiDialogTitle-root": {color: '#3085d6'} }}>Start New Game</DialogTitle>
         <DialogContent>
            <DialogContentText>
               To start a new 1000 game, setup players and game options
               <Button variant='outlined' sx={{marginTop: '16px'}} onClick={readActiveGameData}>Repeat Last Game</Button>
            </DialogContentText>
            <TextField
               autoFocus ref={nameInput}
               fullWidth
               margin="dense"
               id="player"
               label="Add Player"
               type="text"
               variant="standard"
               color='primary'
               value={newName}
               onChange={updateName}
               onKeyDown={handleKeyDown}
               InputProps={{
                  endAdornment: (
                     <InputAdornment position="end" onClick={handleAdd}>
                        <AddCircle />
                        <IconButton onClick={clearAll}><DeleteSweep /> </IconButton>
                     </InputAdornment>
                  ),
                  }}
               />
            <Grid container spacing={1}>
               {players.map((player, idx) => {
                  return (
                     <Grid item xs={4} md={3} key={idx}>
                        <Tooltip title={player} >
                           <Chip
                           label={player}
                           onDelete={() => handleDelete(idx)}
                           />
                        </Tooltip>
                     </Grid>
                  )}
               )}
            </Grid>
            <Grid container spacing={4} sx={{marginTop: '8px'}}>
               <Grid item xs={8} md={5}>
                  <TextField
                     margin="dense"
                     id="glock"
                     label="Rounds to glock (double score)"
                     type="number"
                     variant="standard"
                     color='primary'
                     value={glock}
                     onChange={(e) => setGlock(e.target.value)}>
                  </TextField>
               </Grid>
               <Grid item xs={8} md={5}>
                  <TextField
                     margin="dense"
                     id="winScore"
                     label="Winning Score"
                     type="number"
                     variant="standard"
                     color='primary'
                     value={winScore}
                     onChange={(e) => setWinScore(e.target.value)}>
                  </TextField>
               </Grid>
            </Grid>
         </DialogContent>
         <DialogActions>
            <Button startIcon={<Cancel />} onClick={()=>setShowDlg(false)}>Cancel</Button>
            <Button startIcon={<PlayArrow />} onClick={handleStart}>Start Game</Button>
         </DialogActions>
      </Dialog>

      </>

   )
}

export default NewGame