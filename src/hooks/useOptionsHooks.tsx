import {useState, useRef} from 'react';
import {ThemeColors} from '../types/configTypes';
import AudioPlayer from 'react-h5-audio-player';
import {createFromIconfontCN} from '@ant-design/icons';
import {Button} from 'antd';
import type {MenuProps} from 'antd';
import '../CSS/play-audio-animation.css';

interface CustomButtonProps {
  label: string;
  handleIconClick?: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    label: string
  ) => void;
  handleLabelClick?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    label: string
  ) => void;
}

const PlayIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4566050_zpduwnlv2t.js',
});

export function useOptionsHooks() {
  const [gender, setGender] = useState<string>('Female');
  const [type, setType] = useState<string>('word');
  const [num, setNum] = useState<number>(1);
  const [genderName, setGenderName] = useState<string>('Fem01');
  const audioPlayerNew = useRef<AudioPlayer>(null);
  const [jsonFiles, setJsonFiles] = useState<string[]>([]);
  const [audioKey, setAudioKey] = useState<number>(123);
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [jsonFileLength, setJsonFileLength] = useState<number>(2);
  const [playLyricCount, setPlayLyricCount] = useState<number>(1);
  const [enableAdvFeatures, setEnableAdvFeatures] = useState(false);
  const [theme, setTheme] = useState<string>('light');
  const [colorsMode, setColorsMode] = useState('default');

  // Canvas colors for dif themes/colorblindness settings
  const themeColors: ThemeColors = {
    light: {
      // Name of theme
      default: {
        // Pitch Display Color Theme
        textColor: '#000000',
        dashedLineColor: '#e0e0e0',
        realVoiceColor: '#d679de',
        targetVoiceColor: '#4669C8',
        closeVoiceColor: '#15dbcc',
        currentVoiceColor: '#000000',
      },
      co: {
        textColor: '#000000',
        dashedLineColor: '#e0e0e0',
        realVoiceColor: '#ff0000',
        targetVoiceColor: '#3399ff',
        closeVoiceColor: 'yellow',
        currentVoiceColor: '#000000',
      },
    },
    dark: {
      default: {
        textColor: '#ffffff',
        dashedLineColor: '#e0e0e0',
        realVoiceColor: '#71b3e1',
        targetVoiceColor: '#855494',
        closeVoiceColor: '#f4cfff',
        currentVoiceColor: '#ffffff',
      },
      co: {
        textColor: '#ffffff',
        dashedLineColor: '#e0e0e0',
        realVoiceColor: '#ff0000',
        targetVoiceColor: '#3399ff',
        closeVoiceColor: 'yellow',
        currentVoiceColor: '#ffffff',
      },
    },
  };

  const syllableCount = '5';

  const saveGender = (e: any) => {
    const [genderType, genderNameType] = e.key.split('-');
    setGender(genderType);
    setGenderName(genderNameType);
  };

  // audio
  const playAudio = () => {
    if (audioPlayerNew.current && audioPlayerNew.current.audio.current) {
      const audio = audioPlayerNew.current.audio.current;
      if (audio.readyState === 4) {
        audio.play().catch((error: Error) => {
          console.error('Fail play audios: ', error);
        });
      } else {
        audio.addEventListener('canplay', () => {
          audio.play().catch((error: Error) => {
            console.error('Fail play audios: ', error);
          });
        });
      }
    }
  };

  const fetchAudioData = () => {
    let url = '';
    if (gender === 'male') {
      url = `https://ceas5.uc.edu/transvoice/jsondata/${syllableCount}/${gender}/list.json`;
    } else {
      url = `https://ceas5.uc.edu/transvoice/jsonDataOm/${gender}/${genderName}/${syllableCount}syllable/list.json`;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setJsonFiles(data.json_files);
        setJsonFileLength(data.json_files.length);

        if (data.json_files.length > 0) {
          const playLyricCountIn = 2; // Play the 3rd lyric by default
          setPlayLyricCount(playLyricCountIn);

          let audioFilename = '';
          let audioUrl = '';
          if (gender === 'male') {
            audioFilename = `${gender}-${data.json_files[
              playLyricCountIn
            ].replace('.json', '')}.wav`;
            audioUrl = `https://ceas5.uc.edu/transvoice/audio/${syllableCount}/${gender}/${audioFilename}`;
          } else {
            audioFilename = `${genderName}-${gender}-${data.json_files[
              playLyricCountIn
            ].replace('.json', '')}.wav`;
            audioUrl = `https://ceas5.uc.edu/transvoice/audioOm/${gender}/${genderName}/${syllableCount}syllable/${audioFilename}`;
          }
          console.log(audioUrl);

          // Pause and reset the audio player before setting the new source
          if (
            audioPlayerNew.current &&
            audioPlayerNew.current.audio.current &&
            audioPlayerNew.current.audio.current.src !== audioUrl
          ) {
            const audio = audioPlayerNew.current.audio.current;
            audio.pause(); // Pause the current playback
            audio.currentTime = 0; // Reset to the beginning
          }
          setAudioKey(Date.now()); // For re-render
          setAudioSrc(audioUrl); // Set the new source
        }
      })
      .catch(error => {
        console.error('Error fetching JSON files:', error);
      });
  };

  const getAudioUrl = (key: string) => {
    const [genderType, genderNameType] = key.split('-');
    // I wantedly not setting the genderName, as it triggers rerender and also triggers fetchAudioData
    const gender = genderType === 'Male' ? 'male' : genderType;
    const genderName =
      genderType === 'Male' ? `Male${genderNameType}` : `Fem${genderNameType}`;

    let url = '';
    if (gender === 'male') {
      url = `https://ceas5.uc.edu/transvoice/jsondata/${syllableCount}/${gender}/list.json`;
    } else {
      url = `https://ceas5.uc.edu/transvoice/jsonDataOm/${gender}/${genderName}/${syllableCount}syllable/list.json`;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.json_files.length > 0) {
          const playLyricCountIn = 2; // Play the 3rd lyric by default

          let audioFilename = '';
          let audioUrl = '';
          if (gender === 'male') {
            audioFilename = `${gender}-${data.json_files[
              playLyricCountIn
            ].replace('.json', '')}.wav`;
            audioUrl = `https://ceas5.uc.edu/transvoice/audio/${syllableCount}/${gender}/${audioFilename}`;
          } else {
            audioFilename = `${genderName}-${gender}-${data.json_files[
              playLyricCountIn
            ].replace('.json', '')}.wav`;
            audioUrl = `https://ceas5.uc.edu/transvoice/audioOm/${gender}/${genderName}/${syllableCount}syllable/${audioFilename}`;
          }

          console.log(audioUrl);

          if (
            audioPlayerNew.current &&
            audioPlayerNew.current.audio.current &&
            audioPlayerNew.current.audio.current.src !== audioUrl
          ) {
            const audio = audioPlayerNew.current.audio.current;
            audio.pause(); // Pause the current playback
            audio.currentTime = 0; // Reset to the beginning
          }
          setAudioKey(Date.now()); // For re-render
          setAudioSrc(audioUrl); // Set the new source
        }
      })
      .catch(error => {
        console.error('Error fetching JSON files:', error);
      });
  };

  const resetAudio = () => {
    if (audioPlayerNew.current && audioPlayerNew.current.audio.current) {
      const audio = audioPlayerNew.current.audio.current;
      audio.pause(); // Stop playback
      audio.currentTime = 0; // Reset to the beginning
      audio.src = ''; // Remove the source if necessary
      audio.load(); // Fully reset the audio element
    }
  };

  let debounceTimer: NodeJS.Timeout | null = null;

  const handleIconClick = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    key: string
  ) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        resetAudio(); // Stop any ongoing playback
        getAudioUrl(key);
        setTimeout(() => {
          try {
            setLoadingButtonKey(key); // Set the loading state for the clicked button
            playAudio();
            console.log('play audio!');
          } catch (error) {
            console.error('IconClick: Error playing audio:', error);
          } finally {
            // Reset the loading state after audio starts playing
            setTimeout(() => {
              setLoadingButtonKey(null);
            }, 2000);
          }
        }, 400);
      } catch (error) {
        console.error('IconClick: Error fetching audio data:', error);
      }
    }, 600);
  };

  const handleIconClickDropdown = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    // setIsClickListen(isClickListen+1);
    setTimeout(() => {
      playAudio();
      console.log('play dropdown audio!');
    }, 400);
  };

  const handleIconClickPlayAudio = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    // Made sure that audio is loaded on dropdown menu selection
    setTimeout(() => {
      playAudio();
      console.log('play model audio!');
    }, 400);
  };

  const handleLabelClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    key: string
  ) => {
    try {
      const [genderType, genderNameType] = key.split('-');
      setGender(genderType === 'Male' ? 'male' : genderType);
      setGenderName(
        genderType === 'Male' ? `Male${genderNameType}` : `Fem${genderNameType}`
      ); // setting gendername fetches new data
    } catch (error) {
      console.error('IconClick: Error fetching audio data:', error);
    }
  };

  // Play Icon Loading

  const [loadingButtonKey, setLoadingButtonKey] = useState<string | null>(null);

  const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    handleIconClick,
    handleLabelClick,
  }) => {
    const isLoading = loadingButtonKey === label;
    return (
      <Button
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        className="dropdownIcon"
        onClick={e => {
          if (handleLabelClick) handleLabelClick(e, label);
        }} // Handle label click which closes the dropdown
      >
        <span
          style={{
            display: 'inline-flex',
            fontSize: '1.7em',
          }}
          onClick={e => {
            e.stopPropagation(); // Prevent dropdown from closing
            if (handleIconClick) handleIconClick(e, label);
          }}
        >
          {isLoading ? (
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
              <circle cx="10" cy="10" r="9" fill="currentColor"></circle>
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
        {/* Vertical Line Separator */}
        <span
          style={{
            width: '1px',
            height: '1.5em',
            backgroundColor: '#ccc',
            margin: '0 8px',
          }}
        ></span>
        {label}
      </Button>
    );
  };

  const itemsAvatar: MenuProps['items'] = [
    {
      key: 'Female-Fem01',
      label: (
        <CustomButton
          label="Female-01"
          handleIconClick={handleIconClick}
          handleLabelClick={handleLabelClick}
        />
      ),
    },
    {
      key: 'Female-Fem02',
      label: (
        <CustomButton
          label="Female-02"
          handleIconClick={handleIconClick}
          handleLabelClick={handleLabelClick}
        />
      ),
    },
    {
      key: 'Female-Fem03',
      label: (
        <CustomButton
          label="Female-03"
          handleIconClick={handleIconClick}
          handleLabelClick={handleLabelClick}
        />
      ),
    },
    {
      key: 'Female-Fem04',
      label: (
        <CustomButton
          label="Female-04"
          handleIconClick={handleIconClick}
          handleLabelClick={handleLabelClick}
        />
      ),
    },
    {
      key: 'Female-Fem05',
      label: (
        <CustomButton
          label="Female-05"
          handleIconClick={handleIconClick}
          handleLabelClick={handleLabelClick}
        />
      ),
    },
    {
      key: 'Female-Fem06',
      label: (
        <CustomButton
          label="Female-06"
          handleIconClick={handleIconClick}
          handleLabelClick={handleLabelClick}
        />
      ),
    },
    {
      key: 'Female-Fem07',
      label: (
        <CustomButton
          label="Female-07"
          handleIconClick={handleIconClick}
          handleLabelClick={handleLabelClick}
        />
      ),
    },
    {
      key: 'Female-Fem08',
      label: (
        <CustomButton
          label="Female-08"
          handleIconClick={handleIconClick}
          handleLabelClick={handleLabelClick}
        />
      ),
    },
    {
      key: 'Female-Fem09',
      label: (
        <CustomButton
          label="Female-09"
          handleIconClick={handleIconClick}
          handleLabelClick={handleLabelClick}
        />
      ),
    },
    {
      key: 'male',
      label: (
        <CustomButton
          label="Male-01"
          handleIconClick={handleIconClick}
          handleLabelClick={handleLabelClick}
        />
      ),
    },
  ];
  // Below is a false positive on the linter
  const ModelSelections = () => {
    <>{}</>;
  };
  return {
    gender,
    setGender,
    type,
    setType,
    num,
    setNum,
    genderName,
    setGenderName,
    audioPlayerNew,
    jsonFiles,
    setJsonFiles,
    audioKey,
    setAudioKey,
    audioSrc,
    setAudioSrc,
    jsonFileLength,
    setJsonFileLength,
    playLyricCount,
    setPlayLyricCount,

    syllableCount,

    playAudio,
    fetchAudioData,

    saveGender,

    handleIconClick,
    handleIconClickPlayAudio,

    itemsAvatar,
    enableAdvFeatures,
    setEnableAdvFeatures,
    theme,
    setTheme,
    colorsMode,
    setColorsMode,

    themeColors,
  };
}
