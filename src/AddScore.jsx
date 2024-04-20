import React, { useEffect, useState } from 'react'
import {
   Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
   FormControlLabel, Stack, TextField, InputAdornment,
   Tooltip,
   IconButton
} from '@mui/material'
import { Add, Cancel, Save, RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material';
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
      if (isNaN(score)) return // ignore non-numeric input
      const newScores = [...scores]
      newScores[idx] = score
      setScores([...newScores])
   }

   const toggelNegative = (_, idx) => {
      const newScores = [...scores]
      newScores[idx] = -newScores[idx]
      setScores([...newScores])
   }

   const handleSave = async () => {
      const _scores = double ? scores.map(x => x*2) : scores
      await gameUpdate(user, _scores)
      setShow(false)
   }

   return (
      <>
         <Tooltip title="Add Score">
            <IconButton color='primary' size='large'  onClick={() => setShow(true)}>
               <Add />
            </IconButton>
         </Tooltip>
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
                           type="mumeric"
                           variant="standard"
                           color='success'
                           value={scores[idx]}
                           InputProps={{
                              startAdornment: (
                                 <InputAdornment position="start" style={{cursor: "pointer"}}>
                                    <Tooltip title="Toggle negative/positive">
                                       {scores[idx] < 0 ?
                                          <AddCircleOutline onClick={(e) => toggelNegative(e, idx)} /> :
                                          <RemoveCircleOutline onClick={(e) => toggelNegative(e, idx)} />
                                       }
                                    </Tooltip>
                                 </InputAdornment>
                              )
                           }}
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