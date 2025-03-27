import React, {useState} from 'react';
import {Typography, Col, Row, Input, Button, CheckboxProps} from 'antd';
import '../CSS/MainLayout.css';
import {forgotPassword} from '../services/authService';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import '../CSS/SignUp.css';
import ValidatedInputField from '../components/ValidatedInputField';
import {EMAIL_VALIDATION} from '../hooks/useValidations';

const {Title, Paragraph} = Typography;

const fontSizePara = 17;
const fontAlign = 'center';
const paragraphStyle: React.CSSProperties = {
  textAlign: fontAlign,
  fontSize: fontSizePara,
  fontFamily: "'Roboto', 'sans-serif'",
};

interface ForgotPasswordProps {
  theme: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({theme}) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<Boolean>(true);
  const [doesUserExist, setDoesUserExist] = useState<Boolean>(false);
  const [isTermsChecked, setIsTermsChecked] = useState<Boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({...userData, [e.target.name]: e.target.value});
  };
  const onTermsChange: CheckboxProps['onChange'] = e => {
    console.log(`checked = ${e.target.checked}`);
    setIsTermsChecked(e.target.checked);
  };

  const handleSubmit = async () => {
    if (!isEmailValid) {
      setFormError('Email not found');
      return;
    }
    // Handle submit
    try {
      const response = await forgotPassword(userData);
      if (response?.status === 200) {
        setFormError(response?.data?.message || null);
        // navigate('/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          setFormError('Error occured. Status 400.');
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
    <div className="forgotpasswordmain">
      <div className={`customSignUpBorder customSignUpBorder-${theme}`}>
        <Row>
          <Col span={24} style={{display: 'grid', justifyContent: 'center'}}>
            <Title className={`text-${theme}`}>
              Forgot{' '}
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
                name="email"
                placeholder="Email"
                validations={EMAIL_VALIDATION}
                theme={theme}
                overrideVisualStatus={null}
                globalSetIsValid={setIsEmailValid}
                onChange={handleInputChange}
                onPressEnter={handleSubmit}
              />
              <div style={{height: '3vh'}} />
              {formError && (
                <p
                  style={{justifySelf: 'center', fontSize: 'calc(9px + 0.5vw)'}}
                  className={`text-${theme}`}
                >
                  {formError}
                </p>
              )}
              <div style={{height: '1vh'}} />
              <Button
                type="primary"
                className={`customGradientButton customGradientButton-${theme}`}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              {false && (
                <a
                  href="/"
                  style={{
                    color: '#807fbc',
                    justifySelf: 'center',
                    fontSize: 'calc(9px + 0.25vw)',
                  }}
                >
                  Privacy Policy
                </a>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ForgotPassword;
