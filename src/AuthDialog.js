import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogActions, Button } from "@material-ui/core/";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";

function AuthDialog({ user, setIsLoading, setError }) {
	const { firebase } = window;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleRegister = () => {
		setIsLoading(true);

		firebase
			.auth()
			.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
			.then(() => {
				return firebase.auth().createUserWithEmailAndPassword(email, password);
			})
			.catch(err => {
				setError(err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleAuth = () => {
		setIsLoading(true);

		firebase
			.auth()
			.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
			.then(() => {
				return firebase.auth().signInWithEmailAndPassword(email, password);
			})
			.catch(err => {
				setError(err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<Dialog open={user === null} maxWidth="sm" fullWidth>
			<DialogTitle>Authentication</DialogTitle>
			<DialogContent>
				<DialogContentText>Please enter your login details.</DialogContentText>
				<TextField
					margin="normal"
					label="email"
					onChange={e => setEmail(e.target.value)}
					fullWidth
				></TextField>
				<TextField
					margin="normal"
					type="password"
					label="password"
					onChange={e => setPassword(e.target.value)}
					fullWidth
				></TextField>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleRegister}>REGISTER</Button>
				<Button onClick={handleAuth}>SIGN IN</Button>
			</DialogActions>
		</Dialog>
	);
}

export default AuthDialog;
