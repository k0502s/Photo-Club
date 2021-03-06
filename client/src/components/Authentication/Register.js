import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CLEAR_ERROR_REQUEST, REGISTER_REQUEST } from '../../redux/types';
import { Modal, ModalHeader, ModalBody, Alert, Form, FormGroup, Input } from 'reactstrap';
import * as S from './Authentication.style';

const Sexes = [
    { key: 1, value: '남' },
    { key: 2, value: '여' },
];
const RegisterModal = () => {
    const [modal, setModal] = useState(false);
    const [Sex, setSex] = useState(0);
    const [form, setValue] = useState({
        name: '',
        email: '',
        password: '',
        camera: '',
    });
    const [localMsg, setLocalMsg] = useState('');
    const { errorMsg1 } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const handleToggle = () => {
        dispatch({
            type: CLEAR_ERROR_REQUEST,
        });
        setModal(!modal);
    };

    useEffect(() => {
        try {
            setLocalMsg(errorMsg1);
        } catch (e) {
            console.error(e);
        }
    }, [errorMsg1]);

    const onChange = (e) => {
        setValue({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const sexChangeHandler = (e) => {
        setSex(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const { name, email, password, camera } = form;

        const newUser = { name, email, password, camera, sex: Sex };
        console.log(newUser, 'newUser');
        dispatch({
            type: REGISTER_REQUEST,
            payload: newUser,
        });
    };
    return (
        <div>
            <S.Btn onClick={handleToggle} block data-testid='register-modal'>
                REGISTER
            </S.Btn>
            <Modal isOpen={modal} toggle={handleToggle}>
                <ModalHeader toggle={handleToggle}>회원 가입</ModalHeader>
                <ModalBody>
                    {localMsg ? <Alert color="danger">{localMsg}</Alert> : null}
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <S.Rlabel for="name">Name</S.Rlabel>
                            <Input type="text" name="name" id="name" placeholder="Name" onChange={onChange} value={form.name} data-testid='register-name'/>
                            <S.Rlabel for="email">Email</S.Rlabel>
                            <Input type="email" name="email" id="email" placeholder="Email" onChange={onChange} value={form.email} data-testid='register-email'/>
                            <S.Rlabel for="password">Password</S.Rlabel>
                            <Input type="password" name="password" id="password" placeholder="Password" onChange={onChange} value={form.password} data-testid='register-password'/>
                            <S.Rlabel for="camera">Camera</S.Rlabel>
                            <Input type="text" name="camera" id="camera" placeholder="Camera" onChange={onChange} value={form.camera} data-testid='register-camera'/>
                            <S.Rinput onChange={sexChangeHandler} value={Sex} name="sex" type="select" id="exampleSelect">
                                <option value="">성별을 선택해주세요</option>
                                {Sexes.map((item) => (
                                    <option key={item.key} value={item.key} data-testid="select-option">
                                        {item.value}
                                    </option>
                                ))}
                            </S.Rinput>
                            <S.Btn block data-testid="register-btn">
                                가입하기
                            </S.Btn>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default RegisterModal;
