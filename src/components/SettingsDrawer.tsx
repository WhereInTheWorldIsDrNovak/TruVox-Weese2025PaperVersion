import {
  Space,
  Dropdown,
  Button,
  MenuProps,
  RadioChangeEvent,
  Slider,
  SliderSingleProps,
  Flex,
  Row,
  Col,
} from 'antd';
import {createFromIconfontCN} from '@ant-design/icons';
import {ThemeColors, COLORS} from '../types/configTypes';
import {RadioSetting, SwitchSetting} from './SettingsTemplates';
import ResizableDrawer from './ResizableDrawer';
import React, {useState} from 'react';
import '../CSS/play-audio-animation.css';

interface SettingsDrawerProps {
  isSettingsPinned: boolean;
  setIsSettingsPinned: (bool: boolean) => void;
  enableAdvFeatures: boolean;
  setEnableAdvFeatures: (bool: boolean) => void;
  itemsAvatar: MenuProps['items'];
  handleIconClick: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    label: string
  ) => void;
  handleIconClickPlayAudio: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  genderName: string;
  gender: string;
  colorsMode: string;
  setColorsMode: (str: string) => void;
  setCOLORS: (color: COLORS) => void;
  setShowNotesPar: (bool: boolean) => void;
  showNotesPar: boolean;
  setEnableVol: (bool: boolean) => void;
  setInitialRange: (rangeValue: number[]) => void;
  setDivisor: (speedValue: number) => void;
  enableVol: boolean;
  setThreshold: (e: number) => void;
  component: string;
  setBallPosition: (positionValue: number) => void;
  openSetting: boolean;
  setOpenSetting: (bool: boolean) => void;
  theme: string;
  setTheme: (str: string) => void;
  themeColors: ThemeColors;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isSettingsPinned,
  setIsSettingsPinned,
  enableAdvFeatures,
  setEnableAdvFeatures,
  itemsAvatar,
  handleIconClickPlayAudio,
  genderName,
  gender,
  colorsMode,
  setColorsMode,
  setCOLORS,
  setShowNotesPar,
  showNotesPar,
  setEnableVol,
  setInitialRange,
  setDivisor,
  enableVol,
  setThreshold,
  component,
  setBallPosition,
  openSetting,
  setOpenSetting,
  theme,
  setTheme,
  themeColors,
}) => {
  // This just refreshes the canvas's colors so that they change when Dark Mode is enabled/disabled
  const refreshColors = (themeName: string) => {
    console.log(colorsMode);
    if (colorsMode === 'default') {
      setCOLORS(themeColors[themeName].default);
    } else {
      setCOLORS(themeColors[themeName].co);
    }
  };

  // On Changes
  const onChangeThreshold = (e: number) => {
    setThreshold(e);
  };
  const onChangePosition = (positionValue: number) => {
    setBallPosition(positionValue);
  };
  const onChangeSpeed = (speedValue: number) => {
    const mappedValue = Math.round(speedValue * 20 + 4);
    setDivisor(mappedValue);
  };
  const onChangeColor = ({target: {value}}: RadioChangeEvent) => {
    console.log(value);
    setColorsMode(value);
    setCOLORS(themeColors[theme][value]);
  };
  const onChangeHz = ({target: {value}}: RadioChangeEvent) => {
    console.log(value);
    if (value === 'hz') {
      setShowNotesPar(false);
    } else {
      setShowNotesPar(true);
    }
  };
  const onChangeRange = (rangeValue: number[]) => {
    setInitialRange([rangeValue[0], rangeValue[1]]);
  };
  const onChangeVolMode = (e: boolean) => {
    console.log(e);
    setEnableVol(e);
  };
  const onChangeTheme = ({target: {value}}: RadioChangeEvent) => {
    refreshColors(value);
    setTheme(value);
  };

  // Radio Options
  const pitchDispColorOptions = [
    {name: 'TruVox', value: 'default', label: null},
    {name: 'Colorblind', value: 'co', label: null},
  ];
  const coordDispModeOptions = [
    {
      name: 'Hz',
      value: 'hz',
      label: 'Hz (hertz, the scientific unit for frequency)',
    },
    {
      name: 'Notes',
      value: 'notes',
      label: 'Notes (musical notes: C, D and so on)',
    },
  ];
  const themeOptions = [
    {name: 'Light', value: 'light', label: null},
    {name: 'Dark', value: 'dark', label: null},
  ];

  // Slider Options
  // tooltips
  const formatterdB = (value: number | undefined) => `${value} dB`;
  const formatterHz = (value: number | undefined) => `${value} Hz`;
  const formatterPos = (value: number | undefined) =>
    `${value ? (value * 100).toFixed(0) : '0'}%`;

  // marks
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

  // Components
  const pitchDispColor = (
    <RadioSetting
      title="Pitch Display Color Scheme"
      onChange={onChangeColor}
      value={colorsMode}
      defaultValue="default"
      items={pitchDispColorOptions}
    />
  );
  const coordDispMode = (
    <RadioSetting
      title="Coordinate Display Mode"
      onChange={onChangeHz}
      value={showNotesPar ? 'notes' : 'hz'}
      defaultValue="notes"
      items={coordDispModeOptions}
    />
  );
  const themeSettings = (
    <RadioSetting
      title="Theme"
      onChange={onChangeTheme}
      value={theme}
      defaultValue="light"
      items={themeOptions}
    />
  );
  const pinSettings = (
    <SwitchSetting
      title="Pin Settings Open"
      onChange={setIsSettingsPinned}
      value={isSettingsPinned}
      defaultChecked={isSettingsPinned}
      tooltip="If enabled, settings will stay open in a bar along the bottom of your screen, allowing you to change your settings and access the exercises at the same time."
    />
  );
  const advFeatures = (
    <SwitchSetting
      title="Enable Advanced Features"
      onChange={setEnableAdvFeatures}
      value={enableAdvFeatures}
      defaultChecked={enableAdvFeatures}
      tooltip="If enabled, more advanced settings will be available to you. This setting will also show some features that are currently in development."
    />
  );

  // Play Icon Loading
  const [isPlayIconLoading, setIsPlayIconLoading] = useState(false);
  const handleIconClickPlayAudioAnimation = () => {
    setIsPlayIconLoading(true);

    setTimeout(() => {
      setIsPlayIconLoading(false);
    }, 2000); // duration for the animation (2 seconds)
  };

  const modelSelection = (
    <Space>
      <p>Model Selection</p>
      <Dropdown.Button
        menu={{items: itemsAvatar}}
        placement="bottom"
        trigger={['click']}
        overlayClassName={`custom-dropdown customDropdown-${theme}`}
        buttonsRender={([leftButton, rightButton]) => [
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
            }
          >
            {genderName === 'none'
              ? 'Model Voice'
              : gender === 'Female'
                ? genderName
                : 'Male01'}
          </Button>,
          React.cloneElement(rightButton as React.ReactElement<any, string>, {
            loading: false,
          }),
        ]}
      ></Dropdown.Button>
    </Space>
  );

  const autoStart = (
    <div>
      <SwitchSetting
        title="Auto-Start When Voice Detected"
        onChange={onChangeVolMode}
        value={enableVol}
        defaultChecked={false}
        tooltip="If enabled, an exercise will start if your microphone detects speech. If disabled, you must start exercises manually. Either way, you will need to stop the exercise manually."
      />
      {enableVol && (
        <Slider
          step={1}
          min={50}
          max={90}
          onChange={onChangeThreshold}
          tooltip={{
            formatter: formatterdB,
          }}
          defaultValue={70}
          marks={marksVol}
        />
      )}
    </div>
  );

  const pitchDispRange = (
    <div>
      <p>Pitch Display Range</p>
      <Slider
        range
        step={10}
        min={50}
        max={600}
        onChange={onChangeRange}
        tooltip={{
          formatter: formatterHz,
        }}
        marks={marksRange}
        defaultValue={[100, 300]}
      />
    </div>
  );

  const pitchIndicatorSpeed = (
    <div>
      <p>Pitch Indicator Speed</p>
      <Slider
        step={0.05}
        min={0}
        max={1}
        onChange={onChangeSpeed}
        defaultValue={0.3}
        tooltip={{
          formatter: () =>
            'Changes how fast you need to talk in Stair and Human Curve exercises',
        }}
      />
    </div>
  );

  const pitchIndicatorHorizPos = (
    <div>
      <p>Pitch Indicator Horizontal Position</p>
      <Slider
        step={0.1}
        min={0}
        max={1}
        onChange={onChangePosition}
        tooltip={{
          formatter: formatterPos,
        }}
        defaultValue={0.5}
        marks={marksBallPos}
      />
    </div>
  );

  // Drawer
  if (isSettingsPinned) {
    return (
      <ResizableDrawer
        title="Settings"
        placement="bottom"
        onClose={() => setOpenSetting(false)}
        open={openSetting}
        height={215}
        mask={false}
        className={`settings-${theme}`}
      >
        <Flex vertical gap="middle">
          <Row>
            <Col span={12}>
              <Space direction="vertical" size={'middle'}>
                {modelSelection}
                {pitchDispColor}
                {themeSettings}
              </Space>
            </Col>
            <Col span={1} />
            <Col span={11}>
              <Space direction="vertical" size={'middle'}>
                {coordDispMode}
                {autoStart}
              </Space>
            </Col>
          </Row>

          <div
            className={`divider-${theme}`}
            style={{
              backgroundColor: 'lightgray',
              height: '1px',
              width: '100%',
              borderRadius: '10px',
            }}
          />

          <Row>
            <Col span={12}>
              <Space direction="vertical" size={'middle'}>
                {pinSettings}
              </Space>
            </Col>
            <Col span={1} />
            <Col span={11}>
              <Space direction="vertical" size={'middle'}>
                {advFeatures}
              </Space>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Space
                direction="vertical"
                size={'middle'}
                style={{width: '100%'}}
              >
                {pitchDispRange}
                {pitchIndicatorSpeed}
                {enableAdvFeatures &&
                  component !== 'Fixed' &&
                  component !== 'Stair' &&
                  component !== 'Heteronym' &&
                  pitchIndicatorHorizPos}
              </Space>
            </Col>
          </Row>
        </Flex>
      </ResizableDrawer>
    );
  } else {
    return (
      <ResizableDrawer
        title="Settings"
        placement="right"
        onClose={() => setOpenSetting(false)}
        open={openSetting}
        height={215}
        className={`settings-${theme}`}
      >
        <Flex vertical gap="middle">
          <Space direction="vertical" size={'middle'}>
            {modelSelection}
            {pitchDispColor}
            {themeSettings}

            <div
              className={`divider-${theme}`}
              style={{
                backgroundColor: 'lightgray',
                height: '1px',
                width: '100%',
                borderRadius: '10px',
              }}
            />

            {autoStart}
            {coordDispMode}
            {pitchDispRange}
            {pitchIndicatorSpeed}
            {enableAdvFeatures &&
              component !== 'Fixed' &&
              component !== 'Stair' &&
              component !== 'Heteronym' &&
              pitchIndicatorHorizPos}

            <div
              className={`divider-${theme}`}
              style={{
                backgroundColor: 'lightgray',
                height: '1px',
                width: '100%',
                borderRadius: '10px',
              }}
            />

            {pinSettings}
            {advFeatures}
          </Space>
        </Flex>
      </ResizableDrawer>
    );
  }
};

export default SettingsDrawer;
