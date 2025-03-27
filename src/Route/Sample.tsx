import React, {useState, useEffect, useRef} from 'react';
import {Button, Flex} from 'antd';
import {SettingOutlined, CustomerServiceOutlined} from '@ant-design/icons';
import {Col, Row, Tour, ConfigProvider} from 'antd';
import {CaretRightOutlined} from '@ant-design/icons';
import {Input} from 'antd';
import {Layout, Menu, Dropdown} from 'antd';
import {
  RedoOutlined,
  PauseOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons';
import {Tooltip, FloatButton, Space, Switch} from 'antd';
import '../CSS/sample.css';
import ConstantTxt from '../Canvas/ConstantTxt';
import Fixed from '../Canvas/Fixed';
import Stair from '../Canvas/Stair';
import ChantingTxt from '../Canvas/ChantingTxt';
import Heteronym from '../Canvas/Heteronym';
import type {TourProps} from 'antd';
import type {UploadProps} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {message, Upload} from 'antd';
import hark from 'hark';
import {useLocation} from 'react-router-dom';
import {Typography} from 'antd';
import {Image} from 'antd';
import divide_1 from '../icon/Divider2-half.png';
import {QuestionOutlined} from '@ant-design/icons';
import {useTemString} from '../hooks/useTemString';
import type {MenuProps} from 'antd';
import pdfToText from 'react-pdftotext';
import AudioPlayer from 'react-h5-audio-player';
import {DownOutlined} from '@ant-design/icons';
import {COLORS, ThemeColors} from '../types/configTypes';
import SettingsDrawer from '../components/SettingsDrawer';
import URLSearchParams from '@ungap/url-search-params';

const {TextArea} = Input;
const {Title, Paragraph} = Typography;

const {Content} = Layout;

interface SampleProps {
  genderName: string;
  gender: string;
  type: string;
  num: number;
  setNum: (num: number) => void;
  setType: (str: string) => void;
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
  COLORS: COLORS;
  setCOLORS: (c: COLORS) => void;
  showNotesPar: boolean;
  setShowNotesPar: (b: boolean) => void;
  enableVol: boolean;
  setEnableVol: (b: boolean) => void;
  isPitchDynamicallyScaled: boolean;
  setIsPitchDynamicallyScaled: (b: boolean) => void;
  isSettingsPinned: boolean;
  setIsSettingsPinned: (b: boolean) => void;
  initialRange: number[];
  setInitialRange: (n: number[]) => void;
  divisor: number;
  setDivisor: (n: number) => void;
  threshold: number;
  setThreshold: (n: number) => void;
  component: string;
  setComponent: (s: string) => void;
  ballPosition: number;
  setBallPosition: (n: number) => void;
  openSetting: boolean;
  setOpenSetting: (b: boolean) => void;
}

const Sample: React.FC<SampleProps> = ({
  genderName,
  gender,
  type,
  num,
  setNum,
  setType,
  setGender,
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
}) => {
  // strings
  const {
    items_3,
    stairFilenames,
    chantingFilenames,
    heteronymOrder,
    shortDescription,
    Text_1_Rainbow,
    mVoicedSentences,
    nVoicedSentences,
    mVoicedVoicelessSentences,
    nVoicedVoicelessSentences,
    itemsText,
  } = useTemString(theme);

  // Canvas values
  const size = [400, 1400];
  const [config] = useState({
    SRATE: 44100,
    fxmin: 50,
    fxlow: 50 + 50, // This initial value will be updated by useEffect below
    fxhigh: 600 - 200, // This initial value will be updated by useEffect below
    fxmax: 600,
  });

  // open/close
  const [txtShow, setTxtShow] = useState<boolean>(false);
  const [heteroShowSwitch, setHeteroShowSwitch] = useState<boolean>(true);
  const [openTour, setOpenTour] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRetry, setIsRetry] = useState(false);
  const [readyToRestart, setReadyToRestart] = useState<boolean>(false);
  const [isOpenTextbox, setIsOpenTextbox] = useState<boolean>(false);
  const [showNextPre, setShowNextPre] = useState<boolean>(false);
  const [showListen, setShowListen] = useState<boolean>(false);
  const [showBall] = useState<boolean>(true);

  // reference variables
  const location = useLocation();
  const ref_pitch = useRef(null);
  const ref_functions = useRef(null);
  const ref_settings = useRef(null);
  const ref_moreHelp = useRef(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // initial Value
  const [volume, setVolume] = useState(0);
  const [maxLyricCount, setMaxLyricCount] = useState<number>(2);
  const [playLyricCount, setPlayLyricCount] = useState<number>(0);
  const [pitchDiff, setPitchDiff] = useState<number[]>([0]);
  const [, setAvgPitchDiff] = useState<number>();

  // selected choice
  const [, setCurrentSelection] = useState('Constant');
  const [syllableCount, setSyllableCount] = useState<string>('none');
  const [baseFilenames, setBaseFilenames] = useState<string[]>([]);
  const [heteronymFilenames, setHeteronymFilenames] = useState<string[]>([]);
  const [fileContent, setFileContent] = useState<string[]>([]);
  const [selectedNum, setSelectedNum] = useState<number>(0);
  const [selectedDefaultText, setSelectedDefaultText] = useState<string>('0');

  // const audioPlayerNew = useRef<AudioPlayer>(null);
  const [audioSrcFromChild, setAudioSrcFromChild] = useState<string>('');
  const [isListen, setIsListen] = useState<number>(1);
  const audioPlayerNewListen = useRef<AudioPlayer>(null);

  // Stores longest times for Heteronyms and Human Curve Exercises
  useEffect(() => {
    const heteroLongTimeURL =
      'https://ceas5.uc.edu/transvoice/heteroJsonData/precomputedHeteroData.json';
    const humanCurveLongTimeURL =
      'https://ceas5.uc.edu/transvoice/jsonDataOm/precomputedHumanCurveData.json';

    fetch(heteroLongTimeURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('heteroPrecomputedData', JSON.stringify(data));
      });

    fetch(humanCurveLongTimeURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('humanCurvePrecomputedData', JSON.stringify(data));
      });
  }, []);

  //
  const setPlayingPause = () => {
    setIsPlaying(false);
  };
  const handleBeginTour = () => {
    setOpenTour(true);
    window.scrollTo(0, 0);
  };
  const ClearTxt = () => {
    setFileContent([]);
    setSelectedDefaultText('0');
    setMaxLyricCount(1);
  };
  const handlePitchDiffChange = (value: number[]) => {
    setPitchDiff(value);
  };

  // Constant Page upload and input
  const onClick: MenuProps['onClick'] = ({key}) => {
    setSelectedDefaultText(key);
  };

  useEffect(() => {
    console.log(Text_1_Rainbow[1]);
    if (selectedDefaultText === '0') {
      handleTextInputString('');
    } else {
      handleTextInputString(Text_1_Rainbow[Number(selectedDefaultText) - 1]);
    }
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
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(1);
  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value as string;
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

  // audio
  const handleAudioSrc = (newAudioSrc: string) => {
    setAudioSrcFromChild(newAudioSrc);
  };
  const playAudioListen = () => {
    console.log('audio src file', audioSrcFromChild);
    console.log('abcc');
    // if (audioPlayer.current && audioPlayer.current.audioEl.current) {
    // audioPlayer.current.audioEl.current.play()
    if (
      audioPlayerNewListen.current &&
      audioPlayerNewListen.current.audio.current
    ) {
      audioPlayerNewListen.current.audio.current
        .play()
        .then(() => {
          setIsListen(isListen + 1);
        })
        .catch(error => {
          console.error('Fail play audios: ', error);
        });
    }
  };

  // options audio
  useEffect(() => {
    fetchAudioData();
  }, [genderName]);

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
    ClearTxt(); // Hide txt when page is loaded
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

  // Tour
  const steps: TourProps['steps'] = [
    {
      title: 'Site Navigation',
      description:
        'Switch between different exercise types, voice assessment, videos, and other TruVox components.',
      placement: 'bottom',
      target: document.getElementsByClassName('Menu')[0] as HTMLElement,
      className: `customTour-${theme}`,
    },
    {
      title: 'Pitch Exercises',
      description: (
        <ul style={{textAlign: 'left', marginTop: '0', marginBottom: '0'}}>
          <li>Constant: Match a constant pitch target.</li>
          <li>Stair: Match a series of 5 pitch targets.</li>
          <li>
            Heteronyms: Speak pairs of words that are spelled the same but
            pronounced differently.
          </li>
          <li>Human Curve: Match the pitch curve of a spoken phrase.</li>
          <li>Chanting: Hum and then chant a phrase at a constant pitch.</li>
        </ul>
      ),
      placement: 'top',
      target: () => ref_pitch.current,
      className: `customTour-${theme}`,
    },
    {
      title: 'Real-Time Pitch Display',
      description:
        'Visualize your voice pitch and target pitch curve in real-time. Starts running when you press the Start button.',
      placement: 'top',
      target: document.getElementById('pitchCanvas'),
      className: `customTour-${theme}`,
    },
    {
      title: 'Function Buttons',
      description: (
        <ul style={{textAlign: 'left', marginTop: '0', marginBottom: '0'}}>
          <li>Retry: Clear display and restart.</li>
          <li>Start/Stop: Begin or stop recording.</li>
          <li>
            Upload txt/pdf File (optional): Upload text or pdf for you (in
            .txt/.pdf format) to read while recording.
          </li>
          <li>
            Previous Next (if text uploaded): Switch between lines of text.
          </li>
        </ul>
      ),
      target: () => ref_functions.current,
      className: `customTour-${theme}`,
    },
    {
      title: 'Slider',
      description:
        'Use this slider to change the target pitch value that you want to aim for. The target will become visible once the real-time display is running.',
      target: () =>
        parentRef.current?.children[0]?.querySelector('div') as HTMLDivElement,
      placement: 'left',
      className: `customTour-${theme}`,
    },
    {
      title: 'Settings Menu',
      description: 'Adjust settings such as the pitch display range.',
      target: () => ref_settings.current,
      placement: 'left',
      className: `customTour-${theme}`,
    },
    {
      title: 'How to use',
      description:
        'More help for the selected exercise, including a video, is shown below.',
      target: () => ref_moreHelp.current,
      placement: 'top',
      className: `customTour-${theme}`,
    },
  ];
  const handleChantingMenuClick: MenuProps['onClick'] = e => {
    setSelectedChantingOption(e.key);
    setComponent(`ChantingTxt-${e.key}`);
    setSelectedNum(1);
    setSyllableCount('none');
  };

  const chantingOptions = (
    <Menu onClick={handleChantingMenuClick}>
      <Menu.Item key="Level 1">Level 1</Menu.Item>
      <Menu.Item key="Level 2">Level 2</Menu.Item>
      <Menu.Item key="Level 3">Level 3</Menu.Item>
      <Menu.Item key="Level 4">Level 4</Menu.Item>
    </Menu>
  );

  const currentSentences: {[key: string]: string[]} = {
    'ChantingTxt-Level 1': mVoicedSentences,
    'ChantingTxt-Level 2': mVoicedVoicelessSentences,
    'ChantingTxt-Level 3': nVoicedSentences,
    'ChantingTxt-Level 4': nVoicedVoicelessSentences,
  };

  const sentences = currentSentences[component] || [];

  const [selectedChantingOption, setSelectedChantingOption] =
    useState('CHANTING');

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

  useEffect(() => {
    if (component.startsWith('ChantingTxt')) {
      setChantingStep(1);
      setChantingActualPitch([]);
      setChantingMeanPitch(null);
      setCurrentSentenceIndex(0);
    }
  }, [component]);

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
      setSelectedNum(0);
    } else if (
      e.target.innerText === 'Stair' ||
      e.target.innerText === 'STAIR'
    ) {
      setComponent('Stair');
      setSelectedNum(2);
    } else if (
      e.target.innerText === 'Chanting' ||
      e.target.innerText === 'CHANTING'
    ) {
      setComponent('ChantingTxt');
      setSelectedNum(1);
    } else {
      setComponent('Heteronym');
      setSelectedNum(4);
    }
    setSyllableCount('none');
  };

  const handleMenuClick = (e: any) => {
    setPlayLyricCount(0);
    const [componentType, genderType, syllableCountType] = e.key.split('-');
    if (componentType === 'Constant') {
      setCurrentSelection('Constant');
    } else if (componentType === 'ConstantTxt') {
      setCurrentSelection('Constant');
    } else if (componentType === 'Stair') {
      setCurrentSelection('Staircase');
    } else if (componentType === 'Chanting') {
      setCurrentSelection('ChantingTxt');
      setSelectedNum(1);
    } else {
      const tt = 'Syllables ' + syllableCountType;
      setCurrentSelection(tt);
      setSelectedNum(3);
    }

    setComponent(componentType);
    setGender(genderType);
    setSyllableCount(syllableCountType);

    setCurrentSelection(e.key + 'syllable ' + genderName);
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
  const handlePlayLyricCountChange = (newCount: number) => {
    setPlayLyricCount(newCount);
  };

  /**
   * Defines the items for the syllable menu based on the gender.
   * If the gender is 'none', it only includes a single item prompting the user to select an avatar.
   * Otherwise, it includes multiple items representing the number of syllables, with corresponding click handlers.
   */
  const itemsSyllable: MenuProps['items'] =
    gender === 'none'
      ? [
          {
            key: 'SelectAvatar',
            label: 'Please select avatar',
          },
        ]
      : [
          {
            key: `Fixed-${gender}-2`,
            label: '2 syllables',
            onClick: handleMenuClick,
          },
          {
            key: `Fixed-${gender}-3`,
            label: '3 syllables',
            onClick: handleMenuClick,
          },
          {
            key: `Fixed-${gender}-4`,
            label: '4 syllables',
            onClick: handleMenuClick,
          },
          {
            key: `Fixed-${gender}-5`,
            label: '5 syllables',
            onClick: handleMenuClick,
          },
        ];
  const onChangeStairSwitch = (value: boolean) => {
    setTxtShow(value);
    setShowNextPre(value);
  };
  const onChangeHeteroSwitch = (value: boolean) => {
    setHeteroShowSwitch(value);
    setType(value ? 'word' : 'sentence');
    setNum(1);
    onChangeNum(true);
    console.log('Hetero Switch:', value, 'type', type);
  };
  const onChangeNum = (value: boolean) => {
    setNum(value ? 1 : 2);
    console.log('Num:', num);
  };

  const [chantingStep, setChantingStep] = useState(1);
  const [, setChantingActualPitch] = useState<number[]>([]);
  const [, setChantingMeanPitch] = useState<number | null>(null);
  const [previousStep, setPreviousStep] = useState<number>(chantingStep);

  useEffect(() => {
    if (previousStep === 1 && chantingStep === 2) {
      // Increment sentence index only when transitioning from step 1 to step 2
      setCurrentSentenceIndex(prevIndex => prevIndex % sentences.length);
    }
    setPreviousStep(chantingStep);
  }, [chantingStep, previousStep, sentences.length]);

  const renderSelectedComponent = (): React.ReactNode => {
    switch (component) {
      // case 'Constant':
      //   return <Constant ballPosition={ballPosition} isRetry={isRetry} setPlayingPause={setPlayingPause} setPlaying={setPlaying} COLORS={COLORS} showNotesPar={showNotesPar} size={size} config={config} isPlaying={isPlaying} />;
      case 'ConstantTxt':
        return (
          <ConstantTxt
            handlePitchDiffChange={handlePitchDiffChange}
            ref={parentRef}
            initialRange={initialRange}
            divisor={divisor}
            ballPosition={ballPosition}
            isRetry={isRetry}
            setPlayingPause={setPlayingPause}
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
          <Stair
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
      case 'Fixed':
        return (
          <Fixed
            setMaxLyricCount={setMaxLyricCount}
            setIsListen={setIsListen}
            isListen={isListen}
            isPitchDynamicallyScaled={isPitchDynamicallyScaled}
            initialRange={initialRange}
            setInitialRange={setInitialRange}
            divisor={divisor}
            setPlayingPause={setPlayingPause}
            isRetry={isRetry}
            onAudioSrcChange={handleAudioSrc}
            setBaseFilenames={setBaseFilenames}
            onPlayLyricCountChange={handlePlayLyricCountChange}
            syllableCount={syllableCount}
            gender={gender}
            genderName={genderName}
            COLORS={COLORS}
            showNotesPar={showNotesPar}
            playLyricCount={playLyricCount}
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
          <Heteronym
            setMaxLyricCount={setMaxLyricCount}
            setIsListen={setIsListen}
            isListen={isListen}
            isPitchDynamicallyScaled={isPitchDynamicallyScaled}
            initialRange={initialRange}
            setInitialRange={setInitialRange}
            divisor={divisor}
            setPlayingPause={setPlayingPause}
            isRetry={isRetry}
            onAudioSrcChange={handleAudioSrc}
            setHeteronymFilenames={setHeteronymFilenames}
            heteronymOrder={heteronymOrder}
            onPlayLyricCountChange={handlePlayLyricCountChange}
            gender={gender}
            genderName={genderName}
            type={type}
            num={num}
            COLORS={COLORS}
            showNotesPar={showNotesPar}
            playLyricCount={playLyricCount}
            size={size}
            config={config}
            isPlaying={isPlaying}
            enableAdvFeatures={enableAdvFeatures}
            theme={theme}
            themeColors={themeColors}
            colorsMode={colorsMode}
          />
        );
      case 'ChantingTxt-Level 1':
      case 'ChantingTxt-Level 2':
      case 'ChantingTxt-Level 3':
      case 'ChantingTxt-Level 4':
        return (
          <ChantingTxt
            ref={parentRef}
            initialRange={initialRange}
            divisor={divisor}
            ballPosition={ballPosition}
            isRetry={isRetry}
            setPlayingPause={setPlayingPause}
            COLORS={COLORS}
            showNotesPar={showNotesPar}
            size={size}
            config={config}
            isPlaying={isPlaying}
            showBall={showBall}
            chantingStep={chantingStep}
            setChantingStep={setChantingStep}
            setChantingActualPitch={setChantingActualPitch}
            setChantingMeanPitch={setChantingMeanPitch}
            setCurrentSentenceIndex={setCurrentSentenceIndex}
            type={
              component.split('-')[1] as
                | 'Level 1'
                | 'Level 3'
                | 'Level 2'
                | 'Level 4'
            }
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

  useEffect(() => {
    if (chantingStep === 1 && volume > threshold - 40 && enableVol) {
      setChantingStep(2); // Move to step 2 only if you're in step 1
    }
  }, [volume, chantingStep, threshold, enableVol]);

  const MainButtons = (): React.ReactNode => {
    const handleRetry = () => {
      // Reset to step 1
      if (component.startsWith('ChantingTxt')) {
        setChantingStep(1); // Reset to step 1
        setChantingActualPitch([]); // Clear pitch data
        setChantingMeanPitch(null); // Reset mean pitch
        setCurrentSentenceIndex(1); // Reset sentence index
        setIsPlaying(false); // Ensure that the playback state is reset
        setPreviousStep(0); // Reset the previous step tracker
      }

      // Reset canvas
      setIsRetry(prevIsRetry => !prevIsRetry); // This toggles isRetry state, triggering a canvas reset

      // Any other reset actions can go here
    };

    return (
      <Flex justify="center" wrap="wrap" gap="small">
        <Tooltip title="Retry">
          <Button
            onClick={handleRetry}
            shape="circle"
            icon={<RedoOutlined />}
            className={`customButton-${theme}`}
          />
        </Tooltip>
        <AudioPlayer
          autoPlayAfterSrcChange={false}
          src={audioSrcFromChild}
          ref={audioPlayerNewListen}
          style={{display: 'none'}}
        />
        {showListen && (
          <Tooltip title="Listen">
            <Button
              disabled={component !== 'Fixed' && component !== 'Heteronym'}
              shape="circle"
              onClick={playAudioListen}
              icon={<CustomerServiceOutlined />}
              className={`customButton-${theme}`}
            />
          </Tooltip>
        )}
        {/* Conditionally render Previous and Next buttons based on chantingStep */}
        {chantingStep !== 3 && showNextPre && (
          <Tooltip title="Previous phrase">
            <Button
              shape="circle"
              onClick={onChangePrevious}
              icon={<StepBackwardOutlined />}
              className={`customButton-${theme}`}
            />
          </Tooltip>
        )}
        {/* Play button is always visible */}
        <Tooltip title={isPlaying ? 'Pause' : 'Start'}>
          <Button
            onClick={onChangePause}
            shape="circle"
            icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
            className={`customButton-${theme}`}
          />
        </Tooltip>
        {chantingStep !== 3 && showNextPre && (
          <Tooltip title="Next phrase">
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

  useEffect(() => {
    const avgDiff = pitchDiff.reduce(
      (acc, current) => {
        if (!isNaN(current)) {
          acc.sum += current;
          acc.count++;
        }
        return acc;
      },
      {sum: 0, count: 0}
    );

    const formattedAvgPitchDiff = (
      avgDiff.count > 0 ? avgDiff.sum / avgDiff.count : 0
    ).toFixed(2);
    setAvgPitchDiff(parseFloat(formattedAvgPitchDiff));
  }, [pitchDiff]);

  const openEnterTextBox = () => {
    setIsOpenTextbox(!isOpenTextbox);
    setSelectedDefaultText('0');

    setFileContent([]);
  };
  useEffect(() => {
    if (volume > threshold - 100 && enableVol && chantingStep === 1) {
      setChantingStep(2); // Move to step 2
    }
  }, [volume]);

  const renderSelectedComponentLyric = (): React.ReactNode => {
    switch (component) {
      case 'ConstantTxt':
        return (
          <div className="lyric">
            <Space size="middle" ref={ref_functions}>
              {MainButtons()}
              <Space.Compact>
                {showNextPre && (
                  <Tooltip title="Clear existing files and upload new ones">
                    <Button
                      onClick={ClearTxt}
                      className={`customButton-${theme}`}
                    >
                      Clear text
                    </Button>
                  </Tooltip>
                )}
                <Tooltip
                  title="Some simple texts to read during practice"
                  placement="top"
                  autoAdjustOverflow={false}
                >
                  <Dropdown
                    menu={{items: itemsText, onClick}}
                    placement="bottomLeft"
                    autoAdjustOverflow={false}
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
                      icon={<UploadOutlined />}
                      className={`customButton-${theme}`}
                    >
                      Upload File
                    </Button>
                  </Upload>
                </Tooltip>
                <Tooltip title="Type/Paste text to read during practice">
                  <Button
                    onClick={openEnterTextBox}
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
                  className={`customTextArea-${theme}`}
                />
              )}
            </>
            <ul>
              {fileContent.map((text, index) => {
                const isNearEnd = fileContent.length - playLyricCount <= 2;
                let startIndex;
                let endIndex;
                if (fileContent.length - playLyricCount === 1) {
                  startIndex = fileContent.length - 1;
                  endIndex = fileContent.length - 1;
                } else if (fileContent.length - playLyricCount === 2) {
                  startIndex = fileContent.length - 2;
                  endIndex = fileContent.length - 1;
                } else {
                  startIndex = isNearEnd
                    ? fileContent.length - 3
                    : playLyricCount;
                  endIndex = startIndex + 2;
                }
                const showCondition = index >= startIndex && index <= endIndex;
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
            <Flex align="center" gap="middle" ref={ref_functions}>
              {MainButtons()}
              <Tooltip title="Show/Hide 5-syllable phrases to read">
                <Switch
                  checked={txtShow}
                  checkedChildren="show"
                  unCheckedChildren="hide"
                  onChange={onChangeStairSwitch}
                />
              </Tooltip>
            </Flex>
            {txtShow && <ul>{renderTruncatedFilenames(stairFilenames)}</ul>}
          </div>
        );

      case 'Heteronym':
        return (
          <div className="lyric">
            <Flex align="center" gap="middle" ref={ref_functions}>
              {MainButtons()}
              <Tooltip title="Show/Hide Heteronym Sentences">
                <Switch
                  checked={heteroShowSwitch}
                  checkedChildren="words"
                  unCheckedChildren="sentences"
                  onChange={onChangeHeteroSwitch}
                />
              </Tooltip>
              <Tooltip title="Switch between the two alternatives">
                <Switch
                  checked={num === 1}
                  checkedChildren="1"
                  unCheckedChildren="2"
                  onChange={onChangeNum}
                />
              </Tooltip>
            </Flex>
            {<ul>{renderTruncatedFilenames(heteronymFilenames)}</ul>}
          </div>
        );

      case 'Fixed':
        return (
          <div className="lyric">
            <div ref={ref_functions}>{MainButtons()}</div>
            <ul>{renderTruncatedFilenames(baseFilenames)}</ul>
          </div>
        );
      case 'ChantingTxt-Level 1':
      case 'ChantingTxt-Level 2':
      case 'ChantingTxt-Level 3':
      case 'ChantingTxt-Level 4':
        {
          const currentSentences = {
            'ChantingTxt-Level 1': mVoicedSentences,
            'ChantingTxt-Level 2': mVoicedVoicelessSentences,
            'ChantingTxt-Level 3': nVoicedSentences,
            'ChantingTxt-Level 4': nVoicedVoicelessSentences,
          };
          const sentences = currentSentences[component] || [];
          const currentSentence =
            currentSentenceIndex === 1
              ? sentences[0]
              : sentences[currentSentenceIndex];

          return (
            <div className="lyric">
              {(chantingStep === 1 ||
                chantingStep === 2 ||
                chantingStep === 3) &&
                currentSentence && (
                  <div
                    style={{
                      paddingBottom: '50px',
                      marginBottom: '-35px',
                      marginTop: '-6vh',
                    }}
                  >
                    {chantingStep === 1 && (
                      <Title
                        level={5}
                        style={{
                          fontSize: '2.2vh',
                          textAlign: 'center',
                          marginTop: '4vh',
                        }}
                        className={`text-${theme}`}
                      >
                        (Next Phrase: {currentSentence})
                      </Title>
                    )}
                    {chantingStep === 2 && (
                      <Title
                        level={4}
                        style={{
                          fontSize: '2.15vh',
                          textAlign: 'center',
                          marginTop: '3vh',
                        }}
                        className={`text-${theme}`}
                      >
                        {currentSentence}
                      </Title>
                    )}
                    {chantingStep === 3 && (
                      <Title
                        level={4}
                        style={{
                          fontSize: '2.3vh',
                          textAlign: 'center',
                          marginTop: '0.1vh',
                        }}
                        className={`text-${theme}`}
                      >
                        {currentSentence}
                      </Title>
                    )}
                  </div>
                )}

              <Flex align="center" gap="middle" ref={ref_functions}>
                {MainButtons()}
              </Flex>
            </div>
          );
        }

        return (
          <div className="lyric">
            <Flex align="center" gap="middle">
              {MainButtons()}
            </Flex>
            {txtShow && <ul>{renderTruncatedFilenames(chantingFilenames)}</ul>}
          </div>
        );
      default:
        return <span>Canvas: Picture</span>;
    }
  };
  useEffect(() => {
    // Reset chanting label
    if (!component.startsWith('ChantingTxt')) {
      setSelectedChantingOption('CHANTING');
    }

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
      setShowNextPre(txtShow);
      setShowListen(false);
    } else if (component === 'Heteronym') {
      setShowNextPre(true);
      setShowListen(true);
    } else {
      setShowNextPre(true);
      setShowListen(false);
    }
  }, [component, fileContent]);

  // Options Changing functions
  const onChangePause = () => {
    if (chantingStep === 4) {
      // Reset to the first step
      setChantingStep(1);
      setCurrentSentenceIndex(0);
      setChantingActualPitch([]);
      setChantingMeanPitch(null);
      setIsPlaying(false); // Ensure that the play state is active
    } else {
      // Toggle play/pause as usual
      setIsPlaying(!isPlaying);
    }
  };

  const onChangePrevious = () => {
    if (component.startsWith('ChantingTxt')) {
      if (chantingStep === 1) {
        // In step 1, decrement the index and go to step 4
        setCurrentSentenceIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : sentences.length - 1
        );
        setChantingStep(1); // Go to step 4
      } else if (chantingStep === 2) {
        // In step 2, only decrement the index and stay in step 2
        setCurrentSentenceIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : sentences.length - 1
        );
        setChantingStep(2); // Stay in step 2
      } else if (chantingStep === 4) {
        // In step 4, decrement the index and go back to step 2
        setCurrentSentenceIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : sentences.length - 1
        );
        setChantingStep(1); // Go back to step 2
      }
    } else {
      const tem = playLyricCount;
      if (tem <= 0) {
        setPlayLyricCount(0);
      } else {
        setPlayLyricCount(tem - 1);
      }
    }
  };

  const onChangeNext = () => {
    if (component.startsWith('ChantingTxt')) {
      if (chantingStep === 1) {
        // Increment the index but keep the step as 1
        setCurrentSentenceIndex(
          prevIndex => (prevIndex + 1) % sentences.length
        );
      } else if (chantingStep === 2) {
        // In step 2, increment the index and keep the step 2 active
        setCurrentSentenceIndex(
          prevIndex => (prevIndex + 1) % sentences.length
        );
        setChantingStep(2); // Keep step 2 active
      } else if (chantingStep === 4) {
        // In step 4, increment the index and go back to step 1
        setCurrentSentenceIndex(
          prevIndex => (prevIndex + 1) % sentences.length
        );
        setChantingStep(1); // Go back to step 1
      }
    } else {
      const tem = playLyricCount;
      if (tem >= maxLyricCount) {
        setPlayLyricCount(maxLyricCount);
      } else {
        setPlayLyricCount(tem + 1);
      }
    }
  };

  return (
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
                  <Space size="middle" ref={ref_pitch}>
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

                      <Tooltip title="Switch to the Chanting exercise">
                        <Dropdown
                          overlay={chantingOptions}
                          overlayClassName={`customDropdown-${theme}`}
                        >
                          <Button
                            type={
                              component.startsWith('ChantingTxt')
                                ? 'primary'
                                : 'default'
                            }
                            className={
                              component.startsWith('ChantingTxt')
                                ? `customMainButtons-primary-${theme}`
                                : `customMainButtons-${theme}`
                            }
                            style={{width: '124px'}}
                          >
                            {selectedChantingOption}
                            <DownOutlined />
                          </Button>
                        </Dropdown>
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

                      <Tooltip title="Switch to the Human Curve exercise">
                        <Dropdown
                          menu={{items: itemsSyllable}}
                          placement="bottom"
                          overlayClassName={`customDropdown-${theme}`}
                        >
                          <Button
                            type={component === 'Fixed' ? 'primary' : 'default'}
                            className={
                              component === 'Fixed'
                                ? `customMainButtons-primary-${theme}`
                                : `customMainButtons-${theme}`
                            }
                            style={{width: '155px'}}
                          >
                            {syllableCount === 'none'
                              ? 'HUMAN CURVE'
                              : syllableCount + ' SYLLABLE'}
                            <DownOutlined />
                          </Button>
                        </Dropdown>
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

              <div style={{width: '100%'}}>{renderSelectedComponent()}</div>

              <Flex vertical justify="center" wrap="wrap" gap="small">
                {renderSelectedComponentLyric()}
              </Flex>

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
                ref={ref_settings}
                shape="square"
                description="SETTINGS"
                icon={<SettingOutlined />}
              />

              <FloatButton
                style={{
                  width: 60,
                  height: 60,
                  right: 100,
                  bottom: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className={`customFloatButton-${theme}`}
                shape="square"
                description="TOUR"
                onClick={handleBeginTour}
                icon={<QuestionOutlined />}
              />

              <Image preview={false} src={divide_1} style={{width: '100%'}} />
              <Typography
                style={{
                  width: '100%',
                  paddingLeft: '30px',
                  paddingRight: '40px',
                }}
              >
                <Typography.Title
                  ref={ref_moreHelp}
                  id="part-1"
                  level={2}
                  style={{display: 'grid', margin: 0, justifySelf: 'center'}}
                  className={`text-${theme}`}
                >
                  How to use
                </Typography.Title>
                <br />

                <Paragraph
                  style={{display: 'grid', margin: 0, justifySelf: 'center'}}
                  className={`text-${theme}`}
                >
                  {items_3[selectedNum]?.label}
                  {items_3[selectedNum]?.children}
                </Paragraph>

                <br />

                <Paragraph className={`text-${theme}`}>
                  {items_3[5].label}
                  {items_3[5].children}
                </Paragraph>
              </Typography>
            </Flex>

            <SettingsDrawer
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

            <Tour
              open={openTour}
              onClose={() => setOpenTour(false)}
              steps={steps}
            />
          </Content>
        </Layout>
      </Col>
    </Row>
  );
};

export default Sample;
