import React, {useEffect} from 'react'
import { Text, View, StyleSheet } from 'react-native'
import globalStyles from '../styles'
import DatePicker from 'react-native-date-picker';

const FiltroFecha = ({filtroFecha, setFiltroFecha, gastos, setGastosFiltrados}) => {
    
    useEffect(() => {

            const gastosFiltradosFecha = gastos.filter(gasto => {
                
                const gastoYear = new Date(gasto.fecha).getFullYear();
                const gastoMonth = new Date(gasto.fecha).getMonth();
                const gastoYearNuevo = new Date(filtroFecha).getFullYear();
                const gastoMonthNuevo = new Date(filtroFecha).getMonth();
                return gastoYear === gastoYearNuevo && gastoMonth === gastoMonthNuevo;
            })

            setGastosFiltrados(gastosFiltradosFecha)
            
    }, [filtroFecha,  gastos])

    return (
        
        <View style={styles.contenedor}>
            <Text style={styles.label}>Filtrar Mes/Año</Text>

            <DatePicker
                date={filtroFecha}
                onDateChange={date => setFiltroFecha(date)}
                locale="es"
                textColor="#000000"
                mode="date"
              />
        </View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        ...globalStyles.contenedor,
        transform: [{ translateY: 0 }],
        marginTop: 80
    },
    label: {
        fontSize: 22,
        fontWeight: '900',
        color: '#64748B',
        
    },
    picker: {
        color: '#000000',
       
    }
})

export default FiltroFecha
