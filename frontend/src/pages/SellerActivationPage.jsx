import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);

    useEffect(() => {
        if (activation_token) {
            const sendRequest = async () => {
                try {
                    await axios.post(`${server}/shop/activation`, { activation_token });
                    setError(false);
                } catch (err) {
                    setError(true);
                }
            };
            sendRequest();
        }
    }, [activation_token]);

    return (
        <div style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            {error ? (
                <p>Your token is expired!</p>
            ) : (
                <p>Your account has been created successfully!</p>
            )}
        </div>
    );
};

export default SellerActivationPage;
