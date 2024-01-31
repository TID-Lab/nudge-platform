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

/** Maybe move assignment related APIs to new file */

async function fetchAssignments() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch("/api/assignment", options);
  const jobs = await res.json().then((jobs) => jobs);

  return jobs;
}

async function cancelSchedule(id) {
  const options = {
    ...defaultOptions,
    method: "DELETE",
  };

  fetch(`/api/assignment/${id}`, options);
}

async function reSchedule(id, newTime) {
  const temp_body = { the_id: id, the_time: newTime };
  const options = {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(temp_body),
  };
  const res = await fetch("/api/assignment/reschedule", options);
}

// console.log("THE FOLLOWING SHOULD BE AN ORDERED LIST OF ASSIGNMENTS IN FORM [{nudge_id, [demographics], [(negative demographic pairings), (negative demographic pairings)]}]");
async function checkAssignment(nudges) {
  const options = {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(formatNudges(nudges)),
  };
  const res = await fetch("/api/assignment/check", options);
  const checkedNudges = await res.json().then((checkedNudges) => {
    return [...checkedNudges];
  });
  return checkedNudges;
}

// console.log("THE FOLLOWING SHOULD BE AN ORDERED LIST OF ASSIGNMENTS IN FORM [{nudge_id, [demographics], [(negative demographic pairings), (negative demographic pairings)]}]");
// If isSchedule = True, then timeToSend should be a Date to send (that is in the future!)
async function dispatchAssignment(nudges, isScheduled, timeToSend = null) {
  const options = {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify({
      nudges: nudges,
      assignments: formatNudges(nudges),
      isScheduled: isScheduled,
      timeToSend: timeToSend,
    }),
  };
  const res = await fetch("/api/assignment/assign", options);
  const checkedNudges = await res.json().then((checkedNudges) => {
    return [...checkedNudges];
  });

  return checkedNudges;
}

export {
  fetchNudges,
  fetchAssignments,
  cancelSchedule,
  checkAssignment,
  dispatchAssignment,
  createNudge,
  deactivateNudge,
  reSchedule,
};

// Helper function to format nudges for assignments
function formatNudges(nudges) {
  return nudges.map((nudge) => {
    return {
      nudge_id: nudge.id,
      demographics: nudge.demographics,
      nudge_message: nudge.text,
    };
  });
}
