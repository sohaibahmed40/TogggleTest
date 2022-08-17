import React, { useEffect, useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import authService, { getToken, getUser, resetUserSession, setUserSession } from "../services/auth.service";
const ScoreUpUrl = 'https://n1i8b10t8i.execute-api.ap-south-1.amazonaws.com/prod/scoreup';
const ScoreDownUrl = 'https://n1i8b10t8i.execute-api.ap-south-1.amazonaws.com/prod/scoredown';



function Dashboard(props) {
    const [BTCPrice, setBTCPrice] = useState("");
    const [lastFetched, setLastFetched] = useState("");
    const [chosenPrice, setChosenPrice] = useState("");
    const [guess, setGuess] = useState("");
    const [user, setUser] = useState("");
    const [emailError, setemailError] = useState("");
    const [Message, setMessage] = useState("");
    const navigate = useNavigate();
    const intervalRef = useRef();
    const firstCheck = useRef(false);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    console.log('BTCPrice, chosenPrice', BTCPrice, chosenPrice);
                    if (BTCPrice && chosenPrice) {
                        if ((BTCPrice > chosenPrice) && guess == 'up') {
                            scoreUp();
                            setMessage(`Congratulation your guess was right. Your score has been updated`);
                        }
                        else {
                            if ((BTCPrice < chosenPrice) && guess == 'up') {
                                scoreDown();
                                setMessage(`Better luck next time. Your score has been updated`);
                            }
                        }
                        if ((BTCPrice > chosenPrice) && guess == 'down') {
                            scoreDown();
                            setMessage(`Better luck next time. Your score has been updated`);
                        }
                        else {
                            if ((BTCPrice < chosenPrice) && guess == 'down') {
                                scoreUp();
                                setMessage(`Congratulation your guess was right. Your score has been updated`);
                            }
                        }
                        if (BTCPrice == chosenPrice) {
                            setMessage("BTC value remained same");
                        }
                    }
                    setChosenPrice("");
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    }, [seconds]);

    useEffect(() => {
        if (firstCheck.current === false) {
            getBTCPrice();
            setUser(getUser())
            return () => {
                firstCheck.current = true;
            }
        }
    }, [])

    useEffect(() => {
        intervalRef.current = setInterval(getBTCPrice, 5000);
        return () => {
            clearInterval(intervalRef.current);
        }
    }, [])
    const getBTCPrice = () => {
        fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fected Data:", data.bpi.USD.rate);
                setBTCPrice(data.bpi.USD.rate);
                setLastFetched(data.time.updated);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const setChosenPriceValueUp = () => {
        setChosenPrice("");
        setMessage("");
        setGuess('up')
        setChosenPrice(BTCPrice);
        setSeconds(60)
    }
    const setChosenPriceValueDown = () => {
        setChosenPrice("");
        setMessage("");
        setGuess('down')
        setChosenPrice(BTCPrice);
        setSeconds(60)
    }
    // useEffect(()=>{
    //    console.log('This is Chosen Price',chosenPrice)
    // },[])

    const scoreUp = () => {
        const token = getToken();
        const requestBody = {
            user: getUser(),
            token: token
        }
        axios.post(ScoreUpUrl, requestBody).then(response => {
            console.log('This is User Data:', response)
            setUser(response.data.user);
            authService.setUser(response.data.user);
        }).catch(error => {
            console.log('Error:', error);
            if (error.response.status === 401)
                setMessage(error.response.data.message)
            else if (error.response.status === 403)
                setMessage(error.response.data.message)
            else
                setMessage("Sorry server is not responding... Please try again later")
        })
    }


    const scoreDown = () => {
        const token = getToken();
        const requestBody = {
            user: getUser(),
            token: token
        }
        axios.post(ScoreDownUrl, requestBody).then(response => {
            console.log('This is User Data:', response)
            setUser(response.data.user);
            authService.setUser(response.data.user);
        }).catch(error => {
            console.log('Error:', error);
            if (error.response.status === 401)
                setMessage(error.response.data.message)
            else if (error.response.status === 403)
                setMessage(error.response.data.message)
            else
                setMessage("Sorry server is not responding... Please try again later")
        })
    }

    const logout = () => {
        resetUserSession();
        props.handleLogout();
        navigate('/login')
    }

    // const loginSubmit = (e) => {
    //     e.preventDefault();
    //     const requestBody = {
    //         email: email,
    //         password: password
    //     }

    //     axios.post(loginUrl, requestBody).then(response => {
    //         setUserSession(response.data.user, response.data.token);
    //         navigate('/dashboard')
    //     }).catch(error => {
    //         console.log('Error:', error);
    //         if (error.response.status === 401)
    //             setMessage(error.response.data.message)
    //         else if (error.response.status === 403)
    //             setMessage(error.response.data.message)
    //         else
    //             setMessage("Sorry server is not responding... Please try again later")
    //     })
    // };

    return (
        <div className="app">
            <button onClick={logout} style={{ width: '150px', padding: '10px', color: 'black', backgroundColor: '#ccc5c5', marginTop: '20px', marginRight: '20px', float: 'right' }}>Logout</button>

            <div style={{ textAlign: "center", marginTop: '30px' }}>
                <div style={{ margin: 'auto', background: 'wheat', width: '50%', border: '12px solid grey', padding: '10px', marginTop: '20px' }}>
                    <h1>Name: {user.email}</h1>
                    <h1 >Score: {user.score}</h1>
                </div>
                {BTCPrice && lastFetched && <><div style={{ margin: 'auto', background: '#41464b', width: '50%', border: '12px solid black', padding: '10px', marginTop: '20px', color: 'white' }}>
                    {BTCPrice && <h1>Current BTC Price: <label style={{ fontWeight: 1000, fontSize: '40px', color: "#5eff61" }} >{BTCPrice} USD</label></h1>}
                    {lastFetched && <h1>Last Fetched Date: <label style={{ fontWeight: 1000, fontSize: '40px', color: "#5eff61" }} >{lastFetched}</label></h1>}

                </div>
                    {!chosenPrice && <h4 style={{ marginTop: '10px' }}>In Next One Minute BTC price will go: </h4>}
                    {!chosenPrice && <button onClick={setChosenPriceValueUp} style={{ width: '150px', padding: '10px', color: 'black', backgroundColor: 'grey', marginTop: '20px' }}>Up</button>}
                    {!chosenPrice && <button onClick={setChosenPriceValueDown} style={{ width: '150px', padding: '10px', color: 'black', backgroundColor: 'grey', marginTop: '20px' }}>Down</button>
                    }
                </>
                }          {chosenPrice !== "" && <>
                    <div style={{ margin: 'auto', background: '#ff7d7d', width: '50%', border: '12px solid grey', padding: '10px', marginTop: '20px' }}> <h1>Chosen Price: {chosenPrice}</h1>
                        <div>
                            <h1>Guess Count Down</h1>
                            {minutes === 0 && seconds === 0
                                ? null
                                : <h1> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                            }
                        </div></div></>}
                {!BTCPrice && !lastFetched && <div>Loading BTC Prices...</div>}
                {Message && <h3 style={{ marginTop: '15px', color: 'red' }}>{Message}</h3>}
            </div>
        </div>
    );
}
export default Dashboard;
