import React from "react";

function App() {
	const onLoad = () => {
		const frame = document.getElementById("maps_frame");
		console.log(frame);
		frame.width = document.body.clientWidth;
		// frame.style.height = document.body.clientWidth;
	};

	return (
		<iframe
			id="maps_frame"
			width="600"
			height="450"
			frameBorder="0"
			onLoad={onLoad}
			// style="border:0"
			src="https://www.google.com/maps/embed/v1/view?zoom=10&center=45.5017%2C-73.5673&key=AIzaSyAzFZb4XxRJd-mmin250NYxfHo-kjkj_E4
"
			allowFullScreen
		></iframe>
	);
}

export default App;
