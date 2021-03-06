import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SideNav from '../../Nav/SideNav';
import PhotoImage from './Section/PhotoImage';
import { Loader } from '../../Loader/Loader';
import MiniList1 from './Section/MiniList_1';
import MiniList2 from './Section/MiniList_2';
import Map from './Section/map/Map';
import { useSelector, useDispatch } from 'react-redux';
import { BESTPHOTO_IMAGES_REQUEST, POSTS_LIST_REQUEST, PHOTO_LIST_REQUEST, USER_LOADING_REQUEST } from '../../../redux/types';
import { Row } from 'reactstrap';
import * as S from './LandingPage.style';
import LocationDisplay from '../../../utils/LocationDisplay';

const LandingPage = () => {
    const { isLoading } = useSelector((state) => state.photo);
    const dispatch = useDispatch();
    const getRequestParams = (cty) => {
        let params = {};

        params.page = 0;

        params.size = 9;

        params.category = cty;

        return params;
    };

    useEffect(() => {
        const params = getRequestParams(1);
        dispatch({
            type: BESTPHOTO_IMAGES_REQUEST,
        });
        dispatch({
            type: POSTS_LIST_REQUEST,
            payload: { params },
        });
        dispatch({
            type: USER_LOADING_REQUEST,
            payload: localStorage.getItem('token'),
        });
    }, []);
    useEffect(() => {
        const params = getRequestParams();
        dispatch({
            type: PHOTO_LIST_REQUEST,
            payload: { params },
        });
    }, []);

    const body = (
        <>
            <Row>
                <S.HomeWrap md={{ size: 3, offset: 1 }}>
                    <SideNav />
                    <S.HomeWrap display={'none'} Mdisplay={'block'} Mmargintop={'-10px'}>
                        <PhotoImage />
                    </S.HomeWrap>
                    <S.HomeWrap margintop={'40px'}>
                        <MiniList1 />
                    </S.HomeWrap>
                    <S.HomeWrap margintop={'40px'}>
                        <MiniList2 />
                    </S.HomeWrap>
                </S.HomeWrap>
                <S.HomeWrap md={7} margintop={'20px'}>
                    <S.HomeWrap marginbottom={'20px'} Mdisplay={'none'}>
                        <S.HomeCard>
                            <S.HomeCardheader>
                                <S.TrophyIcon />
                                ????????? ?????? ????????? ??????
                                <small>???????????? ?????? ???????????? ???????????? ???????????? ????????????!</small>
                            </S.HomeCardheader>
                            <S.HomeCardbody>
                                <PhotoImage />
                            </S.HomeCardbody>
                            <S.HomeCardfooter>????????? ??????????????? ?????? ?????? ?????? ??????????????????. ??? ????????? ???????????? ????????? ???????????????! </S.HomeCardfooter>
                        </S.HomeCard>
                    </S.HomeWrap>
                    <S.HomeWrap marginbottom={'60px'} Mmarginbottom={'60px'} Mmargintop={'20px'}>
                        <S.HomeCard>
                            <S.HomeCardheader>
                                <S.MapIcon />
                                ?????? ?????? ??????
                                <small>?????? ????????? ?????? ????????? ????????? ??????????????????!</small>
                            </S.HomeCardheader>
                            <Map />
                        </S.HomeCard>
                    </S.HomeWrap>
                </S.HomeWrap>
            </Row>
        </>
    );
    const sideBody = <></>;
    return (
        <>
            <Helmet title={`?????? ?????????`} />
            {isLoading === true ? Loader : body}
            <LocationDisplay />
        </>
    );
};

export default LandingPage;
