import React, { useContext, useState } from "react"
import { collection, query, where, getDocs, updateDoc, addDoc, Timestamp, doc } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// export const UserContext = React.createContext()

// const emptyGame = {
//    glock: 5,
//    winScore: 1000,
//    players: {
//       name: "",
//       order: 0,
//       scores: []
//    }
// }

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
const GameWriteContext = React.createContext()

export function useGame() {
   return useContext(GameContext)
}

export function useGameUpdate() {
   return useContext(GameUpdateContext)
}

export function useGameRead() {
   return useContext(GameReadContext)
}

export function useGameWrite() {
   return useContext(GameWriteContext)
}



export function GameProvider({ children }) {
   const [game, setGame] = useState({})

   function updateGame(user, newScores) {
      const _players = [ ...game.players ]
      console.log("_players:", _players)
      _players.forEach((player, index) => {
         player.scores.push(Number(newScores[index]))
      })
      setGame({ ...game })
      writeGame(user)
   }

   async function getActiveGame(uid) {
      const gamesRef = collection(firestore, `users/${uid}/Games`);
      const q = query(gamesRef, where("active", "==", true));
      const data = await getDocs(q);
      if (data.empty) return null
      return data.docs[0]
   }

   async function readActiveGame(user) {
      const _game = await getActiveGame(user.uid)
      if (_game) {
         const gameDoc = _game.data()
         // console.log("Game read from db:", _game)
         setGame({
            id: _game.id,
            glock: gameDoc.glock,
            winScore: gameDoc.winScore || 1000,
            players: gameDoc.players
         })
      }
   }

   async function writeGame(user, newGame) {
      if (newGame) {
         //Mark all existing games inactive...
         const gamesRef = collection(firestore, `users/${user.uid}/Games`);
         const q = query(gamesRef, where("active", "==", true))
         const data = await getDocs(q)
         if (!data.empty) {
            data.docs.forEach(async (activeGame) => {
               console.log("Active Game:", activeGame)
               await updateDoc(activeGame.ref, { active: false })
            })
         }
         //Add new game data...
         console.log("newGame:", newGame)
         const gameData = {
            active: true,
            startTime: Timestamp.fromDate(new Date()),
            winScore: newGame.winScore,
            glock: newGame.glock,
            players: newGame.players.map((p, i) => {
               return {
                  name: p.name, order: i + 1, scores: []
               }
            })
         }
         console.log("gameData:", gameData)
         const gameRef = await addDoc(gamesRef, gameData)
        //update local game const...
         setGame({
            id: gameRef.id,
            glock: newGame.glock,
            winScore: newGame.winScore,
            players: newGame.players
         })
      } else {
         //update current game...
         const activeGame = doc(firestore, `users/${user.uid}/Games/${game.id}`)
         await updateDoc(activeGame, {
            id: game.id,
            active: true,
            glock: game.glock,
            winScore: game.winScore,
            players: game.players
         })
      }
   }

   return (
      <GameContext.Provider value={game}>
         <GameUpdateContext.Provider value={updateGame}>
            <GameReadContext.Provider value={readActiveGame}>
               <GameWriteContext.Provider value={writeGame}>
                  {children}
               </GameWriteContext.Provider>
            </GameReadContext.Provider>
         </GameUpdateContext.Provider>
      </GameContext.Provider>
   )
}

