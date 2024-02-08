import React, { useState } from "react";

function GleekInfo() {
	const [copySuccess, setCopySuccess] = useState("");

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText("4ACuWnJZjE1Q51589mBmmyfD82RZ4LNFVeuPdSRFPc3L")
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
					ca: 4ACuWnJZjE1Q51589mBmmyfD82RZ4LNFVeuPdSRFPc3L
				</span>
			</p>
			{copySuccess && (
				<div style={{ color: "black", fontSize: "21px" }}>{copySuccess}</div>
			)}
		</div>
	);
}

export default GleekInfo;
