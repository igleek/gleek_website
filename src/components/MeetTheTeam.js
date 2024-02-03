import React from 'react';


const Team = () => {
  return (
    <div className="dox-event">
        <div className="dox-intro">
          <h2>MEET THE TEAM</h2>
          <h3>DOXING AT 500 TWITTER FOLLOWERS</h3>
        </div>
        <div className="team-container">
        <div className="section team-member">
            <img src='./images/logos/soyjak_gleek.png' alt="artist" className="team-member-img" />
            <p className="team-member-description">redacted</p>
        </div>
        <div className="section team-member">
            <img src='./images/logos/soyjak_gleek.png'alt="dev" className="team-member-img" />
            <p className="team-member-description">redacted</p>
        </div>
        <div className="section team-member">
            <img src='./images/logos/soyjak_gleek.png' alt="memer" className="team-member-img" />
            <p className="team-member-description">redacted</p>
        </div>
        <div className="section team-member">
            <img src='./images/logos/soyjak_gleek.png' alt="strat" className="team-member-img" />
            <p className="team-member-description">redacted</p>
        </div>
      </div>
    </div>
  );
};

export default Team;
