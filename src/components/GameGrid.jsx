import React, { useContext, useState } from "react";
import { context } from "../gameLogic/Context";
import { getBoats } from "../gameLogic/gameLogic";

const GameGrid = () => {
  const { grid_player, grid_pc, shootPc, player_won, pc_won, restart } =
    useContext(context);

  const playerSquaresClasses = (sq) => {
    const { boatType_2, boatType_3, boatType_4, boatType_5 } =
      getBoats(grid_player);

    const is_boatType_2_destroyed = boatType_2.every((sq) => sq.isHitted);
    const is_boatType_3_destroyed = boatType_3.every((sq) => sq.isHitted);
    const is_boatType_4_destroyed = boatType_4.every((sq) => sq.isHitted);
    const is_boatType_5_destroyed = boatType_5.every((sq) => sq.isHitted);

    const boatsStatus = {
      2: { isDestroyed: is_boatType_2_destroyed },
      3: { isDestroyed: is_boatType_3_destroyed },
      4: { isDestroyed: is_boatType_4_destroyed },
      5: { isDestroyed: is_boatType_5_destroyed },
    };

    if (sq.isBoat && boatsStatus[sq.boatType].isDestroyed) {
      return `square boat void`;
    }
    if (sq.isBoat && !sq.isHitted) {
      return `square boat type_${sq.boatType}`;
    }
    if (sq.isBoat && sq.isHitted) {
      return `square hittedBoat`;
    }
    if (!sq.isBoat && sq.isHitted) {
      return "square hitted";
    }
    return "square";
  };

  const pcSquaresClasses = (sq) => {
    const { boatType_2, boatType_3, boatType_4, boatType_5 } =
      getBoats(grid_pc);

    const is_boatType_2_destroyed = boatType_2.every((sq) => sq.isHitted);
    const is_boatType_3_destroyed = boatType_3.every((sq) => sq.isHitted);
    const is_boatType_4_destroyed = boatType_4.every((sq) => sq.isHitted);
    const is_boatType_5_destroyed = boatType_5.every((sq) => sq.isHitted);

    const boatsStatus = {
      2: { isDestroyed: is_boatType_2_destroyed },
      3: { isDestroyed: is_boatType_3_destroyed },
      4: { isDestroyed: is_boatType_4_destroyed },
      5: { isDestroyed: is_boatType_5_destroyed },
    };

    if (sq.isBoat && boatsStatus[sq.boatType].isDestroyed) {
      return `square boat void`;
    }
    if (sq.isBoat && sq.isHitted) {
      return `square hittedBoat`;
    }
    if (!sq.isBoat && sq.isHitted) {
      return `square hitted`;
    }
    return "square";
  };

  const handleClick = (sq) => {
    if (!player_won && !pc_won) {
      shootPc(sq.x, sq.y);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-dark col-2" onClick={restart}>
          Restart
        </button>
      </div>
      {player_won && <div className="h3 text-center text-success">You win</div>}
      {pc_won && <div className="h3 text-center text-danger">You lose</div>}
      <div className="row">
        <div className="col-md-6 mb-5">
          <div className="grid justify-content-center">
            {grid_player.map((sq, i) => (
              <div key={i} className={playerSquaresClasses(sq)}></div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="grid justify-content-center">
            {grid_pc.map((sq, i) => (
              <div
                key={i}
                className={pcSquaresClasses(sq)}
                onClick={() => handleClick(sq)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameGrid;
