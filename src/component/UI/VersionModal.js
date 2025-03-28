import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import ReactNativeBlobUtil from "react-native-blob-util";
import moment from 'moment';
import "moment-timezone";
import Toast from "react-native-toast-message";
import { Config } from "../../../config";


const VersionModal = ({ modalVisible, setModalVisible }) => {
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [installingApk, setInstallingApk] = useState(false);
  const [progress, setProgress] = useState({
    size: 0,
    percentage: 0,
  });
  const todaysDate = moment().format('YYYY-MM-DD');

  

  const downloadLatestApk = () => {
    // console.log("Download");
    setDownloadingApk(true);

    const android = ReactNativeBlobUtil?.android;
    const { config, fs } = ReactNativeBlobUtil;
    const RootDir = fs?.dirs?.DownloadDir;
    const apkFilePath = RootDir + `/${Config.ManagerName}/` + Config.ManagerName + `_v${Config.showVersion}` + `_${todaysDate}.apk`;

    ReactNativeBlobUtil.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        title: `${Config.ManagerName} Apk`,
        description: "Downloading Application...",
        mime: "application/vnd.android.package-archive",
        mediaScannable: true,
        notification: true,
        path: apkFilePath,
      },
    })
      .fetch("GET", `${Config.AppLink}`)
      .progress((received, total) => {
        setProgress({
          size: received,
          percentage: (received / total) * 100,
        });

      })
      // .then((res) => {
      //   android.actionViewIntent(
      //     res.path(),
      //     "application/vnd.android.package-archive"
      //   );
      // })
      .then(() => {
        // console.log('success');
        setDownloadingApk(false);
        setProgress({
          size: 0,
          percentage: 0,
        });

        initialInstallApk(apkFilePath);

        console.log("APK File Path: ", apkFilePath);
      })
      .catch((err) => {
        // console.log('error');
        setDownloadingApk(false);
        setProgress({
          size: 0,
          percentage: 0,
        });
      });
  };


  const initialInstallApk = async (filePath) => {
    try {
      setInstallingApk(true);
      console.log("Installation Initiated");

      // Check if the APK file exists
      const fileExists = await ReactNativeBlobUtil.fs.exists(filePath);
      console.log("File Exists: ", fileExists);
      if (fileExists) {
        // Install the APK
        await ReactNativeBlobUtil.android.actionViewIntent(filePath, 'application/vnd.android.package-archive');
      } else {
        setInstallingApk(false);
        Toast.show({
          type: "error",
          text1: "File Not Exists",
          text2: "We failed to find apk in File System, Please download Again",
        });
        console.log('APK file not found at:', filePath);
      }
    } catch (error) {
      setInstallingApk(false);
      Toast.show({
        type: "error",
        text1: "Installation Error",
        text2: error?.message,
      });
      console.error('Error installing APK:', error);
    } finally {
      setInstallingApk(false);
    }

  };



  const openLinkApk = () => {
    Linking.openURL(`${Config.AppLink}`);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.container}>
            <View style={styles.textContainer}>
              {(!downloadingApk && !installingApk)?
                <Text style={styles.textStyle}>Download Latest App To Bet</Text>
                :
                (downloadingApk)?
                <Text style={styles.textStyle}>Downloading App..</Text>
                :
                <Text style={styles.textStyle}>Installing App..</Text>
              }
              <Icon name="file-download" size={50} color="#DAA520" />
            </View>

            

            {(!downloadingApk && !installingApk)?
              <TouchableOpacity
                disabled={downloadingApk}
                style={styles.buttonDownload}
                onPress={() => {
                  downloadLatestApk();
                  // openLinkApk();
                }}
              >
                <Text style={styles.buttonText}>Download App</Text>
              </TouchableOpacity>
              : 
              (downloadingApk)?
              <View
                style={[
                  {
                    height: 40,
                    backgroundColor: "#fff",
                    marginHorizontal: 15,
                    marginTop: 10,
                    marginBottom: 10,
                  },
                ]}
              >
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    {Number(progress.size / 1048576).toFixed(2)} MB
                  </Text>
                  <Text style={styles.progressText}>
                    {Math.round(progress.percentage)}%
                  </Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressView,
                      { width: `${progress.percentage}%` },
                    ]}
                  />
                </View>
              </View>
              :
              (installingApk)?
                <View>
                  <ActivityIndicator size="small" color="#DAA520" />
                </View>
              :
              null
            }
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    width: "90%",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    elevation: 20,
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
  },
  textContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  textStyle: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginBottom: 10,
  },
  buttonDownload: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DAA520",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  progressInfo: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  progressBarContainer: {
    height: 5,
    width: "100%",
    backgroundColor: "#bfbfbf",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressView: {
    height: 5,
    flexDirection: "row",
    backgroundColor: "#2CC597",
    borderRadius: 2,
  },
  progressText: {
    color: "#2CC597",
    fontSize: 16,
  },
  installText: {
    color: "#DAA520",
    fontSize: 14,
    fontWeight: "500",
  }
});

export default VersionModal;
