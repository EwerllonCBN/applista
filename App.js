import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';
import AppLoading from 'expo-app-loading';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableHighlight,
  Modal,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native'; //Utilizado em persistência de dados.

export default function App() {
  const image = require('./resources/bg.jpg');

  console.disableYellowBox = true;

  //Vetor de tarefas do aplicativo
  const [tarefas, setarTarefas] = useState([]);
  //Estados da modal e setar modal
  const [modal, setModal] = useState(false);
  //Estado de tarefa atual e setar tarefa
  const [tarefaAtual, setTarefaAtual] = useState('');

  //Função de evento pra fonte ser carregada.
  const [fontsLoaded] = useFonts({ Lato_400Regular });

  useEffect(() => {
    (async () => {
      //Async pra dizer que é uma função assincrona
      try {
        let tarefaAtual = await AsyncStorage.getItem('tarefas'); //Recupera as tarefas com o getItem que foram salvas
        if (tarefaAtual == null) {
          //Se o usuário ta abrindo o App pela primeira vez, irá setar as tarefas com o setarTarefas
          setarTarefas([]);
        } else setarTarefas(JSON.parse(tarefaAtual));
        //Caso o usuário esteja abrindo o app pela segunda vez, significa que existe informações salvas
        //Logo, o JSON.parse converterá a string em objeto novamente. Para ser exibido os dados salvos em tela.
      } catch (error) {}
    })(); //() os parenteses é pra dizer que foi criada uma função e ja foi chamada
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  //Função adicionar Tarefas

  function addTarefa() {
    setModal(!modal);
    let id = 1;
    if (tarefas.length >= 1) {
      id = tarefas[tarefas.length - 1].id + 1;
    }
    let tarefa = { id: id, tarefa: tarefaAtual };
    setarTarefas([...tarefas, tarefa]);

    //Chamando a função async
    (async () => {
      try {
        await AsyncStorage.setItem(
          'tarefas',
          JSON.stringify([...tarefas, tarefa])
        );
        //Setando as tarefas e atualizando as que ja estavam no app. E convertendo o objeto newTarefas em string novamente com o stringify.
      } catch (error) {}
    })();
  }

  //Função de deletar tarefas
  function deleteTarefa(id) {
    alert('Tarefa número ' + id + ' deletada com sucesso!');

    let newTarefas = tarefas.filter(function (val) {
      //Criou-se um clone do vetor Tarefas e o filter permite percorrer cada tarefa, logo ele retorna caso q
      return val.id != id; // retorna caso queira que retorne o valor do id, se esse valor for diferente do id que o usuario está deletando vai retornar um valor se é pra manter no array atual ou não.
    });
    setarTarefas(newTarefas);

    //Chamando a função async
    (async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify(newTarefas));
        //Setando as tarefas e atualizando as que ja estavam no app. E convertendo o objeto newTarefas em string novamente com o stringify.
      } catch (error) {}
    })();
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <StatusBar hidden />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              onChangeText={(text) => setTarefaAtual(text)}
              autoFocus={true}
            ></TextInput>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => addTarefa()}
            >
              <Text style={styles.textStyle}>Adicionar Tarefa</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <ImageBackground source={image} style={styles.image}>
        <View style={styles.coverView}>
          <Text style={styles.textHeader}>LISTA DE TAREFAS</Text>
        </View>
      </ImageBackground>

      {tarefas.map(function (val) {
        return (
          <View style={styles.tarefaSingle}>
            <View style={{ flex: 1, width: '100%', padding: 10 }}>
              <Text>{val.tarefa}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', flex: 1, padding: 10 }}>
              <TouchableOpacity onPress={() => deleteTarefa(val.id)}>
                <AntDesign name="minuscircleo" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
      <TouchableOpacity
        style={styles.btnAddTarefa}
        onPress={() => setModal(true)}
      >
        <Text style={{ textAlign: 'center', color: 'white' }}>
          Adicionar tarefa
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  btnAddTarefa: {
    width: 200,
    padding: 8,
    backgroundColor: 'gray',
    marginTop: 20,
  },
  coverView: {
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textHeader: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    marginTop: 20,
    fontFamily: 'Lato_400Regular',
  },
  tarefaSingle: {
    marginTop: 30,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    paddingBottom: 10,
  },
  //Estilos para a Modal |
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    top: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
