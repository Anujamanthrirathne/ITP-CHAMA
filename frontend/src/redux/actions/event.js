import axios from "axios";
import { server } from "../../server";

// Create event
export const createEvent = (data) => async (dispatch) => {
  try {
    dispatch({ type: "eventCreateRequest" });

    const { data: response } = await axios.post(`${server}/event/create-event`, data);

    dispatch({
      type: "eventCreateSuccess",
      payload: response.event,
    });
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAlleventsShopRequest" });

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);
    console.log("Received events:", data.events);

    dispatch({
      type: "getAlleventsShopSuccess",
      payload: data.events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.response?.data?.message);
    dispatch({
      type: "getAlleventsShopFail",
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteeventRequest" });

    const { data } = await axios.delete(`${server}/event/delete-shop-event/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "deleteeventSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteeventFail",
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

//get all events
export const getAllEvents = () => async (dispatch) => {
  try{
       dispatch({
        type: "getAlleventsRequest"
       });

       const {data} = await axios.get(`${server}/event/get-all-events`);
       dispatch({
        type: "getAlleventsSuccess",
        payload: data.events
       })
  } catch (error){
          dispatch({
            type: "getAlleventsFail",
            payload: error.response.data.message,
          })
  }
}
