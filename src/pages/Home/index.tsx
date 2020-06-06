import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  Image,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather as Icon } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface UFIBGE {
  sigla: "string";
}

interface cityIBGE {
  nome: "string";
}

interface OptionsSelect {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [UF, setUF] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [UFs, setUFs] = useState<OptionsSelect[]>([]);
  const [cities, setCities] = useState<OptionsSelect[]>([]);

  useEffect(() => {
    const IBGEURL =
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
    axios.get<UFIBGE[]>(IBGEURL).then((response) => {
      const UFInitials = response.data.map((uf) => {
        return { label: uf.sigla, value: uf.sigla };
      });
      setUFs(UFInitials);
    });
  }, []);

  useEffect(() => {
    const IBGEURL = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`;
    axios.get<cityIBGE[]>(IBGEURL).then((response) => {
      const cities = response.data.map((uf) => {
        return { label: uf.nome, value: uf.nome };
      });
      setCities(cities);
    });
  }, [UF]);

  function handleNavigation() {
    navigation.navigate("Points", { UF, city });
  }

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      imageStyle={{ width: "50%", height: "32%" }}
      style={styles.container}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <View>
          <Text style={styles.title}>
            Seu marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrar pontos de coleta de forma eficiente
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect onValueChange={(value) => setUF(value)} items={UFs} />
        <RNPickerSelect
          onValueChange={(value) => setCity(value)}
          items={cities}
        />
        <RectButton style={styles.button} onPress={handleNavigation}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24}></Icon>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#f0f0f5",
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});
