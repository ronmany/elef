import React, { useContext, useState } from "react"
import { collection, query, where, getDocs } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// export const UserContext = React.createContext()

const emptyGame = {
   glock: 5,
   winScore: 1000,
   players: {
      name: "",
      order: 0,
      scores: []
   }
}
const db = initializeApp({
   apiKey: "AIzaSyDgOndJ0SI4x3OvkGfxSte_GrWcnBdLud4",
   authDomain: "elef-1000.firebaseapp.com",
   projectId: "elef-1000",
   storageBucket: "elef-1000.appspot.com",
   messagingSenderId: "755190142959",
   appId: "1:755190142959:web:37bfd8e67e43f65053c81a"
});

const firestore = getFirestore(db);

const GameContext = React.createContext()
const GameUpdateContext = React.createContext()
const GameReadContext = React.createContext()

export function useGame() {
   return useContext(GameContext)
}

export function useGameUpdate() {
   return useContext(GameUpdateContext)
}

export function useGameRead() {
   return useContext(GameReadContext)
}



export function GameProvider({ children }) {
   const [game, setGame] = useState(emptyGame)

   function updateGame(gameData, newScores) {
      if (gameData)
         setGame({
            glock: (gameData.glock === undefined || isNaN(gameData.glock) || gameData.glock < 0 ? 0 : gameData.glock),
            winScore: gameData.winScore || 1000,
            players: {...gameData.player }
         })
      if (newScores) {
         const _players = { ...game.players }
         _players.array.forEach((player, index) => {
            player.scores.push(newScores[index])
         })
      }
   }

   async function getActiveGame(uid) {
      const gamesRef = collection(firestore, `users/${uid}/Games`);
      const q = query(gamesRef, where("Active", "==", true));
      const data = await getDocs(q);
      if (data.empty) return null
      return data.docs[0]
   }

   async function readActiveGame(userId) {
      const game = await getActiveGame(userId)
      if (game) {
         const playersRef = collection(firestore, `users/${userId}/Games/${game.id}/Players`)
         const data = await getDocs(playersRef)
         const playersDoc = data.docs.map((doc) => ({ ...doc.data() }))
         playersDoc.sort((a, b) => a.Order - b.Order)
         const gameDoc = game.data()

         setGame({
            glock: gameDoc.Glock,
            winScore: gameDoc.WinScore || 1000,
            players: { ...playersDoc }
         })
      }
   }

   return (
      <GameContext.Provider value={game}>
         <GameUpdateContext.Provider value={updateGame}>
            <GameReadContext.Provider value={readActiveGame}>
               {children}
            </GameReadContext.Provider>
         </GameUpdateContext.Provider>
      </GameContext.Provider>
   )
}

