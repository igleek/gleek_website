import React from "react";
import NavBar from "./components/NavBar";
import Phase from "./components/Phase";
import GleekInfo from "./components/GleekInfo";
import Game from "./components/Game";
import HowToGleek from "./components/HowToGleek";
import Memes from "./components/Memes";
import MeetTheTeam from "./components/MeetTheTeam";
import Footer from "./components/Footer";
import "./App.css";
import Gleekenomics from "./components/Gleekenomics";

function App() {
	return (
		<div className="App">
			<NavBar />
			<GleekInfo />
			<Game />
			<Phase />
			<MeetTheTeam />
			<Gleekenomics />
			<div className="content-container">
				<HowToGleek />
				<Memes />
			</div>
			<Footer />
		</div>
	);
}

export default App;
