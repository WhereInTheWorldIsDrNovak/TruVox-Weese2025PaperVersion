import '../CSS/HomePage.css';
import React, {useState, useEffect} from 'react';
import {Typography, Button, Row, Col, Card, Modal} from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import {Link} from 'react-router-dom';

const {Title, Paragraph} = Typography;

interface MainProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: () => void;
  handleCancel: () => void;
  goToSample: () => void;
  theme: string;
}

const Main: React.FC<MainProps> = ({
  isModalOpen,
  setIsModalOpen,
  showModal,
  handleCancel,
  theme,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);

  const goToSample = () => {
    setIsModalOpen(false);
    navigate('/pitch?init=true');
  };

  const showVolumeModal = () => {
    setIsVolumeModalOpen(true);
  };

  const handleVolumeCancel = () => {
    setIsVolumeModalOpen(false);
  };

  useEffect(() => {
    // Ensure modals are closed when navigating away
    setIsModalOpen(false);
    setIsVolumeModalOpen(false);
  }, [location.pathname, setIsModalOpen, setIsVolumeModalOpen]);

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
              onClick={goToSample}
              type="primary"
              className={`customGradientButton customGradientButton-${theme}`}
            >
              Begin Tour
            </Button>
          </Typography>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={`bottom-section customSection-${theme}`}>
        <div className="bottom-title">
          <Title level={2} className="exercises-title">
            EXERCISES
          </Title>
          <Paragraph className="bottom-paragraph">
            Working through these exercises for about two 15-minute periods per
            day should help you obtain a desired voice. Feel free to select
            whatever exercises might be beneficial, and use the Assessment
            function whenever you want to check your progress.
          </Paragraph>
        </div>

        <Row justify="space-around">
          {/* Pitch Training Card */}
          <Col xs={24} sm={12} md={5} lg={6} className={`customCard-${theme}`}>
            <Card
              actions={[
                <Button
                  type="link"
                  onClick={e => {
                    e.stopPropagation();
                    showModal();
                  }}
                  className={`more-info-button text-${theme}`}
                >
                  MORE INFO
                </Button>,
              ]}
              hoverable
              bordered={false}
              className="card-style pitch-training-card"
              onClick={showModal}
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
                <Paragraph className="card-paragraph">
                  Pitch is one of the biggest contributors to the way a voice is
                  perceived. In these exercises, you can practice matching
                  different pitch patterns.
                </Paragraph>
              </div>
            </Card>
          </Col>

          {/* Pitch & Volume Training Card */}
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            style={{padding: '0'}}
            className={`customCard-${theme}`}
          >
            <Card
              actions={[
                <Button
                  type="link"
                  onClick={e => {
                    e.stopPropagation();
                    showVolumeModal();
                  }}
                  style={{color: 'inherit', padding: 0}}
                  className={`text-${theme}`}
                >
                  MORE INFO
                </Button>,
              ]}
              hoverable
              bordered={false}
              className="card-style pitch-volume-card"
              onClick={showVolumeModal}
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
                  Trans people who can speak at a desired pitch often find that
                  they sound quieter than they would like. In these exercises,
                  you can therefore practice matching different pitches and
                  simultaneously sounding loud enough.
                </Paragraph>
              </div>
            </Card>
          </Col>

          {/* Assessment Card */}
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
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
                    03
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

      {/* Pitch Training Modal */}
      <Modal
        title={
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.3rem',
              color: '#8778AA',
              textDecoration: 'underline',
              textUnderlineOffset: '10px',
            }}
          >
            PITCH TRAINING
          </div>
        }
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1200}
        style={{top: '0vh'}}
        bodyStyle={{height: '110vh', overflow: 'hidden'}}
        className={`customModal-${theme}`}
      >
        <div style={{textAlign: 'center'}}>
          <Paragraph
            style={{
              fontSize: '0.11rem',
              color: '#6E6E73',
              marginBottom: '20px',
              width: '550px',
              marginLeft: '250px',
            }}
          >
            Pitch is one of the biggest contributors to the way a voice is
            perceived. If you have no pitch-matching ability, start with the
            Constant Target exercise, then move to other exercises once you've
            mastered that.
          </Paragraph>
        </div>
        <Row justify="space-between" style={{marginTop: '20px'}}>
          {/* Constant Target Exercise */}
          <Col
            span={7}
            style={{padding: '10px'}}
            className={`customCard-${theme}`}
          >
            <Card
              bordered={false}
              style={{
                textAlign: 'center',
                height: '91%',
                border: '1px solid #8DAADA',
                padding: '8px',
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                setIsModalOpen(false);
                navigate('/pitch');
              }}
            >
              <Title
                level={4}
                style={{
                  marginBottom: '0',
                  fontSize: '0.3rem',
                  marginTop: '0',
                  color: '#8DAADA',
                }}
              >
                01
              </Title>
              <Paragraph
                style={{
                  fontSize: '0.175rem',
                  color: '#8DAADA',
                  marginTop: '0.01rem',
                }}
              >
                CONSTANT TARGET
              </Paragraph>
              <Paragraph
                style={{fontSize: '0.1rem', marginTop: '0.15rem'}}
                className={`text-${theme}`}
              >
                Practice talking at a single fixed pitch.
              </Paragraph>
              <hr style={{marginTop: '6.1vh', width: '100%'}} />
              <Button
                style={{
                  border: 'none',
                  fontSize: '0.12rem',
                  color: '#8DAADA',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                  navigate('/pitch');
                }}
                className={`customButton-${theme}`}
              >
                BEGIN
              </Button>
            </Card>
          </Col>

          {/* Stair Target Exercise */}
          <Col
            span={7}
            style={{padding: '10px'}}
            className={`customCard-${theme}`}
          >
            <Card
              bordered={false}
              style={{
                textAlign: 'center',
                height: '91%',
                border: '1px solid #436AC2',
                padding: '8px',
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                setIsModalOpen(false);
                navigate('/pitch?component=Stair');
              }}
            >
              <Title
                level={4}
                style={{
                  marginBottom: '0',
                  fontSize: '0.3rem',
                  marginTop: '0',
                  color: '#436AC2',
                }}
              >
                02
              </Title>
              <Paragraph
                style={{
                  fontSize: '0.175rem',
                  color: '#436AC2',
                  marginTop: '0.01rem',
                }}
              >
                STAIR TARGET
              </Paragraph>
              <Paragraph
                style={{fontSize: '0.1rem', marginTop: '0.18rem'}}
                className={`text-${theme}`}
              >
                Practice matching a sequence of different pitches.
              </Paragraph>
              <hr style={{marginTop: '6.1vh', width: '100%'}} />
              <Button
                style={{
                  border: 'none',
                  fontSize: '0.12rem',
                  color: '#436AC2',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                  navigate('/pitch?component=Stair');
                }}
                className={`customButton-${theme}`}
              >
                BEGIN
              </Button>
            </Card>
          </Col>

          {/* Human Curve Exercise */}
          <Col
            span={7}
            style={{padding: '10px'}}
            className={`customCard-${theme}`}
          >
            <Card
              bordered={false}
              style={{
                textAlign: 'center',
                height: '91%',
                border: '1px solid #8376AA',
                padding: '8px',
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                setIsModalOpen(false);
                navigate('/pitch?component=Fixed');
              }}
            >
              <Title
                level={4}
                style={{
                  marginBottom: '0',
                  fontSize: '0.3rem',
                  marginTop: '0',
                  color: '#8376AA',
                }}
              >
                03
              </Title>
              <Paragraph
                style={{
                  fontSize: '0.175rem',
                  color: '#8376AA',
                  marginTop: '0.01rem',
                }}
              >
                HUMAN CURVE
              </Paragraph>
              <Paragraph
                style={{fontSize: '0.1rem', marginTop: '0.1rem'}}
                className={`text-${theme}`}
              >
                Practice saying different phrases while matching the pitch curve
                of recorded cis women.
              </Paragraph>
              <hr style={{marginTop: '3.1vh', width: '100%'}} />
              <Button
                style={{
                  border: 'none',
                  fontSize: '0.12rem',
                  color: '#8376AA',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                  navigate('/pitch?component=Fixed');
                }}
                className={`customButton-${theme}`}
              >
                BEGIN
              </Button>
            </Card>
          </Col>

          {/* Heteronyms Exercise */}
          <Col
            span={7}
            style={{padding: '10px', marginLeft: '24vh'}}
            className={`customCard-${theme}`}
          >
            <Card
              bordered={false}
              style={{
                textAlign: 'center',
                height: '91%',
                border: '1px solid #8DAADA',
                padding: '8px',
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                setIsModalOpen(false);
                navigate('/pitch?component=Heteronym');
              }}
            >
              <Title
                level={4}
                style={{
                  marginBottom: '0',
                  fontSize: '0.3rem',
                  marginTop: '0',
                  color: '#8DAADA',
                }}
              >
                04
              </Title>
              <Paragraph
                style={{
                  fontSize: '0.175rem',
                  color: '#8DAADA',
                  marginTop: '0.01rem',
                }}
              >
                HETERONYMS
              </Paragraph>
              <Paragraph
                style={{fontSize: '0.1rem', marginTop: '0.2rem'}}
                className={`text-${theme}`}
              >
                Practice upward vs. downward intonation using heteronyms - words
                that are spelled the same but sound different.
              </Paragraph>
              <hr style={{marginTop: '2vh', width: '100%'}} />
              <Button
                style={{
                  border: 'none',
                  fontSize: '0.12rem',
                  color: '#8DAADA',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                  navigate('/pitch?component=Heteronym');
                }}
                className={`customButton-${theme}`}
              >
                BEGIN
              </Button>
            </Card>
          </Col>

          {/* Chanting Exercise */}
          <Col
            span={7}
            style={{padding: '10px', marginRight: '24vh'}}
            className={`customCard-${theme}`}
          >
            <Card
              bordered={false}
              style={{
                textAlign: 'center',
                height: '89%',
                border: '1px solid #8DAADA',
                padding: '8px',
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                setIsModalOpen(false);
                navigate('/pitch?component=ChantingTxt-M-Voiced');
              }}
            >
              <Title
                level={4}
                style={{
                  marginBottom: '0',
                  fontSize: '0.3rem',
                  marginTop: '0',
                  color: '#8DAADA',
                }}
              >
                05
              </Title>
              <Paragraph
                style={{
                  fontSize: '0.175rem',
                  color: '#8DAADA',
                  marginTop: '0.01rem',
                }}
              >
                CHANTING
              </Paragraph>
              <Paragraph
                style={{fontSize: '0.1rem', marginTop: '0.2rem'}}
                className={`text-${theme}`}
              >
                Practice smoothly sliding from a hum to a chant to free speech
                at a target pitch.
              </Paragraph>
              <hr style={{marginTop: '3.2vh', width: '100%'}} />
              <Button
                style={{
                  border: 'none',
                  fontSize: '0.12rem',
                  color: '#8DAADA',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                  navigate('/pitch?component=ChantingTxt-M-Voiced');
                }}
                className={`customButton-${theme}`}
              >
                BEGIN
              </Button>
            </Card>
          </Col>
        </Row>
      </Modal>

      {/* Pitch & Volume Training Modal */}
      <Modal
        title={
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.3rem',
              color: '#436AC2',
              textDecoration: 'underline',
              textUnderlineOffset: '10px',
            }}
          >
            PITCH & VOLUME TRAINING
          </div>
        }
        visible={isVolumeModalOpen}
        onCancel={handleVolumeCancel}
        footer={null}
        width={1200}
        style={{top: '0vh'}}
        bodyStyle={{height: '80vh', overflow: 'hidden'}}
        className={`customModal-${theme}`}
      >
        <div style={{textAlign: 'center'}}>
          <Paragraph
            style={{
              fontSize: '0.11rem',
              color: '#6E6E73',
              marginBottom: '50px',
              marginTop: '20px',
              width: '550px',
              marginLeft: '300px',
              textAlign: 'center',
            }}
          >
            Trans people who can speak at a desired pitch often find that they
            sound quieter than they would like. This exercise helps you practice
            maintaining your pitch while speaking at a louder volume.
          </Paragraph>
        </div>
        <Row justify="space-between" style={{marginTop: '20px'}}>
          {/* Constant Target Exercise */}
          <Col
            span={7}
            style={{padding: '10px'}}
            className={`customCard-${theme}`}
          >
            <Card
              bordered={false}
              style={{
                textAlign: 'center',
                height: '100%',
                border: '1px solid #436AC2',
                padding: '8px',
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                setIsVolumeModalOpen(false);
                navigate('/volume');
              }}
            >
              <Title
                level={4}
                style={{
                  marginBottom: '0',
                  fontSize: '0.3rem',
                  marginTop: '0',
                  color: '#436AC2',
                }}
              >
                01
              </Title>
              <Paragraph
                style={{
                  fontSize: '0.175rem',
                  color: '#436AC2',
                  marginTop: '0.01rem',
                }}
              >
                CONSTANT TARGET
              </Paragraph>
              <Paragraph
                style={{fontSize: '0.1rem', marginTop: '0.15rem'}}
                className={`text-${theme}`}
              >
                Practice talking at a single fixed pitch and maintaining a loud
                volume.
              </Paragraph>
              <hr style={{marginTop: '14.1vh', width: '100%'}} />
              <Button
                style={{
                  border: 'none',
                  fontSize: '0.12rem',
                  color: '#436AC2',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setIsVolumeModalOpen(false);
                  navigate('/volume');
                }}
                className={`customButton-${theme}`}
              >
                BEGIN
              </Button>
            </Card>
          </Col>

          {/* Stair Target Exercise */}
          <Col
            span={7}
            style={{padding: '10px'}}
            className={`customCard-${theme}`}
          >
            <Card
              bordered={false}
              style={{
                textAlign: 'center',
                height: '100%',
                border: '1px solid #436AC2',
                padding: '8px',
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                setIsVolumeModalOpen(false);
                navigate('/volume?component=Stair');
              }}
            >
              <Title
                level={4}
                style={{
                  marginBottom: '0',
                  fontSize: '0.3rem',
                  marginTop: '0',
                  color: '#436AC2',
                }}
              >
                02
              </Title>
              <Paragraph
                style={{
                  fontSize: '0.175rem',
                  color: '#436AC2',
                  marginTop: '0.01rem',
                }}
              >
                STAIR TARGET
              </Paragraph>
              <Paragraph
                style={{fontSize: '0.1rem', marginTop: '0.18rem'}}
                className={`text-${theme}`}
              >
                Practice matching a sequence of different pitches.
              </Paragraph>
              <hr style={{marginTop: '14vh', width: '100%'}} />
              <Button
                style={{
                  border: 'none',
                  fontSize: '0.12rem',
                  color: '#436AC2',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setIsVolumeModalOpen(false);
                  navigate('/volume?component=Stair');
                }}
                className={`customButton-${theme}`}
              >
                BEGIN
              </Button>
            </Card>
          </Col>

          {/* Heteronyms Exercise */}
          <Col
            span={7}
            style={{padding: '10px'}}
            className={`customCard-${theme}`}
          >
            <Card
              bordered={false}
              style={{
                textAlign: 'center',
                height: '100%',
                border: '1px solid #8DAADA',
                padding: '8px',
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                setIsVolumeModalOpen(false);
                navigate('/volume?component=Heteronym');
              }}
            >
              <Title
                level={4}
                style={{
                  marginBottom: '0',
                  fontSize: '0.3rem',
                  marginTop: '0',
                  color: '#8DAADA',
                }}
              >
                03
              </Title>
              <Paragraph
                style={{
                  fontSize: '0.175rem',
                  color: '#8DAADA',
                  marginTop: '0.01rem',
                }}
              >
                HETERONYMS
              </Paragraph>
              <Paragraph
                style={{fontSize: '0.1rem', marginTop: '0rem'}}
                className={`text-${theme}`}
              >
                Practice upward vs. downward intonation using heteronyms - words
                that are spelled the same but sound different.
              </Paragraph>
              <hr style={{marginTop: '7.7vh', width: '100%'}} />
              <Button
                className={`customButton-${theme}`}
                style={{
                  border: 'none',
                  fontSize: '0.12rem',
                  color: '#8DAADA',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setIsVolumeModalOpen(false);
                  navigate('/volume?component=Heteronym');
                }}
              >
                BEGIN
              </Button>
            </Card>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Main;
