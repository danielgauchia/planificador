import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './src/components/Header';
import NuevoPresupuesto from './src/components/NuevoPresupuesto';
import ControlPresupuesto from './src/components/ControlPresupuesto';
import FormularioGasto from './src/components/FormularioGasto';
import ListadoGastos from './src/components/ListadoGastos';
import {generarId} from './src/helpers';
import FiltroFecha from './src/components/FiltroFecha';
//Planificador de Gastos mensuales
const App = () => {
  const fechaActual = new Date()
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);
  const [presupuesto, setPresupuesto] = useState('');
  const [gastos, setGastos] = useState([]);
  const [gastosMes, setGastosMes] = useState([]);
  const [modal, setModal] = useState(false);
  const [gasto, setGasto] = useState({});
  const [filtro, setFiltro] = useState({
    filtroFechaMonth: fechaActual.getMonth(),
    filtroFechaYear: fechaActual.getFullYear(),
    filtroCategoria: '',
  });
  const [gastosFiltrados, setGastosFiltrados] = useState([]);
  const [gastosFiltradosCateg, setGastosFiltradosCateg] = useState([]);

  useEffect(() => {
    const obtenerPresupuestoStorage = async () => {
      try {
        const presupuestoStorage =
          (await AsyncStorage.getItem('planificador_presupuesto')) ?? 0;

        if (presupuestoStorage > 0) {
          setPresupuesto(presupuestoStorage);
          setIsValidPresupuesto(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    obtenerPresupuestoStorage();
  }, []);

  useEffect(() => {
    if (isValidPresupuesto) {
      const guardarPresupuestoStorage = async () => {
        try {
          await AsyncStorage.setItem('planificador_presupuesto', presupuesto);
        } catch (error) {
          console.log(error);
        }
      };
      guardarPresupuestoStorage();
    }
  }, [isValidPresupuesto]);

  useEffect(() => {
    const obtenerGastosStorage = async () => {
      try {
        const gastosStorage = await AsyncStorage.getItem('planificador_gastos');

        setGastos(gastosStorage ? JSON.parse(gastosStorage) : []);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerGastosStorage();
  }, []);

  useEffect(() => {
    const guardarGastosStorage = async () => {
      try {
        await AsyncStorage.setItem(
          'planificador_gastos',
          JSON.stringify(gastos),
        );
      } catch (error) {
        console.log(error);
      }
    };
    guardarGastosStorage();
  }, [gastos]);

  useEffect(() => {
    const latestYear = Math.max(
      ...gastos.map(gasto => new Date(gasto.fecha).getFullYear()),
    );
    const latestGastosOfYear = gastos.filter(
      gasto => new Date(gasto.fecha).getFullYear() === latestYear,
    );

    const filteredGastos = latestGastosOfYear.filter(
      gasto => new Date(gasto.fecha).getMonth() === fechaActual.getMonth(),
    );

    setGastosMes(filteredGastos);
  }, [gastos]);

  const handleNuevoPresupuesto = presupuesto => {
    if (Number(presupuesto) > 0) {
      setIsValidPresupuesto(true);
    } else {
      Alert.alert('Error', 'El Presupuesto no puede ser 0 o menor', 'Ok');
    }
  };

  const handleGasto = gasto => {
    if ([gasto.nombre, gasto.categoria, gasto.cantidad].includes('')) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (gasto.id) {
      const gastosActualizados = gastos.map(gastoState =>
        gastoState.id === gasto.id ? gasto : gastoState,
      );
      setGastos(gastosActualizados);
    } else {
      // Añadir el nuevo gasto al state
      gasto.id = generarId();
      gasto.fecha = Date.now();
      setGastos([...gastos, gasto]);
    }
    setModal(!modal);
  };

  const eliminarGasto = id => {
    Alert.alert(
      '¿Deseas eliminar este gasto?',
      'Un gasto eliminado no se puede recuperar',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Si, Eliminar',
          onPress: () => {
            const gastosActualizados = gastos.filter(
              gastoState => gastoState.id !== id,
            );

            setGastos(gastosActualizados);
            setModal(!modal);
            setGasto({});
          },
        },
      ],
    );
  };

  const resetearApp = () => {
    Alert.alert(
      'Deseas resetear la app?',
      'Esto eliminará presupuesto y gastos',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Si, Eliminar',
          onPress: async () => {
            try {
              await AsyncStorage.clear();

              setIsValidPresupuesto(false);
              setPresupuesto('');
              setGastos([]);
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    );
  };

  const resetearPresupuesto = () => {
    Alert.alert(
      '¿Deseas resetear el presupuesto?',
      'Esto eliminará el presupuesto actual',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Si, Eliminar',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('planificador_presupuesto');

              setIsValidPresupuesto(false);
              setPresupuesto('');
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.contenedor}>
      <ScrollView>
        <View style={styles.header}>
          <Header />

          {isValidPresupuesto ? (
            <ControlPresupuesto
              presupuesto={presupuesto}
              gastosMes={gastosMes}
              resetearApp={resetearApp}
              resetearPresupuesto={resetearPresupuesto}
            />
          ) : (
            <NuevoPresupuesto
              presupuesto={presupuesto}
              setPresupuesto={setPresupuesto}
              handleNuevoPresupuesto={handleNuevoPresupuesto}
            />
          )}
        </View>

        {isValidPresupuesto && (
          <>
            <FiltroFecha
              filtro={filtro}
              setFiltro={setFiltro}
              gastos={gastos}
              gastosFiltrados={gastosFiltrados}
              setGastosFiltrados={setGastosFiltrados}
              setGastosFiltradosCateg={setGastosFiltradosCateg}
            />

            <ListadoGastos
              filtro={filtro}
              gastos={gastos}
              setModal={setModal}
              setGasto={setGasto}
              gastosFiltrados={gastosFiltrados}
              gastosFiltradosCateg={gastosFiltradosCateg}
            />
          </>
        )}
      </ScrollView>

      {modal && (
        <Modal
          animationType="slide"
          visible={modal}
          onRequestClose={() => {
            setModal(!modal);
          }}>
          <FormularioGasto
            setModal={setModal}
            handleGasto={handleGasto}
            gasto={gasto}
            setGasto={setGasto}
            eliminarGasto={eliminarGasto}
          />
        </Modal>
      )}

      {isValidPresupuesto && (
        <Pressable style={styles.pressable} onPress={() => setModal(!modal)}>
          <Image
            style={styles.imagen}
            source={require('./src/img/nuevo-gasto.png')}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  header: {
    backgroundColor: '#3B82F6',
    minHeight: 400,
  },
  pressable: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 40,
    right: 30,
  },
  imagen: {
    width: 60,
    height: 60,
  },
});

export default App;
