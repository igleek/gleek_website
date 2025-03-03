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
import Gleekify from "./components/Gleekify"
import Gleekenomics from "./components/Gleekenomics";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
	return (
		<DndProvider backend={HTML5Backend}>
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
			</>
          } />
          <Route path="/gleekify" element={
		  	<div className="main-content"><Gleekify /></div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
	</DndProvider>
	);
}

export default App;
