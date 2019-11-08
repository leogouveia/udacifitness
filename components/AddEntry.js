import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform
} from "react-native";
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue
} from "../utils/helpers";
import UdaciSlider from "./UdaciSlider";
import UdaciStepper from "./UdaciStepper";
import DateHeader from "./DateHeader";
import { Ionicons } from "@expo/vector-icons";
import TextButton from "./TextButton";
import { submitEntry, removeEntry } from "../utils/api";
import { connect } from "react-redux";
import { addEntry } from "../actions";
import { white, purple } from "../utils/colors";

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={Platform.OS === "ios" ? styles.iosSubmitBtn : styles.mdSubmitBtn}
    >
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  );
}

class AddEntry extends React.Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  };
  increment = metric => {
    const { max, step } = getMetricMetaInfo(metric);
    this.setState(state => {
      const count = state[metric] + step;
      return {
        ...state,
        [metric]: count > max ? max : count
      };
    });
  };
  decrement = metric => {
    this.setState(state => {
      const count = state[metric] - getMetricMetaInfo(metric).step;
      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      };
    });
  };
  slide = (metric, value) => {
    this.setState(() => ({ [metric]: value }));
  };
  submit = () => {
    const key = timeToString();
    const entry = this.state;

    this.props.dispatch(
      addEntry({
        [key]: entry
      })
    );
    this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }));

    //Navigate to home
    submitEntry({ key, entry });
    //clear local notification
  };
  reset = () => {
    const key = timeToString();
    // Update redux
    this.props.dispatch(
      addEntry({
        [key]: getDailyReminderValue()
      })
    );

    // Route to home
    removeEntry(key);
  };
  render() {
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-happy" : "md-happy"}
            size={100}
          />
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset} style={{ padding: 10 }}>
            Reset
          </TextButton>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(key => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === "slider" ? (
                <UdaciSlider
                  value={value}
                  onChange={value => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <UdaciStepper
                  value={value}
                  onIncrement={value => this.increment(key)}
                  onDecrement={value => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  mdSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 40,
    paddingRight: 40,
    height: 45,
    borderRadius: 4,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30
  }
});
function mapStateToProps(state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === "undefined"
  };
}
export default connect(mapStateToProps)(AddEntry);
