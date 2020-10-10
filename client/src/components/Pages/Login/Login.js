import React, { useState, useContext } from 'react';
import './Login.css';
import { BASE_URL } from '../../../common/constants';
import AuthContext from '../../../providers/AuthContext';
import jwtDecode from 'jwt-decode';
import { LanguageContext } from '../../../providers/LanguageProvider';

const Login = (props) => {
    const { setLabels } = useContext(LanguageContext);

    const history = props.history;
    const { setLoginState } = useContext(AuthContext);
    const [errorMsg, setErrorMsg] = useState(null)

    const [user, setUserObject] = useState({
        username: {
            value: '',
            touched: false,
            valid: true,
        },
        password: {
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
        password: [
            value => value?.length >= 4 || setLabels('passwordMinLength'),
            value => value?.length <= 10 || setLabels('passwordMaxLength'),
            value => /[a-zA-Z]/.test(value) || setLabels('passwordRequirement1'),
            value => /[0-9]/.test(value) || setLabels('passwordRequirement2'),
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

    const login = () => {
        fetch(`${BASE_URL}/session `, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user.username.value, password: user.password.value }),
        })
            .then(r => r.json())
            .then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }
                const payload = jwtDecode(result.token);

                if (payload.banEndDate > new Date().toISOString()) {
                    throw new Error(`You are banned until ${payload.banEndDate.toLocaleString().split('T')[0]} ${payload.banEndDate.toLocaleString().split('T')[1].slice(0, 8)}`)
                }

                setLoginState({ isLoggedIn: true, user: payload });
                localStorage.setItem('token', result.token);
                history.push('/homepage');

            })
            .catch(error => setErrorMsg(error.message));
    };

    return (
        <div className="LoginForm">
            <div>
                <h1 className="header">{setLabels('logIn')}</h1>
                <label className="input-username-label" htmlFor="input-username">{setLabels('username')}: </label>
                <input className={"input-username " + getClassNames('username')} type="text" value={user.username.value} onChange={(e) => updateUser('username', e.target.value)} /><br />
                {renderValidationError('username')}<br /><br />
                <label className="input-password-label" htmlFor="input-password">{setLabels('password')}:</label>
                <input className={"input-password " + getClassNames('password')} onKeyDown={(e) => { e.key === 'Enter' && login() }} type="password" value={user.password.value} onChange={(e) => updateUser('password', e.target.value)} /><br /><br />
                <h5 onClick={() => history.push('/forgotten_pass')}>Forgotten password?</h5>
                {renderValidationError('password')}<br /><br />
                {errorMsg && <p className="error" >{errorMsg}</p>}
                <button className="login-button" onClick={login} disabled={validateForm()}>{setLabels('logIn')}</button>
            </div>
        </div>
    )
};
export default Login;