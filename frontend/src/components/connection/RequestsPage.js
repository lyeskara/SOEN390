import { auth, db } from '../../firebase';
import { collection, doc, setDoc,getDoc, getDocs, limitToLast, query, where, updateDoc } from 'firebase/firestore';
import { useEffect, useState} from 'react'
   function  RequestsPage() {
    
    const [Users,SetUsers]= useState([])
    const [UserData, SetUserData] = useState([])

    const currentId = auth.currentUser.uid;
    const dbRef = collection(db, 'connection_requests');
    const profileRef = collection(db, 'users_information')

     useEffect(() => {
      
        const q = query(dbRef, where('requests', 'array-contains', currentId));
        getDocs(q)
          .then((users) => {
            const userArray = [];
            users.docs.forEach((user) => {
              userArray.push(user.id);
            });
            SetUsers(userArray);
          })
          .catch((error) => {
            console.log('Error fetching data:', error);
          });
         
      }, []);

      useEffect(()=>{
        Users.forEach((user)=>{
            getDoc(doc(profileRef,user)).then((e)=>{
             const {firstName,lastName} = e.data();
             const id = e.id
             if (!UserData.find((user) => user.firstName === firstName && user.lastName === lastName)) {
                SetUserData((prevData) => [...prevData, { id,firstName, lastName }]);
            }
        }).catch((error)=>{
                console.log("this is an error " +error)
            })
         })
      }
    ,[Users])
     
function handleConnect(userId){

    const connectionRef = collection(db, 'connection')
    const authdoc = doc(connectionRef,currentId)
    const acceptedoc = doc(connectionRef,userId)
    getDocs(connectionRef).then((docs)=>{
        const condition = docs.docs.includes(authdoc) 
        const condition2 = docs.docs.includes(userId)
        if(condition){
            const getConnection = getDoc(authdoc).then((document)=>{
                const connections = document.data().connections;
                if(!connections.includes(userId)){
                  connections.push(userId)
                  return updateDoc(doc(followRef, currId), {...document.data(), connections : connections})
                
                }

            })
        }else{ 
            setDoc(doc(connectionRef, currentId), {connections:[userId]});
        }
        if(condition2){
            const getConnection = getDoc(userId).then((document)=>{
                const connections = document.data().connections;
                if(!connections.includes(currentId)){
                  connections.push(currentId)
                  return updateDoc(doc(followRef, userId), {...document.data(), connections : connections}) 
                }
            })
        }else{    
            setDoc(doc(connectionRef, userId), {connections:[currentId]});
        }
    })
      getDoc(doc(dbRef,userId)).then((document)=>{
      if(document.exists()){
        const array = document.data().requests
        const updatedArray = array.filter((id)=> id !== currentId)
        console.log(updatedArray)
        updateDoc(doc(dbRef, userId), {...document.data(), requests: updatedArray} )
      }
    })
    }

function handleCancel(userId) {
    getDoc(doc(dbRef,userId)).then((document)=>{
        if(document.exists()){
          const array = document.data().requests
          const updatedArray = array.filter((id)=> id !== currentId)
          console.log(updatedArray)
          updateDoc(doc(dbRef, userId), {...document.data(), requests: updatedArray} )
        }
      })
      SetUserData(UserData.filter((element)=>element.id !== userId))
}
      
      return (
        <div>
      {UserData.map((user) => (
        <div key={user.id}>
          <p>{user.firstName} {user.lastName}</p>
          <button onClick={() => handleConnect(user.id)}>Connect</button>
          <button onClick={()=>{handleCancel(user.id)}} >Cancel</button>
        </div>
      ))}
    </div>
      );
}

export default RequestsPage
