import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer, Text } from "react-konva";
import Konva from "konva";
import { useDrag, useDrop } from "react-dnd";
import mergeImages from "merge-images";

const maxCanvasWidth = 600; // Maximum canvas width
const maxCanvasHeight = 600; // Maximum canvas height

// Custom hook for loading images
const useImage = (src) => {
	const [image, setImage] = useState(null);
	useEffect(() => {
		const img = new Image();
		img.onload = () => setImage(img);
		img.onerror = (err) => console.error("Failed to load image:", err);
		img.src = src;
		return () => {
			img.onload = null;
			img.onerror = null;
		};
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
	const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
	const [isMemeModalOpen, setIsMemeModalOpen] = useState(false);
	const [textElements, setTextElements] = useState([]);
	const [originalFileName, setOriginalFileName] = useState("");
	const [showTransformer, setShowTransformer] = useState(true);
	const [showAdditionalButtons, setShowAdditionalButtons] = useState(true); // Start with buttons visible
	const [editingState, setEditingState] = useState({
		visible: false,
		x: 0,
		y: 0,
		value: "",
		id: null,
	});

	// Example static images
	const gleekImages = [
		{ url: "./images/Gleekify/sappy seals gleek.png" },
		{ url: "./images/Gleekify/cartoon gleek.png" },
		{ url: "./images/Gleekify/plague gleek.png" },
		{ url: "./images/Gleekify/doodles gleek.png" },
		{ url: "./images/Gleekify/sproto gremlins gleek.png" },
		{ url: "./images/Gleekify/mad lads gleek.png" },
		{ url: "./images/Gleekify/galactic geckos gleek.png" },
		{ url: "./images/Gleekify/frogana gleek.png" },
		{ url: "./images/Gleekify/goobers gleek.png" },
		{ url: "./images/Gleekify/gleek 1.png" },
		{ url: "./images/Gleekify/gleek 2.png" },
		{ url: "./images/Gleekify/gleek 3.png" },
		{ url: "./images/Gleekify/acid.png" },
		{ url: "./images/Gleekify/fire.png" },
		{ url: "./images/Gleekify/rainbow.png" },
	];
	const mouthImages = [
		{ url: "./images/Gleekify/sappy seals.png" },
		{ url: "./images/Gleekify/pudgy penguins.png" },
		{ url: "./images/Gleekify/plague.png" },
		{ url: "./images/Gleekify/lil pudgy.png" },
		{ url: "./images/Gleekify/sproto gremlins.png" },
		{ url: "./images/Gleekify/degods.png" },
		{ url: "./images/Gleekify/milady.png" },
		{ url: "./images/Gleekify/yoots.png" },
		{ url: "./images/Gleekify/bitcoin puppets.png" },
		{ url: "./images/Gleekify/okay bears.png" },
		{ url: "./images/Gleekify/mad lads.png" },
		{ url: "./images/Gleekify/goobers.png" },
		{ url: "./images/Gleekify/kanpai panda.png" },
		{ url: "./images/Gleekify/galactic geckos.png" },
		{ url: "./images/Gleekify/frogana.png" },
		{ url: "./images/Gleekify/bodoggos.png" },
		{ url: "./images/Gleekify/anime.png" },
		// Add more images as needed
	];
    const assetImages = [
        { url: "./images/team/dev.jpg", name: "hornelius"  },
        { url: "./images/team/cookies.png", name: "cookies"  },
        { url: "./images/team/artist.jpg", name: "richard"  },
        { url: "./images/team/sd.jpg", name: "psyxology"  },        
        { url: "./images/game/soyjak.png", name: "soyjak"  },
		{ url: "./images/game/wab_gleek.png", name: "wab" },
		{ url: "./images/game/anita.png", name: "anita"  },
		{ url: "./images/game/ape_szn.png", name: "ape szn"  },
		{ url: "./images/game/black_airforce_1.png", name: "black air force 1"  },
		{ url: "./images/game/bobo.png", name: "bobo"  },
		{ url: "./images/game/bonk.png", name: "bonk"  },
		{ url: "./images/game/chad.png", name: "chad"  },
        { url: "./images/game/Ansem.png", name: "ansem"  },
		{ url: "./images/game/doge.png", name: "doge"  },
		{ url: "./images/game/harambe.png", name: "harambe"  },
		{ url: "./images/game/honda.png", name: "honda"  },
		{ url: "./images/game/pepe.png", name: "pepe"  },
		{ url: "./images/game/sax_squirtle.png", name: "sax squirtle"  },
		{ url: "./images/game/smolanoo.png", name: "smolanoo"  },
		{ url: "./images/game/wif.png", name: "wif"  },
		{ url: "./images/game/your_mom.png", name: "your mom"  },
		// Add more images as needed
	];
	const memeTemplates = [
		{ url: "./images/Gleekify/MemeTemplates/Bernie.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Mocking-Spongebob.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/1op9wy.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/1yz6z4.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/1.png" },
		{ url: "./images/Gleekify/MemeTemplates/2tzo2k.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/2xscjb.png" },
		{ url: "./images/Gleekify/MemeTemplates/3kwur5.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/3nx72a.png" },
		{ url: "./images/Gleekify/MemeTemplates/3pdf2w.png" },
		{ url: "./images/Gleekify/MemeTemplates/3vfrmx.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/4fhsie.png" },
		{ url: "./images/Gleekify/MemeTemplates/4pn1an.png" },
		{ url: "./images/Gleekify/MemeTemplates/5c7lwq.png" },
		{ url: "./images/Gleekify/MemeTemplates/8fhy2l.png" },
		{ url: "./images/Gleekify/MemeTemplates/19vcz0.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/46hhvr.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/54hjww.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/145qvv.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/434i5j.png" },
		{ url: "./images/Gleekify/MemeTemplates/Always-Has-Been.png" },
		{
			url: "./images/Gleekify/MemeTemplates/American-Chopper-Argument.jpg",
		},
		{ url: "./images/Gleekify/MemeTemplates/Ancient-Aliens.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Batman-Slapping-Robin.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Bike-Fall.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Blank-Nut-Button.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Change-My-Mind.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Clown-Applying-Makeup.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Disaster-Girl.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Distracted-Boyfriend.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/drake.jpeg" },
		{ url: "./images/Gleekify/MemeTemplates/Epic-Handshake.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Evil-Kermit.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Expanding-Brain.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Futurama-Fry.jpg" },
		{
			url: "./images/Gleekify/MemeTemplates/Grandma-Finds-The-Internet.jpg",
		},
		{ url: "./images/Gleekify/MemeTemplates/Grus-Plan.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Hide-the-Pain-Harold.jpg" },
		{
			url: "./images/Gleekify/MemeTemplates/I-Bet-Hes-Thinking-About-Other-Women.jpg",
		},
		{ url: "./images/Gleekify/MemeTemplates/Inhaling-Seagull.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Is-This-A-Pigeon.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Laughing-Leo.png" },
		{ url: "./images/Gleekify/MemeTemplates/Left-Exit-12-Off-Ramp.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Leonardo-Dicaprio-Cheers.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Monkey-Puppet.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/One-Does-Not-Simply.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Oprah-You-Get-A.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Panik-Kalm-Panik.png" },
		{ url: "./images/Gleekify/MemeTemplates/Roll-Safe-Think-About-It.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Running-Away-Balloon.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Sad-Pablo-Escobar.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Sleeping-Shaq.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Success-Kid.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/The-Rock-Driving.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Same-Picture.jpg" },
		{
			url: "./images/Gleekify/MemeTemplates/Third-World-Skeptical-Kid.jpg",
		},
		{ url: "./images/Gleekify/MemeTemplates/This-Is-Fine.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Tuxedo-Winnie-The-Pooh.png" },
		{ url: "./images/Gleekify/MemeTemplates/Two-Buttons.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/u0pf0.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/UNO-Draw-25-Cards.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Waiting-Skeleton.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Who-Killed-Hannibal.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Woman-Yelling-At-Cat.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/X-X-Everywhere.jpg" },
		{
			url: "./images/Gleekify/MemeTemplates/Yall-Got-Any-More-Of-That.jpg",
		},
	];

	const openGleekModal = () => {
		setIsGleekModalOpen(!isGleekModalOpen); // Toggle the current state
		if (isGleekModalOpen === false) {
			// If we're opening the Gleek modal, close others
			setIsTongueModalOpen(false);
			setIsMemeModalOpen(false);
            setIsAssetModalOpen(false);
		}
	};

	const openTongueModal = () => {
		setIsTongueModalOpen(!isTongueModalOpen); // Toggle the current state
		if (isTongueModalOpen === false) {
			// If we're opening the Tongue modal, close others
			setIsGleekModalOpen(false);
			setIsMemeModalOpen(false);
            setIsAssetModalOpen(false);
		}
	};

    const openAssetModal = () => {
		setIsAssetModalOpen(!isAssetModalOpen); // Toggle the current state
		if (isAssetModalOpen === false) {
			// If we're opening the Tongue modal, close others
			setIsGleekModalOpen(false);
			setIsMemeModalOpen(false);
            setIsTongueModalOpen(false);
		}
	};

	// Add a new function for the Meme Templates button
	const openMemeModal = () => {
		setIsMemeModalOpen(!isMemeModalOpen); // Toggle the current state
		if (isMemeModalOpen === false) {
			// If we're opening the Meme modal, close others
			setIsGleekModalOpen(false);
			setIsTongueModalOpen(false);
            setIsAssetModalOpen(false);
		}
	};

	const toggleAdditionalButtons = () => {
		setShowAdditionalButtons(!showAdditionalButtons); // Toggle the visibility
	};

	// Function to add a new text box
	const addTextElement = () => {
		const newTextElement = {
			text: "New Text",
			x: 250, // Initial position
			y: 250,
			fontSize: 35,
			id: Math.random().toString(36).substr(2, 9), // Unique ID for each text element
			draggable: true,
			color: "white",
			stroke: "black", // Stroke color for white text
			strokeWidth: 2, // Stroke width
			shadowColor: "black", // Shadow color for white text
			shadowBlur: 5, // Shadow blur level
			shadowOpacity: 0.5, // Shadow opacity
			shadowOffsetX: 1, // Shadow horizontal offset
			shadowOffsetY: 1,
		};
		setTextElements(textElements.concat(newTextElement));
	};

	const resetCanvas = () => {
		// Reset the elements array
		setElements([]);
		// Reset the text elements array
		setTextElements([]);
		// Reset any other states you have related to canvas elements
		// For example, if you have a state for selectedId, you might want to reset it as well
		setSelectedId(null);
        adjustCanvasSize(600,600)
	};

	const adjustCanvasSize = (imgWidth, imgHeight) => {
		let canvasWidth = imgWidth;
		let canvasHeight = imgHeight;

		// Calculate the scale factors for width and height
		const widthScale = maxCanvasWidth / imgWidth;
		const heightScale = maxCanvasHeight / imgHeight;
		const scale = Math.min(widthScale, heightScale, 1); // Ensure scale is not more than 1

		// Adjust canvas size with scale factor, not exceeding maximum dimensions
		canvasWidth = imgWidth * scale;
		canvasHeight = imgHeight * scale;

		// Update canvas dimensions
		stageRef.current.width(canvasWidth);
		stageRef.current.height(canvasHeight);

		// Optionally, adjust the view or container size if necessary
		// document.getElementById('canvas-container').style.width = `${canvasWidth}px`;
		// document.getElementById('canvas-container').style.height = `${canvasHeight}px`;
	};

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
				e.preventDefault(); // Prevent the default action to stop from triggering blur event immediately
			}
		});

		textarea.addEventListener("blur", function () {
			// Use setTimeout to debounce the removal
			removeTimeout = setTimeout(removeTextarea, 0);
		});
	};

	// Input field for editing text, positioned based on editingState
	// Ensure this input field is rendered within your component, correctly positioned
	// Adjust the style to match your needs
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
		setEditingState({ visible: false, x: 0, y: 0, value: "", id: null }); // Reset editing state
	};

	const DraggableImage = ({
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
		const offsetX = flipX ? width / 2 : 0; // Half width if flipped
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
				id={id}
			/>
		) : null;
	};

	const handleResize = (id, newWidth, newHeight) => {
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
	};

	const handleTransformEnd = (e, id) => {
		const node = e.target;
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();
		const rotation = node.rotation();
		const x = node.x();
		const y = node.y();
		// Calculate the new width and height
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
						width: Math.abs(newWidth), // Use Math.abs to ensure positive values
						height: Math.abs(newHeight),
						scaleX,
						scaleY,
						flipX: scaleX < 0, // Update flipX based on scaleX
						flipY: scaleY < 0, // Update flipY based on scaleY
					};
				}
				return el;
			})
		);
	};

	const signatureText = "  Powered by $GLEEK\nGLEEKIFY at gleek.lol 💦"; // Customize this message
	const signatureProps = {
		text: signatureText,
		x: 515, // Adjust based on canvas size
		y: 560, // Adjust based on canvas size
		fontSize: 14,
		fontFamily: "chimi",
		fill: "black", // Signature color
		opacity: 0.8,
	};

	const renderSignatureForDownload = (forDownload = false, x, y) => {
		const layer = stageRef.current.getLayers()[stageRef.current.getLayers().length - 1];
		const canvasWidth = stageRef.current.width(); // Assuming stageRef.current holds the canvas width
		const maxBackgroundWidth = 200; // Maximum background width
		const edgeBuffer = 20; // Minimum distance from the edge of the canvas

		// Calculate the maximum x position for the background to prevent it from going to the edge
		// const maxX = canvasWidth - maxBackgroundWidth;
		const adjustedX = x - 27; // Ensure it does not go beyond maxX
		const adjustedY = y + 7;

		// Background properties
		const backgroundProps = {
			x: adjustedX - 10,
			y: adjustedY - 25,
			width: maxBackgroundWidth - 60,
			height: 35,
			fill: "white",
			opacity: 0.4,
			cornerRadius: 15,
			id: "signatureBackground",
		};

		// Create and add background rectangle before the text
		const background = new Konva.Rect(backgroundProps);
		layer.add(background);

		// Update signature position
		const signature = new Konva.Text({
			...signatureProps,
			x: adjustedX,
			y: adjustedY - 20,
			id: "signatureDownload",
		});

		layer.add(signature);
		layer.draw();
	};

	const removeSignatureAfterDownload = () => {
		const layer = stageRef.current.getLayers()[stageRef.current.getLayers().length - 1];
		const signature = layer.findOne("#signatureDownload");
		const background = layer.findOne("#signatureBackground"); // Find the background
		if (signature) {
			signature.destroy();
		}
		if (background) {
			background.destroy(); // Remove the background as well
		}
		layer.draw();
	};
	const handleSelect = (id) => {
		console.log("Selecting ID:", id); // Log incoming id
		setSelectedId(id);
		console.log("Selected ID set to:", selectedId); // This will still show the old value due to the async nature of setState
	};
	useEffect(() => {
		console.log("Current selectedId:", selectedId);
	}, [selectedId]);

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

	const addElementToCanvas = (url, x, y, type) => {
		const img = new Image();
		img.onload = () => {
			let size;

			// Calculate the size based on the type and original image dimensions
			if (type === "gleek") {
				size = { width: 150, height: 75 };
				type = "gleek";
			} else if (type === "tongue") {
				size = { width: 75, height: 75 };
				type = "tongue";
            } else if (type === "asset") {
				size = { width: 300, height: 300 };
				type = "asset";
			} else if (type === "meme") {
				type = "meme";
                resetCanvas();
				// Use the original dimensions but constrain if larger than maximum size
				const maxMemeWidth = 600; // Maximum width for memes
				const maxMemeHeight = 600; // Maximum height for memes
				const aspectRatio = img.width / img.height;
				let memeWidth = img.width;
				let memeHeight = img.height;

				// Scale down if necessary to fit within max dimensions
				if (memeWidth > maxMemeWidth) {
					memeWidth = maxMemeWidth;
					memeHeight = memeWidth / aspectRatio;
				}
				if (memeHeight > maxMemeHeight) {
					memeHeight = maxMemeHeight;
					memeWidth = memeHeight * aspectRatio;
				}

				size = { width: memeWidth, height: memeHeight };
			} else {
				size = { width: 75, height: 75 }; // Default size
			}

			// Create and add the element to the canvas
			const newItem = {
				src: url,
				x: x,
				y: y,
				width: size.width,
				height: size.height,
				id: Math.random().toString(36).substr(2, 9), // Unique ID for each element
				type: type,
			};

			setElements((prevElements) => [...prevElements, newItem]);
		};
		img.src = url; // This triggers the img.onload
	};

	const handleDragEnd = (e, id) => {
		// Find the index of the element being transformed
		const index = elements.findIndex((el) => el.id === id);
		if (index === -1) return; // Element not found

		// Capture the new position and rotation from the event target
		const node = e.target;
		const newX = node.x();
		const newY = node.y();
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();
		const newRotation = node.rotation();
		const newWidth = node.width() * Math.abs(scaleX); // Use Math.abs to ensure positive value
		const newHeight = node.height() * Math.abs(scaleY);
		const newFlipX = node.scaleX() < 0;
		const newFlipY = node.scaleY() < 0;

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
					//   offsetX: newFlipX ? el.width / 2 : 0,
					//   offsetY: newFlipY ? el.height / 2 : 0,
				};
			}
			return el;
		});

		// Update the state with the new elements array
		setElements(newElements);
	};

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
            event.target.value = '';
        }
    };

    const handleAssetUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Store the original file name in the state
            setOriginalFileName(file.name);
    
            const reader = new FileReader();
            reader.onloadend = () => {
                const src = reader.result;
                addAssetToCanvas(src);
    
                // Reset the file input after processing the file
                event.target.value = ''; // Clear the file input
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
			const maxImageWidth = 600; // Maximum width for memes
			const maxImageHeight = 600; 
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
            setElements([{ // This replaces the previous array entirely
                src,
                x: 0,
                y: 0,
                width: size.width, // Use adjusted canvas width
                height: size.height, // Use adjusted canvas height
                id: 'background', // Assign a fixed ID for the background for easy identification
				draggable: false,
            }]);
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
			const scale = Math.min(scaleX, scaleY, 1); // Ensure the scale is not more than 1

			// Calculate the scaled width and height
			const scaledWidth = img.width * scale;
			const scaledHeight = img.height * scale;

			// Add the image to the canvas with the scaled dimensions
			setElements((prevElements) => [
				...prevElements,
				{
					src,
					x: 0, // You might want to change these coordinates
					y: 0, // to center the asset or place it differently
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
					// Assuming images have a src property
					if (element.src) {
						// Increase size by 10% for images
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
					// Assuming texts have a fontSize property
					if (textElement.fontSize) {
						// Increase font size by 2 for texts
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

	const TransformerComponent = ({ selectedId }) => {
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
							transformerRef.current.enabledAnchors([]);
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
		}, [selectedId]); // Dependency array includes selectedId to react to changes
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
	};

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
        let deleted = false; // Flag to check if deletion happened
    
        // Check if the selected ID belongs to an image element and delete it
        const isImageElement = elements.some((element) => element.id === selectedId);
        if (isImageElement) {
            const newElements = elements.filter((element) => element.id !== selectedId);
            setElements(newElements);
            deleted = true; // Update flag to indicate deletion
        } else {
            // Assume if it's not an image element, it must be a text element
            const newTextElements = textElements.filter((textElement) => textElement.id !== selectedId);
            setTextElements(newTextElements);
            deleted = newTextElements.length !== textElements.length; // Update flag based on whether deletion occurred
        }
    
        // After deletion, reset the selected ID
        setSelectedId(null);
    
        // If an element was deleted, check if we need to reset canvas size
        if (deleted && elements.length === 0 && textElements.length === 0) {
            // This means there are no more elements on the canvas, reset to default size
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
					const newStroke = newColor === "white" ? "black" : "transparent";
					const shadowColor = newColor === "white" ? "black" : "transparent";
					const shadowBlur = newColor === "white" ? 5 : 0;
					const shadowOpacity = newColor === "white" ? 0.5 : 0;
					return {
						...textElement,
						color: newColor,
						stroke: newStroke,
						shadowColor: shadowColor,
						shadowBlur: shadowBlur,
						shadowOpacity: shadowOpacity,
					};
				}
				return textElement;
			})
		);
	};

	const handleDownloadMergedImage = () => {
		// Ensure the transformer is not shown in the downloaded image
		setShowTransformer(false);

		setTimeout(() => {
			const stage = stageRef.current.getStage();
			const originalSize = {
				width: stage.width(),
				height: stage.height(),
			}; // Store original size

			// Calculate bounding box of all elements
			let minX = Infinity,
				minY = Infinity,
				maxX = 0,
				maxY = 0;
			elements.forEach((el) => {
				minX = Math.min(minX, el.x);
				minY = Math.min(minY, el.y);
				maxX = Math.max(maxX, el.x + el.width);
				maxY = Math.max(maxY, el.y + el.height);
			});

			// Calculate the dimensions of the content, including padding for the signature
			const contentWidth = maxX - minX;
			const contentHeight = maxY - minY;
			// Temporarily adjust the stage size to fit the content
			stage.width(contentWidth);
			stage.height(contentHeight);

			// Temporarily adjust the stage position to start at the top left corner of the bounding box
			stage.position({ x: -minX, y: -minY });
			stage.batchDraw();

			// Temporarily add the signature directly to the stage for the download
			renderSignatureForDownload(true, contentWidth - 100 - 10, contentHeight - 20 - 5); // Adjust signature position based on new content size

			const dataURL = stage.toDataURL({ pixelRatio: 2 });

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
				removeSignatureAfterDownload(); // Remove the temporary signature
				stage.width(originalSize.width); // Restore original width
				stage.height(originalSize.height); // Restore original height
				stage.position({ x: 0, y: 0 }); // Reset position
				stage.batchDraw();
				setShowTransformer(true); // Optionally, re-enable the transformer
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
		gleekImages.map((image, index) => (
			<div key={`gleek-${index}`} style={{ textAlign: "center", margin: "10px" }}>
				<button onClick={() => addElementToCanvas(image.url, 150, 75, "gleek")}>
					<img
						src={image.url}
						alt={image.url.split("/").pop().split(".")[0]}
						style={{ width: "150px", height: "75px" }} // Size for gleekImages
					/>
				</button>
				<div>{image.url.split("/").pop().split(".")[0]}</div>
			</div>
		));

	// Function to render Tongue Modal content
	const renderTongueModalContent = () =>
		mouthImages.map((image, index) => (
			<div key={`tongue-${index}`} style={{ textAlign: "center", margin: "10px" }}>
				<button onClick={() => addElementToCanvas(image.url, 75, 75, "tongue")}>
					<img
						src={image.url}
						alt={image.url.split("/").pop().split(".")[0]}
						style={{ width: "75px", height: "75px" }} // Size for mouthImages
					/>
				</button>
				<div>{image.url.split("/").pop().split(".")[0]}</div>
			</div>
		));
        const renderAssetModalContent = () =>
        assetImages.map((image, index) => (
            <div key={`asset-${index}`} style={{ textAlign: "center", margin: "10px" }}>
                <button onClick={() => addElementToCanvas(image.url, 150, 150, "asset")}>
                    <img
                        src={image.url}
                        alt={image.name} // Use the name property for alt text
                        style={{ width: "150px", height: "150px" }} // Size for images
                    />
                </button>
                <div>{image.name}</div>
            </div>
        ));
    
	const renderMemeModalContent = () =>
		memeTemplates.map((image, index) => (
			<div key={`meme-${index}`} style={{ textAlign: "center", margin: "10px" }}>
				<button onClick={() => addElementToCanvas(image.url, 0, 0, "meme")}>
					<img src={image.url} alt="" style={{ width: "150px", height: "150px" }} />
				</button>
			</div>
		));
	useEffect(() => {
		console.log("Modal state:", isModalOpen);
	}, [isModalOpen]);

	return (
		<div className="gleekify-container">
			<div
				style={{
					fontSize: "25px",
					color: "#6eb6c8",
					textAlign: "center",
					marginBottom: "10px",
					paddingLeft: "150px",
				}}
			>
				For best results, use at least 512x512
			</div>
			<div className="canvas-toolbar-container">
				<div className="button-toolbar-gleekify">
					<div className="primary-buttons">
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
                            title="This will resize the useable canvas to the images dimensions"
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
					<button className="button-gleekify" onClick={toggleAdditionalButtons}>
						{showAdditionalButtons ? "↑ hide tools" : "↓ show tools"}
					</button>

					{showAdditionalButtons && (
						<div className="additional-buttons group-spacing">
                            <button className="button-gleekify" onClick={addTextElement}>
                                add text
                            </button>
							<button className="button-gleekify" onClick={toggleTextColor}>
								black/white text
							</button>
							<button className="button-gleekify" onClick={moveElementUp}>
								layer down
							</button>
							<button className="button-gleekify" onClick={moveElementDown}>
								layer up
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

				{/* Canvas */}
				<div ref={drop} className="canvas-frame-gleekify">
					<Stage
						width={600}
						height={600}
						ref={stageRef}
						onMouseDown={(e) => {
							// Check if the click is on the stage or the background image
							if (e.target === e.target.getStage() || e.target.name() === "background") {
								setSelectedId(null);
							}
						}}
					>
						<Layer>
							{backgroundImage && (
								<KonvaImage image={backgroundImage} name="background" width={600} height={600} draggable={false} />
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
									draggable={element.id !== 'background' && element.type !== 'meme'}
									flipX={element.flipX || false}
									flipY={element.flipY || false}
									scaleX={element.flipX ? -1 : 1} // Apply flipX state
									scaleY={element.flipY ? -1 : 1} // Apply flipY state
								/>
							))}

							{textElements.map((textElement, i) => (
								<Text
									key={i}
									{...textElement} // Spread operator to pass all text element properties
									fontFamily="Impact"
									fill={textElement.color}
									fontSize={textElement.fontSize}
									// fontStyle="bold"
									stroke={textElement.stroke}
									strokeWidth={textElement.stroke === "transparent" ? 0 : 2}
									shadowColor={textElement.shadowColor}
									shadowBlur={textElement.shadowBlur}
									shadowOpacity={textElement.shadowOpacity}
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
	);
};

export default Gleekify;
