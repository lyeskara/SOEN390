import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import "../../styles/network.css";
import { Link, useNavigate } from "react-router-dom";

function ConnectionPage() {
  const [connections, Setconnections] = useState([]);
  const [ids, Setids] = useState([]);
  const authUserId = auth.currentUser.uid;
  const colRef = collection(db, "connection");
  const userRef = collection(db, "users_information");
  console.log(connections);
  useEffect(() => {
    getDoc(doc(colRef, authUserId)).then((connection) => {
      Setids(connection.data().connections);
      console.log(ids);
    });
  }, []);
  useEffect(() => {
    ids.forEach((id) => {
      getDoc(doc(userRef, id))
        .then((user) => {
          const { firstName, lastName } = user.data();
          const id = user.id;
          if (
            !connections.find(
              (user1) =>
                user1.firstName === firstName && user1.lastName === lastName
            )
          ) {
            Setconnections((prevData) => [
              ...prevData,
              { id, firstName, lastName },
            ]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, [ids]);

  function handle(userId) {
    getDoc(doc(colRef, userId)).then((user) => {
      if (user.exists()) {
        const userArray = user.data().connections;
        const filteredArray = userArray.filter((id) => id !== authUserId);
        console.log(filteredArray);
        updateDoc(doc(colRef, userId), {
          ...user.data(),
          connections: filteredArray,
        });
      }
    });
    getDoc(doc(colRef, authUserId)).then((user) => {
      if (user.exists()) {
        const userArray = user.data().connections;
        const filteredArray = userArray.filter((id) => id !== userId);
        console.log(filteredArray);
        updateDoc(doc(colRef, authUserId), {
          ...user.data(),
          connections: filteredArray,
        });
      }
    });
    Setconnections(connections.filter((element) => element.id !== userId));
  }
  return (
    <>
      <div className="contain">
        <Row className="gap-5">
          <Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>
            <Card className="networkcard">
              <h5 className="NetworkTitle">My Network</h5>
              <Link to="/connections">
                <img src={node} alt="node" /> Connections
              </Link>
              <Link to="/GroupNetwork">
                <img src={group} alt="node" /> Groups
              </Link>
              <Link to="/Event">
                <img src={event} alt="node" /> Events
              </Link>
            </Card>
          </Col>

          <Col xs={12} md={7}>
            <Card className="card">
              <div className="containRequest">
                <h5 className="requests">Pending Requests</h5>
                <div className="arrow">
                  <Link to="/requests">
                    <img src={arrow} alt="node" />
                  </Link>
                </div>
              </div>
            </Card>
            <Card className="card">
              <div className="containRequest">
                <h5>My Connections</h5>

              </div>
              <br></br>
              <hr></hr>
              <Row className="mt-3">
                <div>
                  {connections.map((user) => (
                    <div className="containRequest" key={user.id}>
                      <p className="connection_name">
                        {user.firstName} {user.lastName}
                      </p>
                      <Button
                        className="trash_button"
                        onClick={() => {
                          handle(user.id);
                        }}
                      >
                        <img src={trash} alt="node" />
                        Delete Connection
                      </Button>
                      <hr></hr>
                    </div>
                  ))}
                </div>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ConnectionPage;
