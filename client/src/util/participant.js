import { DEMO_ENUM, FIELD_ENUM, PARTICIPANT_CSV_MAP } from "./constants";

/**
 *
 * @param {string} csv Convert participant CSV to JSON
 * @returns
 */
export function participantCsvToJson(csv) {
  console.log(csv);
  const lines = csv;
  const headers = csv[0];

  let active = false;

  if (headers.includes("active")) {
    active = true;
  }

  const json = [];

  for (let i = 1; i < lines.length; i++) {
    const participant = {
      labels: [],
    };
    const currLine = lines[i];
    let isAtRisk = false; // at risk if any of the following are true: pre-diabetes, family history of diabetes, or at risk

    for (let j = 0; j < headers.length; j++) {
      // first column is record_id (aka. participantId)
      if (j === 0) {
        participant[PARTICIPANT_CSV_MAP.record_id] = currLine[j];
      } else if (headers[j] === FIELD_ENUM.AgeYrs) {
        // calculate age range
        const age = parseInt(currLine[j]);

        participant["labels"].push(calcAgeRange(age));
      } else {
        // parse race labels
        if (headers[j].includes(FIELD_ENUM.Race)) {
          const [, raceCode] = headers[j].split("___");

          if (currLine[j] === "1") {
            participant["labels"].push(
              PARTICIPANT_CSV_MAP.race_ethn_race[raceCode]
            );
          }
        } else if (headers[j] === FIELD_ENUM.Sex) {
          // parse sex labels
          if (currLine[j] === "1") {
            participant["labels"].push(
              PARTICIPANT_CSV_MAP[headers[j]][currLine[j]]
            );
          }
        } else if (
          [
            FIELD_ENUM.PreDiabetes,
            FIELD_ENUM.FamHasDiabetes,
            FIELD_ENUM.AtRisk,
          ].includes(headers[j])
        ) {
          // parse diabetes at risk label
          // at risk is true if any of the conditions are true
          isAtRisk = isAtRisk || currLine[j] === "1";
        } else {
          // parse the rest of the binary labels
          if (currLine[j] === "1") {
            participant["labels"].push(PARTICIPANT_CSV_MAP[headers[j]]);
          }
        }
      }
    }

    if (isAtRisk) {
      participant["labels"].push(DEMO_ENUM.Diabetes.AtRisk);
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
