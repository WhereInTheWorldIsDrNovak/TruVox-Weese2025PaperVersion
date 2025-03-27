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
} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {Routes, Route, Link, useLocation, useNavigate} from 'react-router-dom';
import About from './Route/About';
import Sample from './Route/Sample';
import SampleVolume from './Route/SampleVolume';
import Assessment from './Route/Assessment';
import Help from './Route/Help';
import Videos from './Route/Videos';
import Main from './Route/HomePage';
import PageNotFound from './Route/PageNotFound';
import logoImageLight from '../src/icon/truvox-logo-light.png';
import logoImageDark from '../src/icon/truvox-logo-dark.png';
import './CSS/MainLayout.css';
import './CSS/DarkMode.css';
import type {MenuProps} from 'antd';

import {Flex} from 'antd';
import {createFromIconfontCN} from '@ant-design/icons';
import AudioPlayer from 'react-h5-audio-player';
import {useOptionsHooks} from './hooks/useOptionsHooks';

import DebugFooter from './Debug';

// MASSIVE SECURITY CONCERN
const PlayIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4566050_zpduwnlv2t.js',
});

const {Header, Content, Footer} = Layout;
const defaultBackColor = 'linear-gradient(to bottom, #d7d2e6, #c9d9f3)';

const MainLayout = () => {
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
  } = useOptionsHooks();

  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Settings');
  const [menuKey, setMenuKey] = useState<string>('4');
  const [, setBackgroundImg] = useState<string>(defaultBackColor);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const defaultBackColor_2 = `url('/transvoice/HomePage-img-${theme}.png')`;
  let logoImg;
  if (theme === 'dark') {
    logoImg = logoImageDark;
  } else {
    logoImg = logoImageLight;
  }

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

  // render profile page
  const renderContent = () => {
    switch (selectedItem) {
      case 'Profile':
        return <p className={`text-${theme}`}>profile</p>;
      case 'Settings':
        return (
          <div>
            <Flex vertical gap="middle">
              <Space>
                <p className={`text-${theme}`}># Model Selection: </p>

                <Dropdown.Button
                  menu={{items: itemsAvatar}}
                  placement="bottom"
                  trigger={['click']}
                  overlayClassName={`custom-dropdown customDropdown-${theme}`}
                  buttonsRender={([, rightButton]) => [
                    <Button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onClick={e => {
                        handleIconClickPlayAudioAnimation();
                        handleIconClickPlayAudio(e);
                      }}
                      icon={
                        <span
                          style={{
                            display: 'inline-flex',
                            fontSize: '1.7em',
                          }}
                        >
                          {isPlayIconLoading ? (
                            // Spinner for loading animation
                            <svg
                              width="1em"
                              height="1em"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                            >
                              <circle
                                cx="10"
                                cy="10"
                                r="9"
                                stroke={theme === 'light' ? 'black' : 'white'}
                                strokeWidth="1.5"
                                fill="none"
                                strokeDasharray="31.415, 31.415"
                                strokeDashoffset="0"
                                className="spinner"
                              />
                              <path
                                d="
                                M13.8,10
                                L7.5,6.5
                                A4,4 0 0 1 7.5,6.5
                                L7.5,13.8
                                A4,4 0 0 1 7.5,13.5
                                Z
                              "
                                fill={theme === 'light' ? 'black' : 'white'}
                                stroke={theme === 'light' ? 'black' : 'white'}
                                strokeLinejoin="round"
                                strokeWidth="0.5"
                              ></path>
                            </svg>
                          ) : (
                            // Playback icon
                            <svg
                              width="1em"
                              height="1em"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="10"
                                cy="10"
                                r="9"
                                fill="currentColor"
                              ></circle>
                              <path
                                d="
                                M13.8,10
                                L7.5,6.5
                                A4,4 0 0 1 7.5,6.5
                                L7.5,13.8
                                A4,4 0 0 1 7.5,13.5
                                Z
                              "
                                fill={theme === 'light' ? 'white' : 'black'}
                                stroke={theme === 'light' ? 'white' : 'black'}
                                strokeLinejoin="round"
                                strokeWidth="0.5"
                              ></path>
                            </svg>
                          )}
                        </span>
                      }
                    >
                      {genderName === 'none'
                        ? 'Model Voice'
                        : gender === 'Female'
                          ? genderName
                          : 'Male01'}
                    </Button>,
                    React.cloneElement(
                      rightButton as React.ReactElement<any, string>,
                      {loading: false}
                    ),
                  ]}
                ></Dropdown.Button>
              </Space>
              <br />
            </Flex>
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
                key="2"
                onClick={menuClicked}
                className={`menu-item menu-item-${theme}`}
              >
                <Link to="/Help">HELP</Link>
              </Menu.Item>
              <Menu.Item
                key="8"
                onClick={menuClicked}
                className={`menu-item menu-item-${theme}`}
              >
                <Link to="/videos">VIDEOS</Link>
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

          {enableAdvFeatures && (
            <div className={`userIcon-${theme}`}>
              <Button
                shape="circle"
                type="default"
                icon={<UserOutlined />}
                onClick={showModal} // Show modal on click
              />
            </div>
          )}
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
            <p className={`text-${theme}`}>Name Name</p>

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

            <Button onClick={handleCancel}>Close</Button>
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
