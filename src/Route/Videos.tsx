import React, {useState} from 'react';
import {Typography, Row, Col, Radio, RadioChangeEvent} from 'antd';

const fontAlign = 'justify';
const fontSizePara = '1.3vw'; // Matching the font size with Main.tsx
const fontSizeTitle = '2.0vw'; // Matching the font size with Main.tsx
const titleColor = 'rgb(36, 36, 131)'; // Consistent color with Main.tsx
const paraColor = 'rgb(36, 36, 131)'; // Consistent color with Main.tsx
const fontSizePageTitle = '4.0vw';

interface VideosProps {
  theme: string;
}

const ExerciseOptions = [
  {label: 'Constant', value: 0},
  {label: 'Stair', value: 1},
  {label: 'Heteronym', value: 2},
  {label: 'Human Curve', value: 3},
  {label: 'Chanting', value: 4},
];

const WarmupOptions = [
  {label: '(1) Breathing', value: 0},
  {label: '(2) Resonance', value: 1},
  {label: '(3) Vocal Stretching', value: 2},
];

const ExerciseVids = [
  {
    title: 'TruVox Constant Exercise Demo',
    link: 'https://www.youtube.com/embed/63OuVpZWm4g',
  },
  {
    title: 'TruVox Stair Exercise Demo',
    link: 'https://www.youtube.com/embed/Majy2E2zw94',
  },
  {
    title: 'TruVox Heteronyms Demo',
    link: 'https://www.youtube.com/embed/nVrrTkP49Mw',
  },
  {
    title: 'TruVox Human Curve Demo',
    link: 'https://www.youtube.com/embed/cP1_hMm4y2s',
  },
  {
    title: 'TruVox Chanting Demo',
    link: 'https://www.youtube.com/embed/-oeIlBYThoY',
  },
];

const WarmupVids = [
  {
    title: 'Warmup 1: Breathing Support',
    link: 'https://www.youtube.com/embed/GreuJzVwXjU',
  },
  {
    title: 'Warmup 2: Resonant Voice',
    link: 'https://www.youtube.com/embed/3fgTkI_Nh2A',
  },
  {
    title: 'Warmup 3: Vocal Stretching',
    link: 'https://www.youtube.com/embed/hMQUXTpn4Vk',
  },
];

const Videos: React.FC<VideosProps> = ({theme}) => {
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [currentWarmup, setCurrentWarmup] = useState<number>(0);

  function onExerciseVidChange({target: {value}}: RadioChangeEvent) {
    setCurrentExercise(value);
  }

  function onWarmupVidChange({target: {value}}: RadioChangeEvent) {
    setCurrentWarmup(value);
  }

  return (
    <div style={{width: '98vw', justifyContent: 'center', display: 'grid'}}>
      <div
        style={{
          width: '50%',
          color: 'paraColor',
          justifySelf: 'center',
          display: 'grid',
        }}
      >
        <Typography.Title
          level={1}
          style={{
            margin: 0,
            marginBottom: '20px',
            color: titleColor,
            fontSize: fontSizePageTitle,
            justifySelf: 'center',
          }}
          className={`customColorfulText-${theme}`}
        >
          Videos Page
        </Typography.Title>

        <Typography.Paragraph
          style={{
            textAlign: fontAlign,
            fontSize: fontSizePara,
            color: paraColor,
          }}
          className={`customColorfulText-${theme}`}
        >
          Welcome to the Videos section. This page contains several videos
          intended to supplement the interactive exercises found on the
          Exercises page. Below you'll find three warmup videos that you can
          watch whenever you want some guidance on how to warmup before vocal
          exercise. Below the warmup videos, you'll also find videos that
          demonstrate each of the Pitch exercises.
        </Typography.Paragraph>

        <br />
      </div>

      <Row>
        <Col span={12} style={{paddingRight: '5px'}}>
          <div
            style={{
              width: '50%',
              color: 'paraColor',
              justifySelf: 'center',
              display: 'grid',
            }}
          >
            <Typography.Title
              id="part-1"
              level={2}
              style={{
                margin: 0,
                color: titleColor,
                fontSize: fontSizeTitle,
                justifySelf: 'center',
                marginBottom: '5px',
              }}
              className={`customColorfulText-${theme}`}
            >
              WARMUP VIDEOS
            </Typography.Title>
          </div>

          <div
            style={{height: '26vw', width: '100%'}}
            className={`customVidBackground customVidBackground-${theme}`}
          >
            <Radio.Group
              options={WarmupOptions}
              defaultValue={WarmupOptions[0].value}
              optionType="button"
              buttonStyle="solid"
              onChange={onWarmupVidChange}
              style={{display: 'flex', gap: '0px', justifySelf: 'center'}}
              className={`customRadioGroup-${theme}`}
            />

            <div
              style={{width: '100%', height: '100%'}}
              className={`customVidBorder customVidBorder-${theme}`}
            >
              <iframe
                width="100%"
                height="100%"
                src={WarmupVids[currentWarmup].link}
                title={WarmupVids[currentWarmup].title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{justifySelf: 'center', marginTop: '0'}}
              ></iframe>
            </div>
          </div>
        </Col>

        <Col span={12} style={{paddingLeft: '5px'}}>
          <div
            style={{
              width: '50%',
              color: 'paraColor',
              justifySelf: 'center',
              display: 'grid',
            }}
          >
            <Typography.Title
              id="part-1"
              level={2}
              style={{
                margin: 0,
                color: titleColor,
                fontSize: fontSizeTitle,
                justifySelf: 'center',
                marginBottom: '5px',
              }}
              className={`customColorfulText-${theme}`}
            >
              EXERCISE DEMO VIDEOS
            </Typography.Title>
          </div>

          <div
            style={{height: '26vw', width: '100%'}}
            className={`customVidBackground customVidBackground-${theme}`}
          >
            <Radio.Group
              options={ExerciseOptions}
              defaultValue={ExerciseOptions[0].value}
              optionType="button"
              buttonStyle="solid"
              onChange={onExerciseVidChange}
              style={{display: 'flex', gap: '0px', justifySelf: 'center'}}
              className={`customRadioGroup-${theme}`}
            />

            <div
              style={{width: '100%', height: '100%'}}
              className={`customVidBorder customVidBorder-${theme}`}
            >
              <iframe
                width="100%"
                height="100%"
                src={ExerciseVids[currentExercise].link}
                title={ExerciseVids[currentExercise].title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{justifySelf: 'center', marginTop: '0'}}
              ></iframe>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Videos;
