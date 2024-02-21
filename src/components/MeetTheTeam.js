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
						src="./images/team/hornelius_gleek.png"
						alt="dev"
						className="team-member-img"
					/>
					<p className="team-member-description-doxed">
					dev: <a href="https://www.twitter.com/horneliusdoteth" target="_blank" rel="noopener noreferrer" className="plain-link">hornelius.eth</a>
					</p>
				</div>
				<div className="section-team team-member">
					<img
						src="./images/team/cookies_gleek.png"
						alt="meme"
						className="team-member-img"
					/>
					<p className="team-member-description-doxed">
					chief meme officer: <a href="https://www.twitter.com/cook_ees" target="_blank" rel="noopener noreferrer" className="plain-link">cookies</a>
					</p>
				</div>
				<div className="section-team team-member">
					<img
						src="./images/team/rh_rainbow_gleek.png"
						alt="artist"
						className="team-member-img"
					/>
					<p className="team-member-description-doxed">
					artist: <a href="https://www.twitter.com/richardnhsu" target="_blank" rel="noopener noreferrer" className="plain-link">richardnhsu</a>
					</p>
				</div>
				<div className="section-team team-member">
					<img
						src="./images/team/psy_acid.webp"
						alt="banksy"
						className="team-member-img"
					/>
					<p className="team-member-description-doxed">
					sugar daddy: <a href="https://www.twitter.com/Psyxology_" target="_blank" rel="noopener noreferrer" className="plain-link">psyxology</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Team;
