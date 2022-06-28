import { createContext, useState, useEffect } from "react";
import { createGrid, shoot, checkWin, pcMove } from "./gameLogic";

export const context = createContext();

export const Provider = (props) => {
  const [grid_player, setGrid_player] = useState([]);
  const [grid_pc, setGrid_pc] = useState([]);
  const [player_won, set_player_won] = useState(false);
  const [pc_won, set_pc_won] = useState(false);

  useEffect(() => {
    setGrid_pc(createGrid(8, 8));
    setGrid_player(createGrid(8, 8));
  }, []);

  const shootPc = (x, y) => {
    const updatedGrid = shoot({ x, y }, grid_pc);
    setGrid_pc(updatedGrid);

    const gridAfterPcMove = pcMove(grid_player);
    setGrid_player(gridAfterPcMove);

    const playerWinning = checkWin(updatedGrid);

    if (playerWinning) {
      set_player_won(true);
    }

    if (checkWin(gridAfterPcMove) && !playerWinning) {
      set_pc_won(true);
    }
  };

  const restart = () => {
    set_player_won(false);
    set_pc_won(false);
    setGrid_pc(createGrid(8, 8));
    setGrid_player(createGrid(8, 8));
  };

  return (
    <context.Provider
      value={{ grid_pc, grid_player, shootPc, player_won, pc_won, restart }}
    >
      {props.children}
    </context.Provider>
  );
};
