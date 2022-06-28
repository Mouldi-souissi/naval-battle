export const createGrid = (x_lim, y_lim) => {
  let grid = [];

  for (let i = 0; i < x_lim - 1; i++) {
    for (let j = 0; j < y_lim - 1; j++) {
      grid.push({ x: j, y: i, isBoat: false, isHitted: false, shotDate: null });
    }
  }

  for (let i = 2; i <= 5; i++) {
    grid = generateBoat(grid, i);
  }

  return grid;
};

export const addBoat = (boat, grid) => {
  const updatedGrid = grid;

  for (let i in boat) {
    for (let j in updatedGrid) {
      if (boat[i].x === updatedGrid[j].x && boat[i].y === updatedGrid[j].y) {
        updatedGrid[j] = {
          x: updatedGrid[j].x,
          y: updatedGrid[j].y,
          isBoat: true,
          boatType: boat[i].boatType,
          isHitted: false,
          shotDate: null,
        };
      }
    }
  }

  return updatedGrid;
};

export const shoot = (shot, grid) => {
  const { x, y } = shot;
  return grid.map((sq) => {
    if (sq.x === x && sq.y === y) {
      sq.isHitted = true;
      sq.shotDate = Date.now();
    }
    return sq;
  });
};

export const getBoats = (grid) => {
  const boatType_2 = grid.filter((sq) => sq.isBoat && sq.boatType === 2);
  const boatType_3 = grid.filter((sq) => sq.isBoat && sq.boatType === 3);
  const boatType_4 = grid.filter((sq) => sq.isBoat && sq.boatType === 4);
  const boatType_5 = grid.filter((sq) => sq.isBoat && sq.boatType === 5);
  return { boatType_2, boatType_3, boatType_4, boatType_5 };
};

export const checkWin = (grid) => {
  const allBoats = grid.filter((sq) => sq.isBoat);
  const isAlldestroyed = allBoats.every((boat) => boat.isHitted);

  if (isAlldestroyed) {
    return true;
  } else {
    return false;
  }
};

export const pcMove = (grid) => {
  const hittedBoats = grid.filter((sq) => sq.isBoat && sq.isHitted);

  const shootRandomly = (grid) => {
    const targets = grid.filter((sq) => !sq.isHitted);

    const target = targets[getRandomIntInclusive(0, targets.length - 1)];

    return shoot({ x: target.x, y: target.y }, grid);
  };

  const generateRandomDirection = (hit, grid) => {
    const freeSquares = grid.filter((sq) => !sq.isHitted);
    let directions = [];
    let validShots = [];

    if (hit.x + 1 < 8) {
      directions.push({ x: hit.x + 1, y: hit.y });
    }
    if (hit.x - 1 >= 0) {
      directions.push({ x: hit.x - 1, y: hit.y });
    }
    if (hit.y + 1 < 8) {
      directions.push({ x: hit.x, y: hit.y + 1 });
    }
    if (hit.y - 1 >= 0) {
      directions.push({ x: hit.x, y: hit.y - 1 });
    }

    directions.length &&
      directions.forEach((sq) => {
        const valid = freeSquares.find((el) => el.x === sq.x && el.y === sq.y);
        if (valid) {
          validShots.push(sq);
        }
      });

    if (validShots.length) {
      return validShots[getRandomIntInclusive(0, validShots.length - 1)];
    } else {
      return shootRandomly(grid);
    }
  };

  if (!hittedBoats.length) {
    return shootRandomly(grid);
  }

  if (hittedBoats.length) {
    const destroyedBoats = getDestroyedBoats(grid);

    let filtered = [];

    for (let i in hittedBoats) {
      const isDestroyed = destroyedBoats[hittedBoats[i].boatType].isDestroyed;
      if (destroyedBoats && !isDestroyed) {
        filtered.push(hittedBoats[i]);
      }
    }

    if (filtered.length) {
      console.log("enter filtered", filtered);
      let targets = [];
      filtered.forEach((sq) => {
        const adjacent = showAdjacentSquares(sq, grid);
        const notHittedAdjacent = adjacent.filter((sq) => !sq.isHitted);
        if (notHittedAdjacent.length) {
          targets = [...targets, ...notHittedAdjacent];
        }
      });

      if (targets.length) {
        const randomIndex = getRandomIntInclusive(0, targets.length - 1);
        const nextTarget = targets[randomIndex];

        return shoot(nextTarget, grid);
      } else {
        return shootRandomly(grid);
      }
    } else {
      return shootRandomly(grid);
    }
  }
};

export const generateBoat = (grid, boatType) => {
  const freeSquares = grid.filter((sq) => !sq.isBoat);
  const randomFreeSquare =
    freeSquares[getRandomIntInclusive(0, freeSquares.length - 1)];
  const head = { x: randomFreeSquare.x, y: randomFreeSquare.y };
  const randomDirection = getRandomIntInclusive(0, 1)
    ? "vertical"
    : "horizontal";

  const tail = {
    x:
      randomDirection === "horizontal"
        ? randomFreeSquare.x + boatType - 1
        : randomFreeSquare.x,
    y:
      randomDirection === "horizontal"
        ? randomFreeSquare.y
        : randomFreeSquare.y + boatType - 1,
  };

  const getBoatIfpossible = (head, tail) => {
    if (randomDirection === "horizontal") {
      let boat = [];
      for (let i = head.x; i <= tail.x; i++) {
        const square = grid.find((sq) => sq.x === i && sq.y === head.y);
        if (square.isBoat) {
          return false;
        } else {
          boat.push({ ...square, boatType });
        }
      }
      return boat;
    }
    if (randomDirection === "vertical") {
      let boat = [];
      for (let i = head.y; i <= tail.y; i++) {
        const square = grid.find((sq) => sq.y === i && sq.x === head.x);
        if (square.isBoat) {
          return false;
        } else {
          boat.push({ ...square, boatType });
        }
      }
      return boat;
    }
  };
  if (tail.x > 6 || tail.y > 6 || !getBoatIfpossible(head, tail)) {
    return generateBoat(grid, boatType);
  } else {
    const boat = getBoatIfpossible(head, tail);

    return addBoat(boat, grid);
  }
};

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

const getDestroyedBoats = (grid) => {
  const { boatType_2, boatType_3, boatType_4, boatType_5 } = getBoats(grid);

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

  return boatsStatus;
};

export const showAdjacentSquares = (square, grid) => {
  const { x, y } = square;
  let realSquares = [];
  let squares = [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ].filter(
    (square) =>
      // negative limit
      square.x >= 0 &&
      square.y >= 0 &&
      // positive limit
      square.x < 7 &&
      square.y < 7
  );

  for (let sq of squares) {
    const realSq = grid.find(
      (square) => square.x === sq.x && square.y === sq.y
    );
    realSquares.push(realSq);
  }

  return realSquares;
};
