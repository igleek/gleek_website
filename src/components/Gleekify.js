import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer, Text } from "react-konva";
import Konva from "konva";
import { useDrag, useDrop } from "react-dnd";
import mergeImages from "merge-images";

const IMAGE_WIDTH = "100px"; // Set the width
const IMAGE_HEIGHT = "100px";
const IMAGE_TARGET_WIDTH = 100; // Target width for images on canvas
const IMAGE_TARGET_HEIGHT = 100;

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
	const [isMemeModalOpen, setIsMemeModalOpen] = useState(false);
	const [textElements, setTextElements] = useState([]);
	const [originalFileName, setOriginalFileName] = useState("");
	const [showTransformer, setShowTransformer] = useState(true);
	const [showAdditionalButtons, setShowAdditionalButtons] = useState(false); // Start with buttons visible
	const [editingState, setEditingState] = useState({
		visible: false,
		x: 0,
		y: 0,
		value: '',
		id: null
	});
	const editingInput = editingState.visible ? (
		<input
			style={{
				position: 'absolute',
				top: `${editingState.y}px`,
				left: `${editingState.x}px`,
				zIndex: 100,
			}}
			autoFocus
			value={editingState.value}
			onChange={(e) => setEditingState({ ...editingState, value: e.target.value })}
			onBlur={() => saveText()}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					saveText();
				}
			}}
		/>
	) : null;
	
	// Example static images
	const gleekImages = [
		{ url: "./images/Gleekify/acid.png" },
		{ url: "./images/Gleekify/fire.png" },
		{ url: "./images/Gleekify/gleek 1.png" },
		{ url: "./images/Gleekify/gleek 2.png" },
		{ url: "./images/Gleekify/gleek 3.png" },
		{ url: "./images/Gleekify/gleek 4.png" },
		{ url: "./images/Gleekify/rainbow.png" },
		{ url: "./images/Gleekify/plague gleek.png" },
		{ url: "./images/Gleekify/doodles gleek.png" },
		{ url: "./images/Gleekify/goobers gleek.png" },

	];
	const mouthImages = [
		{ url: "./images/Gleekify/sappy seals.png" },
		{ url: "./images/Gleekify/pudgy penguins.png" },
		{ url: "./images/Gleekify/plague.png" },
		{ url: "./images/Gleekify/degods.png" },
		{ url: "./images/Gleekify/milady.png" },
		{ url: "./images/Gleekify/goobers.png" },
		{ url: "./images/Gleekify/yoots.png" },
		{ url: "./images/Gleekify/degods.png" },
		{ url: "./images/Gleekify/bitcoin puppets.png" },
		{ url: "./images/Gleekify/anime.png" },
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
		{ url: "./images/Gleekify/MemeTemplates/2xytmc.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/3kwur5.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/3nx72a.png" },
		{ url: "./images/Gleekify/MemeTemplates/3pdf2w.png" },
		{ url: "./images/Gleekify/MemeTemplates/3po4m7.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/3vfrmx.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/4fhsie.png" },
		{ url: "./images/Gleekify/MemeTemplates/4pn1an.png" },
		{ url: "./images/Gleekify/MemeTemplates/5c7lwq.png" },
		{ url: "./images/Gleekify/MemeTemplates/8fhy2l.png" },
		{ url: "./images/Gleekify/MemeTemplates/19vcz0.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/46hhvr.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/54hjww.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/58eyvu.png" },
		{ url: "./images/Gleekify/MemeTemplates/64sz4u.png" },
		{ url: "./images/Gleekify/MemeTemplates/72epa9.png" },
		{ url: "./images/Gleekify/MemeTemplates/145qvv.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/434i5j.png" },
		{ url: "./images/Gleekify/MemeTemplates/Always-Has-Been.png" },
		{ url: "./images/Gleekify/MemeTemplates/American-Chopper-Argument.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Ancient-Aliens.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Batman-Slapping-Robin.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Bike-Fall.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Blank-Nut-Button.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Boardroom-Meeting-Suggestion.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Buff-Doge-vs-Cheems.png" },
		{ url: "./images/Gleekify/MemeTemplates/Change-My-Mind.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Chuck-Norris.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Clown-Applying-Makeup.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Disaster-Girl.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Distracted-Boyfriend.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/drake.jpeg" },
		{ url: "./images/Gleekify/MemeTemplates/Epic-Handshake.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Evil-Kermit.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Expanding-Brain.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Futurama-Fry.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Grandma-Finds-The-Internet.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Grus-Plan.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Hide-the-Pain-Harold.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/I-Bet-Hes-Thinking-About-Other-Women.jpg" },
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
		{ url: "./images/Gleekify/MemeTemplates/Surprised-Pikachu.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/The-Rock-Driving.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/The-Scroll-Of-Truth.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Same-Picture.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Third-World-Skeptical-Kid.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/This-Is-Fine.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/This-Is-Where-Id-Put-My-Trophy-If-I-Had-One.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Tuxedo-Winnie-The-Pooh.png" },
		{ url: "./images/Gleekify/MemeTemplates/Two-Buttons.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/u0pf0.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/UNO-Draw-25-Cards.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Waiting-Skeleton.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Who-Killed-Hannibal.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Woman-Yelling-At-Cat.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/X-X-Everywhere.jpg" },
		{ url: "./images/Gleekify/MemeTemplates/Yall-Got-Any-More-Of-That.jpg" },
	];


	const openGleekModal = () => {
		setIsGleekModalOpen(!isGleekModalOpen); // Toggle the current state
		if (isGleekModalOpen === false) { // If we're opening the Gleek modal, close others
			setIsTongueModalOpen(false);
			setIsMemeModalOpen(false);
		}
	};
	
	const openTongueModal = () => {
		setIsTongueModalOpen(!isTongueModalOpen); // Toggle the current state
		if (isTongueModalOpen === false) { // If we're opening the Tongue modal, close others
			setIsGleekModalOpen(false);
			setIsMemeModalOpen(false);
		}
	};
	
	// Add a new function for the Meme Templates button
	const openMemeModal = () => {
		setIsMemeModalOpen(!isMemeModalOpen); // Toggle the current state
		if (isMemeModalOpen === false) { // If we're opening the Meme modal, close others
			setIsGleekModalOpen(false);
			setIsTongueModalOpen(false);
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
			};
			setTextElements(textElements.concat(newTextElement));
		};
  


  const handleTextEdit = (id) => {
	const textEl = textElements.find(te => te.id === id);
	if (!textEl) return;
  
	const textPosition = stageRef.current.findOne(`#${id}`).getAbsolutePosition();
	const stageBox = stageRef.current.container().getBoundingClientRect();
	const areaPosition = {
	  x: stageBox.left + textPosition.x,
	  y: stageBox.top + textPosition.y,
	};
  
	const textarea = document.createElement('textarea');
	document.body.appendChild(textarea);
	textarea.value = textEl.text;
	textarea.style.position = 'absolute';
	textarea.style.top = areaPosition.y + 'px';
	textarea.style.left = areaPosition.x + 'px';
	textarea.style.width = textEl.width + 'px';
	textarea.focus();
  
	let removeTimeout;
  
	const removeTextarea = () => {
	  const newText = textarea.value.trim();
	  const updatedTextElements = textElements.map(te => {
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
  
	textarea.addEventListener('keydown', function (e) {
	  clearTimeout(removeTimeout);
	  if (e.key === 'Enter') {
		removeTextarea();
		e.preventDefault(); // Prevent the default action to stop from triggering blur event immediately
	  }
	});
  
	textarea.addEventListener('blur', function () {
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
					  position: 'absolute',
					  top: `${editingState.y}px`,
					  left: `${editingState.x}px`,
					  zIndex: 100,
					}}
					autoFocus
					value={editingState.value}
					onChange={(e) => setEditingState({ ...editingState, value: e.target.value })}
					onBlur={() => saveText()}
					onKeyDown={(e) => {
					  if (e.key === 'Enter') {
						saveText();
					  }
					}}
				  />
				)
			  }
			  
			  // Save text changes and hide the input field
			  const saveText = () => {
				const updatedTextElements = textElements.map(el => {
				  if (el.id === editingState.id) {
					return { ...el, text: editingState.value };
				  }
				  return el;
				});
			  
				setTextElements(updatedTextElements);
				setEditingState({ visible: false, x: 0, y: 0, value: '', id: null }); // Reset editing state
			  };
			  
			  
	
	// Draggable Image Item for Side Menu
	const DraggableImageMenuItem = ({ image }) => {
		const [{ isDragging }, drag] = useDrag(() => ({
			type: "image",
			item: { url: image.url },
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}));

		return (
			<div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
				{/* Apply the width and height in the style attribute */}
				<img
					src={image.url}
					alt=""
					style={{
						width: IMAGE_WIDTH,
						height: IMAGE_HEIGHT,
						cursor: "pointer",
					}}
				/>
			</div>
		);
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
			draggable
			onMouseDown={(e) => {
			  onSelect(id);
			  e.cancelBubble = true;
			}}
			onDragEnd={(e) => handleDragEnd(e, id)}
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

	
	// const handleTransformEnd = (e) => {
	// 	const node = e.target;
	// 	const id = node.id();
	// 	const scaleX = node.scaleX();
	// 	const scaleY = node.scaleY();
	// 	const rotation = node.rotation();
	// 	// Update the size and position based on the node's transformation state
	// 	const updatedElements = elements.map((el) => {
	// 	  if (el.id === id) {
	// 		return {
	// 		  ...el,
	// 		  x: node.x(),
	// 		  y: node.y(),
	// 		  width: node.width() * Math.abs(scaleX), // Use Math.abs to handle negative scaling
	// 		  height: node.height() * Math.abs(scaleY),
	// 		  rotation: rotation,
	// 		  scaleX: scaleX,
	// 		  scaleY: scaleY,
	// 		};
	// 	  }
	// 	  return el;
	// 	});
	// 	setElements(updatedElements);
	//   };
	  
	
	const signatureText = "created with gleekify 💦"; // Customize this message
	const signatureProps = {
	  text: signatureText,
	  x: 420, // Adjust based on canvas size
	  y: 575, // Adjust based on canvas size
	  fontSize: 20,
	  fontFamily: 'chimi',
	  fill: 'black', // Signature color
	//   opacity: 0.8,
	};
	
	const renderSignatureForDownload = (forDownload = false) => {
		const layer = stageRef.current.getLayers()[stageRef.current.getLayers().length - 1]; // Get the topmost layer
		
		// Create signature text
		const signature = new Konva.Text({
		  ...signatureProps,
		  id: 'signatureDownload', // Unique ID to easily find and remove later
		});
	  
		// Add to the layer and draw
		layer.add(signature);
		layer.draw();
	  };
	
	  const removeSignatureAfterDownload = () => {
		const layer = stageRef.current.getLayers()[stageRef.current.getLayers().length - 1];
		const signature = layer.findOne('#signatureDownload');
		if (signature) {
		  signature.destroy();
		  layer.draw();
		}
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

	const addElementToCanvasAsync = async (url, x, y) => {
		const newItem = {
			src: url,
			x: x,
			y: y,
			width: 100, // Set width to 100 pixels as previously defined
			height: 100, // Set height to 100 pixels as previously defined
			id: Math.random().toString(36).substr(2, 9), // Unique ID for each element
		};

		// Correctly append the new item to the existing elements
		setElements((prevElements) => [...prevElements, newItem]);

		// Check if there are multiple elements on the canvas to merge
		if (elements.length > 1) {
			// Prepare an array of image URLs for merging
			const imageUrls = elements.map((element) => element.src);

			// Merge images
			try {
				const mergedImageSrc = await mergeImages(imageUrls, {
					width: IMAGE_TARGET_WIDTH,
					height: IMAGE_TARGET_HEIGHT,
				});

				// Set the merged image as the background
				setBackgroundSrc(mergedImageSrc);
			} catch (error) {
				console.error("Error merging images:", error);
			}
		}
	};

	const addElementToCanvas = (url, x, y, type) => {
		let size;

		if (type === 'gleek') {
			size = { width: 150, height: 75 };
		} else if (type === 'tongue') {
			size = { width: 75, height: 75 };
		} else if (type === 'meme') {
			size = { width: 599, height: 599 };
		} else {
			size = { width: 75, height: 75 }; // Default size if none of the conditions are met
		}
		
		const newItem = {
			src: url,
			x: x,
			y: y,
			width: size.width,
			height: size.height,
			id: Math.random().toString(36).substr(2, 9), // Unique ID for each element
		};
	
		setElements((prevElements) => [...prevElements, newItem]);
	};
	

	const handleDragEnd = (e, id) => {
		// Find the index of the element being transformed
		const index = elements.findIndex(el => el.id === id);
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
	  

	const handleUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			// Store the original file name in the state
			setOriginalFileName(file.name);
	
			const reader = new FileReader();
			reader.onloadend = () => {
				const src = reader.result;
				addImageToCanvas(src);
			};
			reader.readAsDataURL(file);
		}
	};

const addImageToCanvas = (src) => {
    const img = new Image();
    img.onload = () => {
        // Canvas size
        const stageWidth = 600;
        const stageHeight = 600;

        // Original image dimensions
        let imgWidth = img.width;
        let imgHeight = img.height;

        // Check if the image is larger than the canvas and scale down if necessary
        if (imgWidth > stageWidth || imgHeight > stageHeight) {
            const scaleX = stageWidth / imgWidth;
            const scaleY = stageHeight / imgHeight;
            const scale = Math.min(scaleX, scaleY); // Choose the smaller scale to ensure the image fits within the canvas

            imgWidth *= scale; // Scale width
            imgHeight *= scale; // Scale height
        }

        // Calculate center position for the scaled image
        const x = (stageWidth - imgWidth) / 2;
        const y = (stageHeight - imgHeight) / 2;

        // Add the scaled image to elements with calculated position
        setElements(prevElements => [
            ...prevElements,
            {
                src, // Image source
                x: x, // Centered X position
                y: y, // Centered Y position
                width: imgWidth, // Scaled width
                height: imgHeight, // Scaled height
                id: Math.random().toString(36).substr(2, 9), // Unique ID
            },
        ]);
    };
    img.src = src;
};


// Function to increase the font size of the selected text element
const increaseFontSize = () => {
    if (!selectedId) return;

    setTextElements(textElements.map(textElement => {
        if (textElement.id === selectedId) {
            return { ...textElement, fontSize: textElement.fontSize + 2 }; // Increase font size by 2
        }
        return textElement;
    }));
};

// Function to decrease the font size of the selected text element
const decreaseFontSize = () => {
    if (!selectedId) return;

    setTextElements(textElements.map(textElement => {
        if (textElement.id === selectedId) {
            return { ...textElement, fontSize: Math.max(textElement.fontSize - 2, 1) }; // Decrease font size by 2, minimum of 1
        }
        return textElement;
    }));
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
						if (selectedNode.className === 'Text') {
							// Disable anchors for Text nodes
							transformerRef.current.enabledAnchors([]);
						} else {
							// Enable all anchors for non-Text nodes (e.g., Image)
							transformerRef.current.enabledAnchors([
								"top-left", "top-right", "bottom-left", "bottom-right",
								"top-center", "bottom-center", "middle-left", "middle-right"
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
			const selectedIndex = elements.findIndex(
				(element) => element.id === selectedId
			);
			if (selectedIndex > 0) {
				const updatedElements = moveElementInArray(
					elements,
					selectedIndex,
					selectedIndex - 1
				);
				setElements(updatedElements);
			}
		}
	};

	const moveElementDown = () => {
		if (selectedId) {
			const selectedIndex = elements.findIndex(
				(element) => element.id === selectedId
			);
			if (selectedIndex < elements.length - 1) {
				const updatedElements = moveElementInArray(
					elements,
					selectedIndex,
					selectedIndex + 1
				);
				setElements(updatedElements);
			}
		}
	};

	const deleteSelectedImage = () => {
		// Check if the selected ID belongs to an image element and delete it
		const isImageElement = elements.some(element => element.id === selectedId);
		if (isImageElement) {
			setElements(elements.filter(element => element.id !== selectedId));
		} else {
			// Assume if it's not an image element, it must be a text element
			setTextElements(textElements.filter(textElement => textElement.id !== selectedId));
		}
	
		// After deletion, reset the selected ID
		setSelectedId(null);
	};
	

	// const flipImageHorizontal = (id) => {
	// 	const updatedElements = elements.map((el) => {
	// 		if (el.id === id) {
	// 			return { ...el, flipHorizontal: !el.flipHorizontal };
	// 		}
	// 		return el;
	// 	});
	// 	setElements(updatedElements);
	// };

  // Function to toggle text color between black and white
  const toggleTextColor = () => {
	setTextElements(textElements.map(textElement => {
	  if (textElement.id === selectedId) {
		// Determine the new color based on the current color
		const newColor = textElement.color === 'black' ? 'white' : 'black';
		return { ...textElement, color: newColor };
	  }
	  return textElement;
	}));
  };
	  
  const handleDownloadMergedImage = () => {
	// Ensure the transformer is not shown in the downloaded image
	setShowTransformer(false);
	
	// Wait for the state update to hide the transformer, then proceed
	setTimeout(() => {
	  // Temporarily add the signature directly to the stage for the download
	  renderSignatureForDownload(true); // Pass a flag indicating this is for download
  
	  const stage = stageRef.current.getStage();
	  const dataURL = stage.toDataURL({
		pixelRatio: 2, // Ensures high resolution
	  });
  
	  // Creating a link to trigger the download
	  const link = document.createElement('a');
	  link.download = originalFileName ? `gleekify_${originalFileName}` : "gleekify_merged_image.png";
	  link.href = dataURL;
	  document.body.appendChild(link);
	  link.click();
	  document.body.removeChild(link);
  
	  // Remove the signature after the download
	  removeSignatureAfterDownload();
  
	  // Optionally, re-enable the transformer
	  setShowTransformer(true);
	}, 100); // This delay ensures any state updates to hide UI elements like transformers have been rendered
  };
  
	
	

	const Modal = ({ isOpen, close, children }) => {
		if (!isOpen) return null;
		const imageBackgroundStyle = {
			background: 'black', // Example: white background with 50% opacity
		};
		return (
			<div className="modal-overlay" onClick={close}>
				<div className="modal-content" onClick={(e) => e.stopPropagation()}>
					{children}
				</div>
			</div>
		);
	};

	    // Function to render Gleek Modal content
		const renderGleekModalContent = () => (
			gleekImages.map((image, index) => (
				<div key={`gleek-${index}`} style={{ textAlign: 'center', margin: '10px' }}>
					<button onClick={() => addElementToCanvas(image.url, 150, 75, 'gleek')}>
						<img
							src={image.url}
							alt={image.url.split('/').pop().split('.')[0]}
							style={{ width: '150px', height: '75px' }} // Size for gleekImages
						/>
					</button>
					<div>{image.url.split('/').pop().split('.')[0]}</div>
				</div>
			))
		);

		    // Function to render Tongue Modal content
			const renderTongueModalContent = () => (
				mouthImages.map((image, index) => (
					<div key={`tongue-${index}`} style={{ textAlign: 'center', margin: '10px' }}>
						<button onClick={() => addElementToCanvas(image.url, 75, 75, 'tongue')}>
							<img
								src={image.url}
								alt={image.url.split('/').pop().split('.')[0]}
								style={{ width: '75px', height: '75px' }} // Size for mouthImages
							/>
						</button>
						<div>{image.url.split('/').pop().split('.')[0]}</div>
					</div>
				))
			);
			const renderMemeModalContent = () => (
				memeTemplates.map((image, index) => (
					<div key={`meme-${index}`} style={{ textAlign: 'center', margin: '10px' }}>
						<button onClick={() => addElementToCanvas(image.url, 0, 0, 'meme')}>
							<img src={image.url} alt="" style={{ width: '150px', height: '150px' }} />
						</button>
					</div>
				))
			);
	useEffect(() => {
		console.log("Modal state:", isModalOpen);
	}, [isModalOpen]);

	  
	return (
		<div className="gleekify-container">
		<div className="canvas-toolbar-container">
			<div className="button-toolbar-gleekify">
			<div className="primary-buttons">
				<input id="fileInput" type="file" onChange={handleUpload} accept="image/*" style={{ display: 'none' }} />
				<button className="button-gleekify" onClick={() => document.getElementById('fileInput').click()}>
					upload
				</button>
				<button className="button-gleekify" onClick={openGleekModal}>
  {isGleekModalOpen ? "💦 gleek" : "gleek"}
</button>
<button className="button-gleekify" onClick={openTongueModal}>
  {isTongueModalOpen ? "💦 mouth" : "mouth"}
</button>
<button className="button-gleekify" onClick={openMemeModal}>
  {isMemeModalOpen ? "💦 memes" : "memes"}
</button>
				<button className="button-gleekify" onClick={addTextElement}>
                add text
            </button>
			<button className="button-gleekify" onClick={handleDownloadMergedImage}>
					download
				</button>
				</div>
				<button className="button-gleekify" onClick={toggleAdditionalButtons}>
    {showAdditionalButtons ? '↑ hide tools' : '↓ show tools'}
</button>

				{showAdditionalButtons && (
				<div className="additional-buttons group-spacing">
					<button className="button-gleekify" onClick={toggleTextColor}>black/white text</button>
					<button className="button-gleekify" onClick={increaseFontSize}>+ text size</button>
    				<button className="button-gleekify" onClick={decreaseFontSize}>- text size</button>
					<button className="button-gleekify" onClick={moveElementUp}>layer down</button>
					<button className="button-gleekify" onClick={moveElementDown}>layer up</button>
					<button className="button-gleekify" onClick={() => selectedId && flipElementHorizontal(selectedId)}>flip horizontal</button>
   					<button className="button-gleekify" onClick={() => selectedId && flipElementVertical(selectedId)}>flip vertical</button>
					<button className="button-gleekify" onClick={deleteSelectedImage}>
					<img src='./images/Gleekify/trash.png' alt="Backward" style={{ width: '25px', height: '25px'}}/>
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
							if (
								e.target === e.target.getStage() ||
								e.target.name() === "background"
							) {
								setSelectedId(null);
							}
						}}
					>
<Layer>
  {backgroundImage && (
    <KonvaImage
      image={backgroundImage}
      name="background"
      width={600}
      height={600}
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
      flipX={element.flipX || false}
      flipY={element.flipY || false}
	  scaleX={element.flipX ? -1 : 1}
	  scaleY={element.flipY ? -1 : 1}
    />
  ))}

  {textElements.map((textElement, i) => (
    <Text
      key={i}
      {...textElement} // Spread operator to pass all text element properties
	  fontFamily="Impact"
	  fill={textElement.color}
	  fontSize={textElement.fontSize}
	  fontStyle="bold"
	  stroke='black'
	  strokeWidth={2}
	  shadowColor={textElement.shadowColor || "black"} // Default shadow color to grey if not specified
	  shadowBlur={textElement.shadowBlur || 1} // Default shadow blur to 10 if not specified
	  shadowOffsetX={textElement.shadowOffsetX || 1} // Default shadow offsetX to 5 if not specified
	  shadowOffsetY={textElement.shadowOffsetY || 1} // Default shadow offsetY to 5 if not specified
	  shadowOpacity={textElement.shadowOpacity || 0.8}
	  onClick={() => handleSelect(textElement.id)}
      onDblClick={() => handleTextEdit(textElement.id)}
      onDragEnd={(e) => {
        const updatedTextElements = textElements.map(el => {
          if (el.id === textElement.id) {
            return { ...el, x: e.target.x(), y: e.target.y() };
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
        position: 'absolute',
        top: `${editingState.y}px`,
        left: `${editingState.x}px`,
        zIndex: 100,
      }}
      autoFocus
      value={editingState.value}
      onChange={(e) => setEditingState({ ...editingState, value: e.target.value })}
      onBlur={() => saveText()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          saveText();
        }
      }}
    />
  )}

  {selectedId && (
    <TransformerComponent
      selectedId={selectedId}
      stageRef={stageRef}
    />
  )}
</Layer>

					</Stage>
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
