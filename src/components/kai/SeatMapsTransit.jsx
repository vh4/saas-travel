import { useEffect } from "react";

export const SeatMapTransit = ({
  isNumberTrainPassenger,
  seats,
  changeState,
  setChangeSet,
  clickSeatsData,
  selectedCount,
  setSelectedCount,
  setgerbongsamawajib,
  gerbongsamawajib,
  selectedCheckboxes,
  setSelectedCheckboxes,
}) => {
  const groupColumnCounts = {};
  const rowCount = Math.max(...seats.map((seat) => seat.row));

  seats.forEach((seat) => {
    const groupKey = `${seat.groupColumn}-${seat.row}`;
    if (!groupColumnCounts[groupKey]) {
      groupColumnCounts[groupKey] = 0;
    }
    if (seat.isFilled === 0) {
      groupColumnCounts[groupKey]++;
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function limitFunction() {
    var x = 0;
    changeState[0][isNumberTrainPassenger].map((e, i) => {
      if (e.type == "adult") {
        x = x + 1;
      } else {
        x = x + 0;
      }
    });
    return x;
  }

  const limit = limitFunction();
  const handleOnChange = (e, row, cols, seats) => {
    if (e.target.checked) {
      if (selectedCount < limit) {
        setSelectedCount(selectedCount + 1);
        setgerbongsamawajib(gerbongsamawajib + 1);

        const handlersetSelectedCheckboxes = (prevSelectedCheckboxes) => {
          if (
            prevSelectedCheckboxes.includes(
              `${row}-${cols}-${parseInt(clickSeatsData) + 1}`
            )
          ) {
            return prevSelectedCheckboxes.filter(
              (checkbox) =>
                checkbox !== `${row}-${cols}-${parseInt(clickSeatsData) + 1}`
            );
          } else {
            return [
              ...prevSelectedCheckboxes,
              `${row}-${cols}-${parseInt(clickSeatsData) + 1}`,
            ];
          }
        };

        setSelectedCheckboxes(handlersetSelectedCheckboxes(selectedCheckboxes));

        const changeStateData = changeState[0];
        const tolong = handlersetSelectedCheckboxes(selectedCheckboxes);

        const splittingSeat = tolong[selectedCount].split("-");
        changeStateData[isNumberTrainPassenger][selectedCount].row = parseInt(
          splittingSeat[0]
        );
        changeStateData[isNumberTrainPassenger][selectedCount].type = "adult";
        changeStateData[isNumberTrainPassenger][selectedCount].column =
          splittingSeat[1];
        changeStateData[isNumberTrainPassenger][selectedCount].wagonNumber =
          parseInt(splittingSeat[2]);

        setChangeSet([changeStateData]);
      } else {
        alert("Melebihi jumlah penumpang.");
        e.target.checked = false;
      }
    } else {
      setSelectedCount(selectedCount - 1);
      setgerbongsamawajib(gerbongsamawajib - 1);

      const updateSelectedCheckboxes = (
        prevSelectedCheckboxes,
        row,
        cols,
        clickSeatsData
      ) => {
        if (
          prevSelectedCheckboxes.includes(
            `${row}-${cols}-${parseInt(clickSeatsData) + 1}`
          )
        ) {
          return prevSelectedCheckboxes.filter(
            (checkbox) =>
              checkbox !== `${row}-${cols}-${parseInt(clickSeatsData) + 1}`
          );
        } else {
          return [
            ...prevSelectedCheckboxes,
            `${row}-${cols}-${parseInt(clickSeatsData) + 1}`,
          ];
        }
      };

      const tolong = updateSelectedCheckboxes(
        selectedCheckboxes,
        row,
        cols,
        clickSeatsData
      );

      setSelectedCheckboxes(tolong);

      const changeStateData = changeState[0];

      const splittingSeat = tolong[selectedCount].split("-");
      changeStateData[isNumberTrainPassenger][selectedCount].row = parseInt(
        splittingSeat[0]
      );
      changeStateData[isNumberTrainPassenger][selectedCount].type = "adult";
      changeStateData[isNumberTrainPassenger][selectedCount].column =
        splittingSeat[1];
      changeStateData[isNumberTrainPassenger][selectedCount].wagonNumber =
        parseInt(splittingSeat[2]);

      setChangeSet([changeStateData]);
    }
  };

  return (
    <div className="flex space-x-0 md:space-x-2 justify-center">
      <div className="">
        {Array.from({ length: rowCount }, (_, index) => (
          <div className="block py-2 pl-0 md:pl-4">
            <div class="select-none w-4 h-10 font-medium xl:font-bold rounded-lg">
              <div key={index} class="py-2 text-center text-black">
                {index + 1}.
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-rows-10 grid-cols-4 md:grid-cols-5">
        {seats.map((seat, i) => {
          const { row, column, class: seatClass, isFilled } = seat;
          return (
            <>
              {seats.length <= 80 && (
                <div
                  key={`${row}-${column}`}
                  className={`
								  seat ${column}80
								  ${row > 2 ? "" : ""}
								`}
                >
                  {isFilled === 0 ? (
                    <label
                      class={`block py-2 pl-2 items-center cursor-pointer`}
                    >
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleOnChange(e, seat.row, seat.column, seat)
                        }
                        class="sr-only peer"
                      />
                      <div class="select-none  w-10 text-blue-700 h-10 bg-blue-700 peer-checked:text-black font-medium xl:font-bold peer-checked:border peer-checked:bg-white rounded-lg">
                        <div class="py-2 text-center">
                          {seat.row}
                          {seat.column}
                        </div>
                      </div>
                    </label>
                  ) : (
                    <label
                      class={`select-none block py-2 pl-2 items-center cursor-pointer`}
                    >
                      <div class="w-10 text-white-500 h-10 bg-gray-500 peer-focus:outline-none rounded-lg">
                        <div class="flex justify-center py-2.5">X</div>
                      </div>
                    </label>
                  )}
                </div>
              )}

              {seats.length > 80 && (
                <div
                  key={`${row}-${column}`}
                  className={`
								  seat ${column}106
								  ${row > 2 ? "" : ""}
								`}
                >
                  {isFilled === 0 ? (
                    <label
                      class={`block py-2 pl-2  items-center cursor-pointer`}
                    >
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleOnChange(e, seat.row, seat.column)
                        }
                        class="sr-only peer"
                      />
                      <div class="select-none  w-10 text-blue-700 h-10 bg-blue-700 peer-checked:text-black font-medium xl:font-bold peer-checked:border peer-checked:bg-white rounded-lg">
                        <div class="py-2 text-center">
                          {seat.row}
                          {seat.column}
                        </div>
                      </div>
                    </label>
                  ) : (
                    <label
                      class={`select-none block py-2 pl-2 items-center cursor-pointer`}
                    >
                      <div class="w-10 text-white-500 h-10 bg-gray-500 peer-focus:outline-none rounded-lg">
                        <div class="text-center py-2.5 px-3.5">X</div>
                      </div>
                    </label>
                  )}
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};
