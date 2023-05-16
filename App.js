import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  AppRegistry,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from 'expo-font';
import { expo } from "./app.json";
const appVersion = `${expo.name} v${expo.version}`;
import {
  AppBar,
  HStack,
  IconButton,
  Button,
  Provider,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  ActivityIndicator,
} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import cheerio from "cheerio-without-node-native";

async function generate(func) {
  var UrlToFetch = "https://thisideadoesnotexist.com/";
  try {
    const response = await fetch(UrlToFetch);
    const html = await response.text();
    const $ = cheerio.load(html);
    const idea = $(".container")
      .children()[3]
      .children[0].data.replace("\n", "")
      .trim();
    func(idea);
  } catch (e) {
    console.error(e);
  }
}

const App = () => {
  const [visible, setVisible] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Rubik': require('./Rubik.ttf'),
    });
    setFontsLoaded(true);
  };

  const handleLinkPress = () => {
    Linking.openURL("https://thisideadoesnotexist.com/");
  };
  const handleGithubForward = () => {
    Linking.openURL("https://github.com/itsrn/ideas-generator-app");
  };
  const handleRefresh = async () => {
    setLoading(true);
    await generate((idea) => {
      setTextValue(idea);
      setLoading(false);
    });
  };

  useEffect(() => {
    handleRefresh();
    loadFonts();
  }, []);
  
  if(!fontsLoaded) {
    return (
      <Provider>
        <SafeAreaView style={styles.container}>
          <AppBar
            title="Ideas Generator"
            color="lightgreen"
            tintColor="green"
            trailing={(props) => (
              <HStack>
                <IconButton
                  icon={(props) => <Icon name="github" {...props} />}
                  {...props}
                  onPress={handleGithubForward}
                />
                <IconButton
                  icon={(props) => <Icon name="refresh" {...props} />}
                  {...props}
                  onPress={handleRefresh}
                />
                <IconButton
                  icon={(props) => <Icon name="information" {...props} />}
                  onPress={() => setVisible(true)}
                  {...props}
                />
              </HStack>
            )}
          />
          <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <DialogHeader title={appVersion} />
            <DialogContent>
              <Text>Created by Ron Nuss, {new Date().getFullYear()}.</Text>
              <Text>This app is powered by React Native.</Text>
              <TouchableOpacity onPress={handleLinkPress}>
                <Text style={styles.linkText}>The ideas are taken from thisideadoesnotexist.com</Text>
              </TouchableOpacity>
            </DialogContent>
            <DialogActions>
              <Button
                title="Close"
                compact
                variant="contained"
                color="green"
                uppercase={false}
                onPress={() => setVisible(false)}
              />
            </DialogActions>
          </Dialog>
          <View style={styles.MainContainer}>
              <ActivityIndicator
                size="large"
                color="green"
              />
          </View>
        </SafeAreaView>
      </Provider>
    );
  }

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <AppBar
          title="Ideas Generator"
          style={{fontFamily: 'Rubik'}}
          color="lightgreen"
          tintColor="green"
          trailing={(props) => (
            <HStack>
              <IconButton
                icon={(props) => <Icon name="github" {...props} />}
                {...props}
                onPress={handleGithubForward}
              />
              <IconButton
                icon={(props) => <Icon name="refresh" {...props} />}
                {...props}
                onPress={handleRefresh}
              />
              <IconButton
                icon={(props) => <Icon name="information" {...props} />}
                onPress={() => setVisible(true)}
                {...props}
              />
            </HStack>
          )}
        />
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <DialogHeader title={appVersion} />
          <DialogContent>
            <Text>Created by Ron Nuss, {new Date().getFullYear()}.</Text>
            <Text>This app is powered by React Native.</Text>
            <TouchableOpacity onPress={handleLinkPress}>
              <Text style={styles.linkText}>The ideas are taken from thisideadoesnotexist.com</Text>
            </TouchableOpacity>
          </DialogContent>
          <DialogActions>
            <Button
              title="Close"
              compact
              variant="contained"
              color="green"
              style={{fontFamily: 'Rubik'}}
              uppercase={false}
              onPress={() => setVisible(false)}
            />
          </DialogActions>
        </Dialog>
        <View style={styles.MainContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              style={{ marginBottom: 20 }}
              color="green"
            />
          ) : (
            <>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 30,
                  marginBottom: 20,
                  alignContent: "center",
                  justifyContent: "center",
                  fontFamily: 'Rubik',
                }}
              >
                {textValue}
              </Text>
            </>
          )}

          <Button
            title="Refresh"
            color="green"
            trailing={(props) => <Icon name="refresh" {...props} />}
            onPress={handleRefresh}
          />
        </View>
      </SafeAreaView>
    </Provider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
