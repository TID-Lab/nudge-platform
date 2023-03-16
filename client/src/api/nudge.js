const defaultOptions = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

async function fetchNudges() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch("/api/nudge", options);
  const nudges = await res.json().then((nudges) => {
    return [...nudges];
  });

  return nudges
    .map((nudge, i) => {
      return { ...nudge, key: i };
    })
    .sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
}

async function fetchTotalParticipants() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch("/api/nudge/participantCount", options);
  const count = await res.json().then((resObj) => {
    return resObj.participantCount;
  });
  return count;
}

// console.log("THE FOLLOWING SHOULD BE AN ORDERED LIST OF ASSIGNMENTS IN FORM [{nudge_id, [demographics], [(negative demographic pairings), (negative demographic pairings)]}]");
async function checkNudges(nudges) {
  const options = {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(nudges),
  };
  const res = await fetch("/api/nudge/check", options);
  const checkedNudges = await res.json().then((checkedNudges) => {
    return [...checkedNudges];
  });
  return checkedNudges;
}

async function createNudge(nudge) {
  const options = {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(nudge),
  };

  let res;

  try {
    res = await fetch("/api/nudge", options);
  } catch (err) {
    console.error(`${res.status}: ${err}`);

    return false;
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.status === 200;
}

async function deactivateNudge(id) {
  const options = {
    ...defaultOptions,
    method: "PATCH",
  };

  let res;

  try {
    res = await fetch(`/api/nudge/deactivate/${id}`, options);
  } catch (err) {
    console.error(`${res.status}: ${err}`);

    return false;
  }

  return res.status === 200;
}

// Output (success): [{nudge_id, num_assigned, num_left, success_code}]
// Output (failure object): [{nudge_id, success_code, error_object}]
// NOTE: PREVIOUSLY_ASSIGNED should be handled on the front-end

function handleCheckNudges(nudges) {}

export {
  fetchNudges,
  checkNudges,
  fetchTotalParticipants,
  createNudge,
  deactivateNudge,
};
