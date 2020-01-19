import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import AuthDialog from "./AuthDialog";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import Grow from "@material-ui/core/Grow";
import { makeStyles } from "@material-ui/core/styles";

import AddIcon from "@material-ui/icons/Add";
import { Typography, Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	loader: {
		position: "sticky",
		top: 0,
		left: 0,
		right: 0
	},
	sidebar: {
		position: "absolute",
		width: "20vw",
		height: "50%",
		bottom: 0,
		left: 0,
		padding: theme.spacing(2, 1)
	},
	welcomeMessage: {
		margin: theme.spacing(2, 0)
	},
	button: {
		margin: theme.spacing(2, 0)
	},
	fab: {
		position: "absolute",
		left: theme.spacing(2),
		bottom: theme.spacing(2),
		color: "green"
	},
	snackbar: {
		color: "#d32f2f"
	}
}));

function App() {
	const { firebase } = window;
	const classes = useStyles();

	// callback for when iframe has finished loading
	const onLoad = () => {
		const frame = document.getElementById("maps_frame");
		console.log(frame);
		frame.width = document.body.clientWidth;
		frame.height = document.body.clientHeight;
	};

	// user auth state
	const [user, setUser] = useState(null);

	// is loading state
	const [isLoading, setIsLoading] = useState(false);

	// error state
	const [error, setError] = useState(null);

	// input menu open/close state
	const [isFab, setIsFab] = useState(false);

	// user input state
	const [search, setSearch] = useState({
		origin: "",
		destination: "",
		numPassengers: ""
	});

	// dynamic maps query
	const [mapsQuery, setMapsQuery] = useState("");

	// handle fab button click
	const handleFab = () => {
		setIsFab(!isFab);
	};

	// handle snackbar closing
	const handleErrorClose = () => {
		setError(null);
	};

	// handle input changes
	const handleSearch = name => e => {
		setSearch({ ...search, [name]: e.target.value });
	};

	// handle fetching ride data from backend
	const handleFindRide = () => {
		setIsLoading(true);
		fetch("http://192.168.255.59:3000/createTask", {
			headers: {
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify(search)
		})
			.then(res => res.json())
			.then(res => {
				if (res.error) throw new Error(res.error);
				const waypoints = res.queue.reduce((acc, cur) => {
					acc.push(cur.from, cur.to);
					return acc;
				}, []);

				const query = waypoints.join("|");
				setMapsQuery(query);
				return query;
			})
			.catch(err => {
				setError(err.message || err.toString());
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	// manage state of user
	firebase.auth().onAuthStateChanged(user => {
		setUser(user);
		console.log(user);
	});

	return (
		<div>
			{/* linear progression loading bar to indicate fetching of resource */}
			{isLoading && <LinearProgress className={classes.loader} />}

			{/* dialog to handle user authentication */}
			<AuthDialog
				user={user}
				setIsLoading={setIsLoading}
				setError={setError}
			></AuthDialog>

			{/* sidebar to enter location for pickup/dropoff */}
			{
				<Grow in={isFab}>
					<Paper className={classes.sidebar} elevation={2}>
						<Typography align="center" className={classes.welcomeMessage}>
							Hello {user ? user.email : ""}!
						</Typography>

						{/* origin input */}
						<TextField
							fullWidth
							margin="dense"
							label="Origin"
							value={search.origin}
							onChange={handleSearch("origin")}
						></TextField>

						{/* destination input */}
						<TextField
							fullWidth
							margin="dense"
							label="Destination"
							value={search.destination}
							onChange={handleSearch("destination")}
						></TextField>

						{/* number of passengers input */}
						<TextField
							fullWidth
							margin="dense"
							label="Num passengers"
							value={search.numPassengers}
							onChange={handleSearch("numPassengers")}
						></TextField>

						{/* find a ride button */}
						<Button
							className={classes.button}
							onClick={handleFindRide}
							fullWidth
							variant="outlined"
						>
							Find a ride!
						</Button>
					</Paper>
				</Grow>
			}

			{/* google maps iframe */}
			<iframe
				id="maps_frame"
				width="600"
				height="450"
				frameBorder="0"
				onLoad={onLoad}
				// style="border:0"
				src={`https://www.google.com/maps/embed/v1/${
					mapsQuery ? "directions" : "view"
				}?${
					mapsQuery
						? `origin=3600+Peel+QC&destination=3600+Peel+QC&waypoints=${mapsQuery}&`
						: ""
				}zoom=14&center=45.5017%2C-73.5673&key=AIzaSyAFxV-PWjObeqarsnfmSBS0ShmsLWNktuE`}
				allowFullScreen
			></iframe>

			{/* floating button to open menu for user to enter origin and destination */}
			<Fab className={classes.fab} onClick={handleFab}>
				<AddIcon></AddIcon>
			</Fab>

			{/* snackbar for error messages */}
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				autoHideDuration={3000}
				ContentProps={{ className: classes.snackbar }}
				open={!!error}
				onClose={handleErrorClose}
				message={error && error.toString()}
			/>
		</div>
	);
}

export default App;
