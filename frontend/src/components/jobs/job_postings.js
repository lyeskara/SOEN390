import React, { useEffect, useState } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
// import "../../styles/job_postings.css";
import "../../styles/profile.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

function job_postings() {
	const [user, setUser] = useState({});
	useEffect(() => {
		async function getData() {
			await getDoc(
				doc(collection(db, "users_information"), auth.currentUser.uid)
			)
				.then((doc) => {
					console.log("doc");
					if (doc.exists) {
						console.log(doc.data + " ");
						setUser({ ...doc.data(), id: doc.id });
					} else {
						console.log("nikmok");
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
		console.log(getData());

		return () => {
			getData();
		};
	}, []);
	return (
		//Profile card

		<Container className="container">
			<Row className="gap-6">
				<Col xs={12} md={4}>
					<Card className="profilecard">
						<img src="file" alt="Avatar" class="avatar"></img>
						<input className="form-control" type="file"></input>
						<h1>
							{user.firstName} {user.lastName}
						</h1>
						<b> {user.bio} </b>
						<p> {user.city}</p>
					</Card>

					<Card className="contactcard">
						<h1> emaillll </h1>
						<b> contact number </b>
					</Card>
				</Col>

				<Col xs={12} md={8}>
					<Card className="card">
						<h5>Work Experience</h5>
						<hr></hr>
						<div className="profile-desc-row">
							<img src=" "></img>
							<div>
								<h3>Business Intelligence Analyst</h3>
								<p>DODO Inc.</p>
								<p> Feb 2022 - Present</p>
							</div>
						</div>
						<hr></hr>
						<div className="profile-desc-row">
							<img src=" "></img>
							<div>
								<h3>Business Intelligence Analyst</h3>
								<p>DODO Inc.</p>
								<p> Feb 2022 - Present</p>
							</div>
						</div>
					</Card>

					<Card className="educationcard">
						<h5>Education</h5>
						<hr></hr>
						<div className="profile-desc-row">
							<img src=" "></img>
							<div>
								<h3>Concordia Universtiy</h3>
								<p style={{ color: "#272727" }}>
									Bachelor's degree, software engineering
								</p>
								<p> Aug 2020 - May 2024</p>
							</div>
						</div>
						<hr></hr>
					</Card>

					<Card className="skillscard">
						<h5>Skills</h5>
						<hr></hr>
						<p className="skills-btn">English</p>
						<p className="skills-btn">English</p>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default job_postings;