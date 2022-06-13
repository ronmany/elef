import React from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';


const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(30, 25, 40)',
    color: 'white',
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: 'rgb(40, 37, 53)',
    color: 'white'
  },
}));

function ScoreSheet({ firestore, userId="user-Id" }) {

  const [players, setPlayers] = React.useState([])
  const [scores, setScores] = React.useState([])

  async function getActiveGame(userId) {
    const gamesRef = collection(firestore, `users/${userId}/Games`);
    const q = query(gamesRef, where("Active", "==", true));
    const data = await getDocs(q);
    if (data.empty) return ""
    return data.docs[0].id
  }

  function playersToScores(players) {
    const scores = []
    // const totals = []
    if (players.length == 0) return []
    const rows = players[0].Scores.length
    for (let i = 0; i < rows; i++) {
      const row = []
      players.forEach((player) => {
        row.push(player.Scores[i])
      })
      scores.push(row)
    }
    return scores
  }


  React.useEffect(() => {
    const readActiveGame = async () => {
      const game = await getActiveGame(userId)
      if (game) {
        const playersRef = collection(firestore, `users/${userId}/Games/${game}/Players`)
        const data = await getDocs(playersRef)
        const playersDoc = data.docs.map((doc) => ({ ...doc.data() }))
        playersDoc.sort((a, b) => a.Order - b.Order)
        setPlayers(playersDoc.map(p => p.Name))
        console.log(players)
        setScores(playersToScores(playersDoc))
      }
    }
    readActiveGame();
  }, [userId])


  return (

     <TableContainer component={Paper}>
      <Table sx={{ minWidth: "100wh" }} aria-label="Score table" stickyHeader={true} >
        <TableHead>
          <TableRow >
            <StyledTableCell sx={{maxWidth: 15 }}>Match</StyledTableCell>
            {players.map((p) => {
              return <StyledTableCell key={p} align="right">{p}</StyledTableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody sx={{ color: 'white' }}>
          {scores.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                '&:nth-of-type(odd)': { backgroundColor: 'rgb(60, 57, 70)' },
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <StyledTableCell component="th" scope="row" sx={{maxWidth: 15 }}>{index+1}</StyledTableCell>
              {row.map((c, i) => {
                return <StyledTableCell key={i} align="right">{c}</StyledTableCell>
                })
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ScoreSheet