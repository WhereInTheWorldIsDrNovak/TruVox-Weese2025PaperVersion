import React from 'react';
import '../CSS/MainLayout.css';
import LogInComponent from '../components/LogInComponent';
import '../CSS/SignUp.css';

interface LogInProps {
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  theme: string;
}

const LogIn: React.FC<LogInProps> = ({setIsSignedIn, setUsername, theme}) => {
  return (
    <div className="loginmain">
      <div className={`customSignUpBorder customSignUpBorder-${theme}`}>
        <LogInComponent
          setIsSignedIn={setIsSignedIn}
          setUsername={setUsername}
          theme={theme}
          placement="page"
          isModalOpen={undefined}
          setIsModalOpen={undefined}
        />
      </div>
    </div>
  );
};

export default LogIn;
