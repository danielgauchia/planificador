import React, {useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import globalStyles from '../styles';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';

const FiltroFecha = ({
  filtro,
  setFiltro,
  gastos,
  gastosFiltrados,
  setGastosFiltrados,
  setGastosFiltradosCateg,
}) => {
  useEffect(() => {
    const filterGastosByFecha = () => {
      const gastosFiltradosFecha = gastos.filter(gasto => {
        const gastoYear = new Date(gasto.fecha).getFullYear();
        const gastoMonth = new Date(gasto.fecha).getMonth();
        const gastoYearNuevo = filtro.filtroFecha.getFullYear();
        const gastoMonthNuevo = filtro.filtroFecha.getMonth();
        return gastoYear === gastoYearNuevo && gastoMonth === gastoMonthNuevo;
      });

      setGastosFiltrados(gastosFiltradosFecha);
    };

    filterGastosByFecha();
  }, [filtro.filtroFecha, gastos]);

  useEffect(() => {
    const filterGastosByCategoria = () => {
      if (filtro.filtroCategoria === '') {
        setGastosFiltradosCateg([]);
      } else {
        const gastosFiltradosCategoria = gastosFiltrados.filter(
          gasto => gasto.categoria === filtro.filtroCategoria,
        );
        setGastosFiltradosCateg(gastosFiltradosCategoria);
      }
    };

    filterGastosByCategoria();
  }, [filtro.filtroCategoria, gastosFiltrados]);

  return (
    <>
      <View style={styles.contenedorUno}>
        <Text style={styles.label}>Filtrar Mes/Año</Text>

        <DatePicker
          date={filtro.filtroFecha}
          onDateChange={date => setFiltro({...filtro, filtroFecha: date})}
          locale="es"
          textColor="#000000"
          mode="date"
          maximumDate={gastos.lenght >0 ?
            (
              new Date(Math.max(...gastos.map(gasto => new Date(gasto.fecha).getTime())))
            ) : (
              new Date(Date.now())
            )
            
          }
          minimumDate={gastos.lenght >0 ?
            (
              new Date(Math.min(...gastos.map(gasto => new Date(gasto.fecha).getTime())))
            ) : (
              new Date(Date.now())
            )
            
          }
        />
      </View>

      <View style={styles.contenedorDos}>
        <Text style={styles.label}>Filtrar Categoría</Text>

        <Picker
          selectedValue={filtro.filtroCategoria}
          onValueChange={valor =>
            setFiltro({...filtro, filtroCategoria: valor})
          }
          style={styles.picker}>
          <Picker.Item label="-- Clica para Seleccionar --" value="" />
          <Picker.Item label="Ahorro" value="ahorro" />
          <Picker.Item label="Comida" value="comida" />
          <Picker.Item label="Casa" value="casa" />
          <Picker.Item label="Gastos Varios" value="gastos" />
          <Picker.Item label="Ocio" value="ocio" />
          <Picker.Item label="Salud" value="salud" />
          <Picker.Item label="Suscripciones" value="suscripciones" />
        </Picker>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contenedorUno: {
    ...globalStyles.contenedor,
    transform: [{translateY: 0}],
    marginTop: 80,
  },
  contenedorDos: {
    ...globalStyles.contenedor,
    transform: [{translateY: 0}],
    marginTop: 30,
  },
  label: {
    fontSize: 22,
    fontWeight: '900',
    color: '#64748B',
  },
  picker: {
    color: '#000000',
  },
});

export default FiltroFecha;
