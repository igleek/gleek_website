import React from 'react';

function Phase() {
  return (
    <div className="timeline-container">
      <div className="timeline">
        <div className="timeline-phase" id="phase-one">
          <h3>PHASE ONE</h3>
          <ul>
            <li>$GLEEK LAUNCH</li>
            <li>CONSTESTS</li>
            <li>TEAM DOX</li>
            <li>WEBSITE LIVE</li>
            <li>GAME</li>
          </ul>
        </div>
        <div className="timeline-arrow"></div>
        <div className="timeline-phase" id="phase-two">
          <h3>PHASE TWO</h3>
          <ul>
            <li className='strikethrough'>REDACTED</li>
          </ul>
        </div>
        <div className="timeline-arrow"></div>
        <div className="timeline-phase" id="phase-three">
          <h3>PHASE THREE</h3>
          <ul>
            <li className='strikethrough'>Redacted</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Phase;
