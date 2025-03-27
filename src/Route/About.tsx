import React from 'react';
import {Typography, Col, Row} from 'antd';
import {Link} from 'react-router-dom';

const {Title, Paragraph} = Typography;

const fontSizePara = 17;
const fontAlign = 'justify';
const paragraphStyle: React.CSSProperties = {
  textAlign: fontAlign,
  fontSize: fontSizePara,
  fontFamily: "'Roboto', 'sans-serif'",
};

interface AboutProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: () => void;
  handleCancel: () => void;
  theme: string;
}

const About: React.FC<AboutProps> = ({theme}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className="aboutmain">
        <Row>
          <Col span={5}></Col>
          <Col span={14}>
            <Typography
              style={{
                paddingLeft: '30px',
                paddingRight: '40px',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              <div className="centerTitle">
                <Title
                  className={`customColorfulText-${theme}`}
                  style={{
                    textDecoration: 'underline',
                    color: 'rgb(36, 36, 131)',
                    textDecorationThickness: '2px',
                  }}
                >
                  ABOUT
                </Title>
              </div>

              <Paragraph style={paragraphStyle} className={`text-${theme}`}>
                TruVox was developed by the University of Cincinnati Department
                of Electrical and Computer Engineering under supervision of
                Prof. Vesna Novak. Contributors include Xiangyi Wang, Sam Weese,
                Om Jadhav, Victoria McKenna, Maggie Lyon, Ansh Bhanushali, Rey
                Hicks, and Tyler DiLoreto. The project was funded by the
                National Institute of Deafness and Communication Disorders
                (project R21DC021537) and by a Collaborative Pilot Grant from
                the University of Cincinnati Office of Research. The pitch
                calculation and display code is based on code by{' '}
                <Link
                  style={{fontSize: fontSizePara}}
                  to="http://www.speechandhearing.net/"
                  target="_blank"
                  className={`customLink-${theme}`}
                >
                  Mark Huckvale, University College London
                </Link>
                . Sentences for the chanting exercise were previously published
                in Stemple et al., "Clinical Voice Pathology: Theory and
                Management", 2020. The app is still in development, and updates
                are added regularly.
              </Paragraph>
              <Paragraph style={paragraphStyle} className={`text-${theme}`}>
                Our group aims to provide free and accessible gender-affirming
                voice coaching software that can be used by trans people as a
                supplement to professional voice coaching or as a stand-alone
                tool by trans people who cannot access professional voice
                coaching. We acknowledge that pitch is not the only component of
                gender-affirming voice coaching, but have focused on it in this
                first app since it is easily understood by beginners. In the
                future, we plan to expand to apps for coaching resonance and
                other aspects of transgender voice.
              </Paragraph>
              <Paragraph style={paragraphStyle} className={`text-${theme}`}>
                If you would like to discuss the project, feel free to reach out
                to Prof. Novak at
                <Link
                  style={{fontSize: fontSizePara}}
                  to="mailto:novakdn@ucmail.uc.edu"
                  className={`customLink-${theme}`}
                >
                  {' '}
                  novakdn@ucmail.uc.edu
                </Link>
                .
              </Paragraph>
            </Typography>
          </Col>
          <Col span={5}></Col>
        </Row>
      </div>
    </div>
  );
};

export default About;
