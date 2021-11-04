import { notification } from "antd";

function errorNotification(error) {
  notification.open({
    type: "error",
    message: error.statusCode,
    description: error.message,
    duration: 3,
  });
}

export default errorNotification;
