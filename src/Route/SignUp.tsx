import React, {useEffect, useState} from 'react';
import {
  Typography,
  Col,
  Row,
  Button,
  CheckboxProps,
  Checkbox,
  Tooltip,
} from 'antd';
import '../CSS/MainLayout.css';
import {register} from '../services/userService';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import '../CSS/SignUp.css';
import ValidatedInputField from '../components/ValidatedInputField';
import {
  EMAIL_VALIDATION,
  NAME_VALIDATION,
  PASSWORD_VALIDATION,
} from '../hooks/useValidations';

const {Title, Paragraph} = Typography;

const fontSizePara = 17;
const fontAlign = 'center';
const paragraphStyle: React.CSSProperties = {
  textAlign: fontAlign,
  fontSize: fontSizePara,
  fontFamily: "'Roboto', 'sans-serif'",
};

interface SignUpProps {
  theme: string;
}

const SignUp: React.FC<SignUpProps> = ({theme}) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isNameValid, setIsNameValid] = useState<Boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<Boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<Boolean>(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState<Boolean>(false);
  const [isTermsChecked, setIsTermsChecked] = useState<Boolean>(true);
  const [overrideConfirmPassword, setOverrideConfirmPassword] = useState<
    boolean | undefined
  >(undefined);

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

  const onTermsChange: CheckboxProps['onChange'] = e => {
    console.log(`checked = ${e.target.checked}`);
    setIsTermsChecked(e.target.checked);
  };

  const handleSubmit = async () => {
    if (
      userData.username.length === 0 ||
      !isEmailValid ||
      !isPasswordValid ||
      !doPasswordsMatch
    ) {
      return;
    }

    // Handle submit
    try {
      const {confirmPassword, ...filteredUserData} = userData;
      const response = await register(filteredUserData);
      if (response?.status === 201) {
        setFormError(null);
        navigate('/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          setFormError('Email or username already exists. Sign in');
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
    <div className="signupmain">
      <div className={`customSignUpBorder customSignUpBorder-${theme}`}>
        <Row>
          <Col span={24} style={{display: 'grid', justifyContent: 'center'}}>
            <Title className={`text-${theme}`}>
              Sign{' '}
              <span
                style={{color: '#8d76e3'}}
                className={`customColorfulText-${theme}`}
              >
                Up
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
            <div style={{height: '3vh'}} />
            <div
              style={{
                width: '30vw',
                display: 'grid',
                justifyContent: 'center',
                justifySelf: 'center',
              }}
            >
              <ValidatedInputField
                name="username"
                placeholder="Name"
                validations={NAME_VALIDATION}
                theme={theme}
                globalSetIsValid={setIsNameValid}
                onChange={handleInputChange}
                onPressEnter={(e: React.FormEvent) => {
                  document.getElementsByName('email')[0].focus();
                }}
              />
              <div style={{height: '3vh'}} />
              <ValidatedInputField
                name="email"
                placeholder="Email"
                validations={EMAIL_VALIDATION}
                theme={theme}
                globalSetIsValid={setIsEmailValid}
                onChange={handleInputChange}
                onPressEnter={(e: React.FormEvent) => {
                  document.getElementsByName('password')[0].focus();
                }}
              />
              <div style={{height: '3vh'}} />
              <ValidatedInputField
                name="password"
                placeholder="Password"
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
                    argument: [userData.password],
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
                  isNameValid &&
                  isEmailValid &&
                  isPasswordValid &&
                  doPasswordsMatch
                    ? handleSubmit
                    : undefined
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
              {false && (
                <Checkbox
                  onChange={onTermsChange}
                  style={{fontSize: 'calc(9px + 0.25vw)'}}
                >
                  By signing up you accept the{' '}
                  <Link to="/" style={{color: '#807fbc', fontWeight: 'bold'}}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/" style={{color: '#807fbc', fontWeight: 'bold'}}>
                    Privacy Policy
                  </Link>
                </Checkbox>
              )}
              <div style={{height: '1vh'}} />
              <Tooltip
                title={
                  isNameValid &&
                  isEmailValid &&
                  isPasswordValid &&
                  doPasswordsMatch
                    ? null
                    : 'One or more fields are not filled out properly'
                }
              >
                <Button
                  type="primary"
                  className={`customGradientButton customGradientButton-${theme}`}
                  onClick={handleSubmit}
                  disabled={
                    !(
                      isNameValid &&
                      isEmailValid &&
                      isPasswordValid &&
                      doPasswordsMatch
                    )
                  }
                >
                  Submit
                </Button>
              </Tooltip>
              {false && (
                <Link
                  to="/"
                  style={{
                    color: '#807fbc',
                    justifySelf: 'center',
                    fontSize: 'calc(9px + 0.25vw)',
                  }}
                >
                  Privacy Policy
                </Link>
              )}
              <p
                style={{justifySelf: 'center', fontSize: 'calc(9px + 0.5vw)'}}
                className={`text-${theme}`}
              >
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{color: '#807fbc', fontWeight: 'bold'}}
                  className={`customColorfulText-${theme}`}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SignUp;
