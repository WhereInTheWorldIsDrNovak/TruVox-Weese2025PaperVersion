import React from 'react';
import {useNavigate} from 'react-router-dom';
import type {CollapseProps} from 'antd';
import {Collapse, Button, Anchor, Divider, Typography, Col, Row} from 'antd';
import {useTemString} from '../hooks/useTemString';
import SmoothScrollButton from '../function/SmoothScroll';

interface HelpProps {
  theme: string;
}

const {Paragraph, Link} = Typography;
const fontAlign = 'justify';
const fontSizePara = '1.3vw'; // Matching the font size with Main.tsx
const fontSizeTitle = '1.6vw'; // Matching the font size with Main.tsx

function items_2(theme: string): CollapseProps['items'] {
  return [
    {
      key: 'part-2-1',
      label: (
        <Typography.Title
          id="part-2-1"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          How do we describe voice?
        </Typography.Title>
      ),
      children: (
        <Paragraph
          style={{textAlign: fontAlign, fontSize: fontSizePara}}
          className={`text-${theme}`}
        >
          Voice is often described in three ways: pitch, loudness, and quality.
          We can work on these three different aspects to change how our voice
          is perceived.
        </Paragraph>
      ),
    },
    {
      key: 'part-2-2',
      label: (
        <Typography.Title
          id="part-2-2"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          Why do trans people try to modify their voices?
        </Typography.Title>
      ),
      children: (
        <Paragraph
          style={{textAlign: fontAlign, fontSize: fontSizePara}}
          className={`text-${theme}`}
        >
          Voice is a gender signifier: listeners partially determine a speaker’s
          gender based on their voice. Transgender people often want their voice
          to match their gender expression. This is often referred to as
          voice-gender congruence.
        </Paragraph>
      ),
    },
    {
      key: 'part-2-3',
      label: (
        <Typography.Title
          id="part-2-3"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          Gender-related voice training targets
        </Typography.Title>
      ),
      children: (
        <Paragraph
          style={{textAlign: fontAlign, fontSize: fontSizePara}}
          className={`text-${theme}`}
        >
          Multiple aspects of voice contribute to gender perception. Research
          has shown that the primary voice marker that relates to perceived
          gender is <em>pitch</em> - the perception of how high-frequency or
          low-frequency the voice is. Higher pitches are stereotypically
          associated with femininity and women, whereas lower pitches are
          associated with masculinity and men. A second aspect of voice related
          to perceived gender is <em>resonance</em> - a characteristic of the
          quality of the voice. A more forward resonance (when the sound of the
          voice vibrates the front part of the mouth and face) is perceived as
          more feminine, whereas a more backward resonance (when the back of the
          mouth and throat constricts), is perceived as more masculine. The
          combination of increased pitch and forward resonance results in the
          strongest perception of a feminine voice
          <sup>
            <SmoothScrollButton targetId="part-2-5">[2]</SmoothScrollButton>
          </sup>
          . Our research also shows that transfeminine people are very
          interested in software for gender-affirming voice training, want it to
          focus on both pitch and resonance, and have many recommendations for
          useful features
          <sup>
            <SmoothScrollButton targetId="part-2-5">[3]</SmoothScrollButton>
          </sup>
          .
        </Paragraph>
      ),
    },
    {
      key: 'part-2-4',
      label: (
        <Typography.Title
          id="part-2-4"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          What does the research say about voice training for transfeminine
          people?
        </Typography.Title>
      ),
      children: (
        <Paragraph
          style={{textAlign: fontAlign, fontSize: fontSizePara}}
          className={`text-${theme}`}
        >
          Our previous research has found that transfeminine people who
          completed voice therapy showed an average increase in vocal pitch by
          half an octave
          <sup>
            <SmoothScrollButton targetId="part-2-5">[1]</SmoothScrollButton>
          </sup>
          . They also changed their articulation patterns so that the tongue was
          placed more forward in the mouth to facilitate a forward resonance.
          Targeting pitch and resonance may assist in increasing vocal
          femininity.
        </Paragraph>
      ),
    },
    {
      key: 'part-2-5',
      label: (
        <Typography.Title
          id="part-2-5"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          Citations
        </Typography.Title>
      ),
      children: (
        <>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            [1] Gustin, R.L., Dickinson, T.E., Shanley, S.N., Howell, R.J.,
            Hobek, A.L., Patel, T.H., & McKenna, V.S. (2022). “Acoustic outcomes
            in Patients seeking Voice Feminization: Investigation into
            Articulatory and Spectral Measures.” 51st Annual Voice Foundation,
            Philadelphia, PA. [Oral Presentation].
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            [2] Whiteside, S. P. (1998). The Identification of a Speaker’s Sex
            from Synthesized Vowels. Perceptual and Motor Skills, 87(2),
            595-600.{' '}
            <Link
              href="https://doi.org/10.2466/pms.1998.87.2.595"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://doi.org/10.2466/pms.1998.87.2.595
            </Link>
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            [3] Bush, E. J., Krueger, B. I., Cody, M., Clapp, J. D., and Novak,
            V. D. (2024). “Considerations for voice and communication training
            software for transgender and nonbinary people,” Journal of Voice,
            38, 1251.e1-1251.e20.{' '}
            <Link
              href="https://doi.org/10.1016/j.jvoice.2022.03.002"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://doi.org/10.1016/j.jvoice.2022.03.002
            </Link>
          </Paragraph>
        </>
      ),
    },
  ];
}

const Help: React.FC<HelpProps> = ({theme}) => {
  const navigate = useNavigate();
  const {items_3} = useTemString(theme, fontSizePara, fontSizeTitle);
  const goToTour = () => {
    navigate('/pitch?init=true');
  };

  return (
    <div style={{width: '100%', color: 'paraColor'}}>
      <Row>
        <Col span={3} className={`customAnchor-${theme}`}>
          <Anchor
            items={[
              {
                key: 'part-1',
                href: '#part-1',
                title: 'Introduction',
              },
              {
                key: 'part-2',
                href: '#part-2',
                title: 'How is voice related to gender?',
                children: [
                  {
                    key: 'part-2-1',
                    href: '#part-2-1',
                    title: 'How do we describe voice?',
                  },
                  {
                    key: 'part-2-2',
                    href: '#part-2-2',
                    title: 'Why do trans people try to modify their voices?',
                  },
                  {
                    key: 'part-2-3',
                    href: '#part-2-3',
                    title: 'Gender-related voice training targets',
                  },
                  {
                    key: 'part-2-4',
                    href: '#part-2-4',
                    title:
                      'What does the research say about voice training for transfeminine people?',
                  },
                  {
                    key: 'part-2-5',
                    href: '#part-2-5',
                    title: 'Citations',
                  },
                ],
              },
              {
                key: 'part-3',
                href: '#part-3',
                title: 'Pitch module',
                children: [
                  {
                    key: 'part-3-2',
                    href: '#part-3-2',
                    title: 'Constant exercise',
                  },
                  {
                    key: 'part-3-6',
                    href: '#part-3-6',
                    title: 'Chanting exercise',
                  },
                  {
                    key: 'part-3-3',
                    href: '#part-3-3',
                    title: 'Stair exercise',
                  },
                  {
                    key: 'part-3-5',
                    href: '#part-3-5',
                    title: 'Human Curve exercise',
                  },
                  {
                    key: 'part-3-4',
                    href: '#part-3-4',
                    title: 'Heteronyms exercise',
                  },
                  {
                    key: 'part-3-1',
                    href: '#part-3-1',
                    title: 'Settings',
                  },
                  {
                    key: 'part-3-7',
                    href: '#part-3-7',
                    title: 'Suggestions',
                  },
                ],
              },
              {
                key: 'part-4',
                href: '#part-4',
                title: 'Pitch & Volume module ',
              },
              {
                key: 'part-5',
                href: '#part-5',
                title: 'Assessment module',
              },
              {
                key: 'part-6',
                href: '#part-6',
                title: 'Other resources',
              },
            ]}
          />
        </Col>

        <Col span={1} style={{maxWidth: '1px'}}>
          <Divider
            type="vertical"
            style={{height: '100%', margin: 0, padding: 0}}
          />
        </Col>

        <Col span={20}>
          <Typography style={{paddingLeft: '30px', paddingRight: '40px'}}>
            <Typography.Title
              id="part-1"
              level={2}
              style={{margin: 0, fontSize: fontSizeTitle}}
              className={`text-${theme}`}
            >
              1. Introduction
            </Typography.Title>
            <br />
            <Paragraph
              style={{textAlign: fontAlign, fontSize: fontSizePara}}
              className={`text-${theme}`}
            >
              Welcome to TruVox, a prototype voice coaching app that aims to
              help transfeminine individuals practice changing their voice in
              different ways. TruVox is still being developed, currently focuses
              on speakers of American English, and is not currently intended to
              be used as a complete gender-affirming voice training regimen. We
              recommend combining it with a human coach and other sources of
              information.
            </Paragraph>
            <Paragraph
              style={{textAlign: fontAlign, fontSize: fontSizePara}}
              className={`text-${theme}`}
            >
              You are currently on the Help page. You can start a Tour of the
              Pitch exercises with the button below, read more about the various
              TruVox components below the Tour button, or you can navigate to
              other sections of the page using the Home, Exercises, Assessment,
              Videos, and About tabs above.
            </Paragraph>
            <Button
              onClick={goToTour}
              className={`customGradientButton-${theme}`}
              type="primary"
              style={{
                border: '1.5px solid rgb(41, 41, 130)',
                borderRadius: '30px',
                fontSize: '17px',
                background: 'linear-gradient(to left, #5A82E1, #2f2a5a)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                width: '180px',
                textAlign: 'center',
                margin: '0 auto',
                paddingTop: '2px',
                paddingBottom: '5px',
                marginTop: '7px',
                letterSpacing: '4px',
                fontWeight: 'bold',
              }}
            >
              Begin Tour
            </Button>
            <br />
            <br />
            <br />
            <Typography.Title
              id="part-2"
              level={2}
              style={{margin: 0, fontSize: fontSizeTitle}}
              className={`text-${theme}`}
            >
              2. How is voice related to gender?
            </Typography.Title>
            <Collapse
              defaultActiveKey={['2']}
              ghost
              items={items_2(theme)}
              className={`text-wrapper-${theme}`}
            />
            <br />
            <Typography.Title
              level={2}
              id="part-3"
              style={{margin: 0, fontSize: fontSizeTitle}}
              className={`text-${theme}`}
            >
              3. Pitch module
            </Typography.Title>
            <br />
            <Paragraph
              style={{textAlign: fontAlign, fontSize: fontSizePara}}
              className={`text-${theme}`}
            >
              The pitch module is currently the main component of the app. In
              the center of the page is a graph that shows your voice pitch over
              time as you talk into your microphone. The graph can be started
              and stopped using the Start/Pause button below the graph.
            </Paragraph>
            <Paragraph
              style={{textAlign: fontAlign, fontSize: fontSizePara}}
              className={`text-${theme}`}
            >
              By default, the module starts in the Constant exercise. The
              Settings menu can be accessed using the button below the
              Start/Pause button or using the gear icon on the bottom right. The
              menu allows you to choose between five exercises (Constant,
              Chanting, Stair, Human Curve, and Heteronyms) as well as change
              several settings.
            </Paragraph>
            <Collapse
              defaultActiveKey={[]}
              ghost
              items={items_3}
              className={`text-wrapper-${theme}`}
            />
            <br />
            <Typography.Title
              id="part-4"
              level={2}
              style={{margin: 0, fontSize: fontSizeTitle}}
              className={`text-${theme}`}
            >
              4. Pitch & Volume module
            </Typography.Title>
            <br />
            <Paragraph
              style={{textAlign: fontAlign, fontSize: fontSizePara}}
              className={`text-${theme}`}
            >
              The Pitch & Volume module is intended to help simultaneously
              practice pitch and loudness. It is currently not fully functional
              and simply shows current volume in red and current pitch in blue.
              This will be expanded in a future update.
            </Paragraph>
            <br />
            <Typography.Title
              id="part-5"
              level={2}
              style={{margin: 0, fontSize: fontSizeTitle}}
              className={`text-${theme}`}
            >
              5. Assessment module
            </Typography.Title>
            <br />
            <Paragraph
              style={{textAlign: fontAlign, fontSize: fontSizePara}}
              className={`text-${theme}`}
            >
              The Assessment module is intended to give you a quick idea of what
              your voice sounds like. It will ask you to first make an ‘eee’
              sound, then read a standard voice assessment text. After that, you
              will rate your vocal effort (not currently used for anything), and
              the module will then calculate your mean pitch in Hz during the
              ‘eee’ sound and during text reading. Other voice characteristics
              (e.g., pitch range, resonance) will be added in future updates.
            </Paragraph>
            <br />
            <Typography.Title
              id="part-6"
              level={2}
              style={{margin: 0, fontSize: fontSizeTitle}}
              className={`text-${theme}`}
            >
              6. Other resources
            </Typography.Title>
            <br />
            <Paragraph
              style={{textAlign: fontAlign, fontSize: fontSizePara}}
              className={`text-${theme}`}
            >
              If you’re interested in other resources about transgender voice
              training, we recommend the following link!
              <ul>
                <li>
                  The transgender voice subreddit and the popular L’s voice
                  training guide for transfeminine people:
                  <ul>
                    <li>
                      <Link
                        href="https://www.reddit.com/r/transvoice/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://www.reddit.com/r/transvoice/
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.reddit.com/r/transvoice/comments/d3clhe/ls_voice_training_guide_level_1_for_mtf/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://www.reddit.com/r/transvoice/comments/d3clhe/ls_voice_training_guide_level_1_for_mtf/
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  The Scinguistics Discord server, which is theoretically for
                  all voice discussion but has a heavy transgender voice focus:
                  <ul>
                    <li>
                      <Link
                        href="https://discord.com/invite/w6Eb2tY"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://discord.com/invite/w6Eb2tY
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  The TransVoiceLessons YouTube channel:
                  <ul>
                    <li>
                      <Link
                        href="https://www.youtube.com/channel/UCBYlEnfAUbrYSwF0VujcmHA"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://www.youtube.com/channel/UCBYlEnfAUbrYSwF0VujcmHA
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  For Cincinnati locals: the UC Health Gender Affirming Voice
                  Therapy clinic
                  <ul>
                    <li>
                      <Link
                        href="https://www.uchealth.com/en/treatments-and-procedures/transgender-voice-therapy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://www.uchealth.com/en/treatments-and-procedures/transgender-voice-therapy
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
              Know a resource that should be on this list? Feel free to contact
              us!
            </Paragraph>
          </Typography>
        </Col>
        <Col span={1}></Col>
      </Row>
    </div>
  );
};

export default Help;
