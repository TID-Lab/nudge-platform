import { useDispatch } from "react-redux";
import { fetchAssignments } from "../api/nudge";
import { useCallback } from "react";

export function useUpdateAssignmentLists() {
  const dispatch = useDispatch();

  return useCallback(() => {
    fetchAssignments()
      .then((jobs) => {
        const scheduled = jobs.filter(({ lastRunAt }) => !lastRunAt);
        const sent = jobs.filter(({ lastRunAt }) => lastRunAt);

        dispatch({
          type: "scheduledAssignments/set",
          payload: scheduled.map(({ _id, nextRunAt, data }) => {
            return { id: _id, nextRunAt, nudges: data.nudges };
          }),
        });
        dispatch({
          type: "sentAssignments/set",
          payload: sent.map(({ _id, lastRunAt, data }) => {
            return { id: _id, lastRunAt, nudges: data.nudges };
          }),
        });
      })
      .catch((e) => console.log(e));
  }, [dispatch]);
}
