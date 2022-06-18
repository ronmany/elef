import React, { useEffect, useState } from 'react'
import {
   Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
   FormControlLabel, Stack, TextField
} from '@mui/material'
import { Add, Cancel, Save } from '@mui/icons-material';
import { useGame, useGameUpdate } from './GameProvider'


function AddScore({ user }) {

   const [show, setShow] = useState(false)
   const [glockRound, setGlockRound] = useState(false)
   const [double, setDouble] = useState(false)
   const [scores, setScores] = useState([0,0,0,0,0,0])

   const game = useGame()
   const gameUpdate = useGameUpdate()

   useEffect(() => {
      if (show) {
         const noOfPlayers = game?.players?.length || 0
         setScores(Array(noOfPlayers).fill(0))
         setGlockRound(game.glock > 0 && ((game.players[0].scores.length + 1) % game.glock) === 0)
         setDouble(false)
      }
   }, [show])


   const handleScoreChange = (e, idx) => {
      const score = Number(e.target.value)
      const newScores = [...scores]
      newScores[idx] = score
      setScores([...newScores])
   }

   const handleSave = async () => {
      const _scores = double ? scores.map(x => x*2) : scores
      await gameUpdate(user, _scores)
      setShow(false)
   }

   return (
   <>
         <Button startIcon={<Add />} size='medium' onClick={() => setShow(true)}>
            Add Score
         </Button>
         <Dialog open={show} onClose={()=> setShow(false)} >
         <DialogTitle sx={{"&.MuiDialogTitle-root": {color: '#3085d6'} }}>Enter scores</DialogTitle>
            <DialogContent>
               {game?.players?.length ?
                  <Stack spacing={2}>
                     {game?.players?.map((player, idx) =>
                        <TextField key={idx}
                           autoFocus
                           margin="dense"
                           id={player.name}
                           label={player.name}
                           type="number"
                           variant="standard"
                           color='primary'
                           value={scores[idx]}
                           onChange={(e) => handleScoreChange(e, idx)} />
                     )}
                     {glockRound ?
                        <FormControlLabel
                           control={<Checkbox
                              checked={double}
                              onChange={(e)=>setDouble(e.target.checked)}
                           />} label="Let me double the score?" />
                     : null}
                  </Stack> : null}
            </DialogContent>
            <DialogActions>
               <Button startIcon={<Cancel />} onClick={()=> setShow(false)}>Cancel</Button>
               <Button startIcon={<Save />} onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
   </>
   )
}

export default AddScore