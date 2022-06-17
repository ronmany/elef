import React, { useState } from 'react'
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import { PlayArrow, AddCircle, Cancel, ClearAll } from '@mui/icons-material';
import { collection, query, where, addDoc, Timestamp, getDocs, updateDoc } from 'firebase/firestore'


function NewGame({auth, firestore}) {
   const [showDlg, setShowDlg] = useState(false)
   const [players, setPlayers] = useState([])
   const [newName, setNewName] = useState("")
   const [winScore, setWinScore] = useState(1000)
   const [glock, setGlock] = useState(5)


   const nameInput = React.useRef(null)

   const getActiveGame = async (uid) => {
      const gamesRef = collection(firestore, `users/${uid}/Games`);
      const q = query(gamesRef, where("Active", "==", true));
      const data = await getDocs(q);
      if (data.empty) return
      return data.docs[0].id
   }
   const readActiveGameData = async () => {
      const uid = auth?.currentUser?.uid
      // const uid="user-Id"
      const game = await getActiveGame(uid)
      if (game) {
        const playersRef = collection(firestore, `users/${uid}/Games/${game}/Players`)
        const data = await getDocs(playersRef)
        const playersDoc = data.docs.map((doc) => ({ ...doc.data() }))
        playersDoc.sort((a, b) => a.Order - b.Order)
        setPlayers(playersDoc.map(p => p.Name))
        console.log(players)
        setPlayers(playersDoc.map(p => p.Name))
        setWinScore(game?.WinScore || 1000)
        setGlock(game?.Glock || 0)
      }
   }

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
      const uid = auth?.currentUser?.uid
      console.log(uid, auth)
      const gamesRef = collection(firestore, `users/${uid}/Games`);
      const q = query(gamesRef, where("Active", "==", true))
      const data = await getDocs(q)
      if (!data.empty) {
         data.docs.forEach(async (activeGame) => {
            await updateDoc(activeGame, {Active: false})
         })
      }
      const game = await addDoc(gamesRef, { Active: true, StartTime: Timestamp.fromDate(new Date()), WinScore: 1000, Glock: 5 })
      const playersRef = collection(firestore, `users/${uid}/Games/${game.id}/Players`)
      players.forEach(async (player, idx) => {
         await addDoc(playersRef, {Name: player, Order: idx+1, Scores:[] })
      })
      setShowDlg(false)
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
         <DialogTitle sx={{"&.MuiDialogTitle-root": {color: '#3085d6'} }}>Start New Game</DialogTitle>
         <DialogContent>
            <DialogContentText>
               To start a new 1000 game, setup players and game options
               <Button variant='outlined' sx={{marginTop: '16px'}} onClick={readActiveGameData}>Repeat Last Game</Button>
            </DialogContentText>
            <TextField
               autoFocus ref={nameInput}
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
                     </InputAdornment>
                  ),
                  }}
               />
            <IconButton sx={{marginTop: '20px'}} onClick={clearAll}><ClearAll /> </IconButton>
            <Grid container spacing={1}>
               {players.map((player, idx) => {
                  return (
                     <Grid item xs={4} lg={2} key={idx}>
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
            <p></p>
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
            <p></p>
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