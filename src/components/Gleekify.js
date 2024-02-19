import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer, Text } from "react-konva";
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
	const [showAdditionalButtons, setShowAdditionalButtons] = useState(true); // Start with buttons visible

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
				fontSize: 20,
				id: Math.random().toString(36).substr(2, 9), // Unique ID for each text element
				draggable: true,
			};
			setTextElements(textElements.concat(newTextElement));
		};

		    // Render Text Elements alongside Image Elements
// Render Text Elements alongside Image Elements
const renderTextElements = () => {
	return textElements.map((textElement, i) => (
	  <Text
		key={i}
		id={textElement.id}
		text={textElement.text}
		x={textElement.x}
		y={textElement.y}
		fontSize={textElement.fontSize}
		draggable
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
	));
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
		const selectionProps = isSelected ? {
			shadowColor: "white",
			shadowBlur: 10,
			shadowOffset: { x: 0, y: 0 },
			shadowOpacity: 0.6,
		} : {};
	
		return image ? (
			<KonvaImage
				image={image}
				x={x}
				y={y}
				width={width}
				height={height}
				rotation={rotation}
				scaleX={flipX ? -1 : 1}
				scaleY={flipY ? -1 : 1}
				draggable
				onMouseDown={(e) => {
					onSelect(id);
					e.cancelBubble = true;
				}}
				onDragEnd={onDragEnd}
				{...selectionProps}
				onTransformEnd={(e) => {
					// Pass node to handleTransformEnd to update state
					handleTransformEnd(id, e.target);
				}}
				id={id}
			/>
		) : null;
	};
	
	
	const toggleFlipX = (id) => {
		setElements(elements.map(el => el.id === id ? { ...el, flipX: !el.flipX } : el));
	};
	
	const toggleFlipY = (id) => {
		setElements(elements.map(el => el.id === id ? { ...el, flipY: !el.flipY } : el));
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

	
	const handleTransformEnd = (id, node) => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const width = node.width() * scaleX;
    const height = node.height() * scaleY;
    const x = node.x();
    const y = node.y();
    const rotation = node.rotation();

    if (node.className === 'Text') {
        // Adjust fontSize based on the scale factor. Assuming uniform scaling for simplicity.
        const fontSize = Math.max(node.fontSize() * scaleX, 5); // Ensure font size doesn't become too small.
        const updatedTextElements = textElements.map(textElement => {
            if (textElement.id === id) {
                return { ...textElement,                     fontSize,
                    scaleX: 1, // Reset scaleX to 1 after transformation
                    scaleY: 1, fontSize, scaleX: 1, scaleY: 1,                     x: node.x(),
                    y: node.y(), }; // Reset scale to 1
            }
            return textElement;
        });
        setTextElements(updatedTextElements);
    } else {
        // Handle other elements (e.g., images) normally
        const newElements = elements.map(element => {
            if (element.id === id) {
                return { ...element, x, y, width, height, rotation, scaleX: 1, scaleY: 1 }; // Reset scale to 1
            }
            return element;
        });
        setElements(newElements);
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

	// Example static images
	const gleekImages = [
		{ url: "./images/Gleekify/acid.png" },
		{ url: "./images/Gleekify/fire.png" },
		{ url: "./images/Gleekify/gleek_1.png" },
		{ url: "./images/Gleekify/gleek_2.png" },
		{ url: "./images/Gleekify/gleek_3.png" },
		{ url: "./images/Gleekify/rainbow.png" },
	];
	const mouthImages = [
		{ url: "./images/Gleekify/tongue_1.png" },
		{ url: "./images/Gleekify/tongue_2.png" },
		{ url: "./images/Gleekify/bitcoin_puppet.png" },
		{ url: "./images/Gleekify/degods.png" },
		{ url: "./images/Gleekify/milday_tongue.png" },
		{ url: "./images/Gleekify/pixel_gleek.png" },
		{ url: "./images/Gleekify/pixl_tongue.png" },
		{ url: "./images/Gleekify/tongue_3.png" },
		{ url: "./images/Gleekify/yoots_mouth.png" },
		// Add more images as needed
	];
	const memeTemplates = [
		{ url: "./images/MemeTemplates/template1.png" },
		{ url: "./images/MemeTemplates/template2.png" },
		// Add more templates as needed
	];

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
		// Determine the size based on the image type
		const size = type === 'gleek' ? { width: 150, height: 75 } : { width: 75, height: 75 };
	
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
	

	const handleDragEnd = (e, index) => {
		const updatedElements = elements.map((el, idx) => {
			if (idx === index) {
				return { ...el, x: e.target.x(), y: e.target.y() };
			}
			return el;
		});
		setElements(updatedElements);
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


	const handleDownloadMergedImage = () => {
		const stage = stageRef.current.getStage();
		const dataURL = stage.toDataURL({
			pixelRatio: 2 // Ensures high resolution
		});
	
		// Creating a temporary anchor tag to initiate download
		const link = document.createElement('a');
		link.href = dataURL;
		// Use the stored original file name, with a fallback in case it's not available
		const downloadFileName = originalFileName ? `gleekify_${originalFileName}` : "gleekify_merged_image.png";
		link.download = downloadFileName; // Use the actual original file name
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	
	

	const Modal = ({ isOpen, close, children }) => {
		if (!isOpen) return null;
		const imageBackgroundStyle = {
			background: 'black', // Example: white background with 50% opacity
		};
		return (
			<div className="modal-overlay" onClick={close}>
				<div className="modal-content" onClick={(e) => e.stopPropagation()}>
					{/* Close button inside the modal */}
					<button className="modal-close-button" onClick={close}>
						<img src="./images/Gleekify/close.png" alt="Close" />
					</button>
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
						<button onClick={() => addElementToCanvas(image.url, 300, 300, 'meme')}>
							<img src={image.url} alt="" style={{ width: '100px', height: '100px' }} />
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
                        gleek
                </button>
                <button className="button-gleekify" onClick={openTongueModal}>
                     mouth
                </button>
				<button className="button-gleekify" onClick={openMemeModal}>
    meme templates
</button>
				<button className="button-gleekify" onClick={addTextElement}>
                add text
            </button>
				</div>
				<button className="button-gleekify" onClick={toggleAdditionalButtons}>
    {showAdditionalButtons ? 'Hide Tools' : 'Show Tools'}
</button>

				{showAdditionalButtons && (
				<div className="additional-buttons group-spacing">
				<button className="button-gleekify" onClick={increaseFontSize}>Increase Text Size</button>
    <button className="button-gleekify" onClick={decreaseFontSize}>Decrease Text Size</button>
				<button className="button-gleekify" onClick={moveElementUp}>
					backward
				</button>
				<button className="button-gleekify" onClick={moveElementDown}>
					forward
				</button>
				<button className="button-gleekify" onClick={() => toggleFlipX(selectedId)}>flip horizontal</button>
				<button className="button-gleekify" onClick={() => toggleFlipY(selectedId)}>flip vertical</button>
				<button className="button-gleekify" onClick={deleteSelectedImage}>
					delete selected
				</button>
				<button className="button-gleekify" onClick={handleDownloadMergedImage}>
					download
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
							{editingInput}
							{renderTextElements()}
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
	{renderTextElements()}
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
								/>
							))}
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
