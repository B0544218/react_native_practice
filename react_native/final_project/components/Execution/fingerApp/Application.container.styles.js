import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6CAFF'
  },
  heading: {
    color: '#ffffff',
    fontSize: 22,
    marginTop: 30,
    fontWeight: 'bold',
    marginBottom: 5
  },

  fingerprint: {
    padding: 20,
    marginVertical: 30
  },
  errorMessage: {
    color: '#ea3d13',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 10,
    marginTop: 30
  },
  popup: {
    width: width * 0.8
  }
});
