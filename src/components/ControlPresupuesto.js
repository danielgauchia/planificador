import React, {useState, useEffect } from 'react'
import { Text, View, StyleSheet, Pressable } from 'react-native'
import globalStyles from '../styles'
import {formatearCantidad } from '../helpers'
import CircularProgress from 'react-native-circular-progress-indicator'


const ControlPresupuesto = ({presupuesto, resetearApp, gastosMes, resetearPresupuesto}) => {
    const [disponible, setDisponible] = useState(0)
    const [gastado, setGastado] = useState(0)
    const [porcentaje, setPorcentaje ] = useState(0)

    useEffect(() => {
        let totalGastado = gastosMes.reduce( (total, gasto) => Number(gasto.cantidad) + total, 0 )

        const totalDisponible = presupuesto - totalGastado
        totalGastado = Math.max(totalGastado, 0)
        const nuevoPorcentaje = (
            ((presupuesto - totalDisponible) / presupuesto) * 100
        )

        
        setTimeout(() => {
            setPorcentaje(nuevoPorcentaje)
        }, 1000);
        setGastado(totalGastado)
        setDisponible(totalDisponible)
    }, [gastosMes])

    return (
        <View style={styles.contenedor}>
            <View style={styles.centrarGrafica}>
                <CircularProgress
                    value={porcentaje }
                    duration={1000}
                    radius={150}
                    valueSuffix={'%'}
                    title='Gastado'
                    inActiveStrokeColor='#F5F5F5'
                    inActiveStrokeWidth={20}
                    activeStrokeColor='#3b82f6'
                    activeStrokeWidth={20}
                    titleStyle={{ fontWeight: 'bold', fontSize: 20}}
                    titleColor='#64748B'
                />
            </View>

            <View style={styles.contenedorTexto}>
                <Pressable
                    onLongPress={resetearPresupuesto}
                    style={styles.botonResetearPresupuesto}
                >
                    <Text style={styles.textoBoton}>Cambiar Presupuesto Mensual</Text>
                </Pressable>

                <Pressable
                    onLongPress={resetearApp}
                    style={styles.boton}
                >
                    <Text style={styles.textoBoton}>Borrar todos los datos</Text>
                </Pressable>

                <Text style={styles.valor}>
                    <Text style={styles.label}>Presupuesto: {''} </Text>
                    {formatearCantidad(presupuesto)}
                </Text>

                <Text style={styles.valor}>
                    <Text style={styles.label}>Disponible: {''}</Text>
                    {formatearCantidad(disponible)}
                </Text>

                <Text style={styles.valor}>
                    <Text style={styles.label}>Gastado: {''}</Text>
                    {formatearCantidad(gastado)}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        ...globalStyles.contenedor
    },
    centrarGrafica: {
        alignItems: 'center'
    }, 
    botonResetearPresupuesto: {
        backgroundColor: '#3327db',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    boton: {
        backgroundColor: '#DB2777',
        padding: 10,
        marginBottom: 40,
        borderRadius: 5
    },
    textoBoton: {
        textAlign: 'center',
        color: '#FFF',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    contenedorTexto: {
        marginTop: 50
    },
    valor: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
        color:'#000000'
    },
    label: {
        fontWeight: '700',
        color: '#3B82F6'
    }
})

export default ControlPresupuesto
