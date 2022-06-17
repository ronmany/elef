import { Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'

function AddScore() {

   const [show, setShow] = useState(false)
   const [players, setPlayers] = useState([])
   const [scores, setScores] = useState([])

  const getActiveGame = async (uid) => {
      const gamesRef = collection(firestore, `users/${uid}/Games`);
      const q = query(gamesRef, where("Active", "==", true));
      const data = await getDocs(q);
      if (data.empty) return
      return data.docs[0].id
   }

   const readPlayers = async () => {
      const uid = auth?.currentUser?.uid
      // const uid="user-Id"
      const game = await getActiveGame(uid)
      if (game) {
         const playersRef = collection(firestore, `users/${uid}/Games/${game}/Players`)
         const data = await getDocs(playersRef)
         const playersDoc = data.docs.map((doc) => ({ ...doc.data() }))
         playersDoc.sort((a, b) => a.Order - b.Order)
         setPlayers(playersDoc.map(p => p.Name))
      }
   }

   const handleScoreChange = (e) => {
      const player = e.target.id
      const score = e.target.value

      

   }

   return (
   <>
         <Button startIcon={<Add />}
            size='large'
            sx={{ margin: '4px 6% 16px 6%', color: '#3085d6' }}
            onClick={() => setShow(true)}>
            New Game
         </Button>
         <Dialog open={show} onClose={()=> setShow(false)} >
         <DialogTitle sx={{"&.MuiDialogTitle-root": {color: '#3085d6'} }}>Enter Scores</DialogTitle>
            <DialogContent>
               <Stack>
                  {players.map((player, idx) =>
                  <TextField key={idx}
                     margin="dense"
                     id={player}
                     label={player}
                     type="number"
                     variant="standard"
                     color='primary'
                     value={scores[idx]}
                     onChange={(idx) => handleScoreChange(idx)}>
            </TextField>
                        )}
               </Stack>
            </DialogContent>
        </Dialog>
   </>
   )
}

export default AddScore