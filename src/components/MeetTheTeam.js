import React from "react";

const Team = () => {
	return (
		<div className="dox-event">
			<div className="dox-intro">
				<h2>MEET THE TEAM</h2>
				<h3>INTERN DOXED US</h3>
			</div>
			<div className="team-container">
				<div className="section-team team-member">
					<img
						src="./images/team/gleekify_hornelius_bg.png"
						alt="dev"
						className="team-member-img"
					/>
					<p className="team-member-description-doxed">
					DEV: <a href="https://www.twitter.com/horneliusdoteth" target="_blank" rel="noopener noreferrer" className="plain-link">hornelius.eth</a>
					</p>
				</div>
				<div className="section-team team-member">
					<img
						src="./images/team/gleekify_cookies_bg.png"
						alt="meme"
						className="team-member-img"
					/>
					<p className="team-member-description-doxed">
					CMO: <a href="https://www.twitter.com/cook_ees" target="_blank" rel="noopener noreferrer" className="plain-link">cookies</a>
					</p>
				</div>
				<div className="section-team team-member">
					<img
						src="./images/team/gleekify_richard_bg.png"
						alt="artist"
						className="team-member-img"
					/>
					<p className="team-member-description-doxed">
					ARTIST: <a href="https://www.twitter.com/richardnhsu" target="_blank" rel="noopener noreferrer" className="plain-link">richardnhsu</a>
					</p>
				</div>
				<div className="section-team team-member">
					<img
						src="./images/team/gleekify_psyxology_bg.png"
						alt="banksy"
						className="team-member-img"
					/>
					<p className="team-member-description-doxed">
					BANKSY: <a href="https://www.twitter.com/Psyxology_" target="_blank" rel="noopener noreferrer" className="plain-link">psyxology</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Team;
