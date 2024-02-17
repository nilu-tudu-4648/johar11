import { StyleSheet, View } from 'react-native'
import React from 'react'
import { COLORS, FSTYLES, SIZES, STYLES } from '../constants/theme';
import { Dialog } from 'react-native-paper';
import AppText from './AppText';
import AppButton from './AppButton';

const DeleteUserDialog = ({
    visible,
    setvisible,
}) => {
    const handleClose = () => setvisible(false)
    return (
        <Dialog visible={visible} onDismiss={handleClose} style={styles.modalContainer}>
                <AppText bold={true} size={2.5} >Confirm Account Deletion</AppText>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', height: '90%' }}>
                <AppText size={1.8}>Your account will be deleted in 8 days. Deleting your account will permanently erase all your data including match history and any data.</AppText>
                <View style={{ ...FSTYLES, marginVertical: SIZES.base, alignSelf: 'flex-end' }}>
                    <AppButton title={'No'}
                        onPress={handleClose}
                        textStyle={{ color: COLORS.black }}
                        style={{
                            height: SIZES.h1 * 1.2,
                            borderRadius: SIZES.h6,
                            backgroundColor: COLORS.gray,
                            marginVertical: SIZES.base,
                            width: '40%'
                        }} />
                    <AppButton title={'Yes'}
                        textStyle={{ color: COLORS.white }}
                        onPress={()=>{
                            handleClose()
                        }}
                        style={{
                            height: SIZES.h1 * 1.2,
                            borderRadius: SIZES.h6,
                            backgroundColor: COLORS.primary,
                            marginVertical: SIZES.base,
                            width: '40%'
                        }} />
                </View>
            </View>
        </Dialog>
    )
}

export default DeleteUserDialog

const styles = StyleSheet.create({
    inputStyle: {
        width: '100%',
        marginVertical: 6
    },
    error: {
        color: 'red',
        fontSize: SIZES.h7,
        alignSelf: 'stretch',
        top: 2
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        alignSelf: 'center',
        top: 0,
        padding: 15,
        height: SIZES.height * .3,
        borderRadius: 8,
        justifyContent: 'center',
    }
})