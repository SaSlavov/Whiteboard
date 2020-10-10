import React, { useContext, useState } from 'react'
import { BASE_URL } from '../../../common/constants';
import { LanguageContext } from '../../../providers/LanguageProvider';
import './ForgottenPassword.css'

const ForgottenPassword = (props) => {
    const { setLabels } = useContext(LanguageContext);
    const [path, setPath] = useState(props.location.pathname)
    const [msg, setMsg] = useState(null)
    const userId = +props.location.pathname.split('/').pop()
    const history = props.history
    const [newPass, setNewPass] = useState({
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
        email: {
            value: '',
            touched: false,
            valid: true,
        },
    })

    const updateUser = (prop, value) => setNewPass({
        ...newPass,
        [prop]: {
            value,
            touched: true,
            valid: userValidators[prop].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(value) !== 'string'), true),
        }
    });

    const validateForm = () => !Object
        .keys(newPass)
        .reduce((isValid, prop) => isValid && newPass[prop].valid && newPass[prop].touched, true);

    const userValidators = {
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
            value => value && value === newPass.password.value || setLabels('confirmWarning')
        ],
    };

    const getValidationErrors = (prop) => {
        return userValidators[prop]
            .map(validatorFn => validatorFn(newPass[prop].value))
            .filter(value => typeof value === 'string');
    };

    const renderValidationError = prop => newPass[prop].touched && !newPass[prop].valid
        ? getValidationErrors(prop).map((error, index) => <p className="error" key={index}>{error}</p>)
        : null;

    const getClassNames = (prop) => {
        let classes = '';
        if (newPass[prop].touched) {
            classes += 'touched '
        }
        if (newPass[prop].valid) {
            classes += 'valid ';
        } else {
            classes += 'invalid ';
        }

        return classes;
    };

    const sendMail = () => {
        fetch(`${BASE_URL}/users/recover_email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: newPass.email.value }),
        })
            .then(r => r.json())
            .then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }
                setMsg(result.msg)
            })
    }
    const changePassword = () => {
        fetch(`${BASE_URL}/users/${userId}/recover_pass`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPass: newPass.password }),
        })
            .then(r => r.json())
            .then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }
                history.push('/login')

            })
    }
    return (
        <>
            {path === '/forgotten_pass'
                ? <div className="LoginForm">
                    {msg
                        ? <h3 className="rcv_msg">{setLabels('recoverPassMsg')}</h3>
                        : <> <h1 className="header">{setLabels('resetPass')}</h1>
                            <div className="email-container">
                                <label className="input-username-label" htmlFor="input-username">{setLabels('email')}: </label>
                                <input className={"input-email " + getClassNames('email')} type="text" value={newPass.email.value} onChange={(e) => updateUser('email', e.target.value)} />
                                {renderValidationError('email')}
                            </div>
                            <button className="send-email" onClick={sendMail}>{setLabels('send')}</button>
                        </>
                    }
                </div>
                : <div className="LoginForm">
                    <h1 className="header">{setLabels('resetPass')}</h1>
                    <div className="new-pass-container">
                        <label className="input-new-pass-label" htmlFor="new-pass">{setLabels('newPass')} :</label>
                        <input className={"input-password " + getClassNames('password')} type="password" value={newPass.password.value} onChange={(e) => updateUser('password', e.target.value)} /><br />
                        {renderValidationError('password')}
                    </div>
                    <div className="confirm-pass-container">
                        <label className="input-password-confirm-label" htmlFor="input-password">{setLabels('confirm')}:</label>
                        <input className={"input-password-confirm " + getClassNames('confirm')} value={newPass.confirm.value} type="password" onChange={(e) => updateUser('confirm', e.target.value)} /><br />
                        {renderValidationError('confirm')}
                    </div>
                    <button className="change-pass-btn" onClick={changePassword} disabled={false}>{setLabels('change')}</button>
                </div>
            }

        </>
    )
}

export default ForgottenPassword