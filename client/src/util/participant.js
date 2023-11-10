/**
 *
 * @param {string} csv Convert participant CSV to JSON
 * @returns
 */
export function participantCsvToJson(csv) {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  let active = false;
  //using active\r as that is the return character and active will always be last

  if (headers.includes("active\r") || headers.includes("active")) {
    active = true;
  }

  const json = [];

  for (let i = 1; i < lines.length; i++) {
    const participant = {};
    const currentLine = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      if (j === 0) {
        participant["participantId"] = currentLine[j];
      } else if (active && j === headers.length - 1) {
        if (
          currentLine[j] !== "" &&
          currentLine[j] !== "\r" &&
          (currentLine[j] === "false\r" || currentLine[j] === "true\r")
        ) {
          participant["active"] = currentLine[j] === "true\r";
        }
      } else {
        if (currentLine[j] !== "" && currentLine[j] !== "\r") {
          participant["labels"] = [
            ...(participant["labels"] ?? []),
            currentLine[j],
          ];
        }
      }
    }

    json.push(participant);
  }

  return json;
}
