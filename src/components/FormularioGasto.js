import React, {useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import globalStyles from '../styles';

const FormularioGasto = ({
  setModal,
  handleGasto,
  gasto,
  setGasto,
  eliminarGasto,
}) => {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [id, setId] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    if (gasto?.nombre) {
      if (Number(gasto.cantidad) < 0) {
        setCantidad(Number(gasto.cantidad * -1).toString());
      } else {
        setCantidad(gasto.cantidad);
      }
      setNombre(gasto.nombre);
      setCategoria(gasto.categoria);
      setId(gasto.id);
      setFecha(gasto.fecha);
    }
  }, [gasto]);

  return (
    <SafeAreaView style={styles.contenedor}>
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={styles.contenedorBotones}>
          <Pressable
            onLongPress={() => {
              setModal(false);
              setGasto({});
            }}
            style={[styles.btn, styles.btnCancelar]}>
            <Text style={styles.btnTexto}>Cancelar</Text>
          </Pressable>

          {!!id && (
            <Pressable
              style={[styles.btn, styles.btnEliminar]}
              onLongPress={() => eliminarGasto(id)}>
              <Text style={styles.btnTexto}>Eliminar</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.formulario}>
          <Text style={styles.titulo}>
            {gasto?.nombre ? 'Editar' : 'Nuevo'}
          </Text>

          <View style={styles.campo}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre ej. Comida"
              placeholderTextColor="#6e6d6d"
              onChangeText={setNombre}
              value={nombre}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              style={styles.input}
              placeholder="Cantidad ej. 300"
              placeholderTextColor="#6e6d6d"
              keyboardType="numeric"
              onChangeText={setCantidad}
              value={cantidad}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Categoría</Text>
            <Picker
              selectedValue={categoria}
              onValueChange={valor => {
                setCategoria(valor);
              }}
              style={styles.picker}>
              <Picker.Item label="-- Clica para Seleccionar --" value="" />
              <Picker.Item label="Ingreso" value="ingreso" />
              <Picker.Item label="Comida" value="comida" />
              <Picker.Item label="Casa" value="casa" />
              <Picker.Item label="Gastos Varios" value="gastos" />
              <Picker.Item label="Ocio" value="ocio" />
              <Picker.Item label="Salud" value="salud" />
              <Picker.Item label="Suscripciones" value="suscripciones" />
            </Picker>
          </View>

          <Pressable
            style={styles.submitBtn}
            onPress={() =>
              handleGasto({nombre, cantidad, categoria, id, fecha})
            }>
            <Text style={styles.submitBtnTexto}>
              {gasto?.nombre ? 'Guardar Cambios' : 'Agregar'}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: '#1E40AF',
    flex: 1,
  },
  contenedorBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    padding: 10,
    marginTop: 30,
    marginHorizontal: 10,
    flex: 1,
  },
  btnCancelar: {
    backgroundColor: '#DB2777',
  },
  btnEliminar: {
    backgroundColor: 'red',
  },
  btnTexto: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#FFF',
  },
  formulario: {
    ...globalStyles.contenedor,
  },
  titulo: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 30,
    color: '#64748B',
  },
  campo: {
    marginVertical: 10,
  },
  label: {
    color: '#64748B',
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    color: '#000000',
  },
  submitBtn: {
    backgroundColor: '#3B82F6',
    padding: 10,
    marginTop: 20,
  },
  submitBtnTexto: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  picker: {
    color: '#000000',
  },
});

export default FormularioGasto;
