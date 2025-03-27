import React, {useState, useEffect} from 'react';
import {
  Layout,
  Menu,
  ConfigProvider,
  Button,
  Avatar,
  Modal,
  Space,
  Dropdown,
  Row,
  Col,
  Input,
} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import About from './Route/About';
import Sample from './Route/Sample';
import SampleVolume from './Route/SampleVolume';
import Assessment from './Route/Assessment';
import Help from './Route/Help';
import Videos from './Route/Videos';
import Main from './Route/HomePage';
import PageNotFound from './Route/PageNotFound';
import SignUp from './Route/SignUp';
import LogIn from './Route/LogIn';
import logoImageLight from '../src/icon/truvox-logo-light.png';
import logoImageDark from '../src/icon/truvox-logo-dark.png';
import './CSS/MainLayout.css';
import './CSS/DarkMode.css';
import type {MenuProps, RadioChangeEvent} from 'antd';

import {Flex} from 'antd';
import AudioPlayer from 'react-h5-audio-player';
import {useOptionsHooks} from './hooks/useOptionsHooks';

import DebugFooter from './Debug';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import {login, logout, validateToken} from './services/authService';
import {setupInterceptors} from './services/apiClient';
import LogInComponent from './components/LogInComponent';
import ForgotPassword from './Route/ForgotPassword';
import ResetPassword from './Route/ResetPassword';
import {RadioSetting} from './components/SettingsTemplates';
import SettingsDrawer from './components/SettingsDrawer';
import ChangePassword from './Route/ChangePassword';

const {Header, Content, Footer} = Layout;
const defaultBackColor = 'linear-gradient(to bottom, #d7d2e6, #c9d9f3)';

const MainLayout = () => {
  const navigate = useNavigate();
  setupInterceptors(navigate);
  const {
    gender,
    setGender,
    type,
    setType,
    num,
    setNum,
    genderName,
    audioPlayerNew,
    audioKey,
    audioSrc,
    fetchAudioData,
    handleIconClick,
    handleIconClickPlayAudio,
    itemsAvatar,
    enableAdvFeatures,
    setEnableAdvFeatures,
    theme,
    setTheme,
    themeColors,
    colorsMode,
    setColorsMode,
    COLORS,
    setCOLORS,
    showNotesPar,
    setShowNotesPar,
    enableVol,
    setEnableVol,
    isPitchDynamicallyScaled,
    setIsPitchDynamicallyScaled,
    isSettingsPinned,
    setIsSettingsPinned,
    initialRange,
    setInitialRange,
    divisor,
    setDivisor,
    threshold,
    setThreshold,
    component,
    setComponent,
    ballPosition,
    setBallPosition,
    openSetting,
    setOpenSetting,
  } = useOptionsHooks();

  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Settings');
  const [menuKey, setMenuKey] = useState<string>('4');
  const [, setBackgroundImg] = useState<string>(defaultBackColor);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('Guest');

  const defaultBackColor_2 = `url('/transvoice/HomePage-img-${theme}.png')`;
  let logoImg;
  if (theme === 'dark') {
    logoImg = logoImageDark;
  } else {
    logoImg = logoImageLight;
  }

  const verifyToken = async () => {
    try {
      const response = await validateToken();
      if (response?.status === 200) {
        const {username} = response.data;
        setIsSignedIn(true);
        setUsername(username || 'Guest');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      setIsSignedIn(false);
      setUsername('Guest');
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    fetchAudioData();
  }, [genderName]);

  useEffect(() => {
    switch (menuKey) {
      case '4':
        setBackgroundImg(defaultBackColor_2);
        break;
      case '6':
        setBackgroundImg(defaultBackColor_2);
        break;
      default:
        setBackgroundImg('transparent');
    }

    window.scrollTo(0, 0);
  }, [menuKey]);

  useEffect(() => {
    const pathIn = location.pathname;
    switch (pathIn) {
      case '/HomePage':
        setMenuKey('4');
        break;
      case '/Home':
        setMenuKey('7');
        break;
      case '/pitch':
        setMenuKey('3');
        break;
      case '/volume':
        setMenuKey('5');
        break;
      case '/assessment':
        setMenuKey('6');
        break;
      case '/about':
        setMenuKey('1');
        break;
      case '/Help':
        setMenuKey('2');
        break;
      case '/videos':
        setMenuKey('8');
        break;
      case '/signup':
        setMenuKey('-1');
        break;
      case '/login':
        setMenuKey('-1');
        break;
      case '/forgot-password':
        setMenuKey('-1');
        break;
      case '/reset-password':
        setMenuKey('-1');
        break;
      case '/change-password':
        setMenuKey('-1');
        break;
      default:
        setMenuKey('4');
    }
  }, [location.pathname]);

  const navigateToPitch = () => {
    setMenuKey('3');
    navigate('/pitch');
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onClickMenu = (e: any) => {
    setSelectedItem(e.key);
  };

  const showInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  const handleInfoCancel = () => {
    setIsInfoModalOpen(false);
  };

  // Play Icon Loading
  const [isPlayIconLoading, setIsPlayIconLoading] = useState(false);
  const handleIconClickPlayAudioAnimation = () => {
    setIsPlayIconLoading(true);

    setTimeout(() => {
      setIsPlayIconLoading(false);
    }, 2000); // duration for the animation (1.5 seconds)
  };

  const UserProfile: React.FC = () => {
    // let isSignedIn = false;  // In future change this variable to check whether or not the user is signed in
    const [formError, setFormError] = useState<string | null>(null);

    const handleSignOut = async () => {
      try {
        const response = await logout();
        if (response?.status === 200) {
          setIsSignedIn(false);
          setUsername('Guest');
          setFormError(null);
        }
      } catch (error) {
        setFormError(error.response?.data?.message);
      }
    };

    if (isSignedIn) {
      const handleCloseSettings = () => {
        if (setIsModalOpen) {
          setIsModalOpen(false);
        }
      };

      return (
        <div style={{display: 'grid', justifyContent: 'center'}}>
          {formError && (
            <p style={{justifySelf: 'center', fontSize: 'calc(9px + 0.5vw)'}}>
              {formError}
            </p>
          )}

          <Link
            to="/change-password"
            style={{color: '#807fbc', fontWeight: 'bold'}}
            onClick={isModalOpen ? handleCloseSettings : () => {}}
            className={`customColorfulText-${theme}`}
          >
            Change Password
          </Link>

          <Button
            type="primary"
            className={`customGradientButton customGradientButton-${theme}`}
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      );
    } else {
      // Prompt user to log in
      return (
        <LogInComponent
          setIsSignedIn={setIsSignedIn}
          setUsername={setUsername}
          theme={theme}
          placement="profileMenu"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      );
    }
  };

  // render profile page
  const renderContent = () => {
    switch (selectedItem) {
      case 'Profile':
        return <UserProfile />;
      case 'Settings':
        return (
          <div>
            <SettingsDrawer
              isInProfileModeal
              isSettingsPinned={isSettingsPinned}
              setIsSettingsPinned={setIsSettingsPinned}
              enableAdvFeatures={enableAdvFeatures}
              setEnableAdvFeatures={setEnableAdvFeatures}
              itemsAvatar={itemsAvatar}
              handleIconClick={handleIconClick}
              handleIconClickPlayAudio={handleIconClickPlayAudio}
              genderName={genderName}
              gender={gender}
              colorsMode={colorsMode}
              setColorsMode={setColorsMode}
              setCOLORS={setCOLORS}
              setShowNotesPar={setShowNotesPar}
              showNotesPar={showNotesPar}
              setEnableVol={setEnableVol}
              isPitchDynamicallyScaled={isPitchDynamicallyScaled}
              setIsPitchDynamicallyScaled={setIsPitchDynamicallyScaled}
              initialRange={initialRange}
              setInitialRange={setInitialRange}
              setDivisor={setDivisor}
              enableVol={enableVol}
              threshold={threshold}
              setThreshold={setThreshold}
              component={component}
              setBallPosition={setBallPosition}
              openSetting={openSetting}
              setOpenSetting={setOpenSetting}
              theme={theme}
              setTheme={setTheme}
              themeColors={themeColors}
            />
          </div>
        );
      case 'Other':
        return <p className={`text-${theme}`}>other</p>;
      default:
        return null;
    }
  };

  const menuClicked: MenuProps['onClick'] = e => {
    console.log(e.key);
    setMenuKey(e.key);
  };

  const exerciseMenu = (
    <Menu className="exercise-menu">
      <Menu.Item onClick={menuClicked} key="3">
        <Link to="/pitch">PITCH</Link>
      </Menu.Item>
      <Menu.Item onClick={menuClicked} key="5">
        <Link to="/volume">PITCH & VOLUME</Link>
      </Menu.Item>
    </Menu>
  );

  const itemsMenu = [
    {
      label: 'Profile',
      key: 'Profile',
    },
    {
      label: 'Settings',
      key: 'Settings',
    },
    {
      label: 'Other',
      key: 'Other',
    },
  ];

  return (
    <div className={`LayoutBGP LayoutBGP-${theme}`}>
      <Layout
        style={{
          ...(menuKey === '4'
            ? {
                backgroundImage: defaultBackColor_2,
                backgroundColor: 'linear-gradient(to bottom, #d7d2e6, #c9d9f3)',
                width: '200vw',
                backgroundSize: '10rem',
                maxWidth: '100vw',
                flex: 1,
              }
            : {backgroundColor: 'transparent'}),

          isolation: 'isolate',
          ...(menuKey === '6'
            ? {
                backgroundImage: defaultBackColor_2,
                backgroundColor: 'linear-gradient(to bottom, #d7d2e6, #c9d9f3)',
                width: '100vw',
                backgroundSize: '10rem',
                height: '1300px',
              }
            : {backgroundColor: 'transparent'}),
        }}
        className="layout"
      >
        <Header
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            background: 'transparent',
          }}
        >
          <div className={`TVox TVox-${theme}`}>
            <img className="logoImg" src={logoImg} alt="Logo" />
          </div>
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 0,
              },
              components: {
                Menu: {
                  itemColor: 'rgb(78, 120, 195)',
                  horizontalItemSelectedBg: 'rgb(134, 120, 169)',
                  horizontalItemSelectedColor: 'white',
                },
              },
            }}
          >
            <Menu
              disabledOverflow={true}
              className="Menu"
              theme="light"
              mode="horizontal"
              selectedKeys={[
                menuKey === '3' || menuKey === '5' ? 'exercises' : menuKey,
              ]}
            >
              <Menu.Item
                key="4"
                onClick={menuClicked}
                className={`menu-item menu-item-${theme}`}
              >
                <Link to="/">HOME</Link>
              </Menu.Item>
              <Menu.Item
                key="exercises"
                onClick={menuClicked}
                className={`menu-item menu-item-${theme}`}
              >
                <Dropdown
                  overlay={exerciseMenu}
                  placement="bottom"
                  overlayClassName={`customDropdown-${theme}`}
                >
                  <Link to="/pitch">EXERCISES</Link>
                </Dropdown>
              </Menu.Item>
              <Menu.Item
                key="6"
                onClick={menuClicked}
                className={`menu-item menu-item-${theme}`}
              >
                <Link to="/assessment">ASSESSMENT</Link>
              </Menu.Item>
              <Menu.Item
                key="8"
                onClick={menuClicked}
                className={`menu-item menu-item-${theme}`}
              >
                <Link to="/videos">VIDEOS</Link>
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={menuClicked}
                className={`menu-item menu-item-${theme}`}
              >
                <Link to="/Help">HELP</Link>
              </Menu.Item>
              <Menu.Item
                key="1"
                onClick={menuClicked}
                className={`menu-item menu-item-${theme}`}
              >
                <Link to="/about">ABOUT</Link>
              </Menu.Item>
            </Menu>
          </ConfigProvider>

          <div className={`userIcon-${theme}`}>
            <Button
              shape="circle"
              type="default"
              icon={<UserOutlined />}
              onClick={showModal} // Show modal on click
            />
          </div>
        </Header>

        <Content
          className="ContentMain"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '0rem',
            width: '100%',
            background: 'transparent',
            overflow: 'hidden',
          }}
        >
          <Routes>
            <Route
              path="/about"
              element={
                <About
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  showModal={showModal}
                  handleCancel={handleCancel}
                  theme={theme}
                />
              }
            />
            <Route
              path="/pitch"
              element={
                <Sample
                  gender={gender}
                  setGender={setGender}
                  type={type}
                  setType={setType}
                  num={num}
                  setNum={setNum}
                  genderName={genderName}
                  // audioPlayerNew={audioPlayerNew}
                  audioKey={audioKey}
                  audioSrc={audioSrc}
                  fetchAudioData={fetchAudioData}
                  handleIconClick={handleIconClick}
                  handleIconClickPlayAudio={handleIconClickPlayAudio}
                  itemsAvatar={itemsAvatar}
                  enableAdvFeatures={enableAdvFeatures}
                  setEnableAdvFeatures={setEnableAdvFeatures}
                  theme={theme}
                  setTheme={setTheme}
                  themeColors={themeColors}
                  colorsMode={colorsMode}
                  setColorsMode={setColorsMode}
                  COLORS={COLORS}
                  setCOLORS={setCOLORS}
                  showNotesPar={showNotesPar}
                  setShowNotesPar={setShowNotesPar}
                  enableVol={enableVol}
                  setEnableVol={setEnableVol}
                  isPitchDynamicallyScaled={isPitchDynamicallyScaled}
                  setIsPitchDynamicallyScaled={setIsPitchDynamicallyScaled}
                  isSettingsPinned={isSettingsPinned}
                  setIsSettingsPinned={setIsSettingsPinned}
                  initialRange={initialRange}
                  setInitialRange={setInitialRange}
                  divisor={divisor}
                  setDivisor={setDivisor}
                  threshold={threshold}
                  setThreshold={setThreshold}
                  component={component}
                  setComponent={setComponent}
                  ballPosition={ballPosition}
                  setBallPosition={setBallPosition}
                  openSetting={openSetting}
                  setOpenSetting={setOpenSetting}
                />
              }
            />
            <Route
              path="/volume"
              element={
                <SampleVolume
                  gender={gender}
                  setGender={setGender}
                  genderName={genderName}
                  // audioPlayerNew={audioPlayerNew}
                  audioKey={audioKey}
                  audioSrc={audioSrc}
                  fetchAudioData={fetchAudioData}
                  handleIconClick={handleIconClick}
                  handleIconClickPlayAudio={handleIconClickPlayAudio}
                  itemsAvatar={itemsAvatar}
                  enableAdvFeatures={enableAdvFeatures}
                  setEnableAdvFeatures={setEnableAdvFeatures}
                  theme={theme}
                  setTheme={setTheme}
                  themeColors={themeColors}
                  colorsMode={colorsMode}
                  setColorsMode={setColorsMode}
                />
              }
            />
            <Route
              path="/assessment"
              element={
                <Assessment
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  showModal={showModal}
                  handleCancel={handleCancel}
                  enableAdvFeatures={enableAdvFeatures}
                  setEnableAdvFeatures={setEnableAdvFeatures}
                  theme={theme}
                />
              }
            />
            <Route path="/Help" element={<Help theme={theme} />} />
            <Route path="/videos" element={<Videos theme={theme} />} />
            <Route
              path="/signup"
              element={
                isSignedIn ? <Navigate to="/" /> : <SignUp theme={theme} />
              }
            />
            <Route
              path="/login"
              element={
                isSignedIn ? (
                  <Navigate to="/" />
                ) : (
                  <LogIn
                    setIsSignedIn={setIsSignedIn}
                    setUsername={setUsername}
                    theme={theme}
                  />
                )
              }
            />
            <Route
              path="/forgot-password"
              element={
                isSignedIn ? (
                  <Navigate to="/" />
                ) : (
                  <ForgotPassword theme={theme} />
                )
              }
            />
            <Route
              path="/reset-password"
              element={
                isSignedIn ? (
                  <Navigate to="/" />
                ) : (
                  <ResetPassword theme={theme} />
                )
              }
            />

            <Route
              path="/change-password"
              element={
                isSignedIn ? (
                  <ChangePassword
                    setIsSignedIn={setIsSignedIn}
                    setUsername={setUsername}
                    theme={theme}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/"
              element={
                <Main
                  goToSample={navigateToPitch}
                  isModalOpen={isInfoModalOpen}
                  setIsModalOpen={setIsInfoModalOpen}
                  showModal={showInfoModal}
                  handleCancel={handleInfoCancel}
                  theme={theme}
                />
              }
            />

            <Route path="*" element={<PageNotFound theme={theme} />} />
          </Routes>
        </Content>

        <Modal
          title="Settings"
          open={isModalOpen}
          className={`AvatarModal AvatarModal-${theme}`}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <div style={{textAlign: 'center'}}>
            <Avatar size={64} icon={<UserOutlined />} />
            <p className={`text-${theme}`}>{username || 'Guest'}</p>

            <Menu
              disabledOverflow={true}
              onClick={onClickMenu}
              style={{justifyContent: 'center'}}
              mode="horizontal"
              selectedKeys={[selectedItem]}
              items={itemsMenu}
              className={`profileMenu-${theme}`}
            />
            {renderContent()}
          </div>
        </Modal>

        {/* <ReactAudioPlayer
        className="audio-player-hidden"
        src={audioSrc}
        ref={audioPlayer}
        key={audioKey}
        onEnded={() => console.log('audio ended')}
        onError={(e) => console.log('audio error', e)}
      /> */}

        <AudioPlayer
          autoPlayAfterSrcChange={false}
          src={audioSrc}
          ref={audioPlayerNew}
          key={audioKey}
          style={{display: 'none'}}
          onEnded={() => console.log('audio ended')}
          onError={e => console.log('audio error', e)}
        />

        <Footer className={`customFooter customFooter-${theme}`}>
          TruVox ©{new Date().getFullYear()} Created at the University of
          Cincinnati under Dr. Vesna Novak
          {process.env.REACT_APP_DEBUG === 'true' && DebugFooter()}
        </Footer>
      </Layout>
    </div>
  );
};

export default MainLayout;
