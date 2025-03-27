import React from 'react';
import {Typography, Col, Row} from 'antd';
import {useNavigate} from 'react-router-dom';
import '../CSS/PageNotFound.css';

const {Title, Paragraph} = Typography;

const fontSizePara = 17;
const fontAlign = 'center';
const paragraphStyle: React.CSSProperties = {
  textAlign: fontAlign,
  fontSize: fontSizePara,
  fontFamily: "'Roboto', 'sans-serif'",
};

interface PageNotFoundProps {
  theme: string;
}

const PageNotFound: React.FC<PageNotFoundProps> = ({theme}) => {
  const navigate = useNavigate();

  return (
    <div className="pagenotfoundmain">
      <div>
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
                  style={{
                    color: 'rgb(36, 36, 131)',
                    textDecorationThickness: '2px',
                  }}
                  className={`customColorfulText-${theme}`}
                >
                  404 PAGE NOT FOUND
                </Title>
              </div>

              <Paragraph style={paragraphStyle} className={`text-${theme}`}>
                The page you are looking for does not exist.
              </Paragraph>
            </Typography>
          </Col>
          <Col span={5}></Col>
        </Row>
      </div>
      <div
        style={{
          minHeight: '10vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Row justify="center" align="middle" style={{textAlign: 'center'}}>
          <Col span={5}></Col>
          <Col span={14}>
            <button
              className={`pagenotfoundbutton customGradientButton-${theme}`}
              onClick={() => navigate(-1)}
            >
              PREVIOUS PAGE
            </button>
          </Col>
          <Col span={5}></Col>
        </Row>
        <Row justify="center" align="middle" style={{textAlign: 'center'}}>
          <Col span={5}></Col>
          <Col span={14}>
            <button
              className={`homePage, pagenotfoundbutton customGradientButton-${theme}`}
              onClick={() => navigate('/')}
            >
              HOME PAGE
            </button>
          </Col>
          <Col span={5}></Col>
        </Row>
      </div>
    </div>
  );
};

export default PageNotFound;
