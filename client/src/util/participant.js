import { DEMO_ENUM, FIELD_ENUM, PARTICIPANT_CSV_MAP } from "./constants";

/**
 *
 * @param {string} csv Convert participant CSV to JSON
 * @returns
 */
export function participantCsvToJson(csv) {
  const lines = csv.replace(/(\r)/gm, "").split("\n");
  const headers = lines[0].split(",");

  let active = false;

  if (headers.includes("active")) {
    active = true;
  }

  const json = [];

  for (let i = 1; i < lines.length; i++) {
    const participant = {
      labels: [],
    };
    const currLine = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      if (j === 0) {
        participant[PARTICIPANT_CSV_MAP.record_id] = currLine[j];
      } else if (headers[j] === FIELD_ENUM.AgeYrs) {
        const age = parseInt(currLine[j]);

        participant["labels"].push(calcAgeRange(age));
      } else {
        //
        if (headers[j].includes(FIELD_ENUM.Race)) {
          const [, raceCode] = headers[j].split("___");

          if (currLine[j].includes("1")) {
            participant["labels"].push(
              PARTICIPANT_CSV_MAP.race_ethn_race[raceCode]
            );
          }
        } else if (headers[j] === FIELD_ENUM.Sex) {
          if (currLine[j].includes("1")) {
            participant["labels"].push(
              PARTICIPANT_CSV_MAP[headers[j]][currLine[j]]
            );
          }
        } else {
          if (currLine[j].includes("1")) {
            participant["labels"].push(PARTICIPANT_CSV_MAP[headers[j]]);
          }
        }
      }
    }

    json.push(participant);
  }

  return json;
}

function calcAgeRange(age) {
  if (age >= 18 && age <= 29) {
    return DEMO_ENUM.Age[0];
  } else if (age >= 30 && age <= 40) {
    return DEMO_ENUM.Age[1];
  } else if (age >= 41 && age <= 50) {
    return DEMO_ENUM.Age[2];
  } else if (age >= 51 && age <= 64) {
    return DEMO_ENUM.Age[3];
  } else if (age >= 65) {
    return DEMO_ENUM.Age[4];
  }
}
