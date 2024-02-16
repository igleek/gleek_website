import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
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
		rotation = 0,
		onDragEnd,
		id,
		onSelect,
		isSelected,
		onResize,
	}) => {
		const image = useImage(src);
		const selectionProps = isSelected
			? {
					shadowColor: "red",
					shadowBlur: 10,
					shadowOffset: { x: 0, y: 0 },
					shadowOpacity: 0.6,
			  }
			: {};

		const handleMouseDown = (e) => {
			if (!isSelected) {
				// Set selected ID to null if the image is not already selected
				onSelect(null);
			}
			onSelect(id);
			e.cancelBubble = true;
		};

		return image ? (
			<KonvaImage
				image={image}
				x={x}
				y={y}
				width={width}
				height={height}
				rotation={rotation}
				draggable
				onMouseDown={handleMouseDown}
				onDragEnd={onDragEnd}
				{...selectionProps}
				onTransformEnd={(e) => {
					const node = e.target;
					onResize(id, node.width(), node.height());
					handleTransformEnd(id, e.target);
					node.scaleX(1);
					node.scaleY(1);
				}}
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
	const handleTransformEnd = (id, node) => {
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();
		// Calculate the new dimensions based on the scale
		const width = node.width() * scaleX;
		const height = node.height() * scaleY;
		const x = node.x();
		const y = node.y();
		// If rotation is being used, capture that as well
		const rotation = node.rotation();

		setElements((prevElements) =>
			prevElements.map((element) => {
				if (element.id === id) {
					return {
						...element,
						x,
						y,
						width: Math.max(5, width), // Ensure minimum size
						height: Math.max(5, height), // Ensure minimum size
						rotation,
						// Do not reset scaleX and scaleY to 1 here; store them if needed or apply directly to width/height
					};
				}
				return element;
			})
		);
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
	const staticImages = [
		{ url: "./images/Gleekify/acid.png" },
		{ url: "./images/Gleekify/fire.png" },
		{ url: "./images/Gleekify/gleek_1.png" },
		{ url: "./images/Gleekify/gleek_2.png" },
		{ url: "./images/Gleekify/gleek_3.png" },
		{ url: "./images/Gleekify/rainbow.png" },
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

	const addElementToCanvas = (url, x, y) => {
		addElementToCanvasAsync(url, x, y).catch((error) => {
			console.error("Error adding element to canvas:", error);
		});
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
		const reader = new FileReader();
		reader.onloadend = () => {
			const img = new Image();
			img.src = reader.result;
			img.onload = () => {
				let width = img.width;
				let height = img.height;

				// Check if image exceeds the maximum width or height
				if (width > 800 || height > 800) {
					const aspectRatio = width / height;

					// Calculate new dimensions while maintaining aspect ratio
					if (width > height) {
						width = 800;
						height = width / aspectRatio;
					} else {
						height = 800;
						width = height * aspectRatio;
					}
				}

				// Create a canvas element to draw the resized image
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				canvas.width = width;
				canvas.height = height;
				ctx.drawImage(img, 0, 0, width, height);

				// Convert canvas to data URL and set it as the background source
				setBackgroundSrc(canvas.toDataURL());
			};
		};
		reader.readAsDataURL(file);
	};

	const TransformerComponent = ({ selectedId }) => {
		const transformerRef = useRef();

		useEffect(() => {
			if (transformerRef.current && stageRef.current) {
				// Introduce a delay to ensure nodes are rendered
				setTimeout(() => {
					const selectedNode = stageRef.current.findOne(`#${selectedId}`);
					console.log("Selected node after delay:", selectedNode);
					if (selectedNode) {
						transformerRef.current.nodes([selectedNode]);
						transformerRef.current.getLayer().batchDraw();
					} else {
						transformerRef.current.nodes([]);
					}
				}, 75); // Small delay
			}
		}, [selectedId, transformerRef, stageRef]);

		return (
			<Transformer
				ref={transformerRef}
				keepRatio={false}
				enabledAnchors={[
					"top-left",
					"top-right",
					"bottom-left",
					"bottom-right",
				]}
				borderStroke="red"
				borderStrokeWidth={1}
				anchorSize={8}
				anchorStroke="red"
				anchorFill="#fff"
				flipEnabled={true}
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
		if (selectedId) {
			setElements(elements.filter((element) => element.id !== selectedId));
			setSelectedId(null); // Reset selectedId since the image is now deleted
		}
	};

	const flipImageHorizontal = (id) => {
		const updatedElements = elements.map((el) => {
			if (el.id === id) {
				return { ...el, flipHorizontal: !el.flipHorizontal };
			}
			return el;
		});
		setElements(updatedElements);
	};

	const handleDownloadMergedImage = () => {
		if (backgroundSrc) {
			const stage = stageRef.current.getStage();
			const dataURL = stage.toDataURL();

			const link = document.createElement("a");
			link.href = dataURL;

			// Extracting the original filename from the uploaded file input
			const input = document.querySelector('input[type="file"]');
			let originalFilename = "merged_image.png"; // Default filename if original not found

			if (input.files && input.files.length > 0) {
				originalFilename = input.files[0].name;
			}

			// Setting the download filename with "gleekify_" prefix
			link.download = `gleekify_${originalFilename}`;

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			console.error("Background image source is not available.");
		}
	};

	const Modal = ({ isOpen, close, children }) => {
		if (!isOpen) return null;

		return (
			<div className="modal-overlay" onClick={close}>
				<div className="modal-content" onClick={(e) => e.stopPropagation()}>
					{/* Close button inside the modal */}
					<button className="modal-close-button" onClick={close}>
						Close
					</button>
					{children}
				</div>
			</div>
		);
	};

	useEffect(() => {
		console.log("Modal state:", isModalOpen);
	}, [isModalOpen]);


  
	return (
		<div
			className="gleekify-container"
			style={{ display: "flex", flexDirection: "row" }}
		>
			<div className="button-toolbar">
				{/* File upload input */}
				<input
					type="file"
					onChange={handleUpload}
					accept="image/*"
					style={{ marginTop: "20px" }}
				/>
				<button className="button" onClick={() => setIsModalOpen(true)}>
					Add Image
				</button>
				<button onClick={deleteSelectedImage} style={{ margin: "10px" }}>
					Delete Selected Image
				</button>
				<button onClick={handleDownloadMergedImage} style={{ margin: "10px" }}>
					Download Merged Image
				</button>
				<button onClick={moveElementUp} style={{ margin: "10px" }}>
					Move Down
				</button>
				<button onClick={moveElementDown} style={{ margin: "10px" }}>
					Move Up
				</button>
			</div>

			{/* Canvas */}
			<div ref={drop} className="canvas-frame">
					<Stage
						width={800}
						height={800}
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
									width={800}
									height={800}
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
					<Modal isOpen={isModalOpen} close={() => setIsModalOpen(false)}>
						{/* Remove the extra overlay div here */}
						<div className="image-selection">
							{staticImages.map((image, index) => (
								<button
									key={index}
									onClick={() => {
										addElementToCanvas(image.url, 100, 100);
									}}
								>
									<img
										src={image.url}
										alt=""
										style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
									/>
								</button>
							))}
						</div>
					</Modal>
				</div>
			</div>
	);
};

export default Gleekify;
