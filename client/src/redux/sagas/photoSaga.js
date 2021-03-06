import axios from 'axios';
import { call, put, takeEvery, all, fork } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
    PHOTO_UPLOADING_REQUEST,
    PHOTO_UPLOADING_SUCCESS,
    PHOTO_UPLOADING_FAILURE,
    PHOTO_LIST_REQUEST,
    PHOTO_LIST_SUCCESS,
    PHOTO_LIST_FAILURE,
    BESTPHOTO_LIST_REQUEST,
    BESTPHOTO_LIST_SUCCESS,
    BESTPHOTO_LIST_FAILURE,
    BESTPHOTO_IMAGES_REQUEST,
    BESTPHOTO_IMAGES_SUCCESS,
    BESTPHOTO_IMAGES_FAILURE,
    PHOTO_DERAIL_REQUEST,
    PHOTO_DERAIL_SUCCESS,
    PHOTO_DERAIL_FAILURE,
    PHOTO_DELETE_REQUEST,
    PHOTO_DELETE_SUCCESS,
    PHOTO_DELETE_FAILURE,
    PHOTO_EDIT_UPLOADING_REQUEST,
    PHOTO_EDIT_UPLOADING_SUCCESS,
    PHOTO_EDIT_UPLOADING_FAILURE,
    PHOTO_EDIT_LOADING_REQUEST,
    PHOTO_EDIT_LOADING_SUCCESS,
    PHOTO_EDIT_LOADING_FAILURE,
} from '../types';

// uploading

const photoruploadAPI = (photoData) => {
    console.log(photoData, 'photoData');

    return axios.post('api/photo', photoData);
};

function* photoUpload(action) {
    try {
        const result = yield call(photoruploadAPI, action.payload);
        console.log(result);
        yield put({
            type: PHOTO_UPLOADING_SUCCESS,
            payload: result.data,
        });
        yield put(push(`/photo/${result.data.id}`));
    } catch (e) {
        yield put({
            type: PHOTO_UPLOADING_FAILURE,
            payload: e.response,
        });
        yield put(alert('업로드 실패.'));
    }
}

function* watchphotoUpload() {
    yield takeEvery(PHOTO_UPLOADING_REQUEST, photoUpload);
}

// list get

const photolistAPI = (photoData) => {
    console.log(photoData, 'photoData');

    return axios.get('api/photo/photos', photoData);
};

function* photoList(action) {
    try {
        const result = yield call(photolistAPI, action.payload);
        console.log(result);
        yield put({
            type: PHOTO_LIST_SUCCESS,
            payload: result.data,
        });
    } catch (e) {
        yield put({
            type: PHOTO_LIST_FAILURE,
            payload: e.response,
        });
    }
}

function* watchPhotoList() {
    yield takeEvery(PHOTO_LIST_REQUEST, photoList);
}

// best list get

const bestphotolistAPI = (photoData) => {
    console.log(photoData, 'photoData');

    return axios.get('api/photo/bestphotos', photoData);
};

function* bestphotoList(action) {
    try {
        const result = yield call(bestphotolistAPI, action.payload);
        console.log(result);
        yield put({
            type: BESTPHOTO_LIST_SUCCESS,
            payload: result.data,
        });
    } catch (e) {
        yield put({
            type: BESTPHOTO_LIST_FAILURE,
            payload: e.response,
        });
    }
}

function* watchBestPhotoList() {
    yield takeEvery(BESTPHOTO_LIST_REQUEST, bestphotoList);
}

// best Images get

const bestimagesAPI = (photoData) => {
    console.log(photoData, 'photoData');

    return axios.get('api/photo/bestimages', photoData);
};

function* bestImages(action) {
    try {
        const result = yield call(bestimagesAPI, action.payload);
        console.log(result);
        yield put({
            type: BESTPHOTO_IMAGES_SUCCESS,
            payload: result.data,
        });
    } catch (e) {
        yield put({
            type: BESTPHOTO_IMAGES_FAILURE,
            payload: e.response,
        });
    }
}

function* watchBestImages() {
    yield takeEvery(BESTPHOTO_IMAGES_REQUEST, bestImages);
}

// photo Detail

const photodetailAPI = (id) => {
    console.log(id, 'photoId');

    return axios.get(`/api/photo/getphoto?id=${id}`);
};

function* photoDetail(action) {
    try {
        const result = yield call(photodetailAPI, action.payload);
        console.log(result);
        yield put({
            type: PHOTO_DERAIL_SUCCESS,
            payload: result.data,
        });
    } catch (e) {
        yield put({
            type: PHOTO_DERAIL_FAILURE,
            payload: e.response,
        });
    }
}

function* watchPhotoDetail() {
    yield takeEvery(PHOTO_DERAIL_REQUEST, photoDetail);
}

// photo Delete

const photodeleteAPI = (payload) => {
    console.log(payload, 'delete');

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const token = payload.token;

    if (token) {
        config.headers['x-auth-token'] = token;
    }

    return axios.delete(`/api/photo/${payload.id}`, config);
};

function* photoDelete(action) {
    try {
        const genres = action.payload.genres;

        const result = yield call(photodeleteAPI, action.payload);
        console.log(result);
        yield put({
            type: PHOTO_DELETE_SUCCESS,
            payload: result.data,
        });
        yield put(push(`/photolist/${genres}`));
    } catch (e) {
        yield put({
            type: PHOTO_DELETE_FAILURE,
            payload: e.response,
        });
    }
}

function* watchPhotoDelete() {
    yield takeEvery(PHOTO_DELETE_REQUEST, photoDelete);
}

// Photo Edit Load

const photoEditLoadAPI = (id) => {
    console.log(id, 'editloading');

    return axios.get(`/api/photo/${id}/edit`);
};

function* photoEditLoad(action) {
    try {
        const result = yield call(photoEditLoadAPI, action.payload);
        yield put({
            type: PHOTO_EDIT_LOADING_SUCCESS,
            payload: result.data,
        });
    } catch (e) {
        yield put({
            type: PHOTO_EDIT_LOADING_FAILURE,
            payload: e,
        });
        yield put(push('/'));
    }
}

function* watchPhotoEditLoad() {
    yield takeEvery(PHOTO_EDIT_LOADING_REQUEST, photoEditLoad);
}

// Photo Edit Upload

const PhotoupdateAPI = (PhotoData) => {
    console.log(PhotoData, 'PhotoData');

    return axios.post(`api/photo/${PhotoData.id}/edit`, PhotoData);
};

function* photoUpdate(action) {
    try {
        const result = yield call(PhotoupdateAPI, action.payload);
        console.log(result);
        yield put({
            type: PHOTO_EDIT_UPLOADING_SUCCESS,
            payload: result.data,
        });
        yield put(push(`/photo/${result.data.id}`));
    } catch (e) {
        yield put({
            type: PHOTO_EDIT_UPLOADING_FAILURE,
            payload: e.response,
        });
    }
}

function* watchPhotoUpdate() {
    yield takeEvery(PHOTO_EDIT_UPLOADING_REQUEST, photoUpdate);
}

export default function* photoSaga() {
    yield all([
        fork(watchphotoUpload),
        fork(watchPhotoList),
        fork(watchBestPhotoList),
        fork(watchPhotoDetail),
        fork(watchPhotoDelete),
        fork(watchPhotoEditLoad),
        fork(watchPhotoUpdate),
        fork(watchBestImages),
    ]);
}
