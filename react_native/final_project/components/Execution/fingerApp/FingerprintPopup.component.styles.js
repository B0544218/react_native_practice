export default {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E6CAFF',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  logo: {
    marginVertical: 45
  },
  heading: {
    textAlign: 'center',
    color: '#4F4F4F',
    fontSize: 21
  },
  description: error => ({
    textAlign: 'center',
    color: error ? '#ea3d13' : '#4F4F4F',
    height: 65,
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 20
  }),
  buttonContainer: {
    padding: 20
  },
  buttonText: {
    color: '#4F4F4F',
    fontSize: 15,
    fontWeight: 'bold'
  }
};
