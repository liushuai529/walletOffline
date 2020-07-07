import Modal from "antd-mobile/lib/modal";
import { Alert } from "react-native";
import { common } from "../constants/common";

function alert(title, detail, actions = []) {
  const nextActions = actions.map(e => {
    if (e.style === "destructive") {
      return {
        ...e,
        style: {
          color: "red"
        }
      };
    }
    return {
      ...e,
      style: {
        color: "#157efb"
      }
    };
  });
  Modal.alert(title, detail || "", nextActions);
}

if (common.IsIOS) {
  module.exports = Alert;
} else {
  module.exports = {
    alert
  };
}
