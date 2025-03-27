import React, {useState} from 'react';
import {Typography, Col, Row, Button, Tooltip} from 'antd';
import '../CSS/MainLayout.css';
import {changePassword} from '../services/userService';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import '../CSS/SignUp.css';
import ValidatedInputField from '../components/ValidatedInputField';
import {Validation} from '../types/configTypes';

const {Title} = Typography;

const fontSizePara = 17;
const fontAlign = 'left';
const paragraphStyle: React.CSSProperties = {
  textAlign: fontAlign,
  fontSize: fontSizePara,
  fontFamily: "'Roboto', 'sans-serif'",
};

const PASSWORD_VALIDATION: Validation[] = [
  {
    type: 'length',
    argument: 8,
    errMessage: 'Password must be at least 8 characters long',
    tooltipDesc: '8 Characters',
  },
  {
    type: 'regex_test',
    argument: /[a-z]/,
    errMessage: 'Password must include at least 1 lowercase letter',
    tooltipDesc: 'A lowercase letter',
  },
  {
    type: 'regex_test',
    argument: /[A-Z]/,
    errMessage: 'Password must include at least 1 uppercase letter',
    tooltipDesc: 'An uppercase letter',
  },
  {
    type: 'regex_test',
    argument: /\d/,
    errMessage: 'Password must include at least 1 number',
    tooltipDesc: 'A number',
  },
  {
    type: 'regex_test',
    argument: /[^a-zA-Z0-9]/,
    errMessage: 'Password must include at least 1 special character',
    tooltipDesc: 'A special character',
  },
];

interface ChangePasswordProps {
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  theme: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  setIsSignedIn,
  setUsername,
  theme,
}) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null | undefined>(null);
  const [isOldPasswordValid, setIsOldPasswordValid] = useState<Boolean>(false);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState<Boolean>(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState<Boolean>(false);
  const [overrideConfirmPassword, setOverrideConfirmPassword] = useState<
    boolean | undefined
  >(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({...userData, [e.target.name]: e.target.value});

    // Because of how confirm password is dependent on password, the status needs to be overridden whenever either component is changed
    if (e.target.name === 'newPassword') {
      const password = e.target.value;
      setOverrideConfirmPassword(password === userData.confirmPassword);
    } else if (e.target.name === 'confirmPassword') {
      const confirmPassword = e.target.value;
      setOverrideConfirmPassword(userData.newPassword === confirmPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!isOldPasswordValid || !isNewPasswordValid || !doPasswordsMatch) {
      return;
    }

    // Handle submit
    try {
      const response = await changePassword(userData);
      if (response?.status === 200) {
        setFormError(null);
        alert(
          'Password successfully changed, please log in with your new password.'
        );
        setIsSignedIn(false);
        setUsername('Guest');
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
    <div className="changepasswordmain">
      <div className={`customSignUpBorder customSignUpBorder-${theme}`}>
        <Row>
          <Col span={24} style={{display: 'grid', justifyContent: 'center'}}>
            <Title className={`text-${theme}`}>
              Change{' '}
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
          <Col span={24} style={{display: 'grid', justifyContent: 'center'}}>
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
                name="oldPassword"
                placeholder="Old Password"
                validations={[
                  {
                    type: 'length',
                    argument: 1,
                    errMessage: 'The old password cannot be empty',
                  },
                ]}
                theme={theme}
                isPassword
                globalSetIsValid={setIsOldPasswordValid}
                onChange={handleInputChange}
                onPressEnter={(e: React.FormEvent) => {
                  document.getElementsByName('newPassword')[0].focus();
                }}
              />
              <div style={{height: '3vh'}} />

              <ValidatedInputField
                name="newPassword"
                placeholder="New Password"
                validations={PASSWORD_VALIDATION}
                theme={theme}
                isPassword
                hasTooltip
                globalSetIsValid={setIsNewPasswordValid}
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
                    argument: userData.newPassword,
                    errMessage: 'Passwords do not match',
                    tooltipDesc: 'Passwords match',
                  },
                ]}
                theme={theme}
                isPassword
                hasTooltip
                overrideStatus={overrideConfirmPassword}
                globalSetIsValid={setDoPasswordsMatch}
                onPressEnter={
                  isOldPasswordValid && isNewPasswordValid && doPasswordsMatch
                    ? handleSubmit
                    : undefined
                }
                onChange={handleInputChange}
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
                  isOldPasswordValid && isNewPasswordValid && doPasswordsMatch
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
                      isOldPasswordValid &&
                      isNewPasswordValid &&
                      doPasswordsMatch
                    )
                  }
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

export default ChangePassword;
