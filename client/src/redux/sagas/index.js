import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import authSaga from './authSaga';
import chatSaga from './chatSaga';
import photoSaga from './photoSaga';
import likeSaga from './likeSaga';
import postSaga from './postSaga';
import commentSaga from "./commentSaga";
import dotenv from 'dotenv';
dotenv.config();

axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

export default function* rootSaga() {
    yield all([fork(authSaga), fork(chatSaga), fork(photoSaga), fork(likeSaga), fork(postSaga), fork(commentSaga)]);
}
