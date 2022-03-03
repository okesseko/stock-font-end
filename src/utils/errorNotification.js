import { notification } from "antd";
import { appEventEmitter } from "../App";

function errorNotification(error) {
  if (error?.statusCode === 401) {
    appEventEmitter.emit("unauthorization");
  }
  console.log(error)
  notification.open({
    type: "error",
    message: JSON.stringify(error),
    duration: 3,
  });
}

export default errorNotification;
