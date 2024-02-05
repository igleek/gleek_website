import React, { useState } from "react";

function GleekInfo() {
	const [copySuccess, setCopySuccess] = useState("");

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText("So11111111111111111111111111111111111111112")
			.then(() => {
				setCopySuccess("$gleek ca copied to clipboard");
				setTimeout(() => setCopySuccess(""), 2000);
			})
			.catch(() => {
				setCopySuccess("failed to copy");
				setTimeout(() => setCopySuccess(""), 2000);
			});
	};

	return (
		<div className="gleek-info">
			<p>
				$GLEEK <br />
				<span style={{ cursor: "pointer" }} onClick={copyToClipboard}>
					ca: So11111111111111111111111111111111111111112
				</span>
			</p>
			{copySuccess && (
				<div style={{ color: "black", fontSize: "21px" }}>{copySuccess}</div>
			)}
		</div>
	);
}

export default GleekInfo;
