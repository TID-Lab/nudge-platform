const defaultOptions = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

// fetch active participants
async function fetchParticipants() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };

  return fetch("/api/participant/", options)
    .then((res) => res.json())
    .then((resObj) => {
      return resObj.participants;
    });
}

async function fetchTotalParticipants() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch("/api/participant/count", options);
  const count = await res.json().then((resObj) => {
    return resObj.participantCount;
  });
  return count;
}

//this goes to an endpoint in org/index.js in the server side
//that endpoint is the right function it needs to be moved to participants folder and refactored
async function uploadParticipants(parts) {
  const options = {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(parts),
  };
  const res = await fetch("/api/org/uploadPart", options);
  return res.status === 200;
}

// fetch active and inactive participants (all participants)
async function fetchAllParticipants() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };

  return fetch("/api/participant/partwinactive", options)
    .then((res) => res.json())
    .then((resObj) => {
      return resObj.participants;
    });
}

async function changeState(partStates) {
  const options = {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(partStates),
  };

  const res = await fetch("/api/participant/changeState", options);
  return res.status === 200;
}

export {
  fetchTotalParticipants,
  uploadParticipants,
  fetchParticipants,
  fetchAllParticipants,
};
