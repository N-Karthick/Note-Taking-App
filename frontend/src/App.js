import { BrowserRouter as Router, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Login from './LoginSignup/Login/Login';
import Signup from './LoginSignup/Signup/Signup';
import Notes from './Notes/Notes';
function App() {
  const route = createBrowserRouter([
      {
        path:"/",
        element:<Login/>
      },{
        path:"/Signup",
        element:<Signup/>
      },{
        path:"/Notes",
        element:<Notes/>
      }
    ])
return (
  <div>
    <RouterProvider   router={route}>
<Router>

</Router>
</RouterProvider>
</div>
);
}
export default App;
