import React, {useState, useEffect, useRef} from 'react';
import {Button, Flex} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import {Col, Row, ConfigProvider} from 'antd';
import {CaretRightOutlined} from '@ant-design/icons';
import {Slider, Input} from 'antd';
import {Layout, Dropdown} from 'antd';
import {Radio} from 'antd';
import {
  RedoOutlined,
  PauseOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons';
import {Tooltip, FloatButton, Space, Switch} from 'antd';
import '../CSS/sample.css';
import '../CSS/SampleVolume.css';
import type {RadioChangeEvent} from 'antd';
import type {SliderSingleProps} from 'antd';
import type {UploadProps} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {message, Upload} from 'antd';
import hark from 'hark';
import {useLocation} from 'react-router-dom';
import {Image} from 'antd';
import divide_1 from '../icon/Divider2-half.png';
import {useTemString} from '../hooks/useTemString';
import type {MenuProps} from 'antd';
import pdfToText from 'react-pdftotext';
import ConstantVol from '../Canvas/ConstantVol';
import HeteronymVol from '../Canvas/HeteronymVol';
import StairVol from '../Canvas/StairVol';
import {ThemeColors} from '../types/configTypes';
import ResizableDrawer from '../components/ResizableDrawer';
import URLSearchParams from '@ungap/url-search-params';

const marks: SliderSingleProps['marks'] = {
  0: '0dB',
  50: '50dB',
  80: '80dB',
  100: '100dB',
};
const {TextArea} = Input;
type MenuTheme = 'show' | 'hide';

const {Content} = Layout;

const marksRange: SliderSingleProps['marks'] = {
  50: '50Hz',
  600: '600Hz',
};

const marksBallPos: SliderSingleProps['marks'] = {
  0: '0%',
  1: '100%',
};
const marksVol: SliderSingleProps['marks'] = {
  50: '50dB',
  90: '90dB',
};

interface SampleProps {
  genderName: string;
  gender: string;
  setGender: (str: string) => void;
  audioKey: number;
  audioSrc: string;
  fetchAudioData: () => void;
  handleIconClick: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    label: string
  ) => void;
  handleIconClickPlayAudio: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  itemsAvatar: MenuProps['items'];
  enableAdvFeatures: boolean;
  setEnableAdvFeatures: (bool: boolean) => void;
  theme: string;
  setTheme: (str: string) => void;
  themeColors: ThemeColors;
  colorsMode: string;
  setColorsMode: (str: string) => void;
}
const SampleVolume: React.FC<SampleProps> = ({
  enableAdvFeatures,
  setEnableAdvFeatures,
  theme,
  setTheme,
  themeColors,
  colorsMode,
}) => {
  // strings
  const {
    stairFilenames,
    shortDescription,

    Text_1_Rainbow,
    itemsText,
  } = useTemString(theme);

  // Themes
  const themeOptions = [
    {name: 'Light', value: 'light'},
    {name: 'Dark', value: 'dark'},
  ];

  // Canvas values
  const size = [400, 1400];
  const [initialRange, setInitialRange] = useState<number[]>([100, 300]);
  const [config] = useState({
    SRATE: 44100,
    fxmin: 50,
    fxlow: 50 + 50, // This initial value will be updated by useEffect below
    fxhigh: 600 - 200, // This initial value will be updated by useEffect below
    fxmax: 600,
  });
  const [COLORS, setCOLORS] = useState(themeColors[theme].default);

  // open/close
  const [openSetting, setOpenSetting] = useState(false);
  const [txtShow, setTxtShow] = useState<string>('true');
  const [, setTxtShowSwitch] = useState<MenuTheme>('show');
  const [, setOpenTour] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRetry, setIsRetry] = useState(false);
  const [enableVol, setEnableVol] = useState<boolean>(false);
  const [readyToRestart, setReadyToRestart] = useState<boolean>(false);
  const [isOpenTextbox, setIsOpenTextbox] = useState<boolean>(false);
  const [showNextPre, setShowNextPre] = useState<boolean>(false);
  const [, setShowListen] = useState<boolean>(false);
  const [isSettingsPinned, setIsSettingsPinned] = useState<boolean>(false);

  // special variables
  const location = useLocation();
  const ref12 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // initial Value
  const [volume, setVolume] = useState(0);
  const [threshold, setThreshold] = useState<number>(70);
  const [maxLyricCount, setMaxLyricCount] = useState<number>(2);
  const [playLyricCount, setPlayLyricCount] = useState<number>(0);
  const [divisor, setDivisor] = useState<number>(10);
  const [ballPosition, setBallPosition] = useState<number>(0.5);
  const [, setPitchDiff] = useState<number[]>([0]);

  const [historyMode, setHistoryMode] = useState('Mixed');
  const [currentColorScheme, setCurrentColorScheme] = useState('blue');

  const [colorThreshold, setColorThreshold] = useState<number[]>([50, 80]);
  const [LAMP_COLORS, setLAMP_COLORS] = useState<string[]>([
    'rgb(3, 4, 242)', // low
    'rgb(106, 0, 147)', // mid
    'rgb(221, 0, 34)', // high
  ]);

  const LAMP_COLORSBLUE = [
    'rgb(3, 4, 242)', // low
    'rgb(106, 0, 147)', // mid
    'rgb(221, 0, 34)', // high
  ];

  const LAMP_COLORSGREEN = [
    'rgb(98, 187, 70)', // low
    'rgb(255, 194, 14)', // mid
    'rgb(241, 91, 64)', // high
  ];

  // Hz/Notes
  const [showNotesPar, setShowNotesPar] = useState(false);

  // selected choice
  const [component, setComponent] = useState<string>('ConstantTxt');
  const [, setCurrentSelection] = useState('Constant');
  const [, setSyllableCount] = useState<string>('none');
  const [baseFilenames] = useState<string[]>([]);
  const [heteronymFilenames] = useState<string[]>([]);
  const [fileContent, setFileContent] = useState<string[]>([]);
  const [, setSelectedNum] = useState<string[]>(['2']);
  const [selectedDefaultText, setSelectedDefaultText] = useState<string>('1');

  //

  const setPlaying = () => {
    setIsPlaying(true);
  };
  const setPlayingPause = () => {
    setIsPlaying(false);
  };
  const handleBeginTour = () => {
    setOpenTour(true);
    window.scrollTo(0, 0);
  };
  const onClose = () => {
    setOpenSetting(false);
  };
  const ClearTxt = () => {
    setFileContent([]);
    setMaxLyricCount(1);
  };
  const handlePitchDiffChange = (value: number[]) => {
    setPitchDiff(value);
  };
  // Constant Page upload and input\
  const onClick: MenuProps['onClick'] = ({key}) => {
    setSelectedDefaultText(key);
  };

  useEffect(() => {
    console.log(Text_1_Rainbow[1]);
    handleTextInputString(Text_1_Rainbow[Number(selectedDefaultText) - 1]);
  }, [selectedDefaultText]);

  const handleTextInputString = (e: string) => {
    const content = e as string;
    const separators = /[;,/\n]/;

    const sentences = content.split(/(?<=\.)/);

    const processedSentences = sentences.map(sentence => {
      const clauses = sentence.split(/(;|,|\/|\n)/);

      const processedClauses = clauses.reduce((acc, clause) => {
        const trimmedClause = clause.trim();
        if (trimmedClause.length === 0) {
          return acc;
        }

        if (separators.test(clause)) {
          return [...acc, clause];
        }

        const words = trimmedClause.split(/\s+/);
        if (words.length <= 3) {
          if (acc.length > 0) {
            const lastClause = acc[acc.length - 1];
            const lastClauseWords = lastClause.split(/\s+/);
            if (lastClauseWords.length + words.length <= 3) {
              acc[acc.length - 1] += clause;
              return acc;
            }
          }
        }
        return [...acc, clause];
      }, [] as string[]);
      return processedClauses.join('').trim();
    });

    const filteredContent = processedSentences.filter(Boolean);

    console.log(filteredContent);
    setFileContent(filteredContent);
    setMaxLyricCount(filteredContent.length - 1);
    setPlayLyricCount(0);
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value as string;
    const separators = /[;,./\n]/;
    const splitContent = content
      .split(separators)
      .map(s => s.trim())
      .filter(Boolean);
    console.log(splitContent);
    setFileContent(splitContent);
    setMaxLyricCount(splitContent.length - 1);
    setPlayLyricCount(0);
  };
  const props: UploadProps = {
    name: 'file',
    accept: '.txt, .pdf',
    beforeUpload: file => {
      if (file.type !== 'text/plain' && file.type !== 'application/pdf') {
        message.error(`${file.name} is not a valid text/pdf file.`);
        return false;
      }
      if (file.type === 'application/pdf') {
        pdfToText(file)
          .then((text: string) => {
            const separators = /[;,./\n]/;
            const splitContent = text
              .split(separators)
              .map((s: string) => s.trim())
              .filter(Boolean);
            console.log(splitContent);
            setFileContent(splitContent);
            setMaxLyricCount(splitContent.length - 1);
            setPlayLyricCount(0);
          })
          .catch((error: any) => {
            // Explicitly specify the type of 'error' parameter as 'any'
            message.error('Error reading PDF file:', error);
          });
        return false;
      }
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            const content = e.target.result as string;
            // const separators = /[;,./]/;
            const separators = /[;,./\n]/;
            const splitContent = content
              .split(separators)
              .map(s => s.trim())
              .filter(Boolean);
            console.log(splitContent);
            setFileContent(splitContent);
            setMaxLyricCount(splitContent.length - 1);
            setPlayLyricCount(0);
          }
        };

        reader.readAsText(file);

        return false;
      }
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file read successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file read failed.`);
      }
    },
  };
  const changeOnEnter = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('Enter Key Pressed!');
      handleTextInput(e);
    }
  };

  useEffect(() => {
    if (currentColorScheme === 'blue') {
      setLAMP_COLORS(LAMP_COLORSBLUE);
    } else {
      setLAMP_COLORS(LAMP_COLORSGREEN);
    }
  }, [currentColorScheme]);

  const getLampColor = (vol: number) => {
    const temvol = vol + 130;
    // if (temvol <= 50) return LAMP_COLORS[0];
    // if (temvol <= 80) return LAMP_COLORS[1];
    if (temvol <= colorThreshold[0]) return LAMP_COLORS[0];
    if (temvol <= colorThreshold[1]) return LAMP_COLORS[1];
    return LAMP_COLORS[2];
  };
  const lampStyle = (color: string) => ({
    backgroundColor: color,
    opacity: color === getLampColor(volume) ? 1 : 0.2,
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    margin: '5px',
  });

  // Volume
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({audio: true, video: false})
      .then(stream => {
        const harkInstance = hark(stream, {});

        harkInstance.on('volume_change', volume => {
          setVolume(volume);
        });

        return () => harkInstance.stop();
      })
      .catch(error => {
        console.error('Error accessing the microphone', error);
      });
  }, []);

  // Adds a delay so that the exercise doesn't immediately restart if Auto-Start When Voice Detected is active
  useEffect(() => {
    if (isPlaying) {
      setReadyToRestart(false);
    } else {
      setTimeout(() => {
        setReadyToRestart(true);
        console.log('Restarted');
      }, 2000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (volume > threshold - 100 && enableVol && readyToRestart) {
      setIsPlaying(true);
    }
  }, [volume]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const init = queryParams.get('init');
    if (init === 'true') {
      handleBeginTour();
    }
  }, [location]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const componentParam = queryParams.get('component');
    if (componentParam) {
      setComponent(componentParam);
    }
  }, [location]);

  // Options of different Exercise
  const handleStairAndConstantClick = (e: any) => {
    setPlayLyricCount(0);
    setCurrentSelection(e.target.innerText);
    console.log(e.target.innerText);
    if (
      e.target.innerText === 'Constant' ||
      e.target.innerText === 'CONSTANT'
    ) {
      setComponent('ConstantTxt');
      setSelectedNum(['2']);
    } else if (
      e.target.innerText === 'Stair' ||
      e.target.innerText === 'STAIR'
    ) {
      setComponent('Stair');
      setSelectedNum(['3']);
    } else {
      setComponent('Heteronym');
      setSelectedNum(['4']);
    }
    setSyllableCount('none');
  };

  const handleHistoryMode = (e: any) => {
    setHistoryMode(e.target.innerText);
  };
  const handleColorStyle = (e: any) => {
    const newColorScheme = e.target.innerText.includes('Blue-Red')
      ? 'blue'
      : 'green';
    setCurrentColorScheme(newColorScheme);
  };
  const renderTruncatedFilenames = (filenames: string[]) => {
    return filenames.map((text, index) => {
      const isNearEnd = filenames.length - playLyricCount <= 2;
      const startIndex = isNearEnd ? filenames.length - 3 : playLyricCount;
      const showCondition = index >= startIndex && index <= startIndex + 2;

      return (
        showCondition && (
          <li
            key={index}
            className={
              playLyricCount === index
                ? `highlighted highlighted-${theme}`
                : `lyric-${theme}`
            }
          >
            {text}
          </li>
        )
      );
    });
  };

  const onChangeStairSwitch = (value: boolean) => {
    setTxtShowSwitch(value ? 'hide' : 'show');
    setTxtShow(value ? 'true' : 'false');
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const init = queryParams.get('init');
    if (init === 'true') {
      handleBeginTour();
    }
  }, [location]);
  const renderSelectedComponent = (): React.ReactNode => {
    switch (component) {
      case 'ConstantTxt':
        return (
          <ConstantVol
            handlePitchDiffChange={handlePitchDiffChange}
            LAMP_COLORS={LAMP_COLORS}
            historyMode={historyMode}
            volume={volume}
            ref={parentRef}
            initialRange={initialRange}
            divisor={divisor}
            ballPosition={ballPosition}
            isRetry={isRetry}
            setPlayingPause={setPlayingPause}
            setPlaying={setPlaying}
            COLORS={COLORS}
            showNotesPar={showNotesPar}
            size={size}
            config={config}
            isPlaying={isPlaying}
            enableAdvFeatures={enableAdvFeatures}
            theme={theme}
            themeColors={themeColors}
            colorsMode={colorsMode}
          />
        );
      case 'Stair':
        return (
          <StairVol
            LAMP_COLORS={LAMP_COLORS}
            historyMode={historyMode}
            volume={volume}
            setShowNotesPar={setShowNotesPar}
            setMaxLyricCount={setMaxLyricCount}
            initialRange={initialRange}
            divisor={divisor}
            txtShow={txtShow}
            playLyricCount={playLyricCount}
            setPlayingPause={setPlayingPause}
            isRetry={isRetry}
            COLORS={COLORS}
            showNotesPar={showNotesPar}
            size={size}
            config={config}
            isPlaying={isPlaying}
            enableAdvFeatures={enableAdvFeatures}
            theme={theme}
            themeColors={themeColors}
            colorsMode={colorsMode}
          />
        );
      case 'Heteronym':
        return (
          <HeteronymVol
            LAMP_COLORS={LAMP_COLORS}
            historyMode={historyMode}
            volume={volume}
            setMaxLyricCount={setMaxLyricCount}
            initialRange={initialRange}
            divisor={divisor}
            txtShow={txtShow}
            playLyricCount={playLyricCount}
            setPlayingPause={setPlayingPause}
            isRetry={isRetry}
            setPlaying={setPlaying}
            COLORS={COLORS}
            showNotesPar={showNotesPar}
            size={size}
            config={config}
            isPlaying={isPlaying}
            heteronymFile={heteronymFilenames}
            enableAdvFeatures={enableAdvFeatures}
            theme={theme}
            themeColors={themeColors}
            colorsMode={colorsMode}
          />
        );

      default:
        return <span>Canvas: Picture</span>;
    }
  };
  const MainButtons = (): React.ReactNode => {
    return (
      <Flex justify="center" wrap="wrap" gap="small">
        <Tooltip title="Retry">
          <Button
            onClick={() => setIsRetry(!isRetry)}
            shape="circle"
            icon={<RedoOutlined />}
            className={`customButton-${theme}`}
          />
        </Tooltip>
        {/* <AudioPlayer
          autoPlayAfterSrcChange={false}
          src={audioSrcFromChild}
          ref={audioPlayerNew}
          style={{ display: 'none' }}
        /> */}
        {/* {showListen &&
          <Tooltip title="Listen">
            <Button disabled={component !== "Fixed"} shape="circle" onClick={playAudio} icon={<CustomerServiceOutlined />} />
          </Tooltip>
        } */}

        {showNextPre && (
          <Tooltip title="Previous">
            <Button
              shape="circle"
              onClick={onChangePrevious}
              icon={<StepBackwardOutlined />}
              className={`customButton-${theme}`}
            />
          </Tooltip>
        )}
        <Tooltip title={isPlaying ? 'Pause' : 'Start'}>
          <Button
            onClick={onChangePause}
            shape="circle"
            icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
            className={`customButton-${theme}`}
          />
        </Tooltip>
        {showNextPre && (
          <Tooltip title="Next">
            <Button
              shape="circle"
              onClick={onChangeNext}
              icon={<StepForwardOutlined />}
              className={`customButton-${theme}`}
            />
          </Tooltip>
        )}
      </Flex>
    );
  };
  const renderSelectedComponentLyric = (): React.ReactNode => {
    switch (component) {
      case 'ConstantTxt':
        return (
          <div className="lyric">
            <Space size="middle">
              {MainButtons()}
              <Space.Compact>
                <Tooltip title="Clear existing files and upload new ones">
                  <Button
                    onClick={ClearTxt}
                    className={`customButton-${theme}`}
                  >
                    Clear text
                  </Button>
                </Tooltip>
                <Tooltip title="Some simple texts to read during practice">
                  <Dropdown
                    menu={{items: itemsText, onClick}}
                    placement="bottomLeft"
                    overlayClassName={`customDropdown-${theme}`}
                  >
                    <Button className={`customButton-${theme}`}>
                      Default Texts
                    </Button>
                  </Dropdown>
                </Tooltip>
                <Tooltip title="Upload PDF or .txt file to read during practice">
                  <Upload maxCount={1} {...props}>
                    <Button
                      style={{width: '18vh'}}
                      icon={<UploadOutlined />}
                      className={`customButton-${theme}`}
                    >
                      Upload File
                    </Button>
                  </Upload>
                </Tooltip>
                <Tooltip title="Type/Paste text to read during parctice">
                  <Button
                    onClick={() => setIsOpenTextbox(!isOpenTextbox)}
                    className={`customButton-${theme}`}
                  >
                    {!isOpenTextbox ? 'Enter Text' : 'Close Textbox'}
                  </Button>
                </Tooltip>
              </Space.Compact>
            </Space>
            <>
              {isOpenTextbox && fileContent.length === 0 && (
                <TextArea
                  rows={4}
                  placeholder="Enter or paste Text Entry"
                  style={{height: 40, resize: 'none'}}
                  onKeyDown={changeOnEnter}
                />
              )}
            </>
            <ul>
              {fileContent.map((text, index) => {
                const isNearEnd = fileContent.length - playLyricCount <= 2;
                const startIndex = isNearEnd
                  ? fileContent.length - 3
                  : playLyricCount;
                const showCondition =
                  index >= startIndex && index <= startIndex + 2;

                return (
                  showCondition && (
                    <li
                      key={index}
                      className={
                        playLyricCount === index
                          ? `highlighted highlighted-${theme}`
                          : `lyric-${theme}`
                      }
                    >
                      {text}
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        );
      case 'Stair':
        return (
          <div className="lyric">
            <Flex align="center" gap="middle">
              {MainButtons()}

              <Tooltip title="Show/Hide 5-syllable phrases to read">
                <Switch
                  defaultChecked
                  checkedChildren="show"
                  unCheckedChildren="hide"
                  onChange={onChangeStairSwitch}
                />
              </Tooltip>
            </Flex>
            {(() => {
              if (txtShow === 'true') {
                return <ul>{renderTruncatedFilenames(stairFilenames)}</ul>;
              }
              return null;
            })()}
          </div>
        );
      case 'Heteronym':
        return (
          <div className="lyric">
            {MainButtons()}
            {(() => {
              if (txtShow === 'true') {
                return <ul>{renderTruncatedFilenames(heteronymFilenames)}</ul>;
              }
              return null;
            })()}
          </div>
        );
      case 'Fixed':
        return (
          <div className="lyric">
            {MainButtons()}
            <ul>{renderTruncatedFilenames(baseFilenames)}</ul>
          </div>
        );
      default:
        return <span>Canvas: Picture</span>;
    }
  };

  useEffect(() => {
    if (component === 'ConstantTxt' && fileContent.length === 0) {
      setShowNextPre(false);
      setShowListen(false);
    } else if (component === 'ConstantTxt' && fileContent.length !== 0) {
      setShowNextPre(true);
      setShowListen(false);
    } else if (component === 'Fixed') {
      setShowNextPre(true);
      setShowListen(true);
    } else if (component === 'Stair') {
      setShowNextPre(true);
      setShowListen(false);
    } else if (component === 'Heteronym') {
      setShowNextPre(true);
      setShowListen(false);
    } else {
      setShowNextPre(true);
      setShowListen(false);
    }
  }, [component, fileContent]);
  const onChangeThresholds = (thresholds: number[]) => {
    setColorThreshold([thresholds[0], thresholds[1]]);
  };
  const onChangeRange = (rangeValue: number[]) => {
    setInitialRange([rangeValue[0], rangeValue[1]]);
  };
  const onChangePosition = (positionValue: number) => {
    setBallPosition(positionValue);
  };
  const onChangeSpeed = (speedValue: number) => {
    const mappedValue = Math.round(speedValue * 20 + 4);
    setDivisor(mappedValue);
  };
  const onChangeHz = ({target: {value}}: RadioChangeEvent) => {
    console.log(value);
    if (value === 'hz') {
      setShowNotesPar(false);
    } else {
      setShowNotesPar(true);
    }
  };

  const EnableVoluneMode = (e: boolean) => {
    console.log(e);
    if (e) {
      setEnableVol(true);
    } else {
      setEnableVol(false);
    }
  };
  // Pause function
  const onChangePause = () => {
    setIsPlaying(!isPlaying);
  };
  const onChangePrevious = () => {
    const tem = playLyricCount;
    if (tem <= 0) {
      setPlayLyricCount(0);
    } else {
      setPlayLyricCount(tem - 1);
    }
  };

  const onChangeNext = () => {
    const tem = playLyricCount;
    console.log(playLyricCount);
    if (tem >= maxLyricCount) {
      setPlayLyricCount(maxLyricCount);
    } else {
      setPlayLyricCount(tem + 1);
    }
  };

  // This just refreshes the canvas's colors so that they change when Dark Mode is enabled/disabled
  const refreshColors = (themeName: string) => {
    console.log(colorsMode);
    if (colorsMode === 'default') {
      setCOLORS(themeColors[themeName].default);
    } else {
      setCOLORS(themeColors[themeName].co);
    }
  };

  const onChangeTheme = ({target: {value: value}}: RadioChangeEvent) => {
    refreshColors(value);
    setTheme(value);
  };

  // tooltips
  const onChangeThreshold = (e: number) => {
    setThreshold(e);
  };
  const formatterdB = (value: number | undefined) => `${value} dB`;
  const formatterHz = (value: number | undefined) => `${value} Hz`;
  const formatterPos = (value: number | undefined) =>
    `${value ? (value * 100).toFixed(0) : '0'}%`;

  return (
    // <div className="app-container" >
    <Row>
      <Col span={24}>
        <Layout className="layoutSample">
          <Content>
            <Flex align="center" justify="center" gap="middle" vertical>
              <div style={{marginTop: '2vw'}}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: 'rgb(132, 118, 171)',
                      borderRadius: 0,
                    },
                  }}
                >
                  <Space size="middle" ref={ref12}>
                    <Space.Compact>
                      <Tooltip title="Switch to the Constant exercise">
                        <Button
                          type={
                            component === 'ConstantTxt' ? 'primary' : 'default'
                          }
                          onClick={handleStairAndConstantClick}
                          className={
                            component === 'ConstantTxt'
                              ? `customMainButtons-primary-${theme}`
                              : `customMainButtons-${theme}`
                          }
                        >
                          CONSTANT
                        </Button>
                      </Tooltip>

                      <Tooltip title="Switch to the Stair exercise">
                        <Button
                          type={component === 'Stair' ? 'primary' : 'default'}
                          onClick={handleStairAndConstantClick}
                          className={
                            component === 'Stair'
                              ? `customMainButtons-primary-${theme}`
                              : `customMainButtons-${theme}`
                          }
                        >
                          STAIR
                        </Button>
                      </Tooltip>

                      <Tooltip title="Switch to the Heteronyms exercise">
                        <Button
                          type={
                            component === 'Heteronym' ? 'primary' : 'default'
                          }
                          onClick={handleStairAndConstantClick}
                          className={
                            component === 'Heteronym'
                              ? `customMainButtons-primary-${theme}`
                              : `customMainButtons-${theme}`
                          }
                        >
                          HETERONYMS
                        </Button>
                      </Tooltip>
                    </Space.Compact>
                  </Space>
                </ConfigProvider>
              </div>
              {shortDescription(component)}
              <div className="lampGroup">
                <div className="lampGroupIn" style={{display: 'flex'}}>
                  <div style={lampStyle(LAMP_COLORS[0])}></div>
                  <div style={lampStyle(LAMP_COLORS[1])}></div>
                  <div style={lampStyle(LAMP_COLORS[2])}></div>
                </div>
              </div>
              <div style={{width: '100%'}}>{renderSelectedComponent()}</div>

              <Flex
                vertical
                justify="center"
                wrap="wrap"
                gap="small"
                ref={ref2}
              >
                {renderSelectedComponentLyric()}
              </Flex>

              {/* <div className="currentSelection blueFont">
                <p>Volume mode</p>
              </div> */}
              {/* <div style={{ width: "100%" }}>
                {renderSelectedComponent()}
              </div>
              <Tooltip title={isPlaying ? "Pause" : "Play"}>
                <Button onClick={onChangePause} shape="circle" icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />} />
              </Tooltip> */}

              <FloatButton
                style={{
                  width: 60,
                  height: 60,
                  right: 15,
                  bottom: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className={`customFloatButton-${theme}`}
                onClick={() => setOpenSetting(true)}
                ref={ref3}
                shape="square"
                description="SETTINGS"
                icon={<SettingOutlined />}
              />
              {/* <FloatButton
                style={{
                  width: 60,
                  height: 60,
                  right: 100,
                  bottom: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                shape="square"
                description="TOUR"
                onClick={handleBeginTour}
                icon={<QuestionOutlined />} /> */}
              <Image preview={false} src={divide_1} style={{width: '100%'}} />
            </Flex>
            <ResizableDrawer
              title="Settings"
              placement={isSettingsPinned ? 'bottom' : 'right'}
              onClose={() => setOpenSetting(false)}
              open={openSetting}
              mask={!isSettingsPinned}
              className={`settings-${theme}`}
            >
              <Flex vertical gap="middle">
                <Space>
                  <p># Coordinate Display Mode</p>
                  <Radio.Group
                    onChange={onChangeHz}
                    defaultValue="notes"
                    buttonStyle="solid"
                  >
                    <Radio.Button value="hz"> Hz </Radio.Button>
                    <Radio.Button value="notes">Notes</Radio.Button>
                  </Radio.Group>
                </Space>

                <Space>
                  <p># History Mode Selection </p>
                </Space>

                <Space>
                  <Tooltip title="Volume history indicated by size of dots">
                    <Button
                      type={historyMode === 'Size' ? 'primary' : 'default'}
                      onClick={handleHistoryMode}
                    >
                      Size
                    </Button>
                  </Tooltip>
                  <Tooltip title="Volume history indicated by color of dots">
                    <Button
                      type={historyMode === 'Color' ? 'primary' : 'default'}
                      onClick={handleHistoryMode}
                    >
                      Color
                    </Button>
                  </Tooltip>
                  <Tooltip title="Volume history indicated by both size and color">
                    <Button
                      type={historyMode === 'Mixed' ? 'primary' : 'default'}
                      onClick={handleHistoryMode}
                    >
                      Mixed
                    </Button>
                  </Tooltip>
                  <Tooltip title="Volume not shown in history curve">
                    <Button
                      type={historyMode === 'None' ? 'primary' : 'default'}
                      onClick={handleHistoryMode}
                    >
                      None
                    </Button>
                  </Tooltip>
                </Space>

                <Space>
                  <p># Color Mode</p>
                </Space>
                <Space>
                  <Tooltip title="The color scheme used to indicate low/medium/high volume">
                    <Button
                      onClick={handleColorStyle}
                      type={
                        currentColorScheme === 'blue' ? 'primary' : 'default'
                      }
                    >
                      Blue-Red
                    </Button>
                    <Button
                      onClick={handleColorStyle}
                      type={
                        currentColorScheme === 'green' ? 'primary' : 'default'
                      }
                    >
                      Green-Red
                    </Button>
                  </Tooltip>
                </Space>

                <div>
                  <p># Thresholds for medium and high volume</p>
                  <Slider
                    range
                    marks={marks}
                    onChange={onChangeThresholds}
                    tooltip={{formatter: formatterdB}}
                    defaultValue={[50, 80]}
                  />
                </div>
                <div>
                  <p># Pitch Display Range</p>
                  <Slider
                    range
                    step={10}
                    min={50}
                    max={600}
                    onChange={onChangeRange}
                    // tooltipPlacement={bottom}
                    // tooltip ={{formatter: null}}
                    tooltip={{formatter: formatterHz}}
                    marks={marksRange}
                    defaultValue={[100, 300]}
                  />
                </div>

                <div>
                  <p># Pitch Indicator Speed</p>
                  <Slider
                    step={0.05}
                    min={0}
                    max={1}
                    onChange={onChangeSpeed}
                    // tooltip={{ formatter: formatterPos }}
                    tooltip={{
                      // placement: 'bottom',
                      formatter: formatterPos,
                    }}
                    defaultValue={0.3}
                    // tooltip ={{formatter: null}}
                    // marks={marksBall}
                  />
                </div>

                <div>
                  <Space>
                    <p># Auto-Start When Voice Detected</p>
                    <Tooltip title="If enabled, an exercise will start if your microphone detects speech. If disabled, you must start exercises manually. Either way, you will need to stop the exercise manually.">
                      <Switch
                        defaultChecked={false}
                        onChange={EnableVoluneMode}
                      />
                    </Tooltip>
                  </Space>

                  {enableVol && (
                    <Slider
                      step={1}
                      min={50}
                      max={90}
                      onChange={onChangeThreshold}
                      tooltip={{
                        // placement: 'bottom',
                        formatter: formatterdB,
                        // open: tooltipVisible,
                      }}
                      defaultValue={70}
                      marks={marksVol}
                    />
                  )}
                </div>

                <div>
                  <Space>
                    <p># Theme</p>
                    <Radio.Group
                      onChange={onChangeTheme}
                      value={theme}
                      defaultValue="light"
                      buttonStyle="solid"
                    >
                      {themeOptions.map(option => (
                        <Radio.Button value={option.value} key={option.value}>
                          {option.name}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  </Space>
                </div>

                <div>
                  <Space>
                    <p># Pin Settings Open</p>
                    <Tooltip title="If enabled, settings will stay open in a bar along the bottom of your screen, allowing you to change your settings and access the exercises at the same time.">
                      <Switch
                        defaultChecked={isSettingsPinned}
                        value={isSettingsPinned}
                        onChange={setIsSettingsPinned}
                      />
                    </Tooltip>
                  </Space>
                </div>

                <div>
                  <Space>
                    <p># Enable Advanced Features</p>
                    <Tooltip title="If enabled, more advanced settings will be available to you. This setting will also show some features that are currently in development.">
                      <Switch
                        defaultChecked={enableAdvFeatures}
                        onChange={setEnableAdvFeatures}
                      />
                    </Tooltip>
                  </Space>
                </div>

                {enableAdvFeatures &&
                  component !== 'Fixed' &&
                  component !== 'Stair' &&
                  component !== 'Heteronym' && (
                    <div>
                      <p>Pitch Indicator Horizontal Position</p>
                      <Slider
                        step={0.1}
                        min={0}
                        max={1}
                        onChange={onChangePosition}
                        // tooltip={{ formatter: formatterPos }}
                        // tooltip ={{formatter: null}}
                        tooltip={{
                          // placement: 'bottom',
                          formatter: formatterPos,
                          // open: tooltipVisible,
                        }}
                        defaultValue={0.5}
                        marks={marksBallPos}
                      />
                    </div>
                  )}

                <br />
                <Button onClick={onClose}>Close</Button>
              </Flex>
            </ResizableDrawer>
          </Content>
        </Layout>
      </Col>
    </Row>

    // </div>
  );
};

export default SampleVolume;
