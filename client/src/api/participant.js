const defaultOptions = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

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

async function uploadParticipants(parts) {
  const options = {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(parts),
  };
  const res = await fetch("/api/org/uploadPart", options);
  return res.status === 200;
}

export { fetchTotalParticipants, uploadParticipants, fetchParticipants };
