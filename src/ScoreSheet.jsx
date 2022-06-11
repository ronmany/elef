import React from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore';


function ScoreSheet({ firestore, userId="user-Id" }) {

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
        const players = data.docs.map((doc) => ({ ...doc.data() }))
        players.sort((a, b) => a.Order - b.Order)
        //console.log(data.docs.map((doc) => ({...doc.data() })))
        setScores(playersToScores(players))
      }
    }
    readActiveGame();
  }, [userId])


  return (
    <div>
      {(scores.length > 0) ? (
        scores.map((row, index) => {
          return (
            <li key={index}>{index + 1}: {row.join(", ")}</li>
          )
        })
      )
        : (<h2>No Active Games</h2>)
      }
    </div>
  )
}

export default ScoreSheet