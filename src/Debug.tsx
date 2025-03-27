import React from 'react';
import {useLocation} from 'react-router-dom';

function DebugOption(option: string, output: string) {
  return (
    <div
      style={{
        width: '50%',
        textAlign: 'left',
      }}
    >
      {option}: {output}
    </div>
  );
}

function DebugPageLoadTime(): string {
  const [navigationTiming] = performance.getEntriesByType(
    'navigation'
  ) as PerformanceNavigationTiming[];

  if (navigationTiming) {
    const pageLoadTime =
      navigationTiming.loadEventEnd - navigationTiming.startTime;
    return `${pageLoadTime} ms`;
  }
  return 'Could not measure page load time.';
}

function DebugFooter() {
  return (
    <div
      style={{
        bottom: 0,
        width: '100%',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        textAlign: 'center',
      }}
    >
      Debug Mode On
      {DebugOption('Path', useLocation().pathname)}
      {DebugOption('Load Time', DebugPageLoadTime())}
    </div>
  );
}

export default DebugFooter;
