import { useState, useEffect } from "react";
import "./Dashboard.scss";
import {
  Grid,
  Header,
} from "semantic-ui-react";
import Card from "../../components/Card/index";
import { NavLink, Redirect } from "react-router-dom";
import useAuthStatus from "../../utils/customHooks/user";
import HamburgerMenu from "../../components/HamburgerMenu/index";
import Loader from '../../components/Loader/index'
import Axios from 'axios'
import useToken from '../../utils/customHooks/token'

const Dashboard = () => {

  const { getStatus } = useAuthStatus();
  const [isLoading, setLoading] = useState(true);
  const [auth, setAuth] = useState();
  const [quizes, setQuizes] = useState([{}]);

  const { getToken } = useToken();

  useEffect(async () => {
    const token = getToken();
    const quizEndPoint = 'http://localhost:5000/dashboard';

    const response = await Axios.get(quizEndPoint, {
      headers: {
        Authorization: token,
      }
    });
    setQuizes(response.data)

    const isAuthenticated = await getStatus();
    setAuth(isAuthenticated);
    setLoading(false);

  }, []);

  const rowPositon = { paddingTop: "15px" };
  return (
    <div className="container">
      {isLoading && <Loader />}
      {!isLoading && !auth && <Redirect to="/login" />}
      {!isLoading && auth && (
        <HamburgerMenu>
          <Header as="h3" >Your Quizes </Header>
          <Grid columns="five" divided>
            <Grid.Row style={rowPositon}>
              {quizes.map((ele, index) => {
                return (
                  <Grid.Column>
                    <NavLink
                      exact
                      activeClassName="current"
                      to={`/dashboard/view/${ele.id}`}
                    >
                      <Card
                      quizInfo = {ele} 
                      />
                    </NavLink>
                  </Grid.Column>
                );
              })}
            </Grid.Row>
          </Grid>
        </HamburgerMenu>
      )}
    </div>
  );
};
export default Dashboard;
