import {nudgeSchema} from '../../models/nudge';
import {authFetch} from 'util/auth';

const defaultOptions = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

async function fetchNudges(){
  const options = {
    ...defaultOptions,
    method: 'GET',
  };
  const res = await fetch('/api/nudge', options);
  const nudges = await res.json().then((nudges) => {
    return [
      ...nudges,
    ];
  });
  return nudges;
}

export{fetchNudges};