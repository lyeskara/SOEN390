import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useUserAuth } from "../../context/UserAuthContext";
import { auth, db } from "../../firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function EditProfile({ user, setUser }) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const navigate = useNavigate();
	const storage = getStorage();
	const storageRef = ref(
		"https://console.firebase.google.com/project/soen390-b027d/storage/soen390-b027d.appspot.com/images"
	);
	const [selectedFile, setSelectedFile] = useState(null);

	function update(e) {
		setUser({ ...user, [e.target.name]: e.target.value });
	}

	async function updateUser(e) {
		e.preventDefault();
		if (user) {
			if (selectedFile) {
				const storageRef = ref(
					storage,
					`profilepics/${auth.currentUser.uid}/${selectedFile.name}`
				);
				await uploadBytes(storageRef, selectedFile);
			}
			setDoc(doc(collection(db, "users_information"), auth.currentUser.uid), {
				firstName: user.firstName,
				lastName: user.lastName,
				education: user.education,
				city: user.city,
				bio: user.bio,
				workExperience: user.workExperience,
				skills: user.skills,
				languages: user.languages,
			});
		}
		navigate("/Profile");
	}

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				Edit
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Edit</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formFile" className="mb-3">
							<Form.Label>Avatar</Form.Label>
							<Form.Control
								type="file"
								onChange={(e) => setSelectedFile(e.target.files[0])}
							/>
						</Form.Group>
						<div style={{ display: "flex" }}>
							<Form.Group
								style={{ marginRight: "1rem" }}
								className="mb-3"
								controlId="exampleForm.ControlInput1"
							>
								<Form.Label>First Name</Form.Label>
								<Form.Control
									name="firstName"
									type="text"
									defaultValue={user.firstName}
									onChange={update}
									autoFocus
								/>
							</Form.Group>
							<Form.Group
								className="mb-3"
								controlId="exampleForm.ControlInput1"
							>
								<Form.Label>Last Name</Form.Label>
								<Form.Control
									name="lastName"
									type="text"
									defaultValue={user.lastName}
									onChange={update}
									autoFocus
								/>
							</Form.Group>
						</div>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Location</Form.Label>
							<Form.Control
								name="location"
								type="text"
								defaultValue={user.city}
								onChange={update}
								autoFocus
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Languages</Form.Label>
							<Form.Control
								name="languages"
								type="text"
								defaultValue={user.languages}
								onChange={update}
								autoFocus
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Contact Number</Form.Label>
							<Form.Control
								name="contact"
								type="text"
								defaultValue={user.contact}
								onChange={update}
								autoFocus
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Experience</Form.Label>
							<Form.Control
								name="workExperience"
								type="text"
								defaultValue={user.workExperience}
								onChange={update}
								autoFocus
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Education</Form.Label>
							<Form.Control
								name="education"
								type="text"
								defaultValue={user.education}
								onChange={update}
								autoFocus
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Skills</Form.Label>
							<Form.Control
								name="skills"
								type="text"
								defaultValue={user.skills}
								onChange={update}
								autoFocus
							/>
						</Form.Group>

						<Form.Group
							className="mb-3"
							controlId="exampleForm.ControlTextarea1"
						>
							<Form.Label>Bio</Form.Label>
							<Form.Control
								name="location"
								as="textarea"
								defaultValue={user.bio}
								onChange={update}
								rows={3}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button
						variant="primary"
						onClick={(e) => {
							updateUser(e);
							handleClose();
						}}
					>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
export default EditProfile;