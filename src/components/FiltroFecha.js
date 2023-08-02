import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import globalStyles from '../styles';
import {Picker} from '@react-native-picker/picker';
import {Picker as WheelPicker} from 'react-native-wheel-pick';
const FiltroFecha = ({
  filtro,
  setFiltro,
  gastos,
  gastosFiltrados,
  setGastosFiltrados,
  setGastosFiltradosCateg,
}) => {
  const [yearPickerData, setYearPickerData] = useState([]);
  useEffect(() => {
    const generateYearPickerData = () => {
      const data = new Set(); // Using Set to ensure unique years

      // Add years from the "gastos" array
      gastos.forEach(gasto => {
        const gastoYear = new Date(gasto.fecha).getFullYear();
        data.add(gastoYear);
      });

      // Convert Set back to array and sort the years in ascending order
      const sortedData = [...data].sort((a, b) => a - b);

      // Create the final yearPickerData array
      const yearPickerData = sortedData.map(year => ({
        value: year,
        label: year.toString(),
      }));

      setYearPickerData(yearPickerData);
    };

    generateYearPickerData();
  }, [gastos]);

  useEffect(() => {
    const filterGastosByFecha = () => {
      const gastosFiltradosFecha = gastos.filter(gasto => {
        const gastoYear = new Date(gasto.fecha).getFullYear();
        const gastoMonth = new Date(gasto.fecha).getMonth();
        const gastoYearNuevo = filtro.filtroFechaYear;
        const gastoMonthNuevo = filtro.filtroFechaMonth;
        return gastoYear === gastoYearNuevo && gastoMonth === gastoMonthNuevo;
      });

      setGastosFiltrados(gastosFiltradosFecha);
    };

    filterGastosByFecha();
  }, [filtro.filtroFechaYear, filtro.filtroFechaMonth, gastos]);

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
        {yearPickerData.length > 1 ? (
          <Text style={styles.label}>Filtrar Mes/Año</Text>
        ) : (
          <Text style={styles.label}>Filtrar Mes</Text>
        )}

        <View style={styles.contenedorFiltro}>
          <WheelPicker
            style={{
              backgroundColor: 'white',
              width: yearPickerData.length > 1 ? 150 : '100%',
              color: 'black',
            }}
            selectedValue={filtro.filtroFechaMonth}
            pickerData={[
              {value: 0, label: 'Enero'},
              {value: 1, label: 'Febrero'},
              {value: 2, label: 'Marzo'},
              {value: 3, label: 'Abril'},
              {value: 4, label: 'Mayo'},
              {value: 5, label: 'Junio'},
              {value: 6, label: 'Julio'},
              {value: 7, label: 'Agosto'},
              {value: 8, label: 'Septiembre'},
              {value: 9, label: 'Octubre'},
              {value: 10, label: 'Noviembre'},
              {value: 11, label: 'Diciembre'},
            ]}
            onValueChange={value => {
              setFiltro({...filtro, filtroFechaMonth: value});
            }}
          />
          {yearPickerData.length > 1 && (
            <WheelPicker
              style={{backgroundColor: 'white', width: 150, color: 'black'}}
              selectedValue={filtro.filtroFechaYear}
              pickerData={yearPickerData}
              onValueChange={value => {
                setFiltro({...filtro, filtroFechaYear: value});
              }}
            />
          )}
        </View>
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
  contenedorFiltro: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
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
