import React from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, TableFooter } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(30, 25, 40)',
    borderRight: 0,
    color: 'lightblue',
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: 'rgb(40, 37, 53)',
    color: 'white',
  },
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: 'rgb(30, 25, 40)',
    color: 'yellow',
    fontWeight: '400'
  },
}));



function ScoreSheet({ firestore, userId="user-Id" }) {

  const [players, setPlayers] = React.useState([])
  const [totals, setTotals] = React.useState([])
  const [scores, setScores] = React.useState([])

  async function getActiveGame(userId) {
    const gamesRef = collection(firestore, `users/${userId}/Games`);
    const q = query(gamesRef, where("Active", "==", true));
    const data = await getDocs(q);
    if (data.empty) return ""
    return data.docs[0].id
  }

  function playerToTotals(players) {
    const totals = []
    players.forEach((player) =>  totals.push(player.Scores.reduce((sum, a) => sum + a, 0)))
    return totals
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

  const tableWidth = React.useMemo(() => players > 3 ? '200vw' : '100vw', [players])


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
        setTotals(playerToTotals(playersDoc))
      }
    }
    readActiveGame();
  }, [userId])


  return (

     <TableContainer component={Paper}>
      <Table sx={{ minWidth: {tableWidth}, height: '100%'}} aria-label="Score table" stickyHeader >
        <TableHead>
          <TableRow >
            <StyledTableCell width="50px" sx={{ padding: '0 0 0 20px' }}>#</StyledTableCell>
            {players.map((p) => {
              return <StyledTableCell key={p} sx={{whiteSpace: 'nowrap'}} align="right">{p}</StyledTableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody sx={{ color: 'white' }}>
          {scores.map((row, index) => (
            <TableRow
              key={index}
              // sx={{
              //   // '&:nth-of-type(odd)': { backgroundColor: 'rgb(60, 57, 70)' },
              //   '&:last-child td, &:last-child th': { border: 0 },
              // }}
            >
              <StyledTableCell component="th" scope="row">{index+1}</StyledTableCell>
              {row.map((c, i) => {
                return <StyledTableCell key={i} align="right">{c}</StyledTableCell>
                })
              }
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <StyledTableCell component="th" sx={{backgroundColor: 'blue', color: 'yellow', fontWeight: 'bold'}} scope="row">Total</StyledTableCell>
              {totals.map((c, i) => {
                return <StyledTableCell key={i} align="right">{c}</StyledTableCell>
                })
              }
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default ScoreSheet