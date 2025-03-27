import {Row, Col} from 'antd';

function getColsPerRow(numOfVids: number, rows: number) {
  return Math.ceil(numOfVids / rows);
}

function getColWidth(colsPerRow: number) {
  return Math.ceil(24 / colsPerRow);
}

interface VideoContainer {
  children: any;
  rows: number;
  backgroundColor: string;
  videoHeight: string;
  className?: string | undefined;
}

/**
 * Creates a section of videos/images.
 * The children of this element should be the iframes/images in the sectioned off area.
 * All children should have a width & height of 100%.
 *
 * @param rows The number of rows in this section.
 * @param backgroundColor A string indicating the color of the background.
 * @param videoHeight A string indicating the height of each video/image. Ex - "33vw"
 */
const VideoContainer: React.FC<VideoContainer> = ({
  children,
  rows,
  backgroundColor,
  videoHeight,
  className = undefined,
}) => {
  const numOfVids = children.length;
  const colsPerRow = getColsPerRow(numOfVids, rows);
  const colWidth = getColWidth(colsPerRow);

  const sections = [];
  for (let i = 0; i < numOfVids; i++) {
    console.log(children[i]);
    sections.push(
      <Col span={colWidth} style={{height: videoHeight}}>
        <div
          style={{
            border: `2px solid ${backgroundColor}`,
            borderRight: `2px solid ${backgroundColor}`,
            borderRadius: '10px',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
          }}
        >
          {children[i]}
        </div>
      </Col>
    );
  }

  return (
    <Row
      style={{
        border: `8px solid ${backgroundColor}`,
        borderTop: `6px solid ${backgroundColor}`,
        borderBottom: `6px solid ${backgroundColor}`,
        borderRadius: '10px',
        backgroundColor: backgroundColor,
        justifyContent: 'center',
      }}
      className={className}
    >
      {sections}
    </Row>
  );
};

export default VideoContainer;
