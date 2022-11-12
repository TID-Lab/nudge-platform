import './index.css';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { fetchNudges } from '../../api/nudge';

console.log(fetchNudges());
