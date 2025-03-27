import {useState} from 'react';
import type {CollapseProps, MenuProps} from 'antd';
import {Typography, Row, Col} from 'antd';
import SmoothScrollButton from '../function/SmoothScroll';
import React from 'react';
const {Paragraph} = Typography;

export function useTemString(
  theme: string,
  fontSizePara = '1.0vw',
  fontSizeTitle = '1.3vw'
) {
  const fontAlign = 'justify';
  const paragraphStyle: React.CSSProperties = {
    textAlign: fontAlign,
    fontSize: fontSizePara,
    fontFamily: "'Roboto', 'sans-serif'",
  };

  const [syllablesString] = useState<string[][]>([
    ['Big', '-ger', 'and', 'bet', '-ter'],
    ['Drum', 'and', 'bu', '-gle', 'corps'],
    ['He', 'has', 'a', 'good', 'job'],
    ['Be', '-fore', 'and', 'af', '-ter'],
    ['Come', 'back', 'right', 'a', '-way'],
    ['Blow', 'up', 'the', 'bal', '-loon'],
  ]);

  const [stairFilenames] = useState<string[]>([
    'Bigger and better',
    'Drum and bugle corps',
    'He has a good job',
    'Before and after',
    'Come back right away',
    'Blow up the balloon',
  ]);

  const [chantingFilenames] = useState<string[]>([
    'Mary made me mad.',
    'Mother made marmalade.',
    'My mom may marry Marv.',
    'Marv made my mother merry.',
    'My merry mom made marmalade.',
    'My merry mom may marry Marv.',
  ]);

  const [heteronymOrder] = useState<string[]>([
    'ADdress adDRESS',
    'CONduct conDUCT',
    'CONflict conFLICT',
    'CONtent conTENT',
    'CONsole conSOLE',
    'CONtest conTEST',
    'CONtrast conTRAST',
    'CONtract conTRACT',
    'DEsert deSERT',
    'CONvert conVERT',
    'EScort esCORT',
    'EXport exPORT',
    'CONvict conVICT',
    'EXtract exTRACT',
    'IMport imPORT',
    'DIgest diGEST',
    'INcrease inCREASE',
    'INsult inSULT',
    'PROduce proDUCE',
    'REcord reCORD',
    'TRANSfer transFER',
    'IMprint imPRINT',
    'INsert inSERT',
    'COMpound comPOUND',
    'INvalid inVALID',
    'OBject obJECT',
    'MINute minUTE',
    'PERmit perMIT',
    'PROject proJECT',
    'PREsent preSENT',
  ]);

  const Text_1_Rainbow: string[] = [
    "When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon. There is, according to legend, a boiling pot of gold at one end. People look, but no one ever finds it. When a man looks for something beyond his reach, his friends say he is looking for the pot of gold at the end of the rainbow. Throughout the centuries people have explained the rainbow in various ways. Some have accepted it as a miracle without physical explanation. To the Hebrews it was a token that there would be no more universal floods. The Greeks used to imagine that it was a sign from the gods to foretell war or heavy rain. The Norsemen considered the rainbow as a bridge over which the gods passed from earth to their home in the sky. Others have tried to explain the phenomenon physically. Aristotle thought that the rainbow was caused by reflection of the sun's rays by the rain. Since then physicists have found that it is not reflection, but refraction by the raindrops which causes the rainbows. Many complicated ideas about the rainbow have been formed. The difference in the rainbow depends considerably upon the size of the drops, and the width of the colored band increases as the size of the drops increases. The actual primary rainbow observed is said to be the effect of super-imposition of a number of bows. If the red of the second bow falls upon the green of the first, the result is to give a bow with an abnormally wide yellow band, since red and green light when mixed form yellow. This is a very common type of bow, one showing mainly red and yellow, with little or no green or blue.",
    'You wish to know about my grandfather. Well, he is nearly 93 years old, yet he still thinks as swiftly as ever. He dresses himself in an old black frock coat, usually several buttons missing. A long beard clings to his chin, giving those who observe him a pronounced feeling of the utmost respect. When he speaks, his voice is just a bit cracked and quivers a bit. Twice each day he plays skillfully and with zest upon a small organ. Except in the winter when the snow or ice prevents, he slowly takes a short walk in the open air each day. We have often urged him to walk more and smoke less, but he always answers, "Banana oil!" Grandfather likes to be modern in his language.',
    "The birch canoe slid on the smooth planks.Glue the sheet to the dark blue background.It's easy to tell the depth of a well.These days a chicken leg is a rare dish.Rice is often served in round bowls.The juice of lemons makes fine punch.The box was thrown beside the parked truck.The hogs were fed chopped corn and garbage.Four hours of steady work faced us.A large size in stockings is hard to sell.",
  ];
  const Text_2 =
    "When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon. There is, according to legend, a boiling pot of gold at one end. People look, but no one ever finds it. When a man looks for something beyond his reach, his friends say he is looking for the pot of gold at the end of the rainbow. Throughout the centuries people have explained the rainbow in various ways. Some have accepted it as a miracle without physical explanation. To the Hebrews it was a token that there would be no more universal floods. The Greeks used to imagine that it was a sign from the gods to foretell war or heavy rain. The Norsemen considered the rainbow as a bridge over which the gods passed from earth to their home in the sky. Others have tried to explain the phenomenon physically. Aristotle thought that the rainbow was caused by reflection of the sun's rays by the rain. Since then physicists have found that it is not reflection, but refraction by the raindrops which causes the rainbows. Many complicated ideas about the rainbow have been formed. The difference in the rainbow depends considerably upon the size of the drops, and the width of the colored band increases as the size of the drops increases. The actual primary rainbow observed is said to be the effect of super-imposition of a number of bows. If the red of the second bow falls upon the green of the first, the result is to give a bow with an abnormally wide yellow band, since red and green light when mixed form yellow. This is a very common type of bow, one showing mainly red and yellow, with little or no green or blue.";
  const Text_3 =
    "When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon. There is, according to legend, a boiling pot of gold at one end. People look, but no one ever finds it. When a man looks for something beyond his reach, his friends say he is looking for the pot of gold at the end of the rainbow. Throughout the centuries people have explained the rainbow in various ways. Some have accepted it as a miracle without physical explanation. To the Hebrews it was a token that there would be no more universal floods. The Greeks used to imagine that it was a sign from the gods to foretell war or heavy rain. The Norsemen considered the rainbow as a bridge over which the gods passed from earth to their home in the sky. Others have tried to explain the phenomenon physically. Aristotle thought that the rainbow was caused by reflection of the sun's rays by the rain. Since then physicists have found that it is not reflection, but refraction by the raindrops which causes the rainbows. Many complicated ideas about the rainbow have been formed. The difference in the rainbow depends considerably upon the size of the drops, and the width of the colored band increases as the size of the drops increases. The actual primary rainbow observed is said to be the effect of super-imposition of a number of bows. If the red of the second bow falls upon the green of the first, the result is to give a bow with an abnormally wide yellow band, since red and green light when mixed form yellow. This is a very common type of bow, one showing mainly red and yellow, with little or no green or blue.";

  // Adding the new sentences for chanting exercise
  const [mVoicedSentences] = useState<string[]>([
    'Mary made me mad.',
    'Mother made marmalade.',
    'My mom may marry Marv.',
    'Marv made my mother merry.',
    'My merry mom made marmalade.',
    'My merry mom may marry Marv.',
  ]);

  const [nVoicedSentences] = useState<string[]>([
    'No one knew nanny.',
    'Nanny knew nothing.',
    'None know nothing now.',
    'Now Nan knew Nelly.',
    'Nine knew nothing.',
    'No one knew nine names.',
    'Name nine new names now.',
  ]);

  const [mVoicedVoicelessSentences] = useState<string[]>([
    'Mom put Paul on the moon',
    'Molly moved Paul to the moat',
    'Mom may move Polly’s movie to ten',
    'Mom told Tom to copy my manner',
    'My manner made Pete and Paul mad',
    'My Movies made Tom and Tim merry',
  ]);

  const [nVoicedVoicelessSentences] = useState<string[]>([
    'No one knew Tim too well',
    'Now Tom and Tim knew Nelly',
    'Name nine new hand tools now',
    'Nanny knows Sam and Sally now',
    'Nancy found Fred nine new names',
    'Nance told Tim no news',
  ]);

  const items_3: CollapseProps['items'] = [
    {
      key: '2',
      label: (
        <Typography.Title
          id="part-3-2"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          Constant Exercise
        </Typography.Title>
      ),
      children: (
        <>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            The Constant exercise is the most basic exercise. When you talk, it
            shows your current pitch with a large black dot and the last few
            seconds of your pitch with small purple dots (red if you're using
            the Colorblind scheme). If you stop talking, the graph keeps moving
            but does not show new purple dots.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            On the right side of the graph, you can see a vertical slider.
            Moving this slider up and down creates a constant pitch target that
            is shown as a horizontal dark blue line across the screen. You can
            try to match this target. If your pitch is close enough to the
            target, the target line will change color to indicate you are
            matching the target. You can change the target as you exercise if
            you want.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            If you want something to read while you practice matching a target
            pitch, you can use the Upload txt file button below the graph to
            upload a .txt file with text of your choosing. In the .txt file, a
            semicolon should indicate a new line. While reading, you can then
            move between lines using the Next/Previous buttons underneath the
            text. Other file formats are not currently supported but are planned
            for future releases.
          </Paragraph>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/63OuVpZWm4g"
            title="TruVox Constant Exercise Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </>
      ),
    },
    {
      key: '6',
      label: (
        <Typography.Title
          id="part-3-6"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          Chanting Exercise
        </Typography.Title>
      ),
      children: (
        <>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            The Chanting exercise first asks you to hum at a given pitch, which
            can be selected the same way as the pitch target in the Constant
            exercise. Once you hum at the target pitch for about a second, it
            asks you to chant a specific phrase at the same target pitch. These
            phrases may focus on the letter M or the letter N, and can be
            resonant (“voiced”) or nonresonant (“voiceless”). Once you have
            finished chanting the phrase, press the Next button and say the same
            phrase at your regular (non-chanting) without real-time pitch
            feedback. Finally, press the Finish button to show how you did. This
            is intended to help you talk at a target pitch in a different way
            than the Constant exercise.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            The four levels (1-4) gradually increase in difficulty, with 4 being
            hardest. Level 1 focuses on the letter M and voiced phrases, which
            provide the most resonant sensation (vibrations in the face and
            vocal tract). Level 2 focuses on the letter M and unvoiced phrases,
            which are still somewhat resonant. Levels 3 and 4 focus on the
            letter N, which provides less resonant sensation. We recommend
            progressing through these levels as you feel competent at them.
          </Paragraph>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/-oeIlBYThoY"
            title="TruVox Chanting Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </>
      ),
    },
    {
      key: '3',
      label: (
        <Typography.Title
          id="part-3-3"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          Stair Exercise
        </Typography.Title>
      ),
      children: (
        <>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            When you talk, the Staircase exercise shows your current pitch with
            a large black dot and the last few seconds of your pitch with small
            purple dots (red if you're using the Colorblind scheme). If you stop
            talking, the graph keeps moving but does not show new purple dots.
            This is the same as in the Constant exercise.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            A dark blue line shows a sequence of pitches for you to match within
            a few seconds. You can change the location of these 'target' pitches
            using the light blue vertical slider to the right of the graph –
            drag the bottom white ball up/down to move the lowest target or drag
            the top white ball to move the highest target.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            Pressing the Start button starts moving the current pitch indicator.
            Press it when you are ready to try matching the pitches. You can
            pause at any time, and once the indicator gets to the end, you can
            press Start again to restart. As you speak, the dark blue target
            pitch curve will change color if your pitch is close to it.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            If you would like to have some sounds to make while matching the
            target pitches, the Show/Hide buttons below the graph display a
            5-syllable phrase. The full phrase is shown below the Show/Hide
            buttons, and each individual syllable is shown on one of the target
            pitch lines. The Next/Previous buttons let you move to the
            next/previous phrase, and the Retry button resets the current
            phrase. You don't have to use this function, it's just if you want
            to have something to say.
          </Paragraph>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Majy2E2zw94"
            title="TruVox Stair Exercise Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </>
      ),
    },
    {
      key: '5',
      label: (
        <Typography.Title
          id="part-3-5"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          Human Curve Exercise
        </Typography.Title>
      ),
      children: (
        <>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            To use the Human Curve exercise, you must first select an avatar in
            the Options menu. Once you have done that, the Human Curve exercise
            shows pitch curves from that recorded avatar while speaking 2-, 3-,
            4-, or 5-syllable phrases in dark blue. As in the other two
            exercises, the graph shows your current pitch with a large black dot
            and the last few seconds of your pitch with small purple dots (red
            if you're using the Colorblind scheme). If you stop talking, the
            graph keeps moving but does not show new purple dots.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            The goal of the exercise is to match the avatar's pitch curve as you
            say the same phrase. The target phrase is shown below the graph in
            green. Pressing the Start button starts moving the current pitch
            indicator. Press it when you are ready to try matching the curve.
            You can pause at any time, and once the indicator gets to the end,
            you can press Start again to restart the same phrase. As you speak,
            the dark blue target pitch curve will change color if your pitch is
            close to it.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            Once the phrase finishes, you can press the Retry button to try
            matching it again, or press Next/Previous to move to the next or
            previous phrase. The next two phrases are shown in grey below the
            current phrase.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            If you want to hear the phrase spoken by your selected avatar, press
            the Listen button. The dark blue curve will change color as the
            phrase is played to indicate the timing.
          </Paragraph>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/cP1_hMm4y2s"
            title="TruVox Human Curve Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </>
      ),
    },
    {
      key: '4',
      label: (
        <Typography.Title
          id="part-3-4"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          Heteronyms Exercise
        </Typography.Title>
      ),
      children: (
        <>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            Heteronyms are words that are spelled the same way but pronounced
            differently - for example, by stressing a different syllable. This
            exercise is intended to teach you about upward and downward
            intonation (a rising or falling pitch), which you can achieve by
            stressing a different syllable in a word.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            The display looks similar to the Constant and Stair exercise, and
            below it you’ll see a word with a syllable stressed - for example,
            ADDress. Use the 1 / 2 button to the right of the Start button to
            switch between the two pronunciations of the word - for example,
            ADDress and addRESS. On the display, the target pitch curve will
            show an example of a vocal model speaking that word, and you can
            press the Listen button to hear the vocal model speak. The preferred
            model can be selected in Settings.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            Press the Start button when you are ready to try saying the
            displayed word with the displayed syllable stress. You do not need
            to match the vocal model’s pitch curve exactly; the goal is simply
            to get a “feel” for how the pitch of a word increases or decreases.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            You can also use the Words / Sentences button to the right of the
            Start button to see the heteronym either on its own or used in a
            sentence. This may help you understand the difference in intonation.
            The Next and Previous buttons will move you to the next or previous
            heteronym, and the Retry button will let you try the same word or
            phrase again. As mentioned, this exercise is different from the
            Constant and Stair exercises since it does not help you directly
            maintain a higher pitch - it simply teaches the concept of upward
            and downward pitch within a word, which can serve as the basis for
            other gender-affirming voice exercises.
          </Paragraph>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/nVrrTkP49Mw"
            title="TruVox Heteronyms Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </>
      ),
    },
    {
      key: '1',
      label: (
        <Typography.Title
          id="part-3-1"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          Settings
        </Typography.Title>
      ),
      children: (
        <>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            The possible settings are:
            <ul>
              <li>
                <p>
                  <strong>Model selection</strong>: Lets you pick between
                  several prerecorded voices to serve as a target "avatar".
                  These are currently used only in Heteronyms and Human Curve
                  exercises.
                </p>
              </li>
              <li>
                <p>
                  <strong>Coordinate Display Mode</strong>: changes the pitch
                  display between hertz and musical notes.
                </p>
              </li>
              <li>
                <p>
                  <strong>Pitch Display Color Scheme</strong>: lets you switch
                  between the default and colorblind versions of the real-time
                  pitch display.
                </p>
              </li>
              <li>
                <p>
                  <strong>Pitch display range</strong>: Changes the scale of the
                  pitch graph. The blue part represents the current scale, and
                  the white balls on the left and right can be dragged with your
                  mouse to change the minimum or maximum of the scale. By
                  default, it shows 100-300 Hz, but the maximum range is 50-600
                  Hz.
                </p>
              </li>
              <li>
                <p>
                  <strong>Pitch Indicator speed</strong>: Changes the speed with
                  which the "current pitch" indicator ball moves across the
                  screen.
                </p>
              </li>
              <li>
                <p>
                  <strong>Pin settings open</strong>: By default, the Settings
                  close when you move away from them. This option lets you keep
                  them open at all times.
                </p>
              </li>
              <li>
                <p>
                  <strong>Auto-Start when Voice Detected</strong>: If this is
                  enabled and the pitch module is paused, it will automatically
                  start tracking pitch when the module detects sound on your
                  microphone. If this is disabled, you must manually start it
                  after pausing it.
                </p>
              </li>
              <li>
                <p>
                  <strong>Enable advanced features</strong>: Allows you to
                  access several features that are currently intended to be used
                  by the developers and researchers. These are not
                  well-documented and can be ignored by casual users.
                </p>
              </li>
            </ul>
          </Paragraph>
        </>
      ),
    },
    {
      key: '7',
      label: (
        <Typography.Title
          id="part-3-7"
          level={4}
          style={{margin: 0, fontSize: fontSizeTitle}}
          className={`text-${theme}`}
        >
          Suggestions
        </Typography.Title>
      ),
      children: (
        <>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            If you have limited ability to control your pitch, we recommend
            starting with the Constant exercise. Measure your current pitch and
            set the target pitch (with the slider on the right) to somewhere
            above your regular pitch. The "stereotypical" value for female pitch
            is about 200 Hz. Make sustained sounds (for example, "aaaaaaaaaaa")
            and try to consistently match the target pitch. Once you can
            consistently match the target pitch with all five vowels (a, e, i,
            o, u), try speaking longer phrases at the target pitch. Once you
            have figured out the principle of the Constant exercise, you can
            also try the Chanting exercise, which uses a slightly different
            approach to try to hit and maintain a single target pitch. Most
            users should start the Chanting exercise at level 1 and progress
            through the level as they feel competent.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            When you feel comfortable matching the target pitch in the Constant
            and Chanting exercises for short periods of time, add the Staircase
            exercise to your practice rotation. You can start by hiding the
            target text and just matching the target pitches with a sustained
            vowel sound (for example, "aaaaa" moving up and down in pitch). Once
            you can do that with all five vowel sounds, turn the target text on
            and try speaking the phrases. Once you can do that, you may also try
            the Human Curve exercise, though you do not necessarily need to do
            the Human Curve exercise – the Constant and Staircase will give you
            the fundamentals. The Heteronyms exercise is a little different
            since it’s intended to teach you about the concepts of upward and
            downward intonation. Feel free to try it whenever you’ve started
            doing the Stair and Human Curve exercises, though you don’t
            necessarily need to do it regularly - do it enough to understand
            upward vs. downward intonation.
          </Paragraph>
          <Paragraph
            style={{textAlign: fontAlign, fontSize: fontSizePara}}
            className={`text-${theme}`}
          >
            If TruVox is your only voice practice, use the Pitch module for
            10-15 minutes two times a day. It will help you learn pitch control,
            though you should keep in mind that pitch is not the only component
            of transgender voice. You will want to move on to other components
            of voice as well.
          </Paragraph>
        </>
      ),
    },
  ];

  const shortDescription = (component: string): React.ReactNode => {
    switch (component) {
      case 'ConstantTxt':
        return (
          <Row>
            <Col span={5} />
            <Col span={14}>
              <Typography style={{paddingLeft: '30px', paddingRight: '40px'}}>
                <Paragraph style={paragraphStyle} className={`text-${theme}`}>
                  <strong>
                    <u>Exercise synopsis:</u>
                  </strong>{' '}
                  The Constant exercise is the most basic exercise. Try to match
                  a constant pitch target using whatever sounds you prefer -
                  short sounds, full monologues, or select/upload a text file
                  for you to read below. You can change the pitch target using
                  the slider to the right. &nbsp;
                  <SmoothScrollButton targetId="part-1">
                    More details.
                  </SmoothScrollButton>
                </Paragraph>
              </Typography>
            </Col>
            <Col span={5} />
          </Row>
        );
      case 'Stair':
        return (
          <Row>
            <Col span={5} />
            <Col span={14}>
              <Typography style={{paddingLeft: '30px', paddingRight: '40px'}}>
                <Paragraph style={paragraphStyle} className={`text-${theme}`}>
                  <strong>
                    <u>Exercise synopsis:</u>
                  </strong>{' '}
                  The Stair exercise asks you to match a series of five pitch
                  targets. You can change the lowest and highest target using
                  the slider to the right. You can use whatever sounds you
                  prefer, or you can use the Show/Hide button below to show
                  5-syllable phrases that you can say at the five target
                  pitches. &nbsp;
                  <SmoothScrollButton targetId="part-1">
                    More details.
                  </SmoothScrollButton>
                </Paragraph>
              </Typography>
            </Col>
            <Col span={5} />
          </Row>
        );
      case 'Fixed':
        return (
          <Row>
            <Col span={5} />
            <Col span={14}>
              <Typography style={{paddingLeft: '30px', paddingRight: '40px'}}>
                <Paragraph style={paragraphStyle} className={`text-${theme}`}>
                  <strong>
                    <u>Exercise synopsis:</u>
                  </strong>{' '}
                  The human curve exercise gives you pitch curves of actual
                  humans speaking different phrases (2 to 5 syllables long). Try
                  to match the pitch curve with your own speech! You can use the
                  Listen button below to hear the actual recording, and you can
                  select different model speakers in the Settings menu. If your
                  pitch is moving too fast/slow compared to the target curve,
                  adjust the Pitch Indicator Speed in Settings. &nbsp;
                  <SmoothScrollButton targetId="part-1">
                    More details.
                  </SmoothScrollButton>
                </Paragraph>
              </Typography>
            </Col>
            <Col span={5} />
          </Row>
        );
      case 'Heteronym':
        return (
          <Row>
            <Col span={5} />
            <Col span={14}>
              <Typography style={{paddingLeft: '30px', paddingRight: '40px'}}>
                <Paragraph style={paragraphStyle} className={`text-${theme}`}>
                  <strong>
                    <u>Exercise synopsis:</u>
                  </strong>{' '}
                  The heteronyms exercise asks you to speak two words that are
                  written the same way but pronounced differently - for example,
                  address as a verb vs. address as a noun. Practice stressing
                  different syllables to make your pitch curve go up or down!
                  &nbsp;
                  <SmoothScrollButton targetId="part-1">
                    More details.
                  </SmoothScrollButton>
                </Paragraph>
              </Typography>
            </Col>
            <Col span={5} />
          </Row>
        );
      case 'Chanting':
        return (
          <Row>
            <Col span={5} />
            <Col span={14}>
              <Typography style={{paddingLeft: '30px', paddingRight: '40px'}}>
                <Paragraph style={paragraphStyle} className={`text-${theme}`}>
                  <strong>
                    <u>Exercise synopsis:</u>
                  </strong>{' '}
                  The chanting exercise expects you to hum at a given pitch and
                  then say a few sentences which are termed to be M-Voiced and
                  N-voiced. After this, as you move on, you can say any
                  sentences that you like and then it will calculate your mean
                  pitch. &nbsp;
                  <SmoothScrollButton targetId="part-1">
                    More details.
                  </SmoothScrollButton>
                </Paragraph>
              </Typography>
            </Col>
            <Col span={5} />
          </Row>
        );
      default:
        return (
          <Row>
            <Col span={5} />
            <Col span={14}>
              <Typography style={{paddingLeft: '30px', paddingRight: '40px'}}>
                <Paragraph style={paragraphStyle} className={`text-${theme}`}>
                  <strong>
                    <u>Exercise synopsis:</u>
                  </strong>{' '}
                  The Chanting exercise is a 3-step exercise. First, hum at the
                  target pitch. Once you hold that pitch for a few seconds, move
                  smoothly from humming to chanting the phrase below the screen.
                  Then, press the Next button and continue speaking at the
                  target pitch without visual feedback. Once you are done, press
                  Finish to see how you did. &nbsp;
                  <SmoothScrollButton targetId="part-1">
                    More details.
                  </SmoothScrollButton>
                </Paragraph>
              </Typography>
            </Col>
            <Col span={5} />
          </Row>
        );
    }
  };
  const itemsText: MenuProps['items'] = [
    {
      key: '1',
      label: <>The Rainbow Passage</>,
    },
    {
      key: '2',
      label: <>Grandfather</>,
    },
    {
      key: '3',
      label: <>Harvard Phonetically Balanced Sentences</>,
    },
  ];

  return {
    syllablesString,
    stairFilenames,
    chantingFilenames,
    heteronymOrder,
    items_3,
    shortDescription,
    mVoicedSentences,
    nVoicedSentences,
    mVoicedVoicelessSentences,
    nVoicedVoicelessSentences,
    Text_1_Rainbow,
    Text_2,
    Text_3,
    itemsText,
  };
}
