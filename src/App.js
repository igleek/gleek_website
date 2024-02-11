import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
import Gleekify from "./components/Gleekify";

function App() {
	return (
		<Router>
		<div className="App">
			<NavBar />
			<Routes>
          <Route path="/" element={
            <>
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
			<Gleekify />
			</>
          } />
          <Route path="/gleekify" element={<Gleekify />} />
        </Routes>
        <Footer />
      </div>
    </Router>
	);
}

export default App;
