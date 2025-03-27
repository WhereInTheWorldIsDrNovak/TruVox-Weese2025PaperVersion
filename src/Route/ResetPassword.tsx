import React, {useEffect, useState} from 'react';
import {Typography, Col, Row, Button, Tooltip} from 'antd';
import '../CSS/MainLayout.css';
import {resetPassword} from '../services/authService';
import axios from 'axios';
import {useNavigate, useSearchParams} from 'react-router-dom';
import '../CSS/SignUp.css';
import ValidatedInputField from '../components/ValidatedInputField';
import {PASSWORD_VALIDATION} from '../hooks/useValidations';

const {Title, Paragraph} = Typography;

const fontSizePara = 17;
const fontAlign = 'left';
const paragraphStyle: React.CSSProperties = {
  textAlign: fontAlign,
  fontSize: fontSizePara,
  fontFamily: "'Roboto', 'sans-serif'",
};

interface ResetPasswordProps {
  theme: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({theme}) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null | undefined>(null);
  const [isPasswordValid, setIsPasswordValid] = useState<Boolean>(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState<Boolean>(false);
  const [overrideConfirmPassword, setOverrideConfirmPassword] = useState<
    boolean | undefined
  >(undefined);

  const [token, setToken] = useState<string>('');
  const [requestId, setRequestId] = useState<string>('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const newToken = searchParams.get('token') as string;
    const newRequestId = searchParams.get('requestId') as string;
    if (newToken !== token) setToken(newToken);
    if (newRequestId !== requestId) setRequestId(newRequestId);
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({...userData, [e.target.name]: e.target.value});

    // Because of how confirm password is dependent on password, the status needs to be overridden whenever either component is changed
    if (e.target.name === 'password') {
      const password = e.target.value;
      setOverrideConfirmPassword(password === userData.confirmPassword);
    } else if (e.target.name === 'confirmPassword') {
      const confirmPassword = e.target.value;
      setOverrideConfirmPassword(userData.password === confirmPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(token, requestId);

    if (!isPasswordValid || !doPasswordsMatch) {
      return;
    }

    // Handle submit
    try {
      const response = await resetPassword(
        userData.password as string,
        token as string,
        requestId as string
      );
      if (response?.status === 200) {
        setFormError(null);
        alert(
          'Password successfully reset, please log in using your new password.'
        );
        navigate('/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          setFormError(error.response?.data?.message);
        } else if (status === 500) {
          setFormError('Please try again later');
        } else {
          setFormError(
            error.response?.data?.message ||
              'Unexpected error. Please try again later'
          );
        }
      } else {
        setFormError('Unexpected error. Please try again later');
      }
    }
  };

  return (
    <div className="resetpasswordmain">
      <div className={`customSignUpBorder customSignUpBorder-${theme}`}>
        <Row>
          <Col span={24} style={{display: 'grid', justifyContent: 'center'}}>
            <Title className={`text-${theme}`}>
              Reset{' '}
              <span
                style={{color: '#8d76e3'}}
                className={`customColorfulText-${theme}`}
              >
                Password
              </span>
              <span
                style={{color: '#2b60cb'}}
                className={`customColorfulText2-${theme}`}
              >
                .
              </span>
            </Title>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{display: 'grid'}}>
            <div
              style={{
                width: '30vw',
                display: 'grid',
                justifyContent: 'center',
                justifySelf: 'center',
              }}
            >
              <div style={{height: '3vh'}} />

              <ValidatedInputField
                name="password"
                placeholder="New Password"
                validations={PASSWORD_VALIDATION}
                theme={theme}
                isPassword
                hasTooltip
                globalSetIsValid={setIsPasswordValid}
                onChange={handleInputChange}
                onPressEnter={(e: React.FormEvent) => {
                  document.getElementsByName('confirmPassword')[0].focus();
                }}
              />
              <div style={{height: '3vh'}} />
              <ValidatedInputField
                name="confirmPassword"
                placeholder="Confirm Password"
                validations={[
                  {
                    type: 'string_match',
                    argument: userData.password,
                    errMessage: 'Passwords do not match',
                    tooltipDesc: 'Passwords match',
                  },
                ]}
                theme={theme}
                isPassword
                hasTooltip
                overrideStatus={overrideConfirmPassword}
                globalSetIsValid={setDoPasswordsMatch}
                onChange={handleInputChange}
                onPressEnter={
                  isPasswordValid && doPasswordsMatch ? handleSubmit : undefined
                }
              />
              <div style={{height: '1vh'}} />
              {formError && (
                <p
                  style={{justifySelf: 'center', fontSize: 'calc(9px + 0.5vw)'}}
                  className={`text-${theme}`}
                >
                  {formError}
                </p>
              )}
              <div style={{height: '1vh'}} />
              <Tooltip
                title={
                  isPasswordValid && doPasswordsMatch
                    ? null
                    : 'One or more fields are not filled out properly'
                }
              >
                <Button
                  type="primary"
                  className={`customGradientButton customGradientButton-${theme}`}
                  onClick={handleSubmit}
                  disabled={!(isPasswordValid && doPasswordsMatch)}
                >
                  Submit
                </Button>
              </Tooltip>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ResetPassword;
