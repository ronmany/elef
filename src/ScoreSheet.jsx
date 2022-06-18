import React, { useEffect } from 'react'
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, TableFooter, Snackbar, IconButton, Typography } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';
import NewGame from './NewGame';
import { useGame, useGameRead } from './GameProvider';
// import useMediaQuery from '@mui/material/useMediaQuery';
import Confetti from 'react-confetti'

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(30, 25, 40)',
    borderRight: 0,
    color: 'lightblue',
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: 'rgb(40, 37, 53)',
    color: 'white',
    fontSize: '14px'
  },
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: 'rgb(30, 25, 40)',
    color: 'yellow',
    fontWeight: '400',
    fontSize: '16px'
  },
}));

// const isSmall = useMediaQuery(`(min-width:728)`)

function ScoreSheet({ user }) {

  const game = useGame()
  const readActiveGame = useGameRead()
  const [players, setPlayers] = React.useState([])
  const [totals, setTotals] = React.useState([])
  const [scores, setScores] = React.useState([])
  const [showGlock, setShowGlock] = React.useState(false)
  const [winner, setWinner] = React.useState("")

  useEffect(() => {
    readActiveGame(user)
  }, [user])

  useEffect(() => {
    console.log("game was changed:", game)
    if (game?.players?.length) {
      setPlayers(game.players.map(p => p.name))
      const _scores = playersToScores(game.players)
      setScores(_scores)
      setTotals(playerToTotals(game.players))
      setShowGlock(game.glock > 0 && ((_scores.length+1) % game.glock) === 0)
    }
  }, [game])

  useEffect(() => {
    if (totals.some(x => x >= game.winScore)) {
        const max = Math.max(...totals)
        const winnerName = players[totals.indexOf(max)]
        setWinner(winnerName)
      } else {
        setWinner("")
      }
  }, [totals])


  function playerToTotals(players) {
    const totals = []
    players.forEach((player) =>  totals.push(player.scores.reduce((sum, a) => sum + Number(a), 0)))
    return totals
  }

  function playersToScores(players) {
    const _scores = []
    // const totals = []
    if (players.length == 0) return []
    const rows = players[0].scores.length
    for (let i = 0; i < rows; i++) {
      const row = []
      players.forEach((player) => {
        row.push(player.scores[i])
      })
      _scores.push(row)
    }
    return _scores
  }

  const tableWidth = React.useMemo(() => players > 3 ? '200vw' : '100vw', [players])


  return (
    <>
      {players.length === 0 ?
        (<div style={{ marginTop: '64px', width: '80%' }}>
          <NewGame user={user} />
        </div>)
        : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: { tableWidth }, height: '100%' }} aria-label="Score table" stickyHeader >
            <TableHead>
              <TableRow >
                <StyledTableCell width="50px" sx={{ padding: '0 0 0 20px'}}>#</StyledTableCell>
                {players.map((p, i) => {
                  return <StyledTableCell key={p}
                    sx={{ whiteSpace: 'nowrap',  textDecoration: (((scores.length) % (players.length)) === i ? 'underline wavy 2px' : 'none')  }}
                    align="right"

                  >
                    {p}
                  </StyledTableCell>
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
                  <StyledTableCell component="th" scope="row">{index + 1}</StyledTableCell>
                  {row.map((c, i) => {
                    return <StyledTableCell key={i} align="right">{c}</StyledTableCell>
                  })
                  }
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <StyledTableCell component="th" sx={{ backgroundColor: 'blue', color: 'yellow', fontWeight: 'bold' }} scope="row">Total</StyledTableCell>
                {totals.map((c, i) => {
                  return <StyledTableCell key={i} align="right">{c}</StyledTableCell>
                })
                }
              </TableRow>
            </TableFooter>
            </Table>
        </TableContainer>
      )}
      <Snackbar open={showGlock}
        autoHideDuration={35000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={()=>setShowGlock(false)}
        message="🔫 Glock Round 🔫"
        sx={{
          marginBottom: '30%', width: '260px',
          '&.MuiPaper-root': { backgroundColor: 'yellow', justifyContent: 'center' },
          '&.MuiSnackbarContent-message': { fontSize: '16px'}
        }}
        action={<IconButton size="small" onClick={()=>setShowGlock(false)} color="secondary">
          <Close fontSize="medium" />
        </IconButton>}
      />
      {winner ? <>
          <Confetti style={{margin: '0 auto'}} />
          <Typography variant='h2' className="scale-up-center">{winner}</Typography>
        </> : null}
    </>
  )
}

export default ScoreSheet