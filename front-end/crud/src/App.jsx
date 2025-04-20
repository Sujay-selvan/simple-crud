import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [change,setChange]=useState(true) //to use triger a getApi
  const [popup, setPopup] = useState(false); //using add item popup
  const [updatePopup,setUpdatePopup]=useState(false); //Edit item popup
  const [updatedItem,setUpdatedItem]=useState({}) 
  
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
  });
  const [updateData, setupdateData] = useState({
    name: '',
    age: '',
    city: '',
  });

  const API_URL = import.meta.env.VITE_APP_BACKEND_LINK;
  // console.log(API_URL)

  // Show the popup to add a new user
  function showPopup() {
    setPopup(true);
  }

  // Close the popup
  function removePopup() {
    setPopup(false);
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send POST request
    await fetch(`${API_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    // Clear the form data after successful submission
    setFormData({
      name: '',
      age: '',
      city: ''
    });
    
    setChange(!change); 
  };
  
  useEffect(() => {
     fetch(`${API_URL}/`,{ method:'GET',})
      .then((item) => item.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log("Error:", err)); 
  },[change]);

  useEffect(() => {
     fetch(`${API_URL}/`,{ method:'GET',})
      .then((item) => item.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log("Error:", err)); 
  },[]);

  function showUpdate(updateItem){
    setUpdatePopup(true)
    setUpdatedItem(updateItem)
    setupdateData(updateItem)
    // console.log(updateItem)
  }
  function removeUpdate(){
    setUpdatePopup(false)
  }

  function handleUpdate(e){
    // console.log(e.target.value)
    let {name,value} = e.target
    setupdateData({
      ...updateData,
      [name]: value,
    });   

  }

  async function handleUpdateSubmit(e, id) {
    e.preventDefault();
    
    await fetch(`${API_URL}/${id._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
  
    setupdateData({
      name: '',
      age: '',
      city: ''
    });
  
    setChange(!change); 
    removeUpdate();
  }
  
  // delete functionality
 async function handleDelete(Delete){
    await fetch(`${API_URL}/${Delete._id}`,{
      method:'DELETE',
    }) 
    setTimeout(()=>{
      setChange(!change)
    },100)
      
  }

  return (
    <>
      <div className="overall">
        <h1>CRUD APP - Using React and Express</h1>
        <div className="content">
          <div className="add-user">
            {/* <input type="search" placeholder="search here..." /> */}
            <h3 className='head'>User Details CRUD System</h3>
            <button onClick={showPopup}>Add User</button>
          </div>
          <div className="table-content">
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>City</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
                {users &&
                  users.map((item) => (
                    <tr key={item.id}> 
                      <td>{item.name}</td>
                      <td>{item.age}</td>
                      <td>{item.city}</td>
                      <td><button className="edit" onClick={()=>showUpdate(item)}>Edit</button></td>
                      <td><button className="remove" onClick={()=>handleDelete(item)}>Remove</button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Add New User Form (Popup) */}
          <form onSubmit={handleSubmit} className={`add-new ${popup ? "show-addNew" : ""}`}>
            <div>
              <h3>Add New User</h3>
              <span onClick={removePopup}>x</span>
            </div>
            <div>
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required />
            </div>
            <div>
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div>
              <button type="submit">Add</button>
            </div>
          </form>
          {/* update todo item */}
          {
          <form onSubmit={()=>handleUpdateSubmit(event,updatedItem)} className={`update-new ${updatePopup ? "show-update" : ""}`}>
                <div>
                    <h3>update item</h3>
                    <span onClick={removeUpdate}>x</span>
                </div>
                    <div>
                      <label>Name</label>
                      <input type="text" name="name" value={updateData.name} onChange={handleUpdate} required />
                    </div>
                    <div>
                      <label>age</label>
                      <input type="number" name="age" value={updateData.age} onChange={handleUpdate} required />
                    </div>
                    <div>
                      <label>city</label>
                      <input type="text" name="city" value={updateData.city} onChange={handleUpdate} required />
                    </div>
                    <div>
                       <button type="submit">Update</button>
                    </div>  
          </form>}
        </div>
      </div>
    </>
  );
}

export default App;
