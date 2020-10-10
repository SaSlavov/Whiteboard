import React, { useContext, useState } from 'react';
import { BASE_URL } from '../../../common/constants'
import './Register.css'
import { LanguageContext } from '../../../providers/LanguageProvider';

const Register = (props) => {

    const { setLabels } = useContext(LanguageContext);
    const history = props.history;
    const [files, setFiles] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [user, setUserObject] = useState({
        username: {
            value: '',
            touched: false,
            valid: true,
        },
        email: {
            value: '',
            touched: false,
            valid: true,
        },
        password: {
            value: '',
            touched: false,
            valid: true,
        },
        confirm: {
            value: '',
            touched: false,
            valid: true,
        },
    });

    const updateUser = (prop, value) => setUserObject({
        ...user,
        [prop]: {
            value,
            touched: true,
            valid: userValidators[prop].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(value) !== 'string'), true),
        }
    });

    const validateForm = () => !Object
        .keys(user)
        .reduce((isValid, prop) => isValid && user[prop].valid && user[prop].touched, true);

    const userValidators = {
        username: [
            value => value?.length >= 4 || setLabels('usernameMinLength'),
            value => value?.length <= 10 || setLabels('usernameMaxLength'),
        ],
        email: [
            value => /[@]/.test(value) || setLabels('enterValidEmail'),
        ],
        password: [
            value => value?.length >= 4 || setLabels('passwordMinLength'),
            value => value?.length <= 10 || setLabels('passwordMaxLength'),
            value => /[a-zA-Z]/.test(value) || setLabels('passwordRequirement1'),
            value => /[0-9]/.test(value) || setLabels('passwordRequirement2'),
        ],
        confirm: [
            value => value && value === user.password.value || setLabels('confirmWarning')
        ],

    };

    const getValidationErrors = (prop) => {
        return userValidators[prop]
            .map(validatorFn => validatorFn(user[prop].value))
            .filter(value => typeof value === 'string');
    };

    const renderValidationError = prop => user[prop].touched && !user[prop].valid
        ? getValidationErrors(prop).map((error, index) => <p className="error" key={index}>{error}</p>)
        : null;


    const getClassNames = (prop) => {
        let classes = '';
        if (user[prop].touched) {
            classes += 'touched '
        }
        if (user[prop].valid) {
            classes += 'valid ';
        } else {
            classes += 'invalid ';
        }

        return classes;
    };

    const uploadAvatar = (id) => {
        const formData = new FormData();
        if (!files.length) {
            return;
        }
        formData.append('files', files[0])
        fetch(`${BASE_URL}/users/${id}/avatar`, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(console.log)
            .catch(console.warn)
            .finally(() => history.push('/login'))
    }

    const register = () => {
        fetch(`${BASE_URL}/users `, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user.username.value, password: user.password.value, email: user.email.value }),
        })
            .then(r => r.json())
            .then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }
                history.push('/login')
                uploadAvatar(result.id)
            })
            .catch(error => setErrorMsg(error.message))
    }

    return (
        <div className="RegisterForm">
            <h1 className="header">{setLabels('register')}</h1>
            <label className="input-username-label" htmlFor="input-username">{setLabels('username')}: </label>
            <input className={"input-username " + getClassNames('username')} type="text" value={user.username.value} onChange={(e) => updateUser('username', e.target.value)} /><br />
            {renderValidationError('username')}<br /><br />
            <label className="input-email-label" htmlFor="input-email">{setLabels('email')}: </label>
            <input className={"input-email " + getClassNames('email')} type="email" onChange={(e) => updateUser('email', e.target.value)} /> <br />
            {renderValidationError('email')}<br /><br />
            <label className="input-password-label" htmlFor="input-password">{setLabels('password')}:</label>
            <input className={"input-password " + getClassNames('password')} type="password" value={user.password.value} onChange={(e) => updateUser('password', e.target.value)} /><br />
            {renderValidationError('password')}<br /><br />
            <label className="input-password-confirm-label" htmlFor="input-password">{setLabels('confirm')}:</label>
            <input className={"input-password-confirm " + getClassNames('confirm')} onKeyDown={(e) => { e.key === 'Enter' && validateForm() && register() }} type="password" value={user.confirm.value} onChange={(e) => updateUser('confirm', e.target.value)} /><br /><br />
            {renderValidationError('confirm')}<br /><br />
            <button className="register-button" onClick={register} disabled={validateForm()}>{setLabels('register')}</button>
        </div>
    );
};

export default Register;