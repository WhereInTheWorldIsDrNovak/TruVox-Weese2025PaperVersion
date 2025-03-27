import React, {useState} from 'react';
import {Typography, Col, Row, Input, Button, CheckboxProps} from 'antd';
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import '../CSS/MainLayout.css';
import {login} from '../services/authService';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import ValidatedInputField from './ValidatedInputField';
import {EMAIL_VALIDATION, PASSWORD_VALIDATION} from '../hooks/useValidations';

const {Title, Paragraph} = Typography;

const fontSizePara = 17;
const fontAlign = 'center';
const paragraphStyle: React.CSSProperties = {
  textAlign: fontAlign,
  fontSize: fontSizePara,
  fontFamily: "'Roboto', 'sans-serif'",
};

const onTermsChange: CheckboxProps['onChange'] = e => {
  console.log(`checked = ${e.target.checked}`);
};

interface LogInComponentProps {
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  theme: string;
  placement: string;
  isModalOpen: boolean | undefined;
  setIsModalOpen: ((b: boolean) => void) | undefined;
}

const LogInComponent: React.FC<LogInComponentProps> = ({
  setIsSignedIn,
  setUsername,
  theme,
  placement,
  isModalOpen,
  setIsModalOpen,
}) => {
  const navigate = useNavigate();
  const [isEmailValid, setIsEmailValid] = useState<Boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<Boolean>(false);
  const [isSignInInfoValid, setIsSignInInfoValid] = useState<Boolean>(true);
  const [userData, setUserData] = useState({email: '', password: ''});
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({...userData, [e.target.name]: e.target.value});
  };

  const handleCloseSettings = () => {
    if (setIsModalOpen) {
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!isEmailValid || !isPasswordValid) {
      setIsSignInInfoValid(false);
      setFormError(null);
      return;
    }

    // Handle submit
    try {
      const response = await login(userData);
      if (response?.status === 200) {
        setIsSignInInfoValid(true);
        setIsSignedIn(true);
        setUsername(response?.data?.username);
        setFormError(null);
        navigate('/'); // Redirect to MainLayout
      } else {
        setIsSignInInfoValid(false);
        setFormError(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        // Handle specific server-side error messages
        if (status === 401) {
          setIsSignInInfoValid(false);
          if (error.response?.data?.message) {
            if (
              error.response?.data?.message === 'User not found' ||
              error.response?.data?.message === 'Invalid Password'
            ) {
              // setFormError(error.response?.data?.message);
              // handled by isSignInfoValid
              setFormError(null);
            }
          }
        } else if (status === 500) {
          setFormError('Please try again');
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
    <div>
      <Row>
        <Col span={24} style={{display: 'grid', justifyContent: 'center'}}>
          <Title
            style={{fontSize: placement === 'page' ? '' : '25px'}}
            className={`text-${theme}`}
          >
            Sign{' '}
            <span
              style={{color: '#8d76e3'}}
              className={`customColorfulText-${theme}`}
            >
              In
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
          <div style={{height: '5%'}} />
          <div
            style={{
              width: '30%',
              display: 'grid',
              justifyContent: 'center',
              justifySelf: 'center',
            }}
          >
            <ValidatedInputField
              name="email"
              placeholder="Email"
              validations={EMAIL_VALIDATION}
              theme={theme}
              overrideVisualStatus={isSignInInfoValid ? null : 'error'}
              globalSetIsValid={setIsEmailValid}
              onChange={handleInputChange}
              onPressEnter={(e: React.FormEvent) => {
                document.getElementsByName('password')[0].focus();
              }}
              style={placement === 'page' ? undefined : {width: '100%'}}
            />
            <div style={{height: placement === 'page' ? '5vh' : '2vh'}} />
            <ValidatedInputField
              name="password"
              placeholder="Password"
              validations={PASSWORD_VALIDATION}
              theme={theme}
              isPassword
              overrideVisualStatus={isSignInInfoValid ? null : 'error'}
              globalSetIsValid={setIsPasswordValid}
              onChange={handleInputChange}
              onPressEnter={handleSubmit}
              style={placement === 'page' ? undefined : {width: '100%'}}
            />
            {!isSignInInfoValid && (
              <p
                style={{
                  color: '#ffa39e',
                  fontSize: 'calc(9px + 0.25vw)',
                  justifySelf: 'center',
                  marginTop: 0,
                }}
              >
                Email or Password incorrect
              </p>
            )}
            {formError && (
              <p
                style={{justifySelf: 'center', fontSize: 'calc(9px + 0.5vw)'}}
                className={`text-${theme}`}
              >
                {formError}
              </p>
            )}
            <div
              style={{
                height:
                  placement === 'page'
                    ? isSignInInfoValid
                      ? '15vh'
                      : '13vh'
                    : isSignInInfoValid
                      ? '2vh'
                      : '1vh',
              }}
            />
            <Button
              type="primary"
              className={`customGradientButton customGradientButton-${theme}`}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <p
              style={{justifySelf: 'center', fontSize: 'calc(9px + 0.5vw)'}}
              className={`text-${theme}`}
            >
              Don't have an account?{' '}
              <Link
                to="/signup"
                style={{color: '#807fbc', fontWeight: 'bold'}}
                onClick={isModalOpen ? handleCloseSettings : () => {}}
                className={`customColorfulText-${theme}`}
              >
                Sign Up
              </Link>
            </p>
            <p
              style={{
                justifySelf: 'center',
                fontSize: 'calc(9px + 0.5vw)',
                marginTop: 0,
              }}
            >
              <Link
                to="/forgot-password"
                style={{color: '#807fbc', fontWeight: 'bold'}}
                onClick={isModalOpen ? handleCloseSettings : () => {}}
                className={`customColorfulText-${theme}`}
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LogInComponent;
