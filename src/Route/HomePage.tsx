import '../CSS/HomePage.css';
import React from 'react';
import {Typography, Button, Row, Col, Card} from 'antd';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';

const {Title, Paragraph} = Typography;

interface MainProps {
  handleCancel: () => void;
  goToTour: () => void;
  theme: string;
}

const Main: React.FC<MainProps> = ({theme}) => {
  const navigate = useNavigate();
  const goToTour = () => {
    navigate('/pitch?init=true');
  };

  return (
    <div className="main-container">
      {/* Introduction Section */}
      <div className="intro-section">
        <div>
          <Typography>
            <Title
              level={3}
              style={{
                fontSize: '2.6vw',
                color: 'rgb(36, 36, 131)',
                maxWidth: '10rem',
                margin: '0 auto',
                textAlign: 'center',
                fontWeight: 'normal',
              }}
              className={`customColorfulText-${theme}`}
            >
              Welcome to
            </Title>

            <Title
              level={3}
              style={{
                fontSize: '2.6vw',
                color: 'rgb(36, 36, 131)',
                maxWidth: '400px',
                margin: '20px auto 0',
                textAlign: 'center',
                fontWeight: 'normal',
                marginTop: '-5px',
              }}
              className={`customColorfulText customColorfulText-${theme}`}
            >
              our transgender voice coaching app!
            </Title>

            <Paragraph
              style={{
                fontSize: '1.5vw',
                color: 'rgb(36, 36, 131)',
                maxWidth: '500px',
                margin: '20px auto',
                textAlign: 'center',
              }}
              className={`customColorfulText customColorfulText-${theme}`}
            >
              The exercises and resources on this site are intended to help
              transfeminine people practice changing their voice to better match
              their gender. Right now, the site mainly focuses on pitch
              exercises, but is being expanded to other voice aspects.
            </Paragraph>
            <Button
              onClick={goToTour}
              type="primary"
              className={`customGradientButton customGradientButton-${theme}`}
            >
              Begin Tour
            </Button>
            <Link to="/Help" style={{marginLeft: '10px'}}>
              <Button
                type="primary"
                className={`customGradientButton customGradientButton-${theme}`}
              >
                Help Page
              </Button>
            </Link>
          </Typography>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={`bottom-section customSection-${theme}`}>
        <div className="bottom-title">
          <Title level={2} className="modules-title">
            MODULES
          </Title>
          <Paragraph className="bottom-paragraph">
            Working through the 'Pitch' and 'Pitch & Volume' exercises for about
            two 15-minute periods per day should help you obtain a desired
            voice. Use the Videos to learn warmup strategies and understand how
            to perform the different Exercises, and use the Assessment function
            whenever you want to check your progress.
          </Paragraph>
        </div>

        <Row justify="space-around">
          {/* Pitch Training Card */}
          <Col
            xs={24}
            sm={12}
            md={5}
            lg={5}
            style={{padding: '0'}}
            className={`customCard-${theme}`}
          >
            <Link to="/pitch">
              <Card
                actions={[
                  <Link
                    to="/pitch"
                    style={{color: 'inherit', padding: 0}}
                    className={`more-info-button text-${theme}`}
                  >
                    MORE INFO
                  </Link>,
                ]}
                hoverable
                bordered={false}
                className="card-style pitch-training-card"
              >
                <div>
                  <Title
                    level={1}
                    className="card-number pitch-number"
                    style={{fontSize: '0.25rem'}}
                  >
                    01
                  </Title>
                  <Title level={3} className="card-title pitch-title">
                    PITCH TRAINING
                  </Title>
                  <Paragraph className="card-paragraph pitch-paragraph">
                    Pitch is one of the biggest contributors to the way a voice
                    is perceived. In these exercises, you can practice matching
                    different pitch patterns.
                  </Paragraph>
                </div>
              </Card>
            </Link>
          </Col>

          {/* Pitch & Volume Training Card */}
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={5}
            style={{padding: '0'}}
            className={`customCard-${theme}`}
          >
            <Link to="/volume">
              <Card
                actions={[
                  <Link
                    to="/volume"
                    style={{color: 'inherit', padding: 0}}
                    className={`text-${theme}`}
                  >
                    MORE INFO
                  </Link>,
                ]}
                hoverable
                bordered={false}
                className="card-style pitch-volume-card"
              >
                <div>
                  <Title
                    level={1}
                    className="card-number volume-number"
                    style={{fontSize: '0.25rem'}}
                  >
                    02
                  </Title>
                  <Title level={3} className="card-title volume-title">
                    PITCH & VOLUME TRAINING
                  </Title>
                  <Paragraph className="card-paragraph volume-paragraph">
                    Trans people who can speak at a desired pitch often find
                    that they sound quieter than they would like. In these
                    exercises, you can therefore practice matching different
                    pitches and simultaneously sounding loud enough.
                  </Paragraph>
                </div>
              </Card>
            </Link>
          </Col>

          {/* Videos Card */}
          <Col
            xs={2}
            sm={12}
            md={5}
            lg={5}
            style={{padding: '0'}}
            className={`customCard-${theme}`}
          >
            <Link to="/videos">
              <Card
                actions={[
                  <Link
                    to="/videos"
                    style={{padding: 0}}
                    className={`text-${theme}`}
                  >
                    MORE INFO
                  </Link>,
                ]}
                hoverable
                bordered={false}
                className="card-style video-card"
              >
                <div>
                  <Title
                    level={1}
                    className="card-number video-number"
                    style={{fontSize: '0.25rem'}}
                  >
                    03
                  </Title>
                  <Title level={3} className="card-title video-title">
                    VIDEOS
                  </Title>
                  <Paragraph className="card-paragraph video-paragraph">
                    Information about general warmup strategies as well as demos
                    of individual pitch exercises.
                  </Paragraph>
                </div>
              </Card>
            </Link>
          </Col>

          {/* Assessment Card */}
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={5}
            style={{padding: '0'}}
            className={`customCard-${theme}`}
          >
            <Link to="/assessment">
              <Card
                actions={[
                  <Link
                    to="/assessment"
                    style={{padding: 0}}
                    className={`text-${theme}`}
                  >
                    MORE INFO
                  </Link>,
                ]}
                hoverable
                bordered={false}
                className="card-style assessment-card"
              >
                <div>
                  <Title
                    level={1}
                    style={{
                      color: '#8376AA',
                      fontSize: '0.25rem',
                      paddingTop: '0',
                      marginTop: '0',
                      marginBottom: '0.15rem',
                    }}
                  >
                    04
                  </Title>
                  <Title level={3} style={{color: '#8376AA', marginTop: '0'}}>
                    ASSESSMENT
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: '1.2vw',
                      color: '#6E6E73',
                      margin: '3.2vw 2vw 1vw 2vw',
                    }}
                  >
                    Not sure how your voice sounds right now? Go through a few
                    quick steps to find out.
                  </Paragraph>
                </div>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Main;
