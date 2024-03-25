import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stage, Rect, Layer, Image as KonvaImage, Transformer, Text } from "react-konva";
import WebFont from "webfontloader";
import { ChromePicker } from "react-color";
import Konva from "konva";
import { useDrag, useDrop } from "react-dnd";
import mergeImages from "merge-images";

const maxCanvasWidth = 600; // Maximum canvas width
const maxCanvasHeight = 600; // Maximum canvas height

const imageCache = {};

const useImage = (src) => {
	const [image, setImage] = useState(imageCache[src] || null);

	useEffect(() => {
		if (imageCache[src]) {
			setImage(imageCache[src]);
			return;
		}

		const img = new Image();
		img.onload = () => {
			imageCache[src] = img;
			setImage(img);
		};
		img.onerror = (err) => console.error("Failed to load image:", err);
		img.src = src;
		// No cleanup needed here as we want the loaded images to stay in cache
	}, [src]);

	return image;
};

const Gleekify = () => {
	const [backgroundSrc, setBackgroundSrc] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const backgroundImage = useImage(backgroundSrc);
	const [elements, setElements] = useState([]);
	const stageRef = useRef(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isGleekModalOpen, setIsGleekModalOpen] = useState(false);
	const [isTongueModalOpen, setIsTongueModalOpen] = useState(false);
	const [isAssetModalOpen, setIsAssetModalOpen] = useState(true);
	const [isMemeModalOpen, setIsMemeModalOpen] = useState(false);
	const [textElements, setTextElements] = useState([]);
	const [originalFileName, setOriginalFileName] = useState("");
	const [showTransformer, setShowTransformer] = useState(true);
	const [editingState, setEditingState] = useState({
		visible: false,
		x: 0,
		y: 0,
		value: "",
		id: null,
	});
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
	const [showAdditionalButtons, setShowAdditionalButtons] = useState(!isMobile);
	const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });
	const [canvasTextStyle, setCanvasTextStyle] = useState({
		fontSize: "25px",
		color: "#6eb6c8",
		textAlign: "center",
		marginBottom: "10px",
		paddingLeft: "150px",
	});
	const [gleekSize, setGleekSize] = useState({ width: 90, height: 45 });
	const [mouthSize, setMouthSize] = useState({ width: 150, height: 75 });
	const [assetSize, setAssetSize] = useState({ width: 150, height: 75 });
	const [memeSize, setMemeSize] = useState({ width: 150, height: 75 });
	const mobileCanvasSize = Math.min(window.innerWidth, window.innerHeight) * 0.95;
	const [searchTerms, setSearchTerms] = useState({
		gleek: "",
		mouth: "",
		asset: "",
		meme: "",
	});
	const [backgroundColor, setBackgroundColor] = useState("");
	const colorInputRef = useRef(null);
	const handleOpenColorPicker = () => {
		colorInputRef.current.click();
	};
	// Function to update background color based on the user's selection
	const handleColorChange = (event) => {
		setBackgroundColor(event.target.value);
	};
	// Example static images
	const gleekImages = [
		{ url: "./images/Gleekify/sappy seals gleek.png", name: "sappy seals gleek" },
		{ url: "./images/Gleekify/coom.png", name: "coom" },
		{ url: "./images/Gleekify/pilk.png", name: "pilk" },
		{ url: "./images/Gleekify/cartoon gleek.png", name: "cartoon gleek" },
		{ url: "./images/Gleekify/plague gleek.png", name: "plague gleek" },
		{ url: "./images/Gleekify/doodles gleek.png", name: "doodles gleek" },
		{ url: "./images/Gleekify/birb gleek.png", name: "birb gleek" },
		{ url: "./images/Gleekify/sproto gremlins gleek.png", name: "sproto gremlins gleek" },
		{ url: "./images/Gleekify/mad lads gleek.png", name: "mad lads gleek" },
		{ url: "./images/Gleekify/galactic geckos gleek.png", name: "galactic geckos gleek" },
		{ url: "./images/Gleekify/frogana gleek.png", name: "frogana gleek" },
		{ url: "./images/Gleekify/goobers gleek.png", name: "goobers gleek" },
		{ url: "./images/Gleekify/gleek 1.png", name: "gleek 1" },
		{ url: "./images/Gleekify/gleek 2.png", name: "gleek 2" },
		{ url: "./images/Gleekify/gleek 3.png", name: "gleek 3" },
		{ url: "./images/Gleekify/acid.png", name: "acid" },
		{ url: "./images/Gleekify/fire.png", name: "fire" },
		{ url: "./images/Gleekify/rainbow.png", name: "rainbow" },
	];
	const mouthImages = [
		{ url: "./images/Gleekify/sappy seals.png", name: "sappy seals" },
		{ url: "./images/Gleekify/pudgy penguins.png", name: "pudgy penguins" },
		{ url: "./images/Gleekify/plague.png", name: "plague" },
		{ url: "./images/Gleekify/lil pudgy.png", name: "lil pudgy" },
		{ url: "./images/Gleekify/birb.png", name: "birb" },
		{ url: "./images/Gleekify/sproto gremlins.png", name: "sproto gremlins" },
		{ url: "./images/Gleekify/degods.png", name: "degods" },
		{ url: "./images/Gleekify/milady.png", name: "milady" },
		{ url: "./images/Gleekify/yoots.png", name: "yoots" },
		{ url: "./images/Gleekify/bitcoin puppets.png", name: "bitcoin puppets" },
		{ url: "./images/Gleekify/okay bears.png", name: "okay bears" },
		{ url: "./images/Gleekify/mad lads.png", name: "mad lads" },
		{ url: "./images/Gleekify/goobers.png", name: "goobers" },
		{ url: "./images/Gleekify/kanpai panda.png", name: "kanpai panda" },
		{ url: "./images/Gleekify/galactic geckos.png", name: "galactic geckos" },
		{ url: "./images/Gleekify/frogana.png", name: "frogana" },
		{ url: "./images/Gleekify/bodoggos.png", name: "bodoggos" },
		{ url: "./images/Gleekify/anime.png", name: "anime" },
	];
	const assetImages = [
		{ url: "./images/Gleekify/btc.png", name: "btc" },
		{ url: "./images/Gleekify/eth.png", name: "eth" },
		{ url: "./images/Gleekify/sol.png", name: "sol" },
		{ url: "./images/Gleekify/usdc.png", name: "usdc" },
		{ url: "./images/Gleekify/usdt.png", name: "usdt" },
		{ url: "./images/Gleekify/epep.png", name: "epep" },
		{ url: "./images/Gleekify/mumu.png", name: "mumu" },
		{ url: "./images/Gleekify/phantom.png", name: "phantom" },
		{ url: "./images/Gleekify/NO CHILL LOGO REWORK VECTOR-02.png", name: "nochill" },
		{ url: "./images/Gleekify/NO CHILL LOGO REWORK VECTOR-01.png", name: "nochill" },
		{ url: "./images/Gleekify/NO CHILL LOGO REWORK VECTOR-03.png", name: "nochill" },
		{ url: "./images/Gleekify/melon.png", name: "melon hat" },
		{ url: "./images/Gleekify/melon glasses.png", name: "melon glasses" },
		{ url: "./images/Gleekify/mog.png", name: "mog" },
		{ url: "./images/Gleekify/mog_2.png", name: "mog" },
		{ url: "./images/Gleekify/mog_sol.png", name: "mog sol" },
		{ url: "./images/Gleekify/wif.png", name: "wif" },
		{ url: "./images/Gleekify/PFP-1.png", name: "Arena" },
		{ url: "./images/Gleekify/PFP - 2.png", name: "Arena" },
		{ url: "./images/Gleekify/Arena_Logo.png", name: "Arena" },
		{ url: "./images/Gleekify/Arena_LockUp_alt.png", name: "Arena" },
		{ url: "./images/Gleekify/Arena_LockUp.png", name: "Arena" },
		{ url: "./images/Gleekify/Arena_Wordmark_left.png", name: "Arena" },
		{ url: "./images/Gleekify/Arena_Wordmark_Perspective.png", name: "Arena" },
		{ url: "./images/Gleekify/Gaimin.png", name: "GAIMIN" },
		{ url: "./images/Gleekify/Gaimin_g.png", name: "G" },
		{ url: "./images/team/hornelius_asset.png", name: "hornelius" },
		{ url: "./images/team/cookies_asset.png", name: "cookies" },
		{ url: "./images/team/richard_asset.png", name: "richard" },
		{ url: "./images/team/psyxology_asset.png", name: "psyxology" },
		{ url: "./images/game/soyjak.png", name: "soyjak" },
		{ url: "./images/game/wab_gleek.png", name: "wab" },
		{ url: "./images/Gleekify/pixl.png", name: "pixl" },
		{ url: "./images/Gleekify/PIXL OG.png", name: "pixl og" },
		{ url: "./images/Gleekify/PIXL Ring.png", name: "pixl ring" },
		{ url: "./images/Gleekify/PIXL Glasses.png", name: "pixl glasses" },
		{ url: "./images/Gleekify/PIXL Bling.png", name: "pixl bling" },
		{ url: "./images/Gleekify/PIXL Rich.png", name: "pixl rich" },
		{ url: "./images/Gleekify/PIXL woz ere.png", name: "pixl woz ere" },
		{ url: "./images/Gleekify/PIXL Baggie.png", name: "pixl baggie" },
		{ url: "./images/Gleekify/fp.png", name: "founders pass" },
		{ url: "./images/game/anita.png", name: "anita" },
		{ url: "./images/game/ape_szn.png", name: "ape szn" },
		{
			url: "./images/game/black_airforce_1.png",
			name: "black air force 1",
		},
		{ url: "./images/game/bobo.png", name: "bobo" },
		{ url: "./images/game/bonk.png", name: "bonk" },
		{ url: "./images/game/chad.png", name: "chad" },
		{ url: "./images/game/Ansem.png", name: "ansem" },
		{ url: "./images/game/doge.png", name: "doge" },
		{ url: "./images/game/harambe.png", name: "harambe" },
		{ url: "./images/game/honda.png", name: "honda" },
		{ url: "./images/game/pepe.png", name: "pepe" },
		{ url: "./images/game/sax_squirtle.png", name: "sax squirtle" },
		{ url: "./images/game/smolanoo.png", name: "smolanoo" },
		{ url: "./images/game/wif.png", name: "wif" },
		{ url: "./images/game/your_mom.png", name: "your mom" },
	];
	const memeTemplates = [
		{ url: "./images/Gleekify/MemeTemplates/Bernie.jpg", name: "bernie" },
		{ url: "./images/Gleekify/MemeTemplates/Mocking-Spongebob.jpg", name: "spongebob" },
		{ url: "./images/Gleekify/MemeTemplates/1op9wy.jpg", name: "whisper" },
		{ url: "./images/Gleekify/MemeTemplates/1yz6z4.jpg", name: "headache" },
		{ url: "./images/Gleekify/MemeTemplates/wab pointing.jpg", name: "wab pointing" },
		{ url: "./images/Gleekify/MemeTemplates/1.png", name: "slap flex" },
		{ url: "./images/Gleekify/MemeTemplates/2tzo2k.jpg", name: "soldier" },
		{ url: "./images/Gleekify/MemeTemplates/2xscjb.png", name: "red hair" },
		{ url: "./images/Gleekify/MemeTemplates/3kwur5.jpg", name: "homies" },
		{ url: "./images/Gleekify/MemeTemplates/3nx72a.png", name: "grave" },
		{ url: "./images/Gleekify/MemeTemplates/3pdf2w.png", name: "bernie" },
		{ url: "./images/Gleekify/MemeTemplates/3vfrmx.jpg", name: "undertaker wrestling" },
		{ url: "./images/Gleekify/MemeTemplates/4fhsie.png", name: "chart wojack" },
		{ url: "./images/Gleekify/MemeTemplates/4pn1an.png", name: "wojack corner party" },
		{ url: "./images/Gleekify/MemeTemplates/5c7lwq.png", name: "right" },
		{ url: "./images/Gleekify/MemeTemplates/8fhy2l.png", name: "travis kelce chiefs" },
		{ url: "./images/Gleekify/MemeTemplates/19vcz0.jpg", name: "pawn stars" },
		{ url: "./images/Gleekify/MemeTemplates/seal_me_when_the.png", name: "sappy seal" },
		{ url: "./images/Gleekify/MemeTemplates/46hhvr.jpg", name: "underwater skeleton kid" },
		{ url: "./images/Gleekify/MemeTemplates/54hjww.jpg", name: "receive" },
		{ url: "./images/Gleekify/MemeTemplates/145qvv.jpg", name: "spongebob patrick squidward" },
		{ url: "./images/Gleekify/MemeTemplates/434i5j.png", name: "train bus" },
		{ url: "./images/Gleekify/MemeTemplates/Always-Has-Been.png", name: "always has been" },
		{
			url: "./images/Gleekify/MemeTemplates/American-Chopper-Argument.jpg",
			name: "american chopper argue",
		},
		{ url: "./images/Gleekify/MemeTemplates/Ancient-Aliens.jpg", name: "ancient aliens" },
		{ url: "./images/Gleekify/MemeTemplates/Batman-Slapping-Robin.jpg", name: "batman robin" },
		{ url: "./images/Gleekify/MemeTemplates/Bike-Fall.jpg", name: "bike fall" },
		{ url: "./images/Gleekify/MemeTemplates/Blank-Nut-Button.jpg", name: "button nut" },
		{ url: "./images/Gleekify/MemeTemplates/Change-My-Mind.jpg", name: "change my mind" },
		{ url: "./images/Gleekify/MemeTemplates/wab_comp.png", name: "wab computer" },
		{ url: "./images/Gleekify/MemeTemplates/Clown-Applying-Makeup.jpg", name: "clown" },
		{ url: "./images/Gleekify/MemeTemplates/Disaster-Girl.jpg", name: "fire disaster girl" },
		{
			url: "./images/Gleekify/MemeTemplates/Distracted-Boyfriend.jpg",
			name: "distracted boyfriend",
		},
		{ url: "./images/Gleekify/MemeTemplates/drake.jpeg", name: "drake" },
		{ url: "./images/Gleekify/MemeTemplates/Epic-Handshake.jpg", name: "handshake bicept" },
		{ url: "./images/Gleekify/MemeTemplates/Evil-Kermit.jpg", name: "kermit evil" },
		{ url: "./images/Gleekify/MemeTemplates/Expanding-Brain.jpg", name: "brain" },
		{ url: "./images/Gleekify/MemeTemplates/Futurama-Fry.jpg", name: "futurama fry" },
		{
			url: "./images/Gleekify/MemeTemplates/Grandma-Finds-The-Internet.jpg",
			name: "grandma computer",
		},
		{ url: "./images/Gleekify/MemeTemplates/Grus-Plan.jpg", name: "gru" },
		{
			url: "./images/Gleekify/MemeTemplates/Hide-the-Pain-Harold.jpg",
			name: "pain diabetes harold",
		},
		{
			url: "./images/Gleekify/MemeTemplates/I-Bet-Hes-Thinking-About-Other-Women.jpg",
			name: "bet thninking about",
		},
		{ url: "./images/Gleekify/MemeTemplates/Inhaling-Seagull.jpg", name: "seagull" },
		{ url: "./images/Gleekify/MemeTemplates/Is-This-A-Pigeon.jpg", name: "is this a" },
		{ url: "./images/Gleekify/MemeTemplates/Laughing-Leo.png", name: "laugh leonardo dicaprio" },
		{ url: "./images/Gleekify/MemeTemplates/Left-Exit-12-Off-Ramp.jpg", name: "exit ramp" },
		{ url: "./images/Gleekify/MemeTemplates/Monkey-Puppet.jpg", name: "monkey puppet" },
		{ url: "./images/Gleekify/MemeTemplates/One-Does-Not-Simply.jpg", name: "one does not simply" },
		{ url: "./images/Gleekify/MemeTemplates/Oprah-You-Get-A.jpg", name: "oprah you get a" },
		{ url: "./images/Gleekify/MemeTemplates/Panik-Kalm-Panik.png", name: "panik kalm" },
		{
			url: "./images/Gleekify/MemeTemplates/Roll-Safe-Think-About-It.jpg",
			name: "roll safe think about it smart big brain",
		},
		{ url: "./images/Gleekify/MemeTemplates/Running-Away-Balloon.jpg", name: "run away balloon" },
		{ url: "./images/Gleekify/MemeTemplates/Sad-Pablo-Escobar.jpg", name: "pablo escobar" },
		{ url: "./images/Gleekify/MemeTemplates/Sleeping-Shaq.jpg", name: "shaq" },
		{ url: "./images/Gleekify/MemeTemplates/Success-Kid.jpg", name: "yes success kid" },
		{ url: "./images/Gleekify/MemeTemplates/seal_me_when_the.png", name: "sappy seal" },
		{
			url: "./images/Gleekify/MemeTemplates/The-Rock-Driving.jpg",
			name: "the rock dwayne johnson",
		},
		{ url: "./images/Gleekify/MemeTemplates/Same-Picture.jpg", name: "difference same explain" },
		{
			url: "./images/Gleekify/MemeTemplates/Third-World-Skeptical-Kid.jpg",
			name: "skeptikal kid",
		},
		{ url: "./images/Gleekify/MemeTemplates/This-Is-Fine.jpg", name: "this is gine" },
		{ url: "./images/Gleekify/MemeTemplates/Tuxedo-Winnie-The-Pooh.png", name: "whinnie the pooh" },
		{ url: "./images/Gleekify/MemeTemplates/Two-Buttons.jpg", name: "buttons" },
		{ url: "./images/Gleekify/MemeTemplates/u0pf0.jpg", name: "laughing disappointed" },
		{ url: "./images/Gleekify/MemeTemplates/UNO-Draw-25-Cards.jpg", name: "uno draw 25" },
		{ url: "./images/Gleekify/MemeTemplates/Waiting-Skeleton.jpg", name: "skeleton waiting" },
		{ url: "./images/Gleekify/MemeTemplates/Who-Killed-Hannibal.jpg", name: "who killed hannibal" },
		{ url: "./images/Gleekify/MemeTemplates/Woman-Yelling-At-Cat.jpg", name: "woman yelling cat" },
		{
			url: "./images/Gleekify/MemeTemplates/X-X-Everywhere.jpg",
			name: "woody buzz lightyear everywhere",
		},
		{
			url: "./images/Gleekify/MemeTemplates/Yall-Got-Any-More-Of-That.jpg",
			name: "dave chapelle yall got anymore",
		},
	];

	useEffect(() => {
		WebFont.load({
			google: {
				families: ["Anton"],
			},
			active: () => {
				// Force update on font load to re-render the text with the loaded font
				setElements([...elements]);
			},
		});
	}, []); // Empty dependency array means this effect runs once on component mount

	const filteredAssetImages = searchTerms.asset
		? assetImages.filter((image) =>
				image.name.toLowerCase().includes(searchTerms.asset.toLowerCase())
		  )
		: assetImages;

	const filteredGleekImages = searchTerms.gleek
		? gleekImages.filter((image) =>
				image.name.toLowerCase().includes(searchTerms.gleek.toLowerCase())
		  )
		: gleekImages;

	const filteredMouthImages = searchTerms.mouth
		? mouthImages.filter((image) =>
				image.name.toLowerCase().includes(searchTerms.mouth.toLowerCase())
		  )
		: mouthImages;

	const filteredMemeTemplates = searchTerms.meme
		? memeTemplates.filter((image) =>
				image.name.toLowerCase().includes(searchTerms.meme.toLowerCase())
		  )
		: memeTemplates;

	const openGleekModal = () => {
		setIsGleekModalOpen(!isGleekModalOpen);
		if (isGleekModalOpen === false) {
			setIsTongueModalOpen(false);
			setIsMemeModalOpen(false);
			setIsAssetModalOpen(false);
		}
	};

	const openTongueModal = () => {
		setIsTongueModalOpen(!isTongueModalOpen);
		if (isTongueModalOpen === false) {
			setIsGleekModalOpen(false);
			setIsMemeModalOpen(false);
			setIsAssetModalOpen(false);
		}
	};

	const openAssetModal = () => {
		setIsAssetModalOpen(!isAssetModalOpen);
		if (isAssetModalOpen === false) {
			setIsGleekModalOpen(false);
			setIsMemeModalOpen(false);
			setIsTongueModalOpen(false);
		}
	};

	const openMemeModal = () => {
		setIsMemeModalOpen(!isMemeModalOpen);
		if (isMemeModalOpen === false) {
			setIsGleekModalOpen(false);
			setIsTongueModalOpen(false);
			setIsAssetModalOpen(false);
		}
	};

	const toggleAdditionalButtons = () => {
		setShowAdditionalButtons(!showAdditionalButtons);
	};

	// Adjustments for Mobile
	useEffect(() => {
		function adjustCanvasMobile() {
			if (window.innerWidth <= 1024 || window.innerHeight.height <= 1024) {
				setIsMobile(true);
				setCanvasTextStyle({
					fontSize: "20px",
					color: "#6eb6c8",
					textAlign: "center",
					marginBottom: "10px",
					paddingLeft: "0px",
				});
				setGleekSize({ width: 70, height: 55 });
				setMouthSize({ width: 70, height: 65 });
				setAssetSize({ width: 70, height: 70 });
				setMemeSize({ width: 70, height: 70 });
				setCanvasSize({ width: mobileCanvasSize, height: mobileCanvasSize });
			} else {
				setIsMobile(false);
				setCanvasTextStyle({
					fontSize: "25px",
					color: "#6eb6c8",
					textAlign: "center",
					marginBottom: "10px",
					paddingLeft: "150px",
				});
				setGleekSize({ width: 150, height: 75 });
				setMouthSize({ width: 100, height: 80 });
				setAssetSize({ width: 150, height: 150 });
				setMemeSize({ width: 150, height: 150 });
				setCanvasSize({ width: 600, height: 600 }); // Default size for larger screens
			}
		}
		adjustCanvasMobile();
		window.addEventListener("resize", adjustCanvasMobile);

		// Cleanup listener on component unmount
		return () => window.removeEventListener("resize", adjustCanvasMobile);
	}, []);

	useEffect(() => {
		const handleKeyDown = (event) => {
			// Check if either backspace (for some browsers) or delete was pressed
			if ((event.key === "Backspace" || event.key === "Delete") && selectedId) {
				// Prevent the default action if the active element is NOT a text input or textarea
				if (
					document.activeElement.tagName !== "INPUT" &&
					document.activeElement.tagName !== "TEXTAREA"
				) {
					event.preventDefault(); // Prevent the default backspace action (e.g., navigate back)
					deleteSelectedImage(); // Call your existing function to delete the selected item
				}
			}
		};

		// Add event listener when the component mounts
		document.addEventListener("keydown", handleKeyDown);

		// Cleanup: Remove event listener when the component unmounts
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [selectedId]); // Ensure dependencies are correctly listed

	// Function to add a new text box to canvas
	const addTextElement = () => {
		const newTextElement = {
			text: "$GLEEK",
			x: 50,
			y: 50,
			fontSize: 35,
			id: Math.random().toString(36).substr(2, 9),
			draggable: true,
			color: "white",
		};
		setTextElements(textElements.concat(newTextElement));
		setSelectedId(newTextElement.id);
	};

	const resetCanvas = () => {
		setElements([]);
		setTextElements([]);
		setSelectedId(null);
		setBackgroundColor("");
		if (!isMobile) {
			adjustCanvasSize(600, 600);
		} else {
			adjustCanvasSize(mobileCanvasSize, mobileCanvasSize);
		}
	};

	const adjustCanvasSize = (imgWidth, imgHeight) => {
		let canvasWidth = imgWidth;
		let canvasHeight = imgHeight;

		// Calculate the scale factors for width and height
		const widthScale = maxCanvasWidth / imgWidth;
		const heightScale = maxCanvasHeight / imgHeight;
		const scale = Math.min(widthScale, heightScale, 1);

		// Adjust canvas size with scale factor, not exceeding maximum dimensions
		canvasWidth = imgWidth * scale;
		canvasHeight = imgHeight * scale;

		// Update canvas dimensions
		stageRef.current.width(canvasWidth);
		stageRef.current.height(canvasHeight);
	};

	// Edit text on canvas
	const handleTextEdit = (id) => {
		const textEl = textElements.find((te) => te.id === id);
		if (!textEl) return;

		const textPosition = stageRef.current.findOne(`#${id}`).getAbsolutePosition();
		const stageBox = stageRef.current.container().getBoundingClientRect();
		const areaPosition = {
			x: stageBox.left + textPosition.x,
			y: stageBox.top + textPosition.y,
		};

		const textarea = document.createElement("textarea");
		document.body.appendChild(textarea);
		textarea.value = textEl.text;
		textarea.style.position = "absolute";
		textarea.style.top = areaPosition.y + "px";
		textarea.style.left = areaPosition.x + "px";
		textarea.style.width = textEl.width + "px";
		textarea.focus();

		let removeTimeout;

		const removeTextarea = () => {
			const newText = textarea.value.trim();
			const updatedTextElements = textElements.map((te) => {
				if (te.id === id) {
					return { ...te, text: newText };
				}
				return te;
			});

			setTextElements(updatedTextElements);
			if (textarea.parentNode) {
				document.body.removeChild(textarea);
			}
		};

		textarea.addEventListener("keydown", function (e) {
			clearTimeout(removeTimeout);
			if (e.key === "Enter") {
				removeTextarea();
				e.preventDefault();
			}
		});

		textarea.addEventListener("blur", function () {
			removeTimeout = setTimeout(removeTextarea, 0);
		});
	};

	{
		editingState.visible && (
			<input
				style={{
					position: "absolute",
					top: `${editingState.y}px`,
					left: `${editingState.x}px`,
					zIndex: 100,
				}}
				autoFocus
				value={editingState.value}
				onChange={(e) => setEditingState({ ...editingState, value: e.target.value })}
				onBlur={() => saveText()}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						saveText();
					}
				}}
			/>
		);
	}

	// Save text changes and hide the input field
	const saveText = () => {
		const updatedTextElements = textElements.map((el) => {
			if (el.id === editingState.id) {
				return { ...el, text: editingState.value };
			}
			return el;
		});

		setTextElements(updatedTextElements);
		setEditingState({ visible: false, x: 0, y: 0, value: "", id: null });
	};

	const DraggableImage = React.memo(
		({
			src,
			x,
			y,
			width,
			height,
			rotation,
			onDragEnd,
			id,
			onSelect,
			isSelected,
			onResize,
			flipX,
			flipY,
			draggable,
		}) => {
			const image = useImage(src);
			const offsetX = flipX ? width / 2 : 0;
			const offsetY = flipY ? height / 2 : 0;

			return image ? (
				<KonvaImage
					image={image}
					x={x}
					y={y}
					width={width}
					height={height}
					offsetX={offsetX}
					offsetY={offsetY}
					rotation={rotation}
					scaleX={flipX ? -1 : 1}
					scaleY={flipY ? -1 : 1}
					draggable={draggable}
					onMouseDown={(e) => {
						onSelect(id);
						e.cancelBubble = true;
					}}
					onDragEnd={(e) => handleDragEnd(e, id)}
					onTransformEnd={(e) => handleTransformEnd(e, id)}
					onTap={(e) => {
						onSelect(id); // Use the same onSelect logic for tap as you do for mouse down
						e.cancelBubble = true;
					}}
					onTouchStart={(e) => {
						// This ensures that touch events don't trigger scrolling or zooming
						e.evt.preventDefault();
						onSelect(id);
					}}
					id={id}
				/>
			) : null;
		}
	);

	// handles resizing of assets on canvas
	const handleResize = React.memo((id, newWidth, newHeight) => {
		setElements((prevElements) =>
			prevElements.map((element) => {
				if (element.id === id) {
					return {
						...element,
						width: newWidth,
						height: newHeight,
						scaleX: 1,
						scaleY: 1,
					};
				}
				return element;
			})
		);
	});

	// handle transformation of assets
	const handleTransformEnd = useCallback(
		(e, id) => {
			const node = e.target;
			const scaleX = node.scaleX();
			const scaleY = node.scaleY();
			const rotation = node.rotation();
			const x = node.x();
			const y = node.y();

			const newWidth = node.width() * scaleX;
			const newHeight = node.height() * scaleY;
			// Reset scale back to 1 for both axes since we're applying the scale to the width and height directly
			node.scaleX(1);
			node.scaleY(1);
			// Update the state with the new transformation properties
			setElements((prevElements) =>
				prevElements.map((el) => {
					if (el.id === id) {
						return {
							...el,
							x,
							y,
							rotation,
							width: Math.abs(newWidth),
							height: Math.abs(newHeight),
							scaleX,
							scaleY,
							flipX: scaleX < 0,
							flipY: scaleY < 0,
						};
					}
					return el;
				})
			);
		},
		[elements]
	);

	// const signatureText = '$GLEEK-ify at gleek.lol 💦';
	// const signatureProps = {
	//     text: signatureText,
	//     x: 515,
	//     y: 560,
	//     fontSize: 12,
	//     fontFamily: 'chimi',
	//     fill: 'black',
	//     opacity: 0.9,
	// };

	// const renderSignatureForDownload = (forDownload = false, x, y) => {
	//     const layer =
	//         stageRef.current.getLayers()[
	//             stageRef.current.getLayers().length - 1
	//         ];
	//     const canvasWidth = stageRef.current.width();
	//     const maxBackgroundWidth = 200;
	//     const edgeBuffer = 20;
	//     const topMargin = 5;

	// 	// Calculate the maximum x position for the background to prevent it from going to the edge
	// 	// const maxX = canvasWidth - maxBackgroundWidth;
	// 	// const adjustedX = canvasWidth - 125;
	// 	// const adjustedY = topMargin;

	// 	// Background properties
	// 	const backgroundProps = {
	// 		x: x - 6,
	// 		y: y - 6,
	// 		width: maxBackgroundWidth - 75,
	// 		height: 20,
	// 		fill: "white",
	// 		opacity: 0.1,
	// 		cornerRadius: 15,
	// 		id: "signatureBackground",
	// 	};

	//     // Create and add background rectangle before the text
	//     const background = new Konva.Rect(backgroundProps);
	//     layer.add(background);

	// 	// Update signature position
	// 	const signature = new Konva.Text({
	// 		...signatureProps,
	// 		x: x,
	// 		y: y,
	// 		id: "signatureDownload",
	// 	});

	//     layer.add(signature);
	//     layer.draw();
	// };

	// const removeSignatureAfterDownload = () => {
	//     const layer =
	//         stageRef.current.getLayers()[
	//             stageRef.current.getLayers().length - 1
	//         ];
	//     const signature = layer.findOne('#signatureDownload');
	//     const background = layer.findOne('#signatureBackground');
	//     if (signature) {
	//         signature.destroy();
	//     }
	//     if (background) {
	//         background.destroy();
	//     }
	//     layer.draw();
	// };

	// handles selecting assets
	const handleSelect = useCallback((id) => {
		setSelectedId(id);
	}, []);
	useEffect(() => {}, [selectedId]);

	const [, drop] = useDrop(() => ({
		accept: "image",
		drop: (item, monitor) => {
			const clientOffset = monitor.getClientOffset();
			const stageBox = stageRef.current.container().getBoundingClientRect();
			const x = clientOffset.x - stageBox.left;
			const y = clientOffset.y - stageBox.top;
			addElementToCanvas(item.url, x, y);
		},
	}));

	// const addElementToCanvas = (url, x, y, type) => {
	// 	const img = new Image();
	// 	img.onload = () => {
	// 		let size;

	// 		if (type === "gleek") {
	// 			size = { width: 150, height: 75 };
	// 			type = "gleek";
	// 		} else if (type === "tongue") {
	// 			size = { width: 75, height: 75 };
	// 			type = "tongue";
	// 		} else if (type === "asset") {
	// 			if (isMobile) {
	// 				size = { width: 150, height: 150 };
	// 			} else {
	// 				size = { width: 300, height: 300 };
	// 			}
	// 			type = "asset";
	// 		} else if (type === "meme") {
	// 			type = "meme";
	// 			resetCanvas();
	// 			// Use the original dimensions but constrain if larger than maximum size
	// 			let maxMemeWidth = 0;
	// 			let maxMemeHeight = 0;
	// 			if (!isMobile) {
	// 				maxMemeWidth = 600;
	// 				maxMemeHeight = 600;
	// 			} else {
	// 				maxMemeWidth = mobileCanvasSize;
	// 				maxMemeHeight = mobileCanvasSize;
	// 			}

	// 			const aspectRatio = img.width / img.height;
	// 			let memeWidth = img.width;
	// 			let memeHeight = img.height;

	// 			// Scale down if necessary to fit within max dimensions
	// 			if (memeWidth > maxMemeWidth) {
	// 				memeWidth = maxMemeWidth;
	// 				memeHeight = memeWidth / aspectRatio;
	// 			}
	// 			if (memeHeight > maxMemeHeight) {
	// 				memeHeight = maxMemeHeight;
	// 				memeWidth = memeHeight * aspectRatio;
	// 			}

	// 			size = { width: memeWidth, height: memeHeight };
	// 		} else {
	// 			size = { width: 75, height: 75 };
	// 		}

	// 		// Create and add the element to the canvas
	// 		const newItem = {
	// 			src: url,
	// 			x: x,
	// 			y: y,
	// 			width: size.width,
	// 			height: size.height,
	// 			id: Math.random().toString(36).substr(2, 9),
	// 			type: type,
	// 		};

	// 		setElements((prevElements) => [...prevElements, newItem]);
	// 	};
	// 	img.src = url;
	// };
	const addElementToCanvas = (url, x, y, type) => {
		const img = new Image();
		img.onload = () => {
			let maxWidth, maxHeight;

			// Define maximum dimensions for each type
			switch (type) {
				case "gleek":
					maxWidth = isMobile ? 75 : 100;
					maxHeight = isMobile ? 75 : 100;
					break;
				case "tongue":
					maxWidth = isMobile ? 40 : 40;
					maxHeight = isMobile ? 40 : 40;
					break;
				case "asset":
					maxWidth = isMobile ? 120 : 200;
					maxHeight = isMobile ? 120 : 200;
					break;
				case "meme":
					maxWidth = isMobile ? mobileCanvasSize : 600;
					maxHeight = isMobile ? mobileCanvasSize : 600;
					resetCanvas();
					break;
				default:
					maxWidth = 150;
					maxHeight = 150;
			}

			// Calculate the appropriate size maintaining the aspect ratio
			const aspectRatio = img.width / img.height;
			let newWidth = img.width;
			let newHeight = img.height;

			if (newWidth > maxWidth) {
				newWidth = maxWidth;
				newHeight = newWidth / aspectRatio;
			}

			if (newHeight > maxHeight) {
				newHeight = maxHeight;
				newWidth = newHeight * aspectRatio;
			}

			// Create and add the element to the canvas with the new dimensions
			const newItem = {
				src: url,
				x: x,
				y: y,
				width: newWidth,
				height: newHeight,
				id: Math.random().toString(36).substr(2, 9),
				type: type,
				rotation: 0,
				draggable: true,
			};

			setElements((prevElements) => [...prevElements, newItem]);
			setSelectedId(newItem.id);
		};
		img.src = url;
	};

	// handles dragging of assets
	const handleDragEnd = useCallback(
		(e, id) => {
			// Find the index of the element being transformed
			const index = elements.findIndex((el) => el.id === id);
			if (index === -1) return; // Element not found
			// const canvasWidth = 600; // Example width
			// const canvasHeight = 600;
			// Capture the new position and rotation from the event target
			const node = e.target;
			let newX = node.x(); // Use let for reassignable variables
			let newY = node.y(); // Use let for reassignable variables
			const scaleX = node.scaleX();
			const scaleY = node.scaleY();
			const newRotation = node.rotation();
			const newWidth = node.width() * Math.abs(scaleX);
			const newHeight = node.height() * Math.abs(scaleY);
			const newFlipX = node.scaleX() < 0;
			const newFlipY = node.scaleY() < 0;

			// Adjust newX and newY to prevent the asset from going outside the canvas
			// newX = Math.max(0, Math.min(newX, canvasWidth - newWidth)); // Ensure newX is within the canvas width
			// newY = Math.max(0, Math.min(newY, canvasHeight - newHeight));

			// Create a new array with updated properties for the transformed element
			const newElements = elements.map((el, i) => {
				if (i === index) {
					return {
						...el,
						x: newX,
						y: newY,
						width: newWidth,
						height: newHeight,
						rotation: newRotation,
						flipX: newFlipX,
						flipY: newFlipY,
					};
				}
				return el;
			});

			// Update the state with the new elements array
			setElements(newElements);
		},
		[elements]
	);

	const flipElementHorizontal = (id) => {
		setElements((prevElements) =>
			prevElements.map((el) => {
				if (el.id === id) {
					return { ...el, flipX: !el.flipX };
				}
				return el;
			})
		);
	};

	const flipElementVertical = (id) => {
		setElements((prevElements) =>
			prevElements.map((el) => {
				if (el.id === id) {
					return { ...el, flipY: !el.flipY };
				}
				return el;
			})
		);
	};

	const handleBackgroundUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			resetCanvas();
			// Store the original file name in the state
			setOriginalFileName(file.name);

			const reader = new FileReader();
			reader.onloadend = () => {
				const src = reader.result;
				// Clear all assets and reset the canvas before adding a new background
				resetCanvas();
				addBackgroundToCanvas(src);
			};
			reader.readAsDataURL(file);

			// Manually clear the file input after reading the file
			event.target.value = "";
		}
	};

	const handleAssetUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			// Attempt to find the background image in the elements array

			const relevantElement = elements.find((el) => el.id === "background" || el.type === "meme");

			// Error check: If no background image or meme is found, inform the user and abort the download process
			if (!relevantElement && !backgroundColor) {
				alert("Please upload a background image or a meme before downloading.");
				console.error("Background image or meme not found");
				event.target.value = "";
				return;
			}

			// Store the original file name in the state
			setOriginalFileName(file.name);

			const reader = new FileReader();
			reader.onloadend = () => {
				const src = reader.result;
				// Function to add the uploaded asset to the canvas
				addAssetToCanvas(src);

				// Reset the file input after processing the file
				event.target.value = "";
			};
			reader.readAsDataURL(file);
		}
	};

	const addBackgroundToCanvas = (src) => {
		const img = new Image();
		img.onload = () => {
			let size;
			// Adjust canvas size based on the image loaded
			// adjustCanvasSize(img.width, img.height);
			let maxImageWidth = 0;
			let maxImageHeight = 0;
			if (!isMobile) {
				maxImageWidth = 600;
				maxImageHeight = 600;
			} else {
				maxImageWidth = mobileCanvasSize;
				maxImageHeight = mobileCanvasSize;
			}
			const aspectRatio = img.width / img.height;
			let imageWidth = img.width;
			let imageHeight = img.height;

			// Scale down if necessary to fit within max dimensions
			if (imageWidth > maxImageWidth) {
				imageWidth = maxImageWidth;
				imageHeight = imageWidth / aspectRatio;
			}
			if (imageHeight > maxImageHeight) {
				imageHeight = maxImageHeight;
				imageWidth = imageHeight * aspectRatio;
			}
			size = { width: imageWidth, height: imageHeight };
			// Set the new background image, replacing any existing elements
			setElements([
				{
					src,
					x: 0,
					y: 0,
					width: size.width,
					height: size.height,
					id: "background",
					draggable: false,
				},
			]);
		};
		img.src = src;
	};

	const addAssetToCanvas = (src) => {
		const img = new Image();
		img.onload = () => {
			// Get the current canvas dimensions
			const canvasWidth = stageRef.current.width();
			const canvasHeight = stageRef.current.height();

			// Calculate the scale ratio to maintain the aspect ratio
			const scaleX = canvasWidth / img.width;
			const scaleY = canvasHeight / img.height;
			const scale = Math.min(scaleX, scaleY, 1);
			// Calculate the scaled width and height
			const scaledWidth = img.width * scale;
			const scaledHeight = img.height * scale;

			// Add the image to the canvas with the scaled dimensions
			setElements((prevElements) => [
				...prevElements,
				{
					src,
					x: 0,
					y: 0,
					width: scaledWidth,
					height: scaledHeight,
					id: Math.random().toString(36).substr(2, 9),
				},
			]);
		};
		img.src = src;
	};

	const increaseSize = () => {
		if (!selectedId) return;

		// Update both elements and textElements based on the type determined by specific properties
		setElements((prevElements) =>
			prevElements.map((element) => {
				if (element.id === selectedId) {
					if (element.src) {
						const newWidth = element.width * 1.1;
						const newHeight = element.height * 1.1;
						return {
							...element,
							width: newWidth,
							height: newHeight,
						};
					}
				}
				return element;
			})
		);

		setTextElements((prevTextElements) =>
			prevTextElements.map((textElement) => {
				if (textElement.id === selectedId) {
					if (textElement.fontSize) {
						return {
							...textElement,
							fontSize: textElement.fontSize + 2,
						};
					}
				}
				return textElement;
			})
		);
	};

	// Function to decrease the size of the selected element (text or image)
	const decreaseSize = () => {
		if (!selectedId) return;

		// For text elements
		setTextElements((prevTextElements) =>
			prevTextElements.map((textElement) => {
				if (textElement.id === selectedId) {
					// Decrease font size by 2 or a certain percentage but not below 1
					return {
						...textElement,
						fontSize: Math.max(textElement.fontSize - 2, 1),
					};
				}
				return textElement;
			})
		);

		// For image elements
		setElements((prevElements) =>
			prevElements.map((element) => {
				if (element.id === selectedId) {
					// Decrease width and height by 10%
					const newWidth = element.width * 0.9;
					const newHeight = element.height * 0.9;
					return { ...element, width: newWidth, height: newHeight };
				}
				return element;
			})
		);
	};

	// handles asset transformations
	const TransformerComponent = React.memo(({ selectedId }) => {
		const transformerRef = useRef();

		useEffect(() => {
			// This timeout ensures the transformer is updated after state changes
			const timeout = setTimeout(() => {
				if (transformerRef.current && stageRef.current) {
					const selectedNode = stageRef.current.findOne(`#${selectedId}`);
					// Check if a node is selected
					if (selectedNode) {
						transformerRef.current.nodes([selectedNode]);
						// Check if the selected node is a Text node
						if (selectedNode.className === "Text") {
							// Disable anchors for Text nodes
							transformerRef.current.enabledAnchors([
								"top-left",
								"top-right",
								"bottom-left",
								"bottom-right",
							]);
						} else {
							// Enable all anchors for non-Text nodes (e.g., Image)
							transformerRef.current.enabledAnchors([
								"top-left",
								"top-right",
								"bottom-left",
								"bottom-right",
							]);
						}
					} else {
						transformerRef.current.nodes([]);
					}
				}
			}, 75);

			return () => clearTimeout(timeout);
		}, [selectedId]);
		if (!showTransformer) return null;
		return (
			<Transformer
				ref={transformerRef}
				keepRatio={false}
				borderStroke="#2d9bbd"
				borderStrokeWidth={3}
				anchorSize={8}
				anchorStroke="black"
				anchorFill="#2d9bbd"
				rotateEnabled={true}
			/>
		);
	});

	const moveElementInArray = (array, fromIndex, toIndex) => {
		const newArray = [...array];
		const element = newArray.splice(fromIndex, 1)[0];
		newArray.splice(toIndex, 0, element);
		return newArray;
	};

	const moveElementUp = () => {
		if (selectedId) {
			const selectedIndex = elements.findIndex((element) => element.id === selectedId);
			if (selectedIndex > 0) {
				const updatedElements = moveElementInArray(elements, selectedIndex, selectedIndex - 1);
				setElements(updatedElements);
			}
		}
	};

	const moveElementDown = () => {
		if (selectedId) {
			const selectedIndex = elements.findIndex((element) => element.id === selectedId);
			if (selectedIndex < elements.length - 1) {
				const updatedElements = moveElementInArray(elements, selectedIndex, selectedIndex + 1);
				setElements(updatedElements);
			}
		}
	};

	const deleteSelectedImage = () => {
		let deleted = false;

		// Check if the selected ID belongs to an image element and delete it
		const isImageElement = elements.some((element) => element.id === selectedId);
		if (isImageElement) {
			const newElements = elements.filter((element) => element.id !== selectedId);
			setElements(newElements);
			deleted = true;
		} else {
			// Assume if it's not an image element, it must be a text element
			const newTextElements = textElements.filter((textElement) => textElement.id !== selectedId);
			setTextElements(newTextElements);
			deleted = newTextElements.length !== textElements.length;
		}

		// After deletion, reset the selected ID
		setSelectedId(null);

		// If an element was deleted, check if we need to reset canvas size
		if (deleted && elements.length === 0 && textElements.length === 0) {
			adjustCanvasSize(600, 600);
		}
	};

	// Function to toggle text color between black and white
	const toggleTextColor = () => {
		setTextElements(
			textElements.map((textElement) => {
				if (textElement.id === selectedId) {
					// Determine the new color based on the current color
					const newColor = textElement.color === "black" ? "white" : "black";
					// const newStroke =
					//     newColor === 'white' ? 'black' : 'transparent';
					// const shadowColor =
					//     newColor === 'white' ? 'black' : 'transparent';
					// const shadowBlur = newColor === 'white' ? 5 : 0;
					// const shadowOpacity = newColor === 'white' ? 0.5 : 0;
					return {
						...textElement,
						color: newColor,
						// stroke: newStroke,
						// shadowColor: shadowColor,
						// shadowBlur: shadowBlur,
						// shadowOpacity: shadowOpacity,
					};
				}
				return textElement;
			})
		);
	};

	const handleDownloadMergedImage = () => {
		setShowTransformer(false); // Ensure the transformer is not shown in the downloaded image

		const relevantElement = elements.find((el) => el.id === "background" || el.type === "meme");

		// Proceed with the download if there is a background color selected, even if there's no relevant image
		if (!relevantElement && !backgroundColor) {
			alert(
				"Please upload a background image, select a meme, or choose a background color before downloading."
			);
			console.error("Background image, meme, or color not found");
			setShowTransformer(true); // Re-enable the transformer if needed
			return; // Exit the function to prevent further execution
		}

		setTimeout(() => {
			const stage = stageRef.current.getStage();

			const minX = 0,
				minY = 0;
			// Use relevantElement's width and height if it exists, otherwise use the stage's width and height
			const maxX = relevantElement ? Math.min(stage.width(), relevantElement.width) : stage.width();
			const maxY = relevantElement
				? Math.min(stage.height(), relevantElement.height)
				: stage.height();

			const contentWidth = maxX - minX;
			const contentHeight = maxY - minY;

			// Use toDataURL with clipping set to the calculated bounding box, constrained by the canvas size
			const dataURL = stage.toDataURL({
				pixelRatio: 2,
				x: minX,
				y: minY,
				width: contentWidth,
				height: contentHeight,
			});

			// Creating a link to trigger the download
			const link = document.createElement("a");
			link.download = originalFileName
				? `gleekify_${originalFileName}`
				: "gleekify_merged_image.png";
			link.href = dataURL;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Restore original stage size and position after the download
			setTimeout(() => {
				stage.batchDraw();
				setShowTransformer(true);
			}, 100);
		}, 100);
	};

	const Modal = ({ isOpen, close, children }) => {
		if (!isOpen) return null;
		return (
			<div className="modal-overlay" onClick={close}>
				<div className="modal-content" onClick={(e) => e.stopPropagation()}>
					{children}
				</div>
			</div>
		);
	};

	// Function to render Gleek Modal content
	const renderGleekModalContent = () =>
		filteredGleekImages.map((image, index) => (
			<div key={`gleek-${index}`} style={{ textAlign: "center", margin: "5px" }}>
				<button
					onClick={() => addElementToCanvas(image.url, gleekSize.width, gleekSize.height, "gleek")}
				>
					<img
						src={image.url}
						alt={image.url.split("/").pop().split(".")[0]}
						style={{
							maxWidth: `${gleekSize.width}px`,
							maxHeight: `${gleekSize.height}px`,
							objectFit: "contain",
						}}
					/>
				</button>
				<div>{image.url.split("/").pop().split(".")[0]}</div>
			</div>
		));

	// Function to render Tongue Modal content
	const renderTongueModalContent = () =>
		filteredMouthImages.map((image, index) => (
			<div key={`tongue-${index}`} style={{ textAlign: "center", margin: "5px" }}>
				<button
					onClick={() => addElementToCanvas(image.url, mouthSize.width, mouthSize.height, "tongue")}
				>
					<img
						src={image.url}
						alt={image.url.split("/").pop().split(".")[0]}
						style={{
							maxWidth: `${mouthSize.width}px`,
							maxHeight: `${mouthSize.height}px`,
							objectFit: "contain",
						}}
					/>
				</button>
				<div>{image.url.split("/").pop().split(".")[0]}</div>
			</div>
		));
	const renderAssetModalContent = () =>
		filteredAssetImages.map((image, index) => (
			<div key={`asset-${index}`} style={{ textAlign: "center", margin: "5px" }}>
				<button
					onClick={() => addElementToCanvas(image.url, assetSize.width, assetSize.height, "asset")}
				>
					<img
						src={image.url}
						alt={image.name}
						style={{
							maxWidth: `${assetSize.width}px`,
							maxHeight: `${assetSize.height}px`,
							objectFit: "contain",
						}}
					/>
				</button>
				<div>{image.name}</div>
			</div>
		));

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]]; // Swap elements
		}
		return array;
	}

	const renderMemeModalContent = () => {
		const shuffledMemeTemplates = shuffleArray([...filteredMemeTemplates]);
		const memeTemps = [...memeTemplates];
		return shuffledMemeTemplates.map((image, index) => (
			<div key={`meme-${index}`} style={{ textAlign: "center", margin: "5px" }}>
				<button onClick={() => addElementToCanvas(image.url, 0, 0, "meme")}>
					<img
						src={image.url}
						alt=""
						style={{
							maxWidth: `${memeSize.width}px`,
							maxHeight: `${memeSize.height}px`,
							objectFit: "contain",
						}}
					/>
				</button>
			</div>
		));
	};
	useEffect(() => {
		// console.log('Modal state:', isModalOpen);
	}, [isModalOpen]);

	return (
		<div className="gleekify-container">
			{!isMobile && (
				<div style={canvasTextStyle}>
					{(isGleekModalOpen || isTongueModalOpen || isAssetModalOpen || isMemeModalOpen) && (
						<input
							className="search-text"
							type="text"
							placeholder={`Search ${
								isGleekModalOpen
									? "gleek"
									: isTongueModalOpen
									? "mouth"
									: isAssetModalOpen
									? "assets"
									: "memes"
							}...`}
							style={{ marginLeft: "10px" }}
							value={
								isGleekModalOpen
									? searchTerms.gleek
									: isTongueModalOpen
									? searchTerms.mouth
									: isAssetModalOpen
									? searchTerms.asset
									: searchTerms.meme
							}
							onChange={(e) =>
								setSearchTerms({
									...searchTerms,
									[isGleekModalOpen
										? "gleek"
										: isTongueModalOpen
										? "mouth"
										: isAssetModalOpen
										? "asset"
										: "meme"]: e.target.value,
								})
							}
						/>
					)}
				</div>
			)}
			<div className="canvas-toolbar-container">
				{!isMobile && (
					<div className="button-toolbar-gleekify">
						<div className="primary-buttons">
							<input
								className="color-input"
								ref={colorInputRef}
								type="color"
								style={{ display: "none" }}
								onChange={handleColorChange}
							/>
							<button className="button-gleekify" onClick={handleOpenColorPicker}>
								background color
							</button>
							<input
								id="fileInput1"
								type="file"
								onChange={handleBackgroundUpload}
								accept="image/*"
								style={{ display: "none" }}
							/>
							<button
								className="button-gleekify"
								onClick={() => document.getElementById("fileInput1").click()}
								title="Upload background image first"
							>
								upload background
							</button>
							<input
								id="fileInput2"
								type="file"
								onChange={handleAssetUpload}
								accept="image/*"
								style={{ display: "none" }}
							/>
							<button
								className="button-gleekify"
								onClick={() => document.getElementById("fileInput2").click()}
								title="Must upload background image before loading custom assets"
							>
								upload asset
							</button>
							<button className="button-gleekify" onClick={resetCanvas}>
								reset canvas
							</button>
							<button className="button-gleekify" onClick={handleDownloadMergedImage}>
								download
							</button>
						</div>
						<div className="hide-button">
							<button className="button-gleekify" onClick={toggleAdditionalButtons}>
								{showAdditionalButtons ? "↑ hide tools" : "↓ show tools"}
							</button>
						</div>
						{showAdditionalButtons && (
							<div className="additional-buttons group-spacing">
								<button className="button-gleekify" onClick={addTextElement}>
									add text
								</button>
								<button className="button-gleekify" onClick={toggleTextColor}>
									black/white text
								</button>
								<button className="button-gleekify" onClick={moveElementDown}>
									layer up
								</button>
								<button className="button-gleekify" onClick={moveElementUp}>
									layer down
								</button>
								<button className="button-gleekify" onClick={increaseSize}>
									+ size
								</button>
								<button className="button-gleekify" onClick={decreaseSize}>
									- size
								</button>
								<button
									className="button-gleekify"
									onClick={() => selectedId && flipElementHorizontal(selectedId)}
								>
									flip horizontal
								</button>
								<button
									className="button-gleekify"
									onClick={() => selectedId && flipElementVertical(selectedId)}
								>
									flip vertical
								</button>
								<button className="button-gleekify" onClick={deleteSelectedImage}>
									<img
										src="./images/Gleekify/trash.png"
										alt="Backward"
										style={{ width: "25px", height: "25px" }}
									/>
								</button>
							</div>
						)}
					</div>
				)}
				{/* Canvas */}
				<div ref={drop} className="canvas-frame-gleekify">
					<Stage
						width={canvasSize.width}
						height={canvasSize.height}
						pixelRatio={window.devicePixelRatio}
						ref={stageRef}
						onMouseDown={(e) => {
							// Check if the click is on the stage or the background image
							if (e.target === e.target.getStage() || e.target.name() === "background") {
								setSelectedId(null);
							}
						}}
					>
						<Layer>
							<Rect
								x={0}
								y={0}
								width={canvasSize.width}
								height={canvasSize.height}
								fill={backgroundColor}
							/>
							{backgroundImage && (
								<KonvaImage
									image={backgroundImage}
									name="background"
									width={canvasSize.width}
									height={canvasSize.height}
									draggable={false}
								/>
							)}

							{elements.map((element, i) => (
								<DraggableImage
									key={i}
									src={element.src}
									x={element.x}
									y={element.y}
									width={element.width}
									height={element.height}
									rotation={element.rotation || 0}
									onDragEnd={(e) => handleDragEnd(e, i)}
									isSelected={element.id === selectedId}
									onSelect={handleSelect}
									id={element.id}
									onResize={handleResize}
									draggable={element.id !== "background" && element.type !== "meme"}
									flipX={element.flipX || false}
									flipY={element.flipY || false}
									scaleX={element.flipX ? -1 : 1}
									scaleY={element.flipY ? -1 : 1}
								/>
							))}

							{textElements.map((textElement, i) => (
								<Text
									key={i}
									{...textElement}
									fontFamily="Anton"
									fill={textElement.color}
									fontSize={textElement.fontSize}
									// stroke={textElement.stroke}
									// strokeWidth={
									//     textElement.stroke === 'transparent'
									//         ? 0
									//         : 2
									// }
									// shadowColor={textElement.shadowColor}
									// shadowBlur={textElement.shadowBlur}
									// shadowOpacity={textElement.shadowOpacity}
									onClick={() => handleSelect(textElement.id)}
									onDblClick={() => handleTextEdit(textElement.id)}
									onDragEnd={(e) => {
										const updatedTextElements = textElements.map((el) => {
											if (el.id === textElement.id) {
												return {
													...el,
													x: e.target.x(),
													y: e.target.y(),
												};
											}
											return el;
										});
										setTextElements(updatedTextElements);
									}}
									onTap={() => handleSelect(textElement.id)}
									onDblTap={() => handleTextEdit(textElement.id)}
								/>
							))}

							{editingState.visible && (
								<input
									style={{
										position: "absolute",
										top: `${editingState.y}px`,
										left: `${editingState.x}px`,
										zIndex: 100,
									}}
									autoFocus
									value={editingState.value}
									onChange={(e) =>
										setEditingState({
											...editingState,
											value: e.target.value,
										})
									}
									onBlur={() => saveText()}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											saveText();
										}
									}}
								/>
							)}

							{selectedId && <TransformerComponent selectedId={selectedId} stageRef={stageRef} />}
						</Layer>
					</Stage>
					<div className="bottom-and-modal">
						{!isMobile && (
							<div className="bottom-frame-buttons">
								<button className="button-gleekify" onClick={openGleekModal}>
									{isGleekModalOpen ? "💦 gleek" : "gleek"}
								</button>
								<button className="button-gleekify" onClick={openTongueModal}>
									{isTongueModalOpen ? "💦 mouth" : "mouth"}
								</button>
								<button className="button-gleekify" onClick={openAssetModal}>
									{isAssetModalOpen ? "💦 assets" : "assets"}
								</button>
								<button className="button-gleekify" onClick={openMemeModal}>
									{isMemeModalOpen ? "💦 memes" : "memes"}
								</button>
							</div>
						)}
						{isMobile && (
							<div className="bottom-frame-buttons">
								<button className="button-gleekify" onClick={openGleekModal}>
									{isGleekModalOpen ? "💦 gleek" : "gleek"}
								</button>
								<button className="button-gleekify" onClick={openTongueModal}>
									{isTongueModalOpen ? "💦 mouth" : "mouth"}
								</button>
								<button className="button-gleekify" onClick={openAssetModal}>
									{isAssetModalOpen ? "💦 assets" : "assets"}
								</button>
								<button className="button-gleekify" onClick={openMemeModal}>
									{isMemeModalOpen ? "💦 meme" : "meme"}
								</button>
								<button className="button-gleekify" onClick={toggleTextColor}>
									black/white text
								</button>
								<button className="button-gleekify" onClick={decreaseSize}>
									- size
								</button>
								<button className="button-gleekify" onClick={moveElementUp}>
									layer down
								</button>
								<button
									className="button-gleekify"
									onClick={() => selectedId && flipElementVertical(selectedId)}
								>
									flip vertical
								</button>
							</div>
						)}
						<div className="modal-mobile">
							{isMobile &&
								(isGleekModalOpen || isTongueModalOpen || isAssetModalOpen || isMemeModalOpen) && (
									<input
										className="search-text-mobile"
										type="text"
										placeholder={`Search ${
											isGleekModalOpen
												? "gleek"
												: isTongueModalOpen
												? "mouth"
												: isAssetModalOpen
												? "assets"
												: "memes"
										}...`}
										value={
											isGleekModalOpen
												? searchTerms.gleek
												: isTongueModalOpen
												? searchTerms.mouth
												: isAssetModalOpen
												? searchTerms.asset
												: searchTerms.meme
										}
										onChange={(e) =>
											setSearchTerms({
												...searchTerms,
												[isGleekModalOpen
													? "gleek"
													: isTongueModalOpen
													? "mouth"
													: isAssetModalOpen
													? "asset"
													: "meme"]: e.target.value,
											})
										}
									/>
								)}
							{isGleekModalOpen && (
								<Modal isOpen={isGleekModalOpen} close={() => setIsGleekModalOpen(false)}>
									{renderGleekModalContent()}
								</Modal>
							)}
							{isTongueModalOpen && (
								<Modal isOpen={isTongueModalOpen} close={() => setIsTongueModalOpen(false)}>
									{renderTongueModalContent()}
								</Modal>
							)}
							{isAssetModalOpen && (
								<Modal isOpen={isAssetModalOpen} close={() => setIsAssetModalOpen(false)}>
									{renderAssetModalContent()}
								</Modal>
							)}
							{isMemeModalOpen && (
								<Modal isOpen={isMemeModalOpen} close={() => setIsMemeModalOpen(false)}>
									{renderMemeModalContent()}
								</Modal>
							)}
						</div>
					</div>
				</div>
				{isMobile && (
					<div className="button-toolbar-gleekify">
						<div className="primary-buttons">
							<button className="button-gleekify" onClick={handleDownloadMergedImage}>
								download
							</button>
							<input
								id="fileInput1"
								type="file"
								onChange={handleBackgroundUpload}
								accept="image/*"
								style={{ display: "none" }}
							/>
							{/* <button
								className="button-gleekify"
								onClick={handleOpenColorPicker}
								onTap={handleOpenColorPicker}
							>
								background color
							</button>
							<input
								className="color-input"
								ref={colorInputRef}
								type="color"
								style={{ display: "none" }}
								onChange={handleColorChange}
							/> */}
							<button
								className="button-gleekify"
								onClick={() => document.getElementById("fileInput1").click()}
								title="Upload background image first"
							>
								upload background
							</button>
							<input
								id="fileInput2"
								type="file"
								onChange={handleAssetUpload}
								accept="image/*"
								style={{ display: "none" }}
							/>
							<button
								className="button-gleekify"
								onClick={() => document.getElementById("fileInput2").click()}
								title="Must upload background image before loading custom assets"
							>
								upload asset
							</button>
							<button className="button-gleekify" onClick={resetCanvas}>
								reset canvas
							</button>
							{/* <button className="button-gleekify" onClick={toggleAdditionalButtons}>
								{showAdditionalButtons ? "↑ hide tools" : "↓ show tools"}
							</button> */}

							{/* {showAdditionalButtons && ( */}
							<div className="additional-buttons group-spacing">
							<button className="button-gleekify" onClick={addTextElement}>
									add text
								</button>
								<button className="button-gleekify" onClick={increaseSize}>
									+ size
								</button>
								<button className="button-gleekify" onClick={moveElementDown}>
									layer up
								</button>
								<button
									className="button-gleekify"
									onClick={() => selectedId && flipElementHorizontal(selectedId)}
								>
									flip horizontal
								</button>
								<button className="button-gleekify" onClick={deleteSelectedImage}>
									<img
										src="./images/Gleekify/trash.png"
										alt="Backward"
										style={{ width: "25px", height: "25px" }}
									/>
								</button>
							</div>
							{/* )} */}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Gleekify;
